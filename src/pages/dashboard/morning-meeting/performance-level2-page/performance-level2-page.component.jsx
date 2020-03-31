import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import 'tachyons';

import { 
    setStartDate,
    setEndDate,

    fetchScrapVariancePerDeptStartAsync,
    fetchScrapVariancePerShiftStartAsync,
    fetchDowntimeByOwnerStartAsync,
    fetchDowntimeIconicsStartAsync,
    fetchOvertimePercentPerDeptStartAsync,
    fetchOvertimePercentPerShiftStartAsync,

    setPerformaceSelectedDepartment
} from '../../../../redux/morning-meeting/morning-meeting.actions';

//level 0 charts
import ScrapVariancePerDeptChart from '../../../../components/performance/level-2/scrap-variance-per-dept.component';
import ScrapVariancePerShiftChart from '../../../../components/performance/level-3/scrap-variance-per-shift.component';
import DowntimeByOwnerChart from '../../../../components/performance/level-2/downtime-by-owner-chart.component';
import DowntimeIconics from '../../../../components/performance/level-3/downtime-iconics-chart.component';
import OvertimePercentPerDeptChart from '../../../../components/performance/level-2/overtime-percent-per-dept.component';
import OvertimePercentPerSiftChart from '../../../../components/performance/level-3/overtime-percent-per-shift.component';

import DateRangePicker from '../../../../components/date-range-picker/date-range-picker.component';
import SelectScrapType from '../../../../components/select-scrap-type/seclect-scrap-type.components';
import DeptSelect from '../../../../components/performance/dept-select.component';
import '../morning-meeting.styles.scss';

