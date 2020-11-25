import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from "react-router-dom";
import api from '../../../../API'
import fileDownload from 'js-file-download'
import { useTitle } from 'react-use'

//level 0 charts
import ScrapVarianceChart from '../../../../components/performance/level-0/scrap-variance-chart.component';
import ScrapVarianceChartPerProgram from '../../../../components/performance/level-1/scrap-variance-per-program-chart.component';
import PpmhVariancePerDeptChart from '../../../../components/performance/level-1/ppmh-variance-per-dept-chart.component';
import DeptKpiChart from '../../../../components/performance/level-0/dept-kpi-chart.component';
import DowntimeChart from '../../../../components/downtime/downtime-chart/downtime-chart.component';
import PlantPpmhChart from '../../../../components/performance/level-0/plant-ppmh-chart.component';
import DateRangePicker from '../../../../components/date-range-picker/date-range-picker.component';
import SelectScrapType from '../../../../components/select-scrap-type/seclect-scrap-type.components';
import DeptSelect from '../../../../components/performance/dept-select.component';

import { 
    fetchScrapVarianceStartAsync,
    fetchScrapVariancePerProgramStartAsync,    
    fetchPpmhPerDeptStartAsync,
    fetchDeptKpiStartAsync,
    fetchDowntimeStartAsync,
    fetchPlantPpmhStartAsync,
    setPerformaceSelectedDepartment,
    setStartDate,
    setEndDate
} from '../../../../redux/morning-meeting/morning-meeting.actions';

import { 
    DownloadOutlined,
    LoadingOutlined
} from '@ant-design/icons';

import '../morning-meeting.styles.scss';

import { 
    Layout,
    Row,
    Col,
    Card,
    Tooltip,
    DatePicker,
    message,
    Alert,
    Dropdown,
    Spin,
    Menu,
    PageHeader
 } from "antd";

const { Content } = Layout;
const { RangePicker } = DatePicker;
const dateFormat = 'MM/DD/YYYY';

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

const disabledDate = (current) => current && current > moment().endOf('day');

