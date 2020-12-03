import React, { useState, useEffect } from 'react';
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'

import DateRangePicker from '../../components/date-range-picker/date-range-picker.component'

import MonthlyIncidentRateChart from './components/monthly-incident-rate-chart.component'
import IncidentByDeptChart from './components/incident-by-dept-chart.component'
import IncidentTable from './components/incidents-table'

import { 
    fetchSafetyMonthlyIncidentRateStartAsync,
    fetchSafetyIncidentByDeptStartAsync,
    fetchSafetyIncidentStartAsync
} from '../../core/redux/safety/safety.actions'

import { dateFormat } from '../../core/utilities/helpers'
import { useQuery } from '../../core/utilities/custom-hook'

import { 
    Layout,
    Button,
    PageHeader,
    Row,
    Col,
    Card
 } from "antd";

const { Content } = Layout;

const cardHeightStyle = {
    height: "500px"
}

const yesterday = moment().add(-1, 'd').format(dateFormat);

const SafetyPage = () => {
    
    const dispatch = useDispatch();
    const query = useQuery();
    const history = useHistory();

    //* url qry
    const startDate = query.get('start') ?? yesterday;
    const endDate = query.get('start') ?? yesterday;

    //* states
    const [startFormat, setStartFormat] = useState(startDate);
    const [endFormat, setSendFormat] = useState(endDate);

    //* selectors
    const isMonthlyIncidentRateFetching = useSelector(({ safety }) => safety.isMonthlyIncidentRateFetching);
    const isIncidentByDeptFetching = useSelector(({ safety }) => safety.isIncidentByDeptFetching);
    const isIncidentFetching = useSelector(({ safety }) => safety.isIncidentFetching);

    const monthlyIncidentRateCollection = useSelector(({ safety }) => safety?.monthlyIncidentRateCollection) ?? [];
    const incidentByDept = useSelector(({ safety }) => safety?.incidentByDept) ?? null;
    const incidentCollection = useSelector(({ safety }) => safety?.incidentCollection) ?? [];

    const fetchData = () => {
        history.push(`/dashboard/morningmeeting/safety?start=${startFormat}&end=${endFormat}`)
        dispatch(fetchSafetyMonthlyIncidentRateStartAsync())
        dispatch(fetchSafetyIncidentByDeptStartAsync())
        dispatch(fetchSafetyIncidentStartAsync(startFormat, endFormat))
    }

    const onClick = () => fetchData();

    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        setStartFormat(start?.format(dateFormat) ?? null);
        setSendFormat(end?.format(dateFormat) ?? null);
    }

    useEffect(() => {
        document.title = `Safety`;
        fetchData();
    }, [])

    return (
    <React.Fragment>

        <PageHeader
            className="site-page-header"
            title={`Safety: ${startDate} - ${endDate}`}
        />

        <Content className="ma3 mt0">
            
            <Row gutter={[12,12]}>

                <Col span={24}>

                    <DateRangePicker 
                        dateRangeValue={{startDate: startDate, endDate: endDate}}
                        onButtonClick={onClick}
                        onCalendarChange={onCalendarChange} />

                    <Button type="primary" className="ml2">
                        <a href="http://10.129.224.149/FMSB/Safety2/Charts.aspx" target="_blank" rel="noopener noreferrer">More Charts</a>
                    </Button>
                
                </Col>

                <Col span={8} lg={8} md={24} xs={24}>
                    <Card 
                        title="Monthly Incident Date"
                        size="small"
                        className="ba b--black-10"
                        style={cardHeightStyle}
                        >                     
                            <MonthlyIncidentRateChart data={monthlyIncidentRateCollection} loading={isMonthlyIncidentRateFetching} />
                    </Card>
                </Col>
                <Col span={8} lg={8} md={24} xs={24}>
                    <Card 
                        title="Incident Occurence by Department"
                        
                        size="small"
                        className="ba b--black-10" 
                        style={cardHeightStyle}
                        >
                            <IncidentByDeptChart incidentData={incidentByDept} loading={isIncidentByDeptFetching} />
                    </Card>
                </Col>
                <Col span={8} lg={8} md={24} xs={24}>
                    <Card 
                        title="Incidents"
                        size="small"
                        className="ba b--black-10"
                        style={cardHeightStyle}>
                            <IncidentTable data={incidentCollection} loading={isIncidentFetching} />
                    </Card>
                </Col>
            </Row>
                    
        </Content>      
    </React.Fragment>
)}


export default SafetyPage;