import React, { useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Link, useHistory } from "react-router-dom";
import { useTitle } from 'react-use'

//level 0 charts
import ScrapVarianceChart from '../../components/performance/level-0/scrap-variance-chart.component';
import ScrapVarianceChartPerProgram from '../../components/performance/level-1/scrap-variance-per-program-chart.component';
import PpmhVariancePerDeptChart from '../../components/performance/level-1/ppmh-variance-per-dept-chart.component';
import DeptKpiChart from '../../components/performance/level-0/dept-kpi-chart.component';
import DowntimeChart from '../downtime/components/downtime-chart.component';
import PlantPpmhChart from '../../components/performance/level-0/plant-ppmh-chart.component';
import DateRangePicker from '../../components/date-range-picker/date-range-picker.component';
import SelectScrapType from '../../components/select-scrap-type/seclect-scrap-type.components';
import DeptSelect from '../../components/performance/dept-select.component';

import { 
    fetchScrapVarianceStartAsync,
    fetchScrapVariancePerProgramStartAsync,    
    fetchPpmhPerDeptStartAsync,
    fetchDeptKpiStartAsync,
    fetchPlantPpmhStartAsync,
    setPerformaceSelectedDepartment,
} from '../../core/redux/morning-meeting/morning-meeting.actions';

import { fetchDowntimeStartAsync } from '../../core/redux/downtime/downtime.actions'
import { dateFormat, disabledDate } from '../../core/utilities/helpers'
import { useQuery } from '../../core/utilities/custom-hook'

import { download } from './service/download'

import { 
    DownloadOutlined,
    LoadingOutlined
} from '@ant-design/icons';

import { 
    Layout,
    Row,
    Col,
    Card,
    Tooltip,
    DatePicker,
    Dropdown,
    Spin,
    Menu,
    PageHeader
 } from "antd";

const { Content } = Layout;
const { RangePicker } = DatePicker;

const cardHeightStyle = {
    height: "500px"
}

const responsiveProps = {
    xs: 24,
    xl: 8
}

const setTitleFn = (dept) => {
    switch (dept) {
        case 'Skirt Coat' :
            return 'Finishing';
        case 'Foundry Cell' :
            return 'Foundry';
        case 'Machine Line':
            return 'Machining';
        default:
            return dept;
    }
}

const yesterday = moment().add(-1, 'days').format(dateFormat);
const monthStartDefault = moment().add(-12, 'month').startOf('quarter').format(dateFormat);

const scrapTypeDefault = 'SB';

