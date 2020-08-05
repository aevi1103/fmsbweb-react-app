import React from 'react';
import { connect } from 'react-redux';
import { 
    Row,
    Col,
    Card
 } from "antd";

import SummaryByLineTable from './summary-by-line-table/summary-by-line-table.component'
import SummaryByProgramTable from './summary-by-program/summary-by-program.component'
import DefectSummaryTable from './defect-summary-table/defect-summary-table.component';

import ProductionDetailsSummary from './production-details-summary/production-details-summary.component'

const ProductionDetails = ({productionDetailsCollection, isProductionDetailsLoading}) => (
    <Row gutter={[12,12]}>

        <Col span={24}>
            <Card 
                title="Department Summary"
                size="small"
                className="ba b--black-10"
                loading={isProductionDetailsLoading}
                >       
                {
                    !productionDetailsCollection 
                        ? "" 
                        : <ProductionDetailsSummary data={productionDetailsCollection} />
                }
            </Card>     
        </Col>

        <Col span={24}>
            <Card 
                title="Summary by Line"
                bordered={false} size="small"
                className="ba b--black-10">       
                    <SummaryByLineTable/>          
            </Card>     
        </Col>
        <Col span={24}>
            <Card 
                title="Summary by Program"
                bordered={false} 
                size="small"
                className="ba b--black-10">
                    <SummaryByProgramTable/>
            </Card>
        </Col>
        <Col span={24}>
            <Card 
                title="SB Scrap Summary"
                bordered={false}
                size="small"
                className="ba b--black-10">
                    <DefectSummaryTable 
                        scrapData={(!productionDetailsCollection 
                                    ? [] 
                                    : productionDetailsCollection.sbScrapDetails )} />
            </Card>
        </Col>
        <Col span={24}>
            <Card 
                title="Purchase Scrap Summary"
                bordered={false}
                size="small"
                className="ba b--black-10">
                    <DefectSummaryTable 
                        scrapData={(!productionDetailsCollection 
                                    ? [] 
                                    : productionDetailsCollection.purchaseScrapDetails )} />
            </Card>
        </Col>
    </Row>
);

const mapStateToProps = ({ productionDetails }) => ({
    isProductionDetailsLoading: productionDetails.isProductionDetailsLoading,
    productionDetailsCollection: productionDetails.productionDetailsCollection,
})

export default connect(mapStateToProps)(ProductionDetails);
