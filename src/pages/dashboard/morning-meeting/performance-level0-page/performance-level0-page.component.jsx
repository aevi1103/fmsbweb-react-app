import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import 'tachyons'
import { Link } from "react-router-dom";

import { 
    fetchScrapVarianceStartAsync,
    fetchScrapVariancePerProgramStartAsync,
    setPerformaceSelectedDepartment,
    fetchPpmhPerDeptStartAsync,
    fetchDeptKpiStartAsync,
    fetchDowntimeStartAsync,

    setStartDate,
    setEndDate
} from '../../../../redux/morning-meeting/morning-meeting.actions'

//level 0 charts
import ScrapVarianceChart from '../../../../components/performance/level-0/scrap-variance-chart.component'
import ScrapVarianceChartPerProgram from '../../../../components/performance/level-1/scrap-variance-per-program-chart.component'
import PpmhVariancePerDeptChart from '../../../../components/performance/level-1/ppmh-variance-per-dept-chart.component'
import DeptKpiChart from '../../../../components/performance/level-0/dept-kpi-chart.component'
import DowntimeChart from '../../../../components/downtime/downtime-chart/downtime-chart.component'

import DateRangePicker from '../../../../components/date-range-picker/date-range-picker.component'
import SelectScrapType from '../../../../components/select-scrap-type/seclect-scrap-type.components'
import '../morning-meeting.styles.scss'

import { 
    Layout,
    Row,
    Col,
    Card,
    Select,
    Button,
    Tooltip,
    DatePicker
 } from "antd";

 const { Option } = Select;
 const { Header, Content } = Layout;
 const { RangePicker } = DatePicker;

 const dateFormat = 'MM/DD/YYYY';

 const cardHeightStyle = {
    height: "500px"
}

