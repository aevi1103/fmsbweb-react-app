import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import moment from 'moment'
import numeral from 'numeral'

import { fetchQualityStartAsync } from '../../core/redux/quality/quality.actions'
import { dateFormat } from '../../core/utilities/helpers'
import { useQuery } from '../../core/utilities/custom-hook'

import CustomerComplaintTable from './components/customer-complaint-table.component'

import { 
    Layout,
    Button,
    PageHeader,
    Row,
    Col,
    Card,
    Tooltip,
    DatePicker
 } from "antd";

const { Content } = Layout;

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

const today = moment().format(dateFormat);

const QualityPage = () => {
    
    const history = useHistory();
    const dispatch = useDispatch();
    const query = useQuery();

    const date = query.get('date') ?? today;

    const isQualityFetching = useSelector(({ quality: { isQualityFetching } }) => isQualityFetching);
    const qualityCollection = useSelector(({ quality: { qualityCollection } }) => qualityCollection);

    const [dateStr, setDateStr] = useState(date);

    const fetchData = () => {
        history.push(`/dashboard/morningmeeting/quality?date=${dateStr}`)
        dispatch(fetchQualityStartAsync(dateStr));
    }

    const onClick = () => fetchData();
    const onDateChange = (date) => setDateStr(date.format(dateFormat))

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
                
                    <DatePicker 
                        className="mr2"
                        onChange={onDateChange}
                        format={dateFormat}
                        defaultValue={moment(dateStr, dateFormat)} />

                    <Tooltip placement="top" title={<span>Click to reload dashboard</span>}>
                        <Button type="primary" onClick={onClick}>Go</Button>
                    </Tooltip>

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
                                    <KpiContainer>
                                        <h1>{numeral(qualityCollection?.totalCustomerComplaint ?? 0).format('0,0')}</h1>
                                    </KpiContainer>
                            </Card>     
                        </Col>

                        <Col {...responsiveProps}>
                            <Card 
                                title="YTD Open Status MRR"
                                size="small"
                                className="ba b--black-10"
                                loading={isQualityFetching}
                                >       
                                    <KpiContainer>
                                        <h1>{numeral(qualityCollection?.ytdMrr?.total ?? 0).format('0,0')}</h1>
                                    </KpiContainer>
                            </Card>     
                        </Col>

                        <Col {...responsiveProps}>
                            <Card 
                                title="MTD Open Status MRR"
                                size="small"
                                className="ba b--black-10"
                                loading={isQualityFetching}
                                >       
                                    <KpiContainer>
                                        <h1>{numeral(qualityCollection?.mtdMrr?.total ?? 0).format('0,0')}</h1>
                                    </KpiContainer>   
                            </Card>     
                        </Col>

                        <Col {...responsiveProps}>
                            <Card 
                                title="Last 24 Hours Open MRR"
                                size="small"
                                className="ba b--black-10"
                                loading={isQualityFetching}
                                >       
                                    <KpiContainer>
                                        <h1>{numeral(qualityCollection?.twentyMrr?.total ?? 0).format('0,0')}</h1>
                                    </KpiContainer>
                            </Card>     
                        </Col>

                        <Col span={24}>
                            <Card 
                                title="Customer Complaint"
                                size="small"
                                className="ba b--black-10"
                                >
                                    <CustomerComplaintTable data={qualityCollection?.customerComplaintList ?? []} loading={isQualityFetching} />
                            </Card>
                        </Col>

                    </Row>
                            
                </Col>

            </Row>
            
        </Content>      
    </> 
)}


export default QualityPage;