const PerformanceLevel0Page = ({
    fetchScrapVarianceStartAsync,
    fetchScrapVariancePerProgramStartAsync,
    fetchPpmhPerDeptStartAsync,
    fetchDeptKpiStartAsync,
    fetchDowntimeStartAsync,
    fetchPlantPpmhStartAsync,

    setPerformaceSelectedDepartment,
    performaceSelectedDepartment,

    setStartDate,
    setEndDate,
    startDate,
    endDate
}) => {

    useTitle('Performance: L0 - L1')

    const previousDay = moment().add(-1, 'days').format(dateFormat);
    const scrapTypeDefault = 'SB';
    /** Hooks */

    //date range for quartery charts
    const lastTwelveMonths = moment().add(-12, 'month').startOf('quarter').format(dateFormat);
    const [monthStartFormart, setMonthStartFormat] = useState(lastTwelveMonths);
    const [monthEndFormat, setMonthEndFormat] = useState(previousDay);

    //scrap area name title
    const [scrapAreaNameTitle, setScrapAreaNameTitle] = useState(performaceSelectedDepartment);

    //scrap type
    const [scrapVarianceScrapType, setScrapVarianceScrapType] = useState(scrapTypeDefault);
    const [scrapVariancePerProgScrapType, setScrapVariancePerProgScrapType] = useState(scrapTypeDefault);

    const [downloadLoading, setDownloadLoading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);

    const fetchQuarterly = (start = monthStartFormart, end = monthEndFormat, scrapType = scrapVarianceScrapType) => {
        fetchScrapVarianceStartAsync(start, end, performaceSelectedDepartment, scrapType); 
        fetchPpmhPerDeptStartAsync(start, end, performaceSelectedDepartment);
        fetchPlantPpmhStartAsync(start, end);   
    }
    
    const fetch = (start = startDate, end = endDate, scrapType = scrapVariancePerProgScrapType) => {
        fetchScrapVariancePerProgramStartAsync(start, end, performaceSelectedDepartment, scrapType);   
        fetchDeptKpiStartAsync(start, end, performaceSelectedDepartment);
        fetchDowntimeStartAsync(start, end);
    }

    //events handlers
    const onClick = () => {
        setScrapAreaNameTitle(setTitleFn(performaceSelectedDepartment));
        fetchQuarterly(monthStartFormart, monthEndFormat);
        fetch(startDate, endDate);
    }

    //update selected scrap type
    const onSelectChange = (value) => setPerformaceSelectedDepartment(value);

    const onMonthChange = (date, dateString) => {

        let [start, end] = date;
        const [startStr, endStr] = dateString;
        const currentMonthYear = moment().format('YYYY-MM');

        if (endStr === currentMonthYear) {
            end = moment().add(-1, 'days');
        } else {
            end = end.endOf('month');
        }

        setMonthStartFormat(start?.format(dateFormat) ?? null);
        setMonthEndFormat(end?.format(dateFormat) ?? null);  
    }

    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start ? start.format(dateFormat) : null);
        setEndDate(end ? end.format(dateFormat) : null);  
    }

    const onScrapVarianceSelectChange = (value) => {
        setScrapVarianceScrapType(value);
        fetchScrapVarianceStartAsync(monthStartFormart, monthEndFormat, performaceSelectedDepartment, value); 
    }

    const onScrapVariancePerProgSelectChange = (value) => {
        setScrapVariancePerProgScrapType(value);
        fetchScrapVariancePerProgramStartAsync(startDate, endDate, performaceSelectedDepartment, value); 
    }

    useEffect(() => {
        fetchQuarterly();
        fetch();
        setScrapAreaNameTitle(setTitleFn(performaceSelectedDepartment));
    }, [])

    const onDownload = async () => {

        try {    

            setDownloadError(null);
            setDownloadLoading(true);
            const isPurchasedScrap = scrapVariancePerProgScrapType === 'SB' ? false : true;
            const isPlantTotal = performaceSelectedDepartment === 'Plant' ? true : false;
            const response = await api.get(`/exports/performance/level/0?start=${startDate}&end=${endDate}
                                            &area=${performaceSelectedDepartment}
                                            &isPurchasedScrap=${isPurchasedScrap}
                                            &isPlantTotal=${isPlantTotal}
                                            &monthStart=${monthStartFormart}&monthEnd=${monthEndFormat}`, {
                responseType: 'blob',
            });

            const fileName = `${performaceSelectedDepartment.toUpperCase()}_PERFORMANCE_LVL0&1_DATA_EXPORT_${new Date().getTime()}.xlsx`
            fileDownload(response.data, fileName);

            message.success('Data successfully exported!', 10);
            setDownloadLoading(false);

        } catch (error) {
            setDownloadError(`${error}: Unable to export something went wrong!`);
            setDownloadLoading(false);
            // message.error(error);
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
                title={`${scrapAreaNameTitle} Scrap Performace Level 0 - 1`}
            />
    
            <Content className="ma3 mt0">

                {
                    downloadError ? <Alert className="mb2" showIcon type="error" message={downloadError} /> : null
                }
            
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
                        moment(monthStartFormart, dateFormat),
                        moment(monthEndFormat, dateFormat)
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
                                title={`Lvl 0: ${scrapAreaNameTitle} Scrap Variance (${monthStartFormart} - ${monthEndFormat})`}
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
                                title={`Lvl 0: ${scrapAreaNameTitle} OAE, Downtime, Scrap (${startDate} - ${endDate})`}
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
                                title={`Lvl 1: ${scrapAreaNameTitle} Scrap Variance per Program (${startDate} - ${endDate})`}
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
                                title={`Lvl 1: ${scrapAreaNameTitle} Department PPMH Variance (${monthStartFormart} - ${monthEndFormat})`}
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

const mapDispatchToProps = dispatch => ({
    fetchScrapVarianceStartAsync: (start, end, area, isPurchasedScrap) => dispatch(fetchScrapVarianceStartAsync(start, end, area, isPurchasedScrap)),
    fetchScrapVariancePerProgramStartAsync: (start, end, area, isPurchasedScrap) => dispatch(fetchScrapVariancePerProgramStartAsync(start, end, area, isPurchasedScrap)),
    fetchPpmhPerDeptStartAsync: (start, end, area) => dispatch(fetchPpmhPerDeptStartAsync(start, end, area)),
    fetchDeptKpiStartAsync: (start, end, area) => dispatch(fetchDeptKpiStartAsync(start, end, area)),
    fetchDowntimeStartAsync: (start, end) => dispatch(fetchDowntimeStartAsync(start, end)),
    fetchPlantPpmhStartAsync: (start, end) => dispatch(fetchPlantPpmhStartAsync(start, end)),

    setPerformaceSelectedDepartment: (dept) => dispatch(setPerformaceSelectedDepartment(dept)),

    setStartDate: (date) => dispatch(setStartDate(date)),
    setEndDate: (date) => dispatch(setEndDate(date))
})

const mapStateToProps = ({morningMeeting}) => ({
    performaceSelectedDepartment: morningMeeting.performaceSelectedDepartment,

    startDate: morningMeeting.startDate,
    endDate: morningMeeting.endDate,
})

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceLevel0Page);