import React from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import styled from 'styled-components'

import ScrapByCodeTable from '../../components/production/scrap-by-code-table/scrap-by-code-table.component'

import { 
    Row,
    Col,
    Card,
    Empty,
    Statistic,
    Button
 } from "antd";

 const cardHeightStyle = {
    height: "400px"
}

const cardKpiStyles = {
    height: "200px"
}

const KpiContainer = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 140px;
    font-size: 2.5rem;
`

 const Production = ({productionStatusCollection, isProdStatusFetching}) => {

    let _sbScrapQty = 0;
    let _sbScrapRate = 0;
    let _deptScrap = 0;
    let _deptScrapRate = 0;

    let _purchasedScrapQty = 0;
    let _purchasedScrapRate = 0;

    let _oae = 0;
    let _ppmh = 0;

    let _sbScrapList = [];
    let _purchasedScrapList = [];

    let _target = 0;
    let _sapNet = 0;

    if (productionStatusCollection) {

        const { 
            sbScrapByCode,
            sapOae,
            laborHours,
            purchaseScrapByCode,
            target,
            sapNet,
            departmentScrap
        } = productionStatusCollection;

        const { scrapRate, total } = sbScrapByCode;
        const { ppmh } = laborHours;

        _sbScrapRate = scrapRate;
        _sbScrapQty = total;

        _target = target;
        _sapNet = sapNet
        _oae = sapOae;
        _ppmh = ppmh;

        _purchasedScrapQty = purchaseScrapByCode.total;
        _purchasedScrapRate = purchaseScrapByCode.scrapRate;

        _sbScrapList = sbScrapByCode.details;
        _purchasedScrapList = purchaseScrapByCode.details;

        _deptScrap = departmentScrap.total;
        _deptScrapRate = departmentScrap.scrapRate;
        
    }

    

    return (

        <>
    
        <Row gutter={16}>
        
            <Col span={6}>

                <Card 
                    title="South Bend Scrap Rate by Code"
                    bordered={false} size="small"
                    className="mb3"
                    loading={isProdStatusFetching}
                >
                     {
                        productionStatusCollection 
                        ? (<KpiContainer>
                                <h1>{numeral(_sbScrapRate).format('0.0%')}</h1>
                            </KpiContainer>)
                        : <Empty/>
                     }
                    
                </Card>
            </Col>

            <Col span={6}>
                <Card 
                    title="OAE %"
                    bordered={false} size="small"
                    className="mb3"
                    loading={isProdStatusFetching}
                >

                {
                    productionStatusCollection 
                    ? (<KpiContainer>
                            <h1>{numeral(_oae).format('0.0%')}</h1>
                        </KpiContainer>)
                    : <Empty/>
                 }

                </Card>
            </Col>

            <Col span={6}>
                <Card 
                    title="PPMH"
                    bordered={false} size="small"
                    className="mb3"
                >


                {
                    productionStatusCollection 
                    ? (<KpiContainer>
                            <h1>{numeral(_ppmh).format('0')}</h1>
                        </KpiContainer>)
                    : <Empty/>
                 }

                </Card>
            </Col>

            <Col span={6}>
                <Card 
                    title="MTD Production"
                    bordered={false} size="small"
                    className="mb3"
                >

                {
                productionStatusCollection 
                    ? (<KpiContainer>
                            <h1>0</h1>
                        </KpiContainer>)
                    : <Empty/>
                }

                </Card>
            </Col>

        </Row>

        <Row gutter={16}>
        
            <Col span={6}>
                <Card 
                    title="South Bend Scrap by Code Trend"
                    bordered={false} size="small"
                    style={cardHeightStyle}
                    className="mb3"
                >
                </Card>
            </Col>

            <Col span={6}>
                <Card 
                    title="Department KPI"
                    bordered={false} size="small"
                    style={cardHeightStyle}
                    className="mb3"
                >
                </Card>
            </Col>

            <Col span={6}>
                <Card 
                    title="Weekly PPMH (Kronos)"
                    bordered={false} size="small"
                    style={cardHeightStyle}
                    className="mb3"
                >
                </Card>
            </Col>

            <Col span={6}>
                <Card 
                    title="MTD SAP Production"
                    bordered={false} size="small"
                    style={cardHeightStyle}
                    className="mb3"
                >
                </Card>
            </Col>

        </Row>

        <Row gutter={16}>
        
            <Col span={6}>
                <Card 
                    title="Scrap Details"
                    bordered={false} size="small"
                    className="mb3"
                >

                    <Row gutter={16}  className="mb3">
                        <Col span={12}>
                            <Statistic title="SB Scrap Qty" value={_sbScrapQty} />
                        </Col>

                        <Col span={12}>
                            <Statistic title="SB Scrap %" value={numeral(_sbScrapRate).format('0.00%')} />
                        </Col>

                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Statistic title="Purchase Scrap Qty" value={_purchasedScrapQty} />
                        </Col>

                        <Col span={12}>
                            <Statistic title="Purchase Scrap %" value={numeral(_purchasedScrapRate).format('0.00%')} />
                        </Col>
                    </Row>

                    <ScrapByCodeTable 
                        className="mt3"
                        scrapData={_sbScrapList}
                        isLoading={isProdStatusFetching}
                        tableTitle="SB Scrap Detail" />

                    <ScrapByCodeTable 
                        className="mt3"
                        scrapData={_purchasedScrapList}
                        isLoading={isProdStatusFetching}
                        tableTitle="Purchased Scrap Detail" />

                </Card>
            </Col>

            <Col span={6}>
                <Card 
                    title="Production Details"
                    bordered={false} size="small"
                    className="mb3"
                >

                    <Row gutter={16} className="mb3">
                        <Col span={8}>
                            <Statistic title="Target" value={_target} />
                        </Col>

                        <Col span={8}>      
                            <Statistic 
                                title="SAP OAE %"
                                value={numeral(_oae).format('0.0%')} 
                                suffix={<small>({numeral(_sapNet).format('0,0')})</small>}
                                />
                        </Col>

                        <Col span={8}>
                            <Statistic 
                                title="HXH OAE %"
                                value={numeral(0).format('0.0%')} 
                                suffix={<small>({numeral(0).format('0,0')})</small>}
                            />
                        </Col>

                    </Row>

                    <Row>
                    
                        <Col span={8}>
                            <Statistic 
                                title="Department Scrap %"
                                value={numeral(_deptScrapRate).format('0.0%')} 
                                suffix={<small>({numeral(_deptScrap).format('0,0')})</small>}
                            />
                        </Col>

                    </Row>

                </Card>
            </Col>

            <Col span={6}>
                <Card 
                    title="Labor Hours Details"
                    bordered={false} size="small"
                    style={cardHeightStyle}
                    className="mb3"
                >
                </Card>
            </Col>

            <Col span={6}>
                <Card 
                    title="MTD Scrap Details"
                    bordered={false} size="small"
                    style={cardHeightStyle}
                    className="mb3"
                >
                </Card>
            </Col>

        

        </Row>


        </>

    )

 }

 const mapStateToProps = ({morningMeeting}) => ({
    productionStatusCollection: morningMeeting.productionStatusCollection,
    isProdStatusFetching: morningMeeting.isProdStatusFetching
 })

 export default connect(mapStateToProps)(Production);