const PerformanceLevel0Page = () => {

    const query = useQuery();
    const dispatch = useDispatch();
    const history = useHistory();

    useTitle('Performance: L0 - L1');

    //* selectors
    const performaceSelectedDepartment = useSelector(({ morningMeeting }) => morningMeeting.performaceSelectedDepartment)

    //*  url query params
    const startQry = query.get('start') ?? yesterday;
    const endQry = query.get('end') ?? yesterday;

    //* date range state
    const [startDate, setStartDate] = useState(startQry);
    const [endDate, setEndDate] = useState(endQry)
    const [monthStart, setMonthStart] = useState(monthStartDefault);
    const [monthEnd, setMonthEnd] = useState(yesterday);

    //* other state
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [title, setTitle] = useState(performaceSelectedDepartment);
    const [scrapType, setScrapType] = useState(scrapTypeDefault);
    const [programScrapType, setProgramScrapType] = useState(scrapTypeDefault);

    const fetchQuarterly = () => {
        dispatch(fetchScrapVarianceStartAsync(monthStart, monthEnd, performaceSelectedDepartment, scrapType))
        dispatch(fetchPpmhPerDeptStartAsync(monthStart, monthEnd, performaceSelectedDepartment))
        dispatch(fetchPlantPpmhStartAsync(monthStart, monthEnd))
    }
    
    const fetch = () => {
        dispatch(fetchScrapVariancePerProgramStartAsync(startDate, endDate, performaceSelectedDepartment, scrapType))
        dispatch(fetchDeptKpiStartAsync(startDate, endDate, performaceSelectedDepartment))
        dispatch(fetchDowntimeStartAsync(startDate, startDate))
    }

    //* effects
    useEffect(() => {
        fetchQuarterly();
        fetch();
        setTitle(setTitleFn(performaceSelectedDepartment));

        history.push(`/dashboard/morningmeeting/level0?start=${startDate}&end=${endDate}`)
    }, [])

    //* events handlers

    const onClick = () => {
        setTitle(setTitleFn(performaceSelectedDepartment));
        fetchQuarterly();
        fetch();
    }

    const onSelectChange = (value) => dispatch(setPerformaceSelectedDepartment(value));

    const onMonthChange = (date, dateString) => {

        let [start, end] = date;
        const [, endStr] = dateString;
        const currentMonthYear = moment().format('YYYY-MM');

        if (endStr === currentMonthYear) {
            end = moment().add(-1, 'days');
        } else {
            end = end.endOf('month');
        }

        setMonthStart(start?.format(dateFormat) ?? null);
        setMonthEnd(end?.format(dateFormat) ?? null);  
    }

    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start?.format(dateFormat) ?? null);
        setEndDate(end?.format(dateFormat) ?? null);  
    }

    const onScrapVarianceSelectChange = (value) => {
        setScrapType(value);
        dispatch(fetchScrapVarianceStartAsync(monthStart, monthEnd, performaceSelectedDepartment, value))
    }

    const onScrapVariancePerProgSelectChange = (value) => {
        setProgramScrapType(value);
        dispatch(fetchScrapVariancePerProgramStartAsync(startDate, endDate, performaceSelectedDepartment, value));
    }

    const onDownload = async () => download(
            setDownloadLoading,
            programScrapType,
            performaceSelectedDepartment,
            startDate,
            endDate,
            monthStart,
            monthEnd)

    const btnOverlay = (
        <Menu>
            <Menu.Item key="export" icon={<DownloadOutlined />} onClick={onDownload} >
                Export
            </Menu.Item>   
            <Menu.Item key="targets">
                <a href="http://10.129.224.149/FMSB/SWOT/Targets.aspx" target="_blank" rel="noreferrer">Targets</a>
            </Menu.Item>
        </Menu>
    )
    const loadingIcon = <LoadingOutlined style={{ fontSize: 15 }} spin />;

    return (
        <>
            <PageHeader
                className="site-page-header"
                title={`${title} Scrap Performace Level 0 - 1`}
            />
    
            <Content className="ma3 mt0">

                <Tooltip placement="top" title={
                    (<div>
                        <b>Update Charts:</b>
                        <ul>
                            <li>Plant Wide Scrap Variance</li>
                            <li>PPMH Plant Wide Variance</li>
                            <li>PPMH Variance per Dept</li>
                        </ul>
                    </div>)}>

                    <span className="mr2">Month Range:</span>
                </Tooltip>
                <RangePicker picker="month" onChange={onMonthChange} className="mr2" disabledDate={disabledDate}
                    defaultValue={[
                        moment(monthStart, dateFormat),
                        moment(monthEnd, dateFormat)
                    ]} />

                <Tooltip placement="top" title={
                    (<div>
                        <b>Update Charts:</b>
                        <ul>
                            <li>Plant OAE, Downtime, Scrap</li>
                            <li>Plant Wide Scrap Variace per Program</li>
                            <li>Downtime per Dept</li>
                        </ul>
                    </div>)}>

                    <span className="mr2">Date Range:</span>
                </Tooltip>

                <DateRangePicker 
                    dateRangeValue={{startDate: startDate, endDate: endDate}}
                    onCalendarChange={onCalendarChange}
                    isRenderButton={false}/>
                
                <span className="mr2">Scrap:</span>
                <DeptSelect defaultValue={performaceSelectedDepartment} onChange={onSelectChange} />
                                
                <Dropdown.Button type="primary" onClick={onClick} overlay={btnOverlay} disabled={downloadLoading}>
                    {
                        downloadLoading ? <Spin indicator={loadingIcon} /> : 'Go'
                    }
                </Dropdown.Button>

                <div className="mt3">
                    <Row gutter={[12,12]}>  

                        <Col {...responsiveProps}>
                            <Card 
                                title={`Lvl 0: ${title} Scrap Variance (${monthStart} - ${monthEnd})`}
                                size="small"
                                className="ba b--black-10"
                                style={cardHeightStyle}
                                extra={<SelectScrapType onChange={onScrapVarianceSelectChange} />}
                            >
                                <ScrapVarianceChart  />
                            </Card>         
                        </Col>

                        <Col {...responsiveProps}>
                            <Card 
                                title="Lvl 0: PPMH Plant Wide Variance"
                                size="small"
                                className="ba b--black-10"
                                style={cardHeightStyle}
                            >
                                <PlantPpmhChart/>
                            </Card>         
                        </Col>

                        <Col {...responsiveProps}>
                            <Card 
                                title={`Lvl 0: ${title} OAE, Downtime, Scrap (${startDate} - ${endDate})`}
                                size="small"
                                className="ba b--black-10"
                                style={cardHeightStyle}
                            >
                                <DeptKpiChart/>
                            </Card>         
                        </Col>

                    </Row>

                    <Row gutter={[12,12]}>  

                        <Col {...responsiveProps}>
                            <Card 
                                title={`Lvl 1: ${title} Scrap Variance per Program (${startDate} - ${endDate})`}
                                size="small"
                                className="ba b--black-10"
                                style={cardHeightStyle}
                                extra={<SelectScrapType onChange={onScrapVariancePerProgSelectChange} />}
                            >
                                <ScrapVarianceChartPerProgram/>
                            </Card>         
                        </Col>

                        <Col {...responsiveProps}>
                            <Card 
                                title={`Lvl 1: ${title} Department PPMH Variance (${monthStart} - ${monthEnd})`}
                                size="small"
                                className="ba b--black-10"
                                style={cardHeightStyle}
                            >
                                <PpmhVariancePerDeptChart/>
                            </Card>         
                        </Col>

                        <Col {...responsiveProps}>
                            <Card 
                                title={`Lvl 0: Downtime per Department (${startDate} - ${endDate})`}
                                size="small"
                                className="ba b--black-10"
                                style={cardHeightStyle}
                                extra={
                                    <Link to="/dashboard/morningmeeting/downtime">Drilldown</Link>
                                }
                            >
                                <DowntimeChart isDrillDown={false}/>
                            </Card>         
                        </Col>

                    </Row>

                </div>
                
            </Content>      
        </>)

}

export default PerformanceLevel0Page;