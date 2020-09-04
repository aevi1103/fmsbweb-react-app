import React from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import styled from 'styled-components';
import moment from 'moment';
import axios from 'axios';

import ScrapByCodeTable from '../../components/production/scrap-by-code-table/scrap-by-code-table.component';
import ProductionByTypeTable from '../../components/production/production-by-type-table/production-by-type-table.component';
import ScrapByDeptTable from '../../components/production/scrap-by-dept-table/scrap-by-dept-tale.component';
import DailyScrapChart from '../../components/production/daily-scrap-rate-chart/daily-scrap-rate.component';
import DailyKpi from '../../components/production/daily-kpi-chart/daily-kpi.component';
import WeeklyPpmhChart from '../../components/production/weekly-ppmh-chart/weekly-ppmh-chart.component';
import DailyProdChart from '../../components/production/daily-prod-chart/daily-prod-chart.component';
import PpmhPerShiftChart from '../production/ppmh-per-shift-chart/ppmh-per-shift-chart.component';

import {
    setPpmhChartType,
    fetchPpmhPerShiftStartAsync,
    fetchWeeklyLaborHrsStartAsync
} from '../../redux/morning-meeting/morning-meeting.actions';

import { 
    Row,
    Col,
    Card,
    Empty,
    Statistic,
    Collapse,
    Select,
    Tooltip,
    Typography 
 } from "antd";

 const { Text } = Typography;
 const { Panel } = Collapse;
 const { Option } = Select;

 const cardHeightStyle = {
    height: "400px"
};

const KpiContainer = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 140px;
    font-size: 2.5rem;
