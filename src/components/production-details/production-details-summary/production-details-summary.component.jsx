import React from 'react';
import numeral from 'numeral'
import { 
    Row,
    Col,
    Statistic,
 } from "antd";

import {
    ArrowUpOutlined,
    ArrowDownOutlined
} from '@ant-design/icons';

const formatScrapText = (rate, qty) => `${numeral(rate).format('0.00%')} (${numeral(qty).format('0,0')})`;

const formatScrap = (data, scrap) => {
    let rate = 0, qty = 0;
    if (data) {
        const filteredData = data.sbScrapAreaDetails.find(({scrapAreaName}) => scrapAreaName === scrap);

        if (filteredData) {
            rate = filteredData.scrapRate;
            qty = filteredData.qty;
        }
        
    }

    return formatScrapText(rate, qty)    
}

const formatNetOae = (net, oae) => `${numeral(oae).format('0%')} (${numeral(net).format('0,0')})`;
const getStatusState = (value, target) => (value <= target) ? { color: '#FF4136' } : { color: '#19A974' } 
const getPrefix = (value, target) => (value <= target) ? <ArrowDownOutlined /> : <ArrowUpOutlined />

const ProductionDetailsSummary = ({ data }) => (

    <Row gutter={16}>

        <Col span={3}>
            <Statistic title={`SAP ~ Target: ${numeral(data.oaeTarget).format('0%')}`} value={formatNetOae(data.sapNet, data.sapOae)} 
                valueStyle={getStatusState(data.sapOae, data.oaeTarget)} prefix={getPrefix(data.sapOae, data.oaeTarget)} />
        </Col>

        <Col span={3}>
            <Statistic title="HxH" value={formatNetOae(data.hxHNet, data.hxHOae)} 
                valueStyle={getStatusState(data.hxHOae, data.oaeTarget)} 
                prefix={getPrefix(data.hxHOae, data.oaeTarget)}/>
        </Col>

        <Col span={3}>
            <Statistic title="Total SB Scrap" value={formatScrapText(data.totalSbScrapRate, data.totalSbScrap)} />
        </Col>

        <Col span={3}>
            <Statistic title="Total FS" value={formatScrap(data, 'Foundry')} />
        </Col>

        <Col span={3}>
            <Statistic title="Total MS" value={formatScrap(data, 'Machining')} />
        </Col>

        <Col span={3}>
            <Statistic title="Total Anod" value={formatScrap(data, 'Anodize')} />
        </Col>

        <Col span={3}>
            <Statistic title="Total Skirt Coat" value={formatScrap(data, 'Skirt Coat')} />
        </Col>

        <Col span={3}>
            <Statistic title="Total Assembly" value={formatScrap(data, 'Assembly')} />
        </Col>

    </Row>

)

export default ProductionDetailsSummary;
