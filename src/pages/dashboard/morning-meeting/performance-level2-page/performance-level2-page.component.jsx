import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import 'tachyons'
import { Link } from "react-router-dom";

import { 
    setStartDate,
    setEndDate,

    fetchScrapVariancePerDeptStartAsync,

    setPerformaceSelectedDepartment
} from '../../../../redux/morning-meeting/morning-meeting.actions'

//level 0 charts
import ScrapVariancePerDeptChart from '../../../../components/performance/level-2/scrap-variance-per-dept.component'

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

const PerformanceLevel2Page = ({
    setStartDate,
    setEndDate,
    startDate,
    endDate,

    setPerformaceSelectedDepartment,
    performaceSelectedDepartment,

    fetchScrapVariancePerDeptStartAsync
}) => {

    const previousDay = moment().add(-1, 'days').format(dateFormat);
    const scrapTypeDefault = 'SB';
    /** Hooks */

    //date range for quartery charts
    const lastTwelveMonths = moment().add(-12, 'month').startOf('quarter').format(dateFormat);
    const [monthStartFormart, setMonthStartFormat] = useState(lastTwelveMonths);
    const [monthEndFormat, setMonthEndFormat] = useState(previousDay);

    //scrap type
    const [scrapByDeptScrapType, setScrapByDeptScrapType] = useState(scrapTypeDefault);
    const [scrapByShiftScrapType, setScrapByShiftScrapType] = useState(scrapTypeDefault);

    //scrap area name title
    const [deptTitle, setDeptTitle] = useState(performaceSelectedDepartment);

    const fetchQuarterly = (start = monthStartFormart, end = monthEndFormat) => {

    }
    
    const fetch = (start = startDate, end = endDate) => {
        fetchScrapVariancePerDeptStartAsync(start, end);
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

    //events handlers
    const onClick = () => {
        setDeptTitle(setTitleFn(performaceSelectedDepartment));
        fetchQuarterly(monthStartFormart, monthEndFormat);
        fetch(startDate, endDate);
    }

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

        setMonthStartFormat(start ? start.format(dateFormat) : null);
        setMonthEndFormat(end ? end.format(dateFormat) : null);  
    }

    const onCalendarChange = (date, dateString) => {
        const [start, end] = date;
        setStartDate(start ? start.format(dateFormat) : null);
        setEndDate(end ? end.format(dateFormat) : null);  
    }

    const onScrapByDeptChange = (value) => {
        setScrapByDeptScrapType(value);
        fetchScrapVariancePerDeptStartAsync(startDate, endDate, value);
    }

    const onScrapByShiftChange = (value) => {
        setScrapByShiftScrapType(value);
    }

    useEffect(() => {
        document.title = `Performance: L0 - L1`;
        setDeptTitle(setTitleFn(performaceSelectedDepartment));
        fetchQuarterly();
        fetch();
    }, [])

    return (
        <>
            <Header className="pa0 custom-header" >
                <h2 className="ml3">{deptTitle} Department Performace L2 - L3</h2>
            </Header>
    
            <Content className="ma3 mt0">
            
                <Tooltip placement="top" title={
                    (<div>
                        <b>Update Charts:</b>
                        <ul>
                            <li>Overtime percentage per department</li>
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
                            <li>Scrap Variance per Dept</li>
                            <li>Scrap Variance per Shift</li>
                            <li>Overtime Variance per Shift</li>
                            <li>Downtime by Owner</li>
                            <li>Downtime Pareto PLC</li>
                        </ul>
                    </div>)}>

                    <span className="mr2">Date Range:</span>
                </Tooltip>

                <DateRangePicker 
                    dateRangeValue={{startDate: startDate, endDate: endDate}}
                    onCalendarChange={onCalendarChange}
                    isRenderButton={false}/>
                
                <span className="mr2">Department:</span>
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
                                
                <Tooltip placement="top" title={<span>Click to reload dashboard</span>}>
                    <Button type="primary" onClick={onClick}>Go</Button>
                </Tooltip>

                <div className="mt3">
                    <Row gutter={12}>  

                        <Col span={8}>
                            <Card 
                                title={`Lvl 2: Scrap Variance per Dept (${startDate} - ${endDate})`}
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                                extra={<SelectScrapType onChange={onScrapByDeptChange} />}
                            >
                                <ScrapVariancePerDeptChart/>
                            </Card>         
                        </Col>

                        <Col span={8}>
                            <Card 
                                title={`Lvl 2: ${deptTitle} Dept Overtime  percentage (${monthStartFormart} - ${monthEndFormat})`}
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                            >
                                
                            </Card>         
                        </Col>

                        <Col span={8}>
                            <Card 
                                title={`Lvl 2: ${deptTitle} Dept Downtime by Owner (${startDate} - ${endDate})`}
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                            >

                            </Card>         
                        </Col>

                    </Row>

                    <Row gutter={12}>  

                        <Col span={8}>
                            <Card 
                                title={`Lvl 3: ${deptTitle} Dept Scrap Variance per Shift (${startDate} - ${endDate})`}
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                                extra={<SelectScrapType onChange={onScrapByShiftChange} />}
                            >
  
                            </Card>         
                        </Col>

                        <Col span={8}>
                            <Card 
                                title={`Lvl 3: ${deptTitle} Overtime Variance per Shift (${startDate} - ${endDate})`}
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                            >

                            </Card>         
                        </Col>

                        <Col span={8}>
                            <Card 
                                title={`Lvl 3: ${deptTitle} Top 25 Downtime pareto - PLC (${startDate} - ${endDate})`}
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                            >

                            </Card>         
                        </Col>

                    </Row>

                </div>
                
            </Content>      
        </>)

}

const mapDispatchToProps = dispatch => ({
    setStartDate: (date) => dispatch(setStartDate(date)),
    setEndDate: (date) => dispatch(setEndDate(date)),

    fetchScrapVariancePerDeptStartAsync: (start, end, isPurchasedScrap) => dispatch(fetchScrapVariancePerDeptStartAsync(start, end, isPurchasedScrap)),

    setPerformaceSelectedDepartment: (dept) => dispatch(setPerformaceSelectedDepartment(dept)),
})

const mapStateToProps = ({morningMeeting}) => ({
    startDate: morningMeeting.startDate,
    endDate: morningMeeting.endDate,

    performaceSelectedDepartment: morningMeeting.performaceSelectedDepartment,
})

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceLevel2Page);