`;

const fontRed = {
    color: "#FF4136"
};

const fontGreen = {
    color: "#19A974"
};

 const Production = ({
    productionStatusCollection,
    isProdStatusFetching, 
    prodScrapCollection,
    isProdScrapFetching,

    setPpmhChartType,
    ppmhChartType,

    area,
    startDate,
    endDate,

    fetchWeeklyLaborHrsStartAsync,
    fetchPpmhPerShiftStartAsync
}) => {

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
        hxhOaeColorCode,
        scrapByCodeColorCode,
        ppmhColorCode,

        hxHNet,
        hxhOae,

        targets
    } = productionStatusCollection || {};

    const { scrapRate, total } = sbScrapByCode || {};
    const { ppmh } = laborHours || {};
    const { oaeTarget, scrapRateTarget, ppmhTarget } = targets || {};

    //prod status
    const sbScrapList = sbScrapByCode ? sbScrapByCode.details : [];

    const deptScrap = departmentScrap ? departmentScrap.total : 0;
    const deptScrapRate = departmentScrap ? departmentScrap.scrapRate : 0;
    const deptScrapList = departmentScrap ? departmentScrap.details : [];

    const purchasedScrapQty = purchaseScrapByCode ? purchaseScrapByCode.total : 0;
    const purchasedScrapRate = purchaseScrapByCode ? purchaseScrapByCode.scrapRate : 0;
    const purchasedScrapList = purchaseScrapByCode ? purchaseScrapByCode.details : [];
    const prodByTypeList = sapProductionByType ? sapProductionByType.details : [];

    //MTD
    const mtdStart = prodScrapCollection ? prodScrapCollection.startDate : '';
    const mtdEnd = prodScrapCollection ? prodScrapCollection.endDate : '';

    const mtdProd = prodScrapCollection ? prodScrapCollection.sapProd : 0;
    const mtdScrap = prodScrapCollection ? prodScrapCollection.sbScrap : 0;
    const mtdPurchaseScrap = prodScrapCollection ? prodScrapCollection.purchasedScrap : 0;
    const mtdSapOae = prodScrapCollection ? prodScrapCollection.sapOae : 0;
    const mtdSbScrapRate = prodScrapCollection ? prodScrapCollection.sbScrapRate : 0;
    const mtdPurchaseScrapRate = prodScrapCollection ? prodScrapCollection.purchaseScrapRate : 0;
    const mtdSbScrapDetail = prodScrapCollection ? prodScrapCollection.sbScrapDetail : [];
    const mtdPurchaseScrapDetail = prodScrapCollection ? prodScrapCollection.purchaseScrapDetail : [];

    //format
    const dateFormat = 'MM/DD/YYYY';

    const onPpmhChartTypeChange = (value) => {
        setPpmhChartType(value);
        const tokenSrc = axios.CancelToken.source();
        if (value === 'ppmhByShift') {
            fetchPpmhPerShiftStartAsync(startDate, endDate, area, tokenSrc);
        } else {         
            const laborHoursStart = moment(startDate, dateFormat).add(-9, 'w').startOf('week').format(dateFormat);
            fetchWeeklyLaborHrsStartAsync(laborHoursStart, endDate, area, tokenSrc);
        }
    };

    const getppmhTitle = laborHours => laborHours 
                                        ? `PPMH (${moment(laborHours.startDate).format(dateFormat)} - ${moment(laborHours.endDate).format(dateFormat)})`
                                        : 'PPMH';

    const getLaborHoursProp = (laborHours, propName) => {
        if (!laborHours) return 0;
        return numeral(laborHours[propName]).format('0.00');
    };

    const responsiveProps = {
        xs: 24,
        md: 12,
        lg:12,
        xl: 6
    }

    return (

        <>
    
        <Row gutter={[12,12]}>
        
            <Col {...responsiveProps}>
                <Card 
                    title="South Bend Scrap Rate by Code"
                    size="small"
                    className="b--black-10"
                    loading={isProdStatusFetching}
                    extra={
                        <Text type="secondary" className="b">Target: {numeral(scrapRateTarget / 100).format('0.00%')}</Text>
                    }
                >
                     {
                        productionStatusCollection 
                        ? (<KpiContainer>
                                <h1 style={{color: scrapByCodeColorCode}}>
                                    {numeral(scrapRate).format('0.0%')}
                                </h1>
                            </KpiContainer>)
                        : <Empty/>
                     }
                    
                </Card>
            </Col>

            <Col {...responsiveProps}>
                <Card 
                    title="OAE %"
                    size="small"
                    className="b--black-10"
                    loading={isProdStatusFetching}
                    extra={
                        <Text type="secondary" className="b">Target: {numeral(oaeTarget / 100).format('0%')}</Text>
                    }
                >

                {
                    productionStatusCollection 
                    ? (<KpiContainer>
                            <h1 style={{color: sapOaeColorCode}}>
                                {numeral(sapOae).format('0%')}
                            </h1>
                        </KpiContainer>)
                    : <Empty/>
                 }

                </Card>
            </Col>

            <Col {...responsiveProps}>
                <Card 
                    title={getppmhTitle(laborHours)}
                    size="small"
                    className="b--black-10"
                    loading={isProdStatusFetching}
                    extra={
                        <Text type="secondary" className="b">Target: {numeral(ppmhTarget).format('0')}</Text>
                    }
                >
                {
                    productionStatusCollection 
                    ? (<KpiContainer>
                            <h1 style={{color: ppmhColorCode}} className="b">{numeral(ppmh).format('0')}</h1>
                        </KpiContainer>)
                    : <Empty/>
                 }

                </Card>
            </Col>

            <Col {...responsiveProps}>
                <Card 
                    title={`MTD Production (${moment(mtdStart).format(dateFormat)} - ${moment(mtdEnd).format(dateFormat)})`}
                    size="small"
                    className="b--black-10"
                    loading={isProdScrapFetching}
                >

                {
                    prodScrapCollection 
                    ? (<KpiContainer>
                        <h1 style={{color: "#19a974"}}>{numeral(mtdProd).format('0,0')}</h1>
                        </KpiContainer>)
                    : <Empty/>
                }

                </Card>
            </Col>

        </Row>

        <Row gutter={[12,12]}>
        
            <Col {...responsiveProps}>
                <Card 
                    title="South Bend Scrap by Code Trend"
                    size="small"
                    style={cardHeightStyle}
                    className="b--black-10"
                >
                    <DailyScrapChart/>
                </Card>
            </Col>

            <Col {...responsiveProps}>
                <Card 
                    title="Department KPI"
                    size="small"
                    style={cardHeightStyle}
                    className="b--black-10"
                >
                    <DailyKpi/>
                </Card>
            </Col>

            <Col {...responsiveProps}>
                <Card 
                    title={ppmhChartType === 'ppmhByShift' ? `PPMH by Shift (${startDate} - ${endDate})` : 'Weekly PPMH (Kronos)'}
                    size="small"
                    style={cardHeightStyle}
                    className="b--black-10"
                    extra={
                        <Tooltip title="Select PPMH Chart type">
                            <Select defaultValue={ppmhChartType} style={{ width: 135 }} bordered={false} size="small" onChange={onPpmhChartTypeChange}>
                                <Option value="ppmhByShift">PPMH by Shift</Option>
                                <Option value="weeklyPpmh">Weekly PPMH</Option>
                            </Select>
                        </Tooltip>                      
                    }
                >
                    {
                        ppmhChartType === 'ppmhByShift' 
                            ? <PpmhPerShiftChart/>
                            : <WeeklyPpmhChart/>
                    }
                </Card>
            </Col>

            <Col {...responsiveProps}>
                <Card 
                    title={`MTD Daily SAP Production`}
                    size="small"
                    style={cardHeightStyle}
                    className="b--black-10"
                >
                    <DailyProdChart/>
                </Card>
            </Col>

        </Row>

        <Row gutter={[12,12]}>

            <Col {...responsiveProps}>
                <Card 
                    title="Scrap Details"
                    size="small"
                    className="b--black-10"
                    loading={isProdStatusFetching}
                >
                    <Row gutter={16}  className="b--black-10">
                        <Col span={12}>
                            <Statistic title="SB Scrap Qty" value={total} valueStyle={{color: scrapByCodeColorCode}} />
                        </Col>

                        <Col span={12}>
                            <Statistic title="SB Scrap %" value={numeral(scrapRate).format('0.00%')} valueStyle={{color: scrapByCodeColorCode}} />
                        </Col>

                    </Row>
                    <Row gutter={16} className="b--black-10">
                        <Col span={12}>
                            <Statistic title="Purchase Scrap Qty" value={purchasedScrapQty} />
                        </Col>

                        <Col span={12}>
                            <Statistic title="Purchase Scrap %" value={numeral(purchasedScrapRate).format('0.00%')} />
                        </Col>
                    </Row>
                    <Collapse>

                        <Panel header="SB Scrap Details" key="1">                     
                            <ScrapByCodeTable 
                                className="mt3"
                                scrapData={sbScrapList}
                                isLoading={isProdStatusFetching} />
                        </Panel>
                        <Panel header="Purchased Scrap Detail" key="2">
                            <ScrapByCodeTable 
                                className="mt3"
                                scrapData={purchasedScrapList}
                                isLoading={isProdStatusFetching} />
                        </Panel>

                    </Collapse>

                </Card>
            </Col>

            <Col {...responsiveProps}>
                <Card 
                    title="Production Details" 
                    size="small"
                    className="b--black-10"
                    loading={isProdStatusFetching}
                >

                    <Row gutter={16} className="b--black-10">
                        <Col span={8}>
                            <Statistic title="Target" value={target} valueStyle={fontGreen} />
                        </Col>
                        <Col span={8}>      
                            <Statistic 
                                title="SAP OAE %"
                                valueStyle={{color: sapOaeColorCode}}
                                value={numeral(sapOae).format('0%')} 
                                suffix={<small>({numeral(sapNet).format('0,0')})</small>}
                                />
                        </Col>
                        <Col span={8}>
                            <Statistic 
                                title={`${area === 'machine line' ? 'EOS' : 'HxH'} OAE %`}
                                valueStyle={{color: hxhOaeColorCode}}
                                value={numeral(hxhOae).format('0%')} 
                                suffix={<small>({numeral(hxHNet).format('0,0')})</small>}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16} className="b--black-10">              
                        <Col span={8}>
                            <Statistic 
                                title="Department Scrap %"
                                valueStyle={fontRed}
                                value={numeral(deptScrapRate).format('0.00%')} 
                                suffix={<small>({numeral(deptScrap).format('0,0')})</small>}
                            />
                        </Col>
                    </Row>

                    <Collapse>                 
                        <Panel header="SAP Production by Type Details" key="1">
                            <ProductionByTypeTable 
                                prodData={prodByTypeList}
                                isLoading={isProdStatusFetching}
                                className="mt3" />
                        </Panel>
                        <Panel header="Department Scrap Details" key="2">
                            <ScrapByDeptTable 
                                scrapData={deptScrapList}
                                isLoading={isProdStatusFetching}
                                className="mt3" />
                        </Panel>
                    </Collapse>

                </Card>
            </Col>

            <Col {...responsiveProps}>
                <Card 
                    title={getppmhTitle(laborHours)}
                    size="small"
                    className="b--black-10"
                    loading={isProdStatusFetching}
                >
                    <Row gutter={16} className="b--black-10">
                        <Col span={8}>
                            <Statistic title="PPMH" value={numeral(ppmh).format('0')} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="Regular" 
                                value={getLaborHoursProp(laborHours, 'regular')} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="Overtime" 
                                value={getLaborHoursProp(laborHours, 'overtime')} />
                        </Col>
                    </Row>

                    <Row gutter={16} className="b--black-10">
                        <Col span={8}>
                            <Statistic title="Double Time" 
                                value={getLaborHoursProp(laborHours, 'doubleTime')} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="Orientation" 
                                value={getLaborHoursProp(laborHours, 'orientation')} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="Overall" 
                                value={getLaborHoursProp(laborHours, 'overAll')} />
                        </Col>
                    </Row>

                </Card>
            </Col>

            <Col {...responsiveProps}>
                <Card 
                    title="MTD Details"
                    size="small"
                    className="b--black-10"
                    loading={isProdScrapFetching}
                >

                    {
                        prodScrapCollection ?
                        (<>
                            <Row gutter={16} className="b--black-10">
                                <Col span={8}>
                                    <Statistic title="Production" value={numeral(mtdProd).format('0,0')} valueStyle={fontGreen} />
                                </Col>
                                <Col span={8}>
                                    <Statistic title="SB Scrap" value={numeral(mtdScrap).format('0,0')} />
                                </Col>
                                <Col span={8}>
                                    <Statistic title="Purchased Scrap %" value={numeral(mtdPurchaseScrap).format('0,0')} />
                                </Col>
                            </Row>

                            <Row gutter={16} className="b--black-10">
                                <Col span={8}>
                                    <Statistic title="SAP OAE %" value={numeral(mtdSapOae).format('0.0%')} />
                                </Col>
                                <Col span={8}>
                                    <Statistic title="SB Scrap %" value={numeral(mtdSbScrapRate).format('0.00%')} />
                                </Col>
                                <Col span={8}>
                                    <Statistic title="Purchased Scrap %" value={numeral(mtdPurchaseScrapRate).format('0.00%')} />
                                </Col>
                            </Row>
                        </>)
                        : <Empty/>
                    }

                    <Collapse>

                        <Panel header="SB Scrap Details" key="1">                     
                            <ScrapByCodeTable 
                                className="mt3"
                                scrapData={mtdSbScrapDetail}
                                isLoading={isProdScrapFetching} />
                        </Panel>
                        <Panel header="Purchased Scrap Detail" key="2">
                            <ScrapByCodeTable 
                                className="mt3"
                                scrapData={mtdPurchaseScrapDetail}
                                isLoading={isProdScrapFetching} />
                        </Panel>

                    </Collapse>

                </Card>
            </Col>

        </Row>
        
        </>

    )

 }

 const mapStateToProps = ({morningMeeting, productionDetails}) => ({
    productionStatusCollection: morningMeeting.productionStatusCollection,
    isProdStatusFetching: morningMeeting.isProdStatusFetching,
    prodScrapCollection: morningMeeting.prodScrapCollection,
    isProdScrapFetching: morningMeeting.isProdScrapFetching,
    ppmhChartType: morningMeeting.ppmhChartType,
    startDate: morningMeeting.startDate,
    endDate: morningMeeting.endDate,
 });

 const mapDispatchTooProps = dispatch => ({
    setPpmhChartType: (chartType) => dispatch(setPpmhChartType(chartType)),
    fetchWeeklyLaborHrsStartAsync: (start, end, area, cancelToken) => dispatch(fetchWeeklyLaborHrsStartAsync(start, end, area, cancelToken)),
    fetchPpmhPerShiftStartAsync: (start, end, area, cancelToken) => dispatch(fetchPpmhPerShiftStartAsync(start, end, area, cancelToken)),
 })

 export default connect(mapStateToProps, mapDispatchTooProps)(Production);