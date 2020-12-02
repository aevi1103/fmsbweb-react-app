import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
    Row,
    Col,
    Card
 } from "antd";

import DefectSummaryTable from '../../../components/defect-summary-table/defect-summary-table.component';

import SummaryByLineTable from './summary-by-line-table.component'
import SummaryByProgramTable from './summary-by-program.component'
import ProductionDetailsSummary from './production-details-summary.component'

const tabListNoTitle = [
    {
        tab: 'Summary By Line',
        key: 'line',
    },
    {
        tab: 'Summary by Program',
        key: 'program',
    },
    {
        tab: 'SB Scrap Summary',
        key: 'sb',
    },
    {
        tab: 'Purchase Scrap Summary',
        key: 'purchase',
    }
];

const ProductionDetails = () => {
    
    const loading = useSelector(({ productionDetails }) => productionDetails.isProductionDetailsLoading);
    const productionDetails = useSelector(({ productionDetails }) => productionDetails?.productionDetails) ?? null;
    const sbScrapDetails = productionDetails?.sbScrapDetails ?? [];
    const purchaseScrapDetails = productionDetails?.purchaseScrapDetails ?? [];

    const [tabKey, setTabKey] = useState('line')
    
    const contentListNoTitle = {
        line: <SummaryByLineTable data={productionDetails} loading={loading}/>     ,
        program: <SummaryByProgramTable data={productionDetails} loading={loading} />,
        sb: <DefectSummaryTable scrapData={sbScrapDetails} />,
        purchase: <DefectSummaryTable scrapData={purchaseScrapDetails} />
    };

    return (
        <Row gutter={[12,12]}>

            <Col span={24}>
                <Card 
                    title="Department Summary"
                    size="small"
                    className="ba b--black-10"
                    loading={loading}
                    >       
                        <ProductionDetailsSummary data={productionDetails} />
                </Card>     
            </Col>

            <Col span={24}>

                <Card
                    size="small"
                    tabList={tabListNoTitle}
                    tabProps={{
                        size: 'small'
                    }}
                    activeTabKey={tabKey}
                    onTabChange={key => setTabKey(key)}
                    >
                        { contentListNoTitle[tabKey] }
                </Card>
  
            </Col>

        </Row>)
};



export default ProductionDetails;