const PerformanceLevel0Page = ({
    fetchScrapVarianceStartAsync,
    fetchScrapVariancePerProgramStartAsync,
    fetchPpmhPerDeptStartAsync,
    fetchDeptKpiStartAsync,
    fetchDowntimeStartAsync,

    setPerformaceSelectedDepartment,
    performaceSelectedDepartment,

    setStartDate,
    setEndDate,
    startDate,
    endDate
}) => {

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

    const fetchQuarterly = (start = monthStartFormart, end = monthEndFormat, scrapType = scrapVarianceScrapType) => {
        fetchScrapVarianceStartAsync(start, end, performaceSelectedDepartment, scrapType); 
        fetchPpmhPerDeptStartAsync(start, end, performaceSelectedDepartment);
    }
    
    const fetch = (start = startDate, end = endDate, scrapType = scrapVariancePerProgScrapType) => {
        fetchScrapVariancePerProgramStartAsync(start, end, performaceSelectedDepartment, scrapType);   
        fetchDeptKpiStartAsync(start, end, performaceSelectedDepartment);
        fetchDowntimeStartAsync(start, end);
    }

    const setTitleFn = (dept) => {
        switch (dept) {
            case 'Skirt Coat' :
                return 'Finishing Scrap';
            case 'Foundry Cell' :
                return 'Foundry Scrap';
            case 'Machine Line':
                return 'Machining Scrap';
            default:
                return dept + ' Scrap';
        }
    }

    const disabledDate = (current) => current && current > moment().endOf('day');

    //events handlers
    const onClick = () => {
        setScrapAreaNameTitle(setTitleFn(performaceSelectedDepartment));
        fetchQuarterly(monthStartFormart, monthEndFormat);
        fetch(startDate, endDate);
    }

    const onSelectChange = (value) => {
        setPerformaceSelectedDepartment(value);
    }

    const onMonthChange = (date, dateString) => {

        let [start, end] = date;
        const [startStr, endStr] = dateString;
        const currentMonthYear = moment().format('YYYY-MM');

        if (endStr === currentMonthYear) {
            end = moment().add(-1, 'days');
        } else {
            end = end.endOf('month');
        }

        setMonthStartFormat(start ? start.format(dateFormat) : null);
        setMonthEndFormat(end ? end.format(dateFormat) : null);  
    }

    const onCalendarChange = (date, dateString) => {
        const [start, end] = date;
        setStartDate(start ? start.format(dateFormat) : null);
        setEndDate(end ? end.format(dateFormat) : null);  
    }

    const onScrapVarianceSelectChange = (value) => {
        setScrapVarianceScrapType(value);
        fetchScrapVarianceStartAsync(monthStartFormart, monthEndFormat, performaceSelectedDepartment, value); 
    }

    const onScrapVariancePerProgSelectChange = (value) => {
        setScrapVariancePerProgScrapType(value);
        fetch(startDate, endDate, value);
    }

    useEffect(() => {
        document.title = `Performance: L0 - L1`;
        fetchQuarterly();
        fetch();
        setScrapAreaNameTitle(setTitleFn(performaceSelectedDepartment));
    }, [])

    return (
        <>
            <Header className="pa0 custom-header" >
                <h2 className="ml3">{scrapAreaNameTitle} Performace L0 - L1</h2>
            </Header>
    
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
                
                <Tooltip placement="top" title={<span>Scrap Type</span>}>
                    <Select 
                        defaultValue={performaceSelectedDepartment}
                        style={{ width: 120 }}
                        onChange={onSelectChange}
                        className="mr2">       
                        <Option value="Foundry Cell">Foundry</Option>
                        <Option value="Machine Line">Machining</Option>
                        <Option value="Skirt Coat">Finishing</Option>
                        <Option value="Assembly">Assembly</Option>
                        <Option value="Plant">Plant</Option>
                    </Select>
                </Tooltip>
                                
                <Tooltip placement="top" title={<span>Click to reload dashboard</span>}>
                    <Button type="primary" onClick={onClick}>Go</Button>
                </Tooltip>

                <Button type="primary" className="ml2">
                    <a href="http://134.238.150.15/FMSB/SWOT/Targets.aspx" target="_blank">Update KPI Targets</a>
                </Button>

                <div className="mt3">
                    <Row gutter={12}>  

                        <Col span={8}>
                            <Card 
                                title={`Lvl 0: ${scrapAreaNameTitle} Variance (${monthStartFormart} - ${monthEndFormat})`}
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                                extra={<SelectScrapType onChange={onScrapVarianceSelectChange} />}
                            >
                                <ScrapVarianceChart  />
                            </Card>         
                        </Col>

                        <Col span={8}>
                            <Card 
                                title="Level 0 - PPMH Plant Wide Variance"
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                            >
                                
                            </Card>         
                        </Col>

                        <Col span={8}>
                            <Card 
                                title={`Level 0: ${scrapAreaNameTitle.replace(' Scrap','')} OAE, Downtime, Scrap (${startDate} - ${endDate})`}
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                            >
                                <DeptKpiChart/>
                            </Card>         
                        </Col>

                    </Row>

                    <Row gutter={12}>  

                        <Col span={8}>
                            <Card 
                                title={`Lvl 1: ${scrapAreaNameTitle} Variance per Program (${startDate} - ${endDate})`}
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                                extra={<SelectScrapType onChange={onScrapVariancePerProgSelectChange} />}
                            >
                                <ScrapVarianceChartPerProgram/>
                            </Card>         
                        </Col>

                        <Col span={8}>
                            <Card 
                                title={`Lvl 1: ${scrapAreaNameTitle.replace(' Scrap','')} PPMH Variance per Department (${monthStartFormart} - ${monthEndFormat})`}
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                            >
                                <PpmhVariancePerDeptChart/>
                            </Card>         
                        </Col>

                        <Col span={8}>
                            <Card 
                                title={`Lvl 0: Downtime per Department (${startDate} - ${endDate})`}
                                bordered={false} size="small"
                                className="mb3"
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