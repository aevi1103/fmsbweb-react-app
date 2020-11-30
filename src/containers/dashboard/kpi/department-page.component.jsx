import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import { connect, useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import moment from 'moment';
import axios from 'axios';
import styled from 'styled-components';
import api from '../../../core/utilities/api'
import fileDownload from 'js-file-download'

import { 
    DownloadOutlined,
    LoadingOutlined
 } from '@ant-design/icons';

import { 
    fetchProductionStatusStartAsync,
    fetchDailyScrapRateStartAsync,
    fetchDailyKpiStartAsync,
    fetchWeeklyLaborHrsStartAsync,
    fetchPpmhPerShiftStartAsync,
    fetchProdScrapStartAsync,
    setStartDate,
    setEndDate
} from '../../../core/redux/morning-meeting/morning-meeting.actions';

import { 
    setTitle,
    setArea,
    setDetailsStartDate,
    setDetailsEndDate,
} from '../../../core/redux/production-details/production-details.actions';

import DateRangePicker from '../../../components/date-range-picker/date-range-picker.component';
import Production from '../../../components/production/production.component';

import { 
    updateUrlQryParameter,
    mapAreaToDept
} from '../../../core/utilities/helpers'

import {
    useQuery
} from '../../../core/utilities/custom-hook'

import { 
    Layout,
    Spin,
    message,
    PageHeader,
    Dropdown,
    Menu
 } from "antd";

const { Content } = Layout;
const dateFormat = 'MM/DD/YYYY';
const Container = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 140px;
    font-size: 2.5rem;
`;

const DepartmentPage = ({
        area,
        headerTitle,

        setProductionData,
        fetchDailyScrapRateStartAsync,
        fetchDailyKpiStartAsync,
        fetchWeeklyLaborHrsStartAsync,
        fetchPpmhPerShiftStartAsync,
        fetchProdScrapStartAsync,
        isProdStatusFetching,

        setTitle,
        setArea,
        setStartDate,
        setEndDate,
        setDetailsStartDate,
        setDetailsEndDate,
        startDate,
        endDate,
        ppmhChartType
    }) => {
        
    const query = useQuery();
    const previousDay = moment().add(-1, 'day').format(dateFormat);

    const defaultStartDate = query.get('start') ?? previousDay;
    const defaultEndDate = query.get('end') ?? previousDay;

    const [startFormat, setStartFormat] = useState(defaultStartDate);
    const [endFormat, setSendFormat] = useState(defaultEndDate);

    const [downloadLoading, setDownloadLoading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);

    const [dept, setDept] = useState(area);
    const [pageHeader, setPageHeader] = useState();


    const getPageHeaderTitle = (area, start, end) => `${area}: ${start} - ${end}`;

    useEffect(() => {
        setDept(mapAreaToDept(area))
    }, [area]);

    useEffect(() => {
        const ttl = getPageHeaderTitle(headerTitle, startFormat, endFormat)
        setPageHeader(ttl)
        document.title = `${ttl}`;
    }, [area]);

    //cancel token
    const prodTokenSrc = axios.CancelToken.source();
    const scrapRateTokenSrc = axios.CancelToken.source();
    const dailyKpiTokenSrc = axios.CancelToken.source();
    const weeklyLaborHrsKpiTokenSrc = axios.CancelToken.source();
    const prodScrapLaborHrsKpiTokenSrc = axios.CancelToken.source();

    const updateUrl = (start, end) => {
        const ttl = getPageHeaderTitle(headerTitle, startFormat, endFormat);
        const docTitle =  `${ttl}`;
        setPageHeader(ttl)
        updateUrlQryParameter({ start, end }, docTitle);
    }

    const fetchData = (start, end) => {

        setStartDate(start);
        setEndDate(end);

        setDetailsStartDate(start);
        setDetailsEndDate(end);
        updateUrl(start, end);
        setProductionData(start,end,area, prodTokenSrc);

        const chartTrendStart = moment(start, dateFormat).add(-30, 'd').format(dateFormat);    
        fetchDailyScrapRateStartAsync(chartTrendStart, end, area, scrapRateTokenSrc);
        fetchDailyKpiStartAsync(chartTrendStart, end, area, dailyKpiTokenSrc);

        if (ppmhChartType === 'ppmhByShift') {
            fetchPpmhPerShiftStartAsync(start, end, area, weeklyLaborHrsKpiTokenSrc);
        } else {
            const laborHoursStart = moment(start, dateFormat).add(-9, 'w').startOf('week').format(dateFormat);
            fetchWeeklyLaborHrsStartAsync(laborHoursStart, end, area, weeklyLaborHrsKpiTokenSrc);
        }

        const mtdStart = moment(end, dateFormat).startOf('month').format(dateFormat); 
        const mtdEnd =  moment(end, dateFormat).format(dateFormat); 
        fetchProdScrapStartAsync(mtdStart, mtdEnd, area, prodScrapLaborHrsKpiTokenSrc);
    };

    useEffect(() => {
        
        fetchData(startFormat, endFormat);

        return function cleanup() {
            prodTokenSrc.cancel('Operation cancelled');
            scrapRateTokenSrc.cancel('Operation cancelled');
            dailyKpiTokenSrc.cancel('Operation cancelled');
            weeklyLaborHrsKpiTokenSrc.cancel('Operation cancelled');
            prodScrapLaborHrsKpiTokenSrc.cancel('Operation cancelled');
        };

    }, [area]);

    const onClick = () => fetchData(startFormat, endFormat);

    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        setStartFormat( start?.format(dateFormat));
        setSendFormat(end?.format(dateFormat));
    };

    const onDetailsButtonClick = () => {

        setTitle({
            headerTitle,
            startDate,
            endDate
        });

        setArea(area);
    };

    const onDownload = async () => {

        try {    

            setDownloadLoading(true);
            const response = await api.get(`/exports/department?start=${startFormat}&end=${endFormat}&area=${area}`, {
                responseType: 'blob',
            });

            const fileName = `${area.toUpperCase()}_DATAEXPORT_${startFormat}_to_${endFormat}.xlsx`
            fileDownload(response.data, fileName);

            message.success('Data successfully exported!', 10);

        } catch (error) {
            setDownloadError(error);
            setDownloadLoading(false);
            message.error(error);
        } finally {
            if (!downloadError) {
                setDownloadLoading(false);
            }
        }
    }
    
    const btnOverlay = (
        <Menu>
            <Menu.Item key="export" icon={<DownloadOutlined />} onClick={onDownload} >
                Export
            </Menu.Item>
            <Menu.Item key={`/dashboard/morningmeeting/${dept}/details`} onClick={onDetailsButtonClick}>
                <Link to={`/dashboard/morningmeeting/${dept}/details?start=${startFormat}&end=${endFormat}&shift=`}>Work Center</Link>
            </Menu.Item>
            <Menu.Item key={`/dashboard/swot/settings/${_.capitalize(dept)}`}>
                <Link to={`/dashboard/swot/settings/${_.capitalize(dept)}?start=${startFormat}&end=${endFormat}&getdata=true`} >SWOT</Link>
            </Menu.Item>
            <Menu.Item key={`/dashboard/morningmeeting/${dept}/hourly-production`} >
                <Link to={`/dashboard/morningmeeting/${dept}/hourly-production?date=${endFormat}`} >Hourly Production</Link>
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
                title={pageHeader}
            />

            <Content className="ma3 mt0">

                <DateRangePicker 
                    dateRangeValue={{startDate: startFormat, endDate: endFormat}}
                    onCalendarChange={onCalendarChange}
                    isRenderButton={false}  />
                
                <Dropdown.Button type="primary" onClick={onClick} overlay={btnOverlay} disabled={downloadLoading || isProdStatusFetching}>
                    {
                        downloadLoading || isProdStatusFetching ? <Spin indicator={loadingIcon} /> : 'Go'
                    }
                </Dropdown.Button>

                <div className="mt3">
                    {
                        !isProdStatusFetching 
                            ? <Production area={area}/> 
                            : <Container><Spin tip="Loading..."/></Container>
                    }
                    
                </div>

            </Content>
        </React.Fragment>)
}

const mapStateToProps = ({morningMeeting}) => ({
    startDate: morningMeeting.startDate,
    endDate: morningMeeting.endDate,
    ppmhChartType: morningMeeting.ppmhChartType,
    isProdStatusFetching: morningMeeting.isProdStatusFetching,
})

const mapDispatchToProps = dispatch => ({
    setProductionData: (start, end, area, cancelToken) => dispatch(fetchProductionStatusStartAsync(start, end, area, cancelToken)),
    fetchDailyScrapRateStartAsync: (start, end, area, cancelToken) => dispatch(fetchDailyScrapRateStartAsync(start, end, area, cancelToken)),
    fetchDailyKpiStartAsync: (start, end, area, cancelToken) => dispatch(fetchDailyKpiStartAsync(start, end, area, cancelToken)),
    fetchWeeklyLaborHrsStartAsync: (start, end, area, cancelToken) => dispatch(fetchWeeklyLaborHrsStartAsync(start, end, area, cancelToken)),
    fetchPpmhPerShiftStartAsync: (start, end, area, cancelToken) => dispatch(fetchPpmhPerShiftStartAsync(start, end, area, cancelToken)),
    fetchProdScrapStartAsync: (start, end, area, cancelToken) => dispatch(fetchProdScrapStartAsync(start, end, area, cancelToken)),

    setTitle: title => dispatch(setTitle(title)),
    setArea: area => dispatch(setArea(area)),

    setStartDate: (date) => dispatch(setStartDate(date)),
    setEndDate: (date) => dispatch(setEndDate(date)),
    setDetailsStartDate: date => dispatch(setDetailsStartDate(date)),
    setDetailsEndDate: date => dispatch(setDetailsEndDate(date))
})


export default connect(mapStateToProps, mapDispatchToProps)(DepartmentPage);