import { 
    Layout,
    Row,
    Col,
    Card,
    Button,
    Tooltip,
    DatePicker,
    Input
 } from "antd";

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

    fetchScrapVariancePerDeptStartAsync,
    fetchScrapVariancePerShiftStartAsync,
    fetchDowntimeByOwnerStartAsync,
    fetchDowntimeIconicsStartAsync,
    fetchOvertimePercentPerDeptStartAsync,
    fetchOvertimePercentPerShiftStartAsync
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

    //downtime event
    const [minDowntimeEvt, setMinDowntimeEvt] = useState(10);
    const [maxDowntimeEvt, setMaxDowntimeEvt] = useState(null);

    const fetchQuarterly = (start = monthStartFormart, end = monthEndFormat) => {
        fetchOvertimePercentPerDeptStartAsync(start, end, performaceSelectedDepartment);
    }
    
    const fetch = (start = startDate, end = endDate) => {
        fetchScrapVariancePerDeptStartAsync(start, end, scrapByDeptScrapType);
        fetchScrapVariancePerShiftStartAsync(start, end, performaceSelectedDepartment, scrapByDeptScrapType);
        fetchDowntimeByOwnerStartAsync(start, end, performaceSelectedDepartment);
        fetchDowntimeIconicsStartAsync(start, end, performaceSelectedDepartment, minDowntimeEvt, maxDowntimeEvt);
        fetchOvertimePercentPerShiftStartAsync(start, end, performaceSelectedDepartment);
    };

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
    };

    const disabledDate = (current) => current && current > moment().endOf('day');

    //events handlers
    const onClick = () => {
        setDeptTitle(setTitleFn(performaceSelectedDepartment));
        fetchQuarterly(monthStartFormart, monthEndFormat);
        fetch(startDate, endDate);
    };

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
    };

    const onCalendarChange = (date, dateString) => {
        const [start, end] = date;
        setStartDate(start ? start.format(dateFormat) : null);
        setEndDate(end ? end.format(dateFormat) : null);  
    };

    const onScrapByDeptChange = (value) => {
        setScrapByDeptScrapType(value);
        fetchScrapVariancePerDeptStartAsync(startDate, endDate, value);
    };

    const onScrapByShiftChange = (value) => {
        setScrapByShiftScrapType(value);
        fetchScrapVariancePerShiftStartAsync(startDate, endDate, performaceSelectedDepartment, value);
    };

    const isNumeric = (value) => {
        const reg = /^-?[0-9]*(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') return true;
        return false;
    };

    const onChangeMinDowntimeEvt = (e) => {
        const { value } = e.target;
        
        if (isNumeric(value)) {
            setMinDowntimeEvt(value);
        }
    };

    const onChangeMaxDowntimeEvt = (e) => {
        const { value } = e.target;
        if (isNumeric(value)) {
            setMaxDowntimeEvt(value);   
        }
    };

    const onDowntimeEvtClick = () => {
        fetchDowntimeIconicsStartAsync(startDate, endDate, performaceSelectedDepartment, minDowntimeEvt, maxDowntimeEvt);
    };

    useEffect(() => {
        document.title = `Performance: L0 - L1`;
        setDeptTitle(setTitleFn(performaceSelectedDepartment));
        fetchQuarterly();
        fetch();
    }, []);

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
                <DeptSelect defaultValue={performaceSelectedDepartment} onChange={onSelectChange} type="dept" />
                                
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
                                <OvertimePercentPerDeptChart/>
                            </Card>         
                        </Col>

                        <Col span={8}>
                            <Card 
                                title={`Lvl 2: ${deptTitle} Dept Downtime by Owner (${startDate} - ${endDate})`}
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                            >
                                <DowntimeByOwnerChart/>
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
                                <ScrapVariancePerShiftChart/>
                            </Card>         
                        </Col>

                        <Col span={8}>
                            <Card 
                                title={`Lvl 3: ${deptTitle} Overtime Variance per Shift (${startDate} - ${endDate})`}
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                            >
                                <OvertimePercentPerSiftChart/>
                            </Card>         
                        </Col>

                        <Col span={8}>
                            <Card 
                                title={`Lvl 3: ${deptTitle} Downtime pareto - PLC (${startDate} - ${endDate})`}
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                                extra={
                                    <Tooltip title="Set Min and Max Downtime Event">
                                        <Input.Group compact size="small">
                                            <Input style={{ width: 100, textAlign: 'center' }} 
                                                    placeholder="Minimum"
                                                    value={minDowntimeEvt} 
                                                    onChange={onChangeMinDowntimeEvt} />
                                            <Input
                                                className="site-input-split"
                                                style={{
                                                    width: 30,
                                                    borderLeft: 0,
                                                    borderRight: 0,
                                                    pointerEvents: 'none',
                                                }}
                                                placeholder="~"
                                                disabled
                                            />
                                            <Input
                                                className="site-input-right"
                                                onChange={onChangeMaxDowntimeEvt}
                                                value={maxDowntimeEvt}
                                                style={{
                                                width: 100,
                                                textAlign: 'center',
                                                }}
                                                placeholder="Maximum"
                                            />
                                            <Button type="primary" size="small" onClick={onDowntimeEvtClick}>Go</Button>
                                        </Input.Group>
                                        
                                    </Tooltip>
                                    
                                }
                            >
                                <DowntimeIconics/>
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
    fetchScrapVariancePerShiftStartAsync: (start, end, area, isPurchasedScrap) => dispatch(fetchScrapVariancePerShiftStartAsync(start, end, area, isPurchasedScrap)),
    fetchDowntimeByOwnerStartAsync: (start, end, area) => dispatch(fetchDowntimeByOwnerStartAsync(start, end, area)),
    fetchDowntimeIconicsStartAsync: (start, end, area, min, max) => dispatch(fetchDowntimeIconicsStartAsync(start, end, area, min, max)),
    fetchOvertimePercentPerDeptStartAsync: (start, end, dept) => dispatch(fetchOvertimePercentPerDeptStartAsync(start, end, dept)),
    fetchOvertimePercentPerShiftStartAsync: (start, end, dept) => dispatch(fetchOvertimePercentPerShiftStartAsync(start, end, dept)),

    setPerformaceSelectedDepartment: (dept) => dispatch(setPerformaceSelectedDepartment(dept)),
})

const mapStateToProps = ({morningMeeting}) => ({
    startDate: morningMeeting.startDate,
    endDate: morningMeeting.endDate,

    performaceSelectedDepartment: morningMeeting.performaceSelectedDepartment,
})

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceLevel2Page);