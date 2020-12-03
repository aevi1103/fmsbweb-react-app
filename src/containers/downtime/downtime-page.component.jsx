import React, { useState, useEffect } from 'react';
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'

import { 
    fetchDowntimeStartAsync
} from '../../core/redux/downtime/downtime.actions'

import DowntimeChart from './components/downtime-chart.component'
import DowntimeByOwnerChart from './components/downtime-by-owner-chart.component'
import DowntimeByLineChart from './components/downtime-by-line-chart.component'

import { dateFormat, dateRange, disabledDate } from '../../core/utilities/helpers'
import { useQuery } from '../../core/utilities/custom-hook'

import { 
    Layout,
    Button,
    Row,
    Col,
    Card,
    PageHeader,
    DatePicker
 } from "antd";

const { Content } = Layout;
const { RangePicker } = DatePicker;

const cardHeightStyle = {
    height: "500px"
}

const responsiveProps = {
    xs: 24,
    xl: 12
}

const today = moment().format(dateFormat);

const DowntimePage = () => {

    const history = useHistory();
    const query = useQuery();
    const dispatch = useDispatch();

    const startQry = query.get('start') ?? today;
    const endQry = query.get('end') ?? today;

    const ownerTitle = useSelector(({ downtime }) => downtime?.downtimeByOwnerCollection?.ownerTitle) ?? null;
    const lineTitle = useSelector(({ downtime }) => downtime?.downtimeByLineCollection?.lineTitle) ?? null;
    const isDowntimeFetching = useSelector(({ downtime }) => downtime?.isDowntimeFetching);

    const [startDate, setStartDate] = useState(startQry);
    const [endDate, setEndDate] = useState(endQry);

    const fetchData = () => {
        history.push(`/dashboard/morningmeeting/downtime?start=${startDate}&end=${endDate}`);
        document.title = `Downtime: ${startDate} - ${endDate}`;
        dispatch(fetchDowntimeStartAsync(startDate, endDate))
    }

    useEffect(() => {
        fetchData();
    }, [])

    const onClick = () => fetchData();

    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start?.format(dateFormat) ?? null);
        setEndDate(end?.format(dateFormat) ?? null);
    }

    return (
        <>

            <PageHeader
                className="site-page-header"
                title={`Downtime: ${startDate} - ${endDate}`}
            />
    
            <Content className="ma3 mt0">
            
                <Row gutter={[12,12]}>

                    <Col span={24}>

                        <RangePicker 
                                className="mr2"
                                format={dateFormat}
                                onCalendarChange={onCalendarChange}
                                disabledDate={disabledDate}
                                defaultValue={[moment(startDate), moment(endDate)]}
                                ranges={dateRange}/>


                        <Button type="primary" onClick={onClick} loading={isDowntimeFetching}>Go</Button>

                        <Button type="primary" className="ml2">
                            <a href="http://10.129.224.149/FMSB/Engineering/Downtime.aspx" target="_blank" rel="noopener noreferrer">More Charts</a>
                        </Button>

                    </Col>

                    <Col span={24}>

                        <Row gutter={[12,12]}>  

                            <Col {...responsiveProps}>
                                <Card 
                                    title="Downtime by Department and Shift (Minutes)"
                                    size="small"
                                    className="ba b--black-10"
                                    style={cardHeightStyle}
                                >
                                    <DowntimeChart/>
                                </Card>         
                            </Col>

                            <Col {...responsiveProps}>
                                <Card 
                                    title={ownerTitle}
                                    size="small"
                                    className="ba b--black-10"
                                    style={cardHeightStyle}
                                >
                                    <DowntimeByOwnerChart/>
                                </Card>         
                            </Col>

                            <Col span={24}>
                                <Card 
                                    title={lineTitle}
                                    size="small"
                                    className="ba b--black-10"
                                    style={cardHeightStyle}
                                >
                                    <DowntimeByLineChart/>
                                </Card>         
                            </Col>

                        </Row>
                                        
                    </Col>

                </Row>
                
            </Content>      
        </>)
    }

export default DowntimePage;