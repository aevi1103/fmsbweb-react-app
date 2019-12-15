import React from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import styled from 'styled-components'

import ScrapByCodeTable from '../../components/production/scrap-by-code-table/scrap-by-code-table.component'
import ProductionByTypeTable from '../../components/production/production-by-type-table/production-by-type-table.component'
import ScrapByDeptTable from '../../components/production/scrap-by-dept-table/scrap-by-dept-tale.component'
import LaborHoursTable from '../../components/production/labor-hours-table/labor-hours-table.component'
import DailyScrapChart from '../../components/production/daily-scrap-rate-chart/daily-scrap-rate.component'
import DailyKpi from '../../components/production/daily-kpi-chart/daily-kpi.component'
import WeeklyPpmhChart from '../../components/production/weekly-ppmh-chart/weekly-ppmh-chart.component'

import { 
    Row,
    Col,
    Card,
    Empty,
    Statistic,
    Collapse
 } from "antd";

 const { Panel } = Collapse;

 const cardHeightStyle = {
    height: "400px"
}

const KpiContainer = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 140px;
    font-size: 2.5rem;
`

const fontRed = {
    color: "#FF4136"
}

const fontGreen = {
    color: "#19A974"
}

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

    let _prodByTypeList = [];
    let _deptScrapList = [];

    let _laborHours = null;

    let _laborHoursDetails = [];

    let _sapOaeColorCode,
        _scrapByCodeColorCode,
        _ppmhColorCode;

    if (productionStatusCollection) {

        const { 
            sbScrapByCode,
            sapOae,
            laborHours,
            purchaseScrapByCode,
            target,
            sapNet,
            departmentScrap,
            sapProductionByType,

            sapOaeColorCode,
            scrapByCodeColorCode,
            ppmhColorCode
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

        _prodByTypeList = sapProductionByType.details;
        _deptScrapList = departmentScrap.details;

        _laborHours = laborHours;

        _laborHoursDetails = laborHours.details;

        _sapOaeColorCode = sapOaeColorCode;
        _scrapByCodeColorCode = scrapByCodeColorCode;
        _ppmhColorCode = ppmhColorCode;
        
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
                                <h1 style={{color: _scrapByCodeColorCode}}>{numeral(_sbScrapRate).format('0.0%')}</h1>
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
                            <h1 style={{color: _sapOaeColorCode}}>{numeral(_oae).format('0%')}</h1>
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
                    loading={isProdStatusFetching}
                >
                {
                    productionStatusCollection 
                    ? (<KpiContainer>
                            <h1 style={{color: _ppmhColorCode}}>{numeral(_ppmh).format('0')}</h1>
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
                    <DailyScrapChart/>
                </Card>
            </Col>

            <Col span={6}>
                <Card 
                    title="Department KPI"
                    bordered={false} size="small"
                    style={cardHeightStyle}
                    className="mb3"
                >
                    <DailyKpi/>
                </Card>
            </Col>

            <Col span={6}>
                <Card 
                    title="Weekly PPMH (Kronos)"
                    bordered={false} size="small"
                    style={cardHeightStyle}
                    className="mb3"
                >
                    <WeeklyPpmhChart/>
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
                    loading={isProdStatusFetching}
                >
                    <Row gutter={16}  className="mb3">
                        <Col span={12}>
                            <Statistic title="SB Scrap Qty" value={_sbScrapQty} valueStyle={fontRed} />
                        </Col>

                        <Col span={12}>
                            <Statistic title="SB Scrap %" value={numeral(_sbScrapRate).format('0.00%')} valueStyle={fontRed} />
                        </Col>

                    </Row>
                    <Row gutter={16} className="mb3">
                        <Col span={12}>
                            <Statistic title="Purchase Scrap Qty" value={_purchasedScrapQty} valueStyle={fontRed} />
                        </Col>

                        <Col span={12}>
                            <Statistic title="Purchase Scrap %" value={numeral(_purchasedScrapRate).format('0.00%')} valueStyle={fontRed} />
                        </Col>
                    </Row>
                    <Collapse bordered={false}>

                        <Panel header="SB Scrap Details" key="1">                     
                            <ScrapByCodeTable 
                                className="mt3"
                                scrapData={_sbScrapList}
                                isLoading={isProdStatusFetching} />
                        </Panel>
                        <Panel header="Purchased Scrap Detail" key="2">
                            <ScrapByCodeTable 
                                className="mt3"
                                scrapData={_purchasedScrapList}
                                isLoading={isProdStatusFetching} />
                        </Panel>

                    </Collapse>

                </Card>
            </Col>

            <Col span={6}>
                <Card 
                    title="Production Details"
                    bordered={false} size="small"
                    className="mb3"
                    loading={isProdStatusFetching}
                >

                    <Row gutter={16} className="mb3">
                        <Col span={8}>
                            <Statistic title="Target" value={_target} valueStyle={fontGreen} />
                        </Col>
                        <Col span={8}>      
                            <Statistic 
                                title="SAP OAE %"
                                valueStyle={fontGreen}
                                value={numeral(_oae).format('0%')} 
                                suffix={<small>({numeral(_sapNet).format('0,0')})</small>}
                                />
                        </Col>
                        <Col span={8}>
                            <Statistic 
                                title="HXH OAE %"
                                valueStyle={fontGreen}
                                value={numeral(0).format('0%')} 
                                suffix={<small>({numeral(0).format('0,0')})</small>}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16} className="mb3">              
                        <Col span={8}>
                            <Statistic 
                                title="Department Scrap %"
                                valueStyle={fontRed}
                                value={numeral(_deptScrapRate).format('0.00%')} 
                                suffix={<small>({numeral(_deptScrap).format('0,0')})</small>}
                            />
                        </Col>
                    </Row>

                    <Collapse bordered={false}>                 
                        <Panel header="SAP Production by Type Details" key="1">
                            <ProductionByTypeTable 
                                prodData={_prodByTypeList}
                                isLoading={isProdStatusFetching}
                                className="mt3" />
                        </Panel>
                        <Panel header="Department Scrap Details" key="2">
                            <ScrapByDeptTable 
                                scrapData={_deptScrapList}
                                isLoading={isProdStatusFetching}
                                className="mt3" />
                        </Panel>
                    </Collapse>

                </Card>
            </Col>

            <Col span={6}>
                <Card 
                    title="Labor Hours Details"
                    bordered={false} size="small"
                    className="mb3"
                    loading={isProdStatusFetching}
                >
                    <Row gutter={16} className="mb3">
                        <Col span={8}>
                            <Statistic title="PPMH" value={numeral(_ppmh).format('0')} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="Regular" 
                                value={numeral((!_laborHours ? 0 : _laborHours.regular)).format('0.00')} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="Overtime" 
                                value={numeral((!_laborHours ? 0 : _laborHours.overtime)).format('0.00')} />
                        </Col>
                    </Row>

                    <Row gutter={16} className="mb3">
                        <Col span={8}>
                            <Statistic title="Double Time" 
                                value={numeral((!_laborHours ? 0 : _laborHours.doubleTime)).format('0.00')} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="Orientation" 
                                value={numeral((!_laborHours ? 0 : _laborHours.orientation)).format('0.00')} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="Overall" 
                                value={numeral((!_laborHours ? 0 : _laborHours.overAll)).format('0.00')} />
                        </Col>
                    </Row>

                    <Collapse bordered={false}>                 
                        <Panel header="Labor Hours Details" key="1">
                            <LaborHoursTable 
                                laborHoursData={_laborHoursDetails}
                                isLoading={isProdStatusFetching}
                                className="mt3" />
                        </Panel>
                    </Collapse>

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