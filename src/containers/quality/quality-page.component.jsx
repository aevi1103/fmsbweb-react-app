import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components'
import moment from 'moment'
import numeral from 'numeral'

import DatePicker from '../../components/single-date-range-picker/single-date-range-picker.component'
import CustomerComplaintTable from './components/customer-complaint-table.component'

import { 
    fetchQualityStartAsync
} from '../../core/redux/morning-meeting/morning-meeting.actions'

import { 
    Layout,
    Button,
    PageHeader,
    Row,
    Col,
    Card,
    Empty
 } from "antd";

const { Content } = Layout;
const dateFormat = 'MM/DD/YYYY';

const KpiContainer = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 140px;
    font-size: 2.5rem;
`
const responsiveProps = {
    xs: 24,
    md: 12,
    lg:12,
    xl: 6
}

const QualityPage = () => {
    
    const dispatch = useDispatch();
    const endDate = useSelector(({ morningMeeting: { endDate } }) => endDate);
    const isQualityFetching = useSelector(({ morningMeeting: { isQualityFetching } }) => isQualityFetching);
    const qualityCollection = useSelector(({ morningMeeting: { qualityCollection } }) => qualityCollection);

    const endDatePlusOneDay = moment(endDate, dateFormat).add(1, 'd').format(dateFormat)
    const [ date, setDate ] = useState(endDatePlusOneDay);

    const fetchData = () => dispatch(fetchQualityStartAsync(date));
    const onClick = () => fetchData();
    const onChange = (date, dateStr) => setDate(dateStr);

    useEffect(() => {
        document.title = `Quality`;
        fetchData();
    }, [])

    return (
    <>
        <PageHeader
            className="site-page-header"
            title={`Quality: ${date}`}
        />

        <Content className="ma3 mt0">

            <Row gutter={[12,12]}>

                <Col span={24}>
                
                    <DatePicker onButtonClick={onClick} onChange={onChange} defaultValue={moment(endDatePlusOneDay, dateFormat)} />
                    <Button type="primary" className="ml2">
                        <a href="http://10.129.224.149/FMSB/Quality/Customer/Record.aspx" target="_blank" rel="noopener noreferrer">Enter Data</a>
                    </Button>

                </Col>

                <Col span={24}>

                    <Row gutter={[12,12]}>
                        <Col {...responsiveProps}>
                            <Card 
                                title="PRR / PIR / QR"
                                size="small"
                                className="ba b--black-10"
                                loading={isQualityFetching}
                                >       
                                    {
                                        !qualityCollection 
                                        ? (<Empty/>)
                                        : (<KpiContainer>
                                            <h1>{numeral(qualityCollection.totalCustomerComplaint).format('0,0')}</h1>
                                        </KpiContainer>)
                                    }
                            </Card>     
                        </Col>
                        <Col {...responsiveProps}>
                            <Card 
                                title="YTD Open Status MRR"
                                size="small"
                                className="ba b--black-10"
                                loading={isQualityFetching}
                                >       
                                    {
                                        !qualityCollection 
                                        ? (<Empty/>)
                                        : (<KpiContainer>
                                            <h1>{numeral(qualityCollection.ytdMrr.total).format('0,0')}</h1>
                                        </KpiContainer>)
                                    }
                            </Card>     
                        </Col>
                        <Col {...responsiveProps}>
                            <Card 
                                title="MTD Open Status MRR"
                                size="small"
                                className="ba b--black-10"
                                loading={isQualityFetching}
                                >       
                                    {
                                        !qualityCollection 
                                        ? (<Empty/>)
                                        : (<KpiContainer>
                                            <h1>{numeral(qualityCollection.mtdMrr.total).format('0,0')}</h1>
                                        </KpiContainer>)
                                    }    
                            </Card>     
                        </Col>
                        <Col {...responsiveProps}>
                            <Card 
                                title="Last 24 Hours Open MRR"
                                size="small"
                                className="ba b--black-10"
                                loading={isQualityFetching}
                                >       
                                    {
                                        !qualityCollection 
                                        ? (<Empty/>)
                                        : (<KpiContainer>
                                            <h1>{numeral(qualityCollection.twentyMrr.total).format('0,0')}</h1>
                                        </KpiContainer>)
                                    } 
                        
                            </Card>     
                        </Col>
                        <Col span={24}>
                            <Card 
                                title="Customer Complaint"
                                
                                size="small"
                                className="ba b--black-10"
                                >
                                    <CustomerComplaintTable/>
                            </Card>
                        </Col>
                    </Row>
                            
                </Col>

            </Row>
            
        </Content>      
    </> 
)}


export default QualityPage;