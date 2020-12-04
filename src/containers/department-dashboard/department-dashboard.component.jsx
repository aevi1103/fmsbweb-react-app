import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import moment from 'moment';
import axios from 'axios';

import { 
    DownloadOutlined,
    LoadingOutlined
 } from '@ant-design/icons';

import {
    fetchProductionDataStartAsync,
    fetchDailyKpiStartAsync,
    fetchProdScrapStartAsync,
    fetchDailyScrapRateStartAsync,
    fetchPpmhStartAsync,
    fetchWeeklyLaborHrsStartAsync
} from '../../core/redux/department-dashboard/department-dashboard.actions'

import Production from './components/production.component';

import { mapAreaToDept, dateRange, disabledDate, dateFormat } from '../../core/utilities/helpers'
import { useQuery } from '../../core/utilities/custom-hook'
import download from './service/download'

import { 
    Layout,
    Spin,
    PageHeader,
    Dropdown,
    Menu,
    Row,
    Col,
    DatePicker
 } from "antd";

const { Content } = Layout;
const { RangePicker } = DatePicker
const previousDay = moment().add(-1, 'day').format(dateFormat);

const DepartmentDashboard = ({
        area
    }) => {
        
    const dispatch = useDispatch();
    const history = useHistory();
    const dept = mapAreaToDept(area)

    //* selectors
    const ppmhChartType = useSelector(({ departmentDashboard }) => departmentDashboard?.ppmhChartType) ?? null;
    const isProductionDataLoading = useSelector(({ departmentDashboard }) => departmentDashboard?.isProductionDataLoading) ?? false;

    //* url qry
    const query = useQuery();
    const defaultStartDate = query.get('start') ?? previousDay;
    const defaultEndDate = query.get('end') ?? previousDay;

    //* states
    const [startFormat, setStartFormat] = useState(defaultStartDate);
    const [endFormat, setSendFormat] = useState(defaultEndDate);
    const [title, setTitle] = useState(null)
    const [subTitle, setSubTitle] = useState(null)

    //* download states
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [, setDownloadError] = useState(null);

    //* cancel tokens
    const prodTokenSrc = axios.CancelToken.source();
    const scrapRateTokenSrc = axios.CancelToken.source();
    const dailyKpiTokenSrc = axios.CancelToken.source();
    const ppmhTokenSrc = axios.CancelToken.source();
    const weeklyLaborHrsKpiTokenSrc = axios.CancelToken.source();
    const prodScrapLaborHrsKpiTokenSrc = axios.CancelToken.source();

    //* fetch data
    const fetchData = useCallback((start, end) => {

        //* update date state
        setStartFormat(start);
        setSendFormat(end);

        //* update url
        history.push(`/dashboard/morningmeeting/${area === 'skirt coat' ? 'finishing' : dept}?start=${start}&end=${end}`);

        //* update title
        const ttl = `${_.startCase(dept)} Department Summary`;
        const subTitle = `${start} - ${end}`
        setTitle(ttl);
        setSubTitle(subTitle)
        document.title = ttl + ' ' + subTitle;

        //* dispatch actions
        dispatch(fetchProductionDataStartAsync(start, end, area, prodTokenSrc))

        //* last 30 days
        const last30daysStart = moment(start, dateFormat).add(-30, 'd').format(dateFormat);
        dispatch(fetchDailyScrapRateStartAsync(last30daysStart, end, area, scrapRateTokenSrc))
        dispatch(fetchDailyKpiStartAsync(last30daysStart, end, area, dailyKpiTokenSrc))

        //* labor hours / ppmh
        if (ppmhChartType === 'ppmhByShift') {
            dispatch(fetchPpmhStartAsync(start, end, area, ppmhTokenSrc))
        } else {
            const laborHoursStart = moment(start, dateFormat).add(-9, 'w').startOf('week').format(dateFormat);
            dispatch(fetchWeeklyLaborHrsStartAsync(laborHoursStart, end, area, weeklyLaborHrsKpiTokenSrc));
        }

        //* MTD
        const mtdStart = moment(end, dateFormat).startOf('month').format(dateFormat); 
        dispatch(fetchProdScrapStartAsync(mtdStart, end, area, prodScrapLaborHrsKpiTokenSrc))
        
    }, [area, dispatch, history, ppmhChartType]);

    useEffect(() => {
        
        fetchData(startFormat, endFormat);

        //* cancel fetch on un mount
        return function cleanup() {
            prodTokenSrc.cancel('Operation cancelled');
            scrapRateTokenSrc.cancel('Operation cancelled');
            dailyKpiTokenSrc.cancel('Operation cancelled');
            weeklyLaborHrsKpiTokenSrc.cancel('Operation cancelled');
            ppmhTokenSrc.cancel('Operation cancelled')
            prodScrapLaborHrsKpiTokenSrc.cancel('Operation cancelled');
        };

    }, [area]);

    const onSumit = () => fetchData(startFormat, endFormat);

    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        setStartFormat(start?.format(dateFormat));
        setSendFormat(end?.format(dateFormat));
    };

    const onDownload = () => download(startFormat, endFormat, area, setDownloadLoading, setDownloadError)
    
    const btnOverlay = (
        <Menu>
            <Menu.Item key="export" icon={<DownloadOutlined />} onClick={onDownload} >
                Export
            </Menu.Item>
            <Menu.Item key={`/dashboard/morningmeeting/${dept}/details`}>
                <Link to={`/dashboard/morningmeeting/${dept}/details?start=${startFormat}&end=${endFormat}&shift=`}>Work Center</Link>
            </Menu.Item>
            <Menu.Item key={`/dashboard/swot/settings/${_.capitalize(dept)}`}>
                <Link to={`/dashboard/swot/settings/${_.capitalize(dept)}?start=${startFormat}&end=${endFormat}&getdata=true`} >SWOT</Link>
            </Menu.Item>
            <Menu.Item key={`/dashboard/morningmeeting/${dept}/hourly-production`} >
                <Link to={`/dashboard/morningmeeting/${dept}/hourly-production?start=${endFormat}`} >Hourly Production</Link>
            </Menu.Item>
            <Menu.Item key={`/orderstatus/${dept}`} >
                <Link to={`/orderstatus/${dept}`}>Production Orders</Link>
            </Menu.Item>     
            <Menu.Item key="targets">
                <a href="http://10.129.224.149/FMSB/SWOT/Targets.aspx" target="_blank" rel="noreferrer">Targets</a>
            </Menu.Item>
        </Menu>
    )

    const loadingIcon = <LoadingOutlined style={{ fontSize: 15 }} spin />;

    return (
        <React.Fragment>

            <PageHeader
                className="site-page-header"
                title={title}
                subTitle={subTitle}
            />

            <Content className="ma3 mt0">

                <Row gutter={[12,12]}>

                    <Col span={24}>

                        <RangePicker 
                            className="mr2"
                            onChange={() => {}}
                            format={dateFormat}
                            onCalendarChange={onCalendarChange}
                            defaultValue={[
                                moment(startFormat, dateFormat),
                                moment(endFormat, dateFormat)
                            ]}
                            disabledDate={disabledDate}
                            ranges={dateRange} />
                        
                        <Dropdown.Button 
                            type="primary" 
                            onClick={onSumit} 
                            overlay={btnOverlay} 
                            disabled={downloadLoading || isProductionDataLoading}>
                                {
                                    downloadLoading || isProductionDataLoading ? <Spin indicator={loadingIcon} /> : 'Go'
                                }
                        </Dropdown.Button>

                    </Col>

                    <Col span={24}>
                    
                        <Production area={area} startDate={startFormat} endDate={endFormat} /> 

                    </Col>

                </Row>

            </Content>
        </React.Fragment>)
}

export default DepartmentDashboard;