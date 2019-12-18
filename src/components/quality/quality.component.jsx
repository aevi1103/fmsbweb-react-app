import React from 'react';
import styled from 'styled-components'
import { connect } from 'react-redux';
import numeral from 'numeral'

import { 
    Row,
    Col,
    Card,
    Empty
 } from "antd";

 import CustomerComplaintTable from '../../components/quality/customer-complaint-table/customer-complaint-table.component'

 const KpiContainer = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 140px;
    font-size: 2.5rem;
`

const Quality = ({isQualityFetching, qualityCollection}) => (
    <Row gutter={16}>
        <Col span={6}>
            <Card 
                title="PRR / PIR / QR"
                bordered={false} size="small"
                className="mb3"
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
        <Col span={6}>
            <Card 
                title="YTD Open Status MRR"
                bordered={false} size="small"
                className="mb3"
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
        <Col span={6}>
            <Card 
                title="MTD Open Status MRR"
                bordered={false} size="small"
                className="mb3"
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
        <Col span={6}>
            <Card 
                title="Last 24 Hours Open MRR"
                bordered={false} size="small"
                className="mb3"
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
                bordered={false} 
                size="small"
                className="mb3"
                >
                    <CustomerComplaintTable/>
            </Card>
        </Col>
    </Row>
);

const mapStateToProps = ({ morningMeeting }) => ({
    isQualityFetching: morningMeeting.isQualityFetching,
    qualityCollection: morningMeeting.qualityCollection
})

export default connect(mapStateToProps)(Quality);
