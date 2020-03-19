import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import DateRangePicker from '../../../../components/date-range-picker/date-range-picker.component'

import { 
    setStartDate,
    setEndDate,
    fetchScrapVarianceStartAsync,
    setPerformaceSelectedDepartment
} from '../../../../redux/morning-meeting/morning-meeting.actions'

import PerformanceLevel0Chart from '../../../../components/performance/performance-level0-chart.component'

import '../morning-meeting.styles.scss'

import { 
    Layout,
    Row,
    Col,
    Card,
    Select,
    Button,
    Tooltip
 } from "antd";

 import 'tachyons'

 const { Option } = Select;
 const { Header, Content } = Layout;
 const dateFormat = 'MM/DD/YYYY';

 const cardHeightStyle = {
    height: "500px"
}

const PerformanceLevel0Page = ({
    fetchScrapVarianceStartAsync,

    setPerformaceSelectedDepartment,
    performaceSelectedDepartment
}) => {

    const lastTwelveMonths = moment().add(-12, 'month').startOf('quarter').format(dateFormat);
    const previousDay = moment().add(-1, 'days').format(dateFormat);

    const [startFormat, setStartFormat] = useState(lastTwelveMonths);
    const [endFormat, setSendFormat] = useState(previousDay);

    const [deptTitle, setDeptTitle] = useState(performaceSelectedDepartment);
    
    const fetchData = (start = startFormat, end = endFormat) => {
        fetchScrapVarianceStartAsync(start, end, performaceSelectedDepartment);
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

    const onClick = () => {

        setStartDate(startFormat);
        setEndDate(endFormat);
        setDeptTitle(setTitleFn(performaceSelectedDepartment));
        fetchData(startFormat, endFormat, performaceSelectedDepartment);
    }

    const onSelectChange = (value) => {
        setPerformaceSelectedDepartment(value);
    }

    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        setStartFormat(start ? start.format(dateFormat) : null);
        setSendFormat(end ? end.format(dateFormat) : null);  
    }

    useEffect(() => {
        document.title = `Performance: L0 - L1`;
        fetchData();
        setDeptTitle(setTitleFn(performaceSelectedDepartment));
    }, [])

    return (
        <>
            <Header className="pa0 custom-header" >
                <h2 className="ml3">{deptTitle} Performace L0 - L1: {startFormat} - {endFormat} (WIP)</h2>
            </Header>
    
            <Content className="ma3 mt0">
            
                <span className="mr2">Quarterly Chart Date Range:</span>
                <Tooltip className="mr2" placement="top" title={<span>Update date range for quarterly charts</span>}>
                    <DateRangePicker 
                        dateRangeValue={{startDate: startFormat, endDate: endFormat}}
                        onCalendarChange={onCalendarChange}
                        isRenderButton={false}/>
                </Tooltip>

                <span className="mr2">Date Range:</span>
                <Tooltip className="mr2" placement="top" title={<span>Update date range for other charts</span>}>
                    <DateRangePicker 
                        dateRangeValue={{startDate: startFormat, endDate: endFormat}}
                        onCalendarChange={onCalendarChange}
                        isRenderButton={false}/>
                </Tooltip>
                
                <Tooltip placement="top" title={<span>Update department</span>}>
                    <Select 
                        defaultValue={performaceSelectedDepartment}
                        style={{ width: 120 }}
                        onChange={onSelectChange}
                        className="mr2">
                        <Option value="Foundry Cell">Foundry</Option>
                        <Option value="Machine Line">Machining</Option>
                        <Option value="Skirt Coat">Finishing</Option>
                        <Option value="Assembly">Assembly</Option>
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
                                title={`Level 0 - Plant Wide Scrap Variance`}
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                                extra={<span>{deptTitle}</span>}
                            >
                                <PerformanceLevel0Chart/>
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
                                title="Level 0 - Plant OAE, Downtime, Scrap"
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
                                title="Level 1 - Plant Wide Scrap Variance per Program"
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                            >
                                
                            </Card>         
                        </Col>

                        <Col span={8}>
                            <Card 
                                title="Level 1 - PPMH Plant Wide Variance per Department"
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                            >
                            </Card>         
                        </Col>

                        <Col span={8}>
                            <Card 
                                title="Level 1 - Downtime per Department"
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
    fetchScrapVarianceStartAsync: (start, end, area) => dispatch(fetchScrapVarianceStartAsync(start, end, area)),
    setPerformaceSelectedDepartment: (dept) => dispatch(setPerformaceSelectedDepartment(dept))
})

const mapStateToProps = ({morningMeeting}) => ({
    performaceSelectedDepartment: morningMeeting.performaceSelectedDepartment
})

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceLevel0Page);