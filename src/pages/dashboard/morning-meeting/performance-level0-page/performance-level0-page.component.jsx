import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import DateRangePicker from '../../../../components/date-range-picker/date-range-picker.component'

import { 
    setStartDate,
    setEndDate,
    fetchScrapVarianceStartAsync
} from '../../../../redux/morning-meeting/morning-meeting.actions'

import '../morning-meeting.styles.scss'

import { 
    Layout,
    Row,
    Col,
    Card,
    Select
 } from "antd";

 const { Option } = Select;
 const { Header, Content } = Layout;
 const dateFormat = 'MM/DD/YYYY';

 const cardHeightStyle = {
    height: "500px"
}

const PerformanceLevel0Page = ({
    fetchScrapVarianceStartAsync,
    scrapVarianceCollection,
    isScrapVarianceFetching
}) => {

    const firstOfTheYear = moment().startOf('year').format(dateFormat);
    const previousDay = moment().add(-1, 'days').format(dateFormat);

    const [startFormat, setStartFormat] = useState(firstOfTheYear);
    const [endFormat, setSendFormat] = useState(previousDay);
    const [deptValue, setDeptValue] = useState('Foundry Cell');

    const fetchData = (start = startFormat, end = endFormat) => {
        fetchScrapVarianceStartAsync(start, end, deptValue);
    }

    const onClick = () => {
        setStartDate(startFormat);
        setEndDate(endFormat);
        fetchData(startFormat, endFormat, deptValue)
    }

    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        setStartFormat(start ? start.format(dateFormat) : null);
        setSendFormat(end ? end.format(dateFormat) : null);  
    }

    useEffect(() => {
        document.title = `Performance: L0 - L1`;
        fetchData();
    }, [])

    const scrapVarianceDeptSelectChange = (value) => {
        setDeptValue(value)
    }

    const DeptSelect = (
        <Select defaultValue={deptValue} style={{ width: 120 }} onChange={scrapVarianceDeptSelectChange} value={deptValue}>
            <Option value="Foundry Cell">Foundry</Option>
            <Option value="Machine Line">Machining</Option>
            <Option value="Skirt Coat">Finishing</Option>
            <Option value="Assembly">Assembly</Option>
        </Select>
    )

    return (
        <>
            <Header className="pa0 custom-header" >
                <h2 className="ml3">Performace L0 - L1: {startFormat} - {endFormat} (WIP)</h2>
            </Header>
    
            <Content className="ma3 mt0">
            
                <DateRangePicker 
                    dateRangeValue={{startDate: startFormat, endDate: endFormat}}
                    onButtonClick={onClick}
                    onCalendarChange={onCalendarChange}/>

                <div className="mt3">
                    <Row gutter={12}>  

                        <Col span={8}>
                            <Card 
                                title="Level 0 - Plant Wide Scrap Variance"
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                                extra={DeptSelect}
                                loading={isScrapVarianceFetching}
                            >

                            </Card>         
                        </Col>

                        <Col span={8}>
                            <Card 
                                title="Level 0 - PPMH Plant Wide Variance"
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                                extra={DeptSelect}
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
                                extra={DeptSelect}
                            >
                                
                            </Card>         
                        </Col>

                        <Col span={8}>
                            <Card 
                                title="Level 1 - PPMH Plant Wide Variance per Department"
                                bordered={false} size="small"
                                className="mb3"
                                style={cardHeightStyle}
                                extra={DeptSelect}
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
    fetchScrapVarianceStartAsync: (start, end, area) => dispatch(fetchScrapVarianceStartAsync(start, end, area))
})

const mapStateToProps = ({morningMeeting}) => ({
    isScrapVarianceFetching: morningMeeting.isScrapVarianceFetching,
    scrapVarianceCollection: morningMeeting.morningMeeting
})

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceLevel0Page);