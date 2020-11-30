import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment'

import DatePicker from '../../components/single-date-range-picker/single-date-range-picker.component'

import KpiTable from './components/kpi-table.component'
import DeptForecastTable from './components/dept-forecast-table.compoennt'
import FlashProjectionTable from './components/flash-projections-table.component'

import { 
    fetchFiananceKpiStartAsync
} from '../../core/redux/morning-meeting/morning-meeting.actions'

import { 
    Layout,
    Button,
    PageHeader,
    Row,
    Col,
    Card
 } from "antd";

const { Content } = Layout;
const dateFormat = 'MM/DD/YYYY';

const responsiveProps = {
    xs: 24,
    xl: 12
}

const FinancePage = () => {
    
    const dispatch = useDispatch();
    const endDate = useSelector(({ morningMeeting: { endDate } }) => endDate);

    const endDatePlusOneDay = moment(endDate, dateFormat).add(1, 'd').format(dateFormat)
    const [ date, setDate ] = useState(endDatePlusOneDay);

    const fetchData = () => dispatch(fetchFiananceKpiStartAsync(date))
    const onClick = () => fetchData();
    const onChange = (date, dateStr) => setDate(dateStr);

    useEffect(() => {
        document.title = `Finance`;
        fetchData();
    }, [])

    return (
    <>
        <PageHeader
            className="site-page-header"
            title={`Finance: ${date}`}
        />

        <Content className="ma3 mt0">

            <Row gutter={[12,12]}>

                <Col span={24}>

                    <DatePicker onButtonClick={onClick} onChange={onChange}  defaultValue={moment(endDatePlusOneDay, 'MM/DD/YYYY')} />
                    <Button type="primary" className="ml2">
                        <a href="http://10.129.224.149/FMSB/Finance/DataEntry.aspx" target="_blank" rel="noopener noreferrer">Enter Data</a>
                    </Button>
                
                </Col>

                <Col span={24}>

                    <Row gutter={[12,12]}>
                        <Col span={24}>
                            <Card 
                                title="Finance Daily KPI"
                                size="small"
                                className="ba b--black-10"
                                >       
                                    <KpiTable/>              
                            </Card>     
                        </Col>
                        <Col {...responsiveProps}>
                            <Card 
                                title="Department Forecast"
                                size="small"
                                className="ba b--black-10"
                                >
                                <DeptForecastTable/>
                            </Card>
                        </Col>
                        <Col {...responsiveProps}>
                            <Card 
                                title="Flash Projections"
                                size="small"
                                className="ba b--black-10">
                                    <FlashProjectionTable/>
                            </Card>
                        </Col>
                    </Row>
                    
                </Col>

            </Row>

        </Content>      
    </> 
)}

export default FinancePage;