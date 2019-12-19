import React from 'react';

import { 
    Row,
    Col,
    Card
 } from "antd";

const ProductionDetails = () => (
    <Row gutter={16}>
        <Col span={24}>
            <Card 
                title="Summary by Line"
                bordered={false} size="small"
                className="mb3"
                >                 
            </Card>     
        </Col>
        <Col span={24}>
            <Card 
                title="Summary by Program"
                bordered={false} 
                size="small"
                className="mb3"
                >
            </Card>
        </Col>
        <Col span={24}>
            <Card 
                title="SB Scrap Summary"
                bordered={false}
                size="small"
                className="mb3">
            </Card>
        </Col>
        <Col span={24}>
            <Card 
                title="Purchase Scrap Summary"
                bordered={false}
                size="small"
                className="mb3">
            </Card>
        </Col>
    </Row>
);

export default ProductionDetails;