import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import numeral from 'numeral';
import styled from 'styled-components';
import moment from 'moment';
import axios from 'axios';

import ScrapByCodeTable from '../../../components/production/scrap-by-code-table/scrap-by-code-table.component';
import ProductionByTypeTable from '../../../components/production/production-by-type-table/production-by-type-table.component';
import ScrapByDeptTable from '../../../components/production/scrap-by-dept-table/scrap-by-dept-tale.component';
import DailyScrapChart from '../../../components/production/daily-scrap-rate-chart/daily-scrap-rate.component';
import DailyKpi from '../../../components/production/daily-kpi-chart/daily-kpi.component';
import WeeklyPpmhChart from '../../../components/production/weekly-ppmh-chart/weekly-ppmh-chart.component';
import DailyProdChart from '../../../components/production/daily-prod-chart/daily-prod-chart.component';
import PpmhPerShiftChart from '../../../components/production/ppmh-per-shift-chart/ppmh-per-shift-chart.component';

import {
    setPpmhChartType,
    fetchPpmhStartAsync,
    fetchWeeklyLaborHrsStartAsync
} from '../../../core/redux/department-dashboard/department-dashboard.actions'

import KpiWrapper from '../../../components/kpi-wrapper/kpi-wrapper.component'

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

const cardHeightStyle = { height: "400px" };
const fontRed = { color: "#FF4136" };
const fontGreen = { color: "#19A974" };
const dateFormat = 'MM/DD/YYYY';

const responsiveProps = {
    xs: 24,
    md: 12,
    lg:12,
    xl: 6
}

const Production = ({
    area,
    startDate,
    endDate
}) => {

    const dispatch = useDispatch();

    //* selectors
    const isProductionDataLoading = useSelector(({ departmentDashboard }) => departmentDashboard.isProductionDataLoading)
    const productionData = useSelector(({ departmentDashboard }) => departmentDashboard?.productionData ) ?? null;
    const isProdScrapLoading = useSelector(({ departmentDashboard }) => departmentDashboard.isProdScrapLoading)
    const prodScrap = useSelector(({ departmentDashboard }) => departmentDashboard?.prodScrap) ?? null
    const ppmhChartType = useSelector(({ departmentDashboard }) => departmentDashboard?.ppmhChartType)

    //* production data
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
    } = productionData ?? {};

    const { scrapRate, total } = sbScrapByCode || {};
    const { ppmh } = laborHours || {};
    const { oaeTarget, scrapRateTarget, ppmhTarget } = targets || {};

    const onPpmhChartTypeChange = (value) => {

        dispatch(setPpmhChartType(value))

        const tokenSrc = axios.CancelToken.source();
        if (value === 'ppmhByShift') {
            dispatch(fetchPpmhStartAsync(startDate, endDate, area, tokenSrc))
        } else {         
            const laborHoursStart = moment(startDate, dateFormat).add(-9, 'w').startOf('week').format(dateFormat);
            dispatch(fetchWeeklyLaborHrsStartAsync(laborHoursStart, endDate, area, tokenSrc)); 
        }
    };

    const getppmhTitle = laborHours => laborHours 
                                        ? `PPMH (${moment(laborHours.startDate).format(dateFormat)} - ${moment(laborHours.endDate).format(dateFormat)})`
                                        : 'PPMH';

    const getLaborHoursProp = (laborHours, propName) => {
        if (!laborHours) return 0;
        return numeral(laborHours[propName]).format('0.00');
    };

    return (

        <>
    
        <Row gutter={[12,12]}>
        
            <Col {...responsiveProps}>

                <Card 
                    title="South Bend Scrap Rate by Code"
                    size="small"
                    className="b--black-10"
                    loading={isProductionDataLoading}
                    extra={
                        <Text type="secondary" className="b">Target: {numeral(scrapRateTarget / 100).format('0.00%')}</Text>
                    }
                >
                     {
                        productionData 
                            ?   <KpiWrapper>
                                    <h1 style={{color: scrapByCodeColorCode}}>
                                        {numeral(scrapRate).format('0.0%')}
                                    </h1>
                                </KpiWrapper>
                            :   <Empty/>
                     }
                    
                </Card>

            </Col>

            <Col {...responsiveProps}>

                <Card 
                    title={ area === 'skirt coat' ? 'HxH OAE %' : 'SAP OAE %' }
                    size="small"
                    className="b--black-10"
                    loading={isProductionDataLoading}
                    extra={
                        <Text type="secondary" className="b">Target: {numeral(oaeTarget / 100).format('0%')}</Text>
                    }
                >

                {
                    productionData 
                    ? (<KpiWrapper>
                            {
                                area !== 'skirt coat' 
                                    ?   <h1 style={{color: sapOaeColorCode}}>
                                            {numeral(sapOae).format('0%')}
                                        </h1>
                                    :   <h1 style={{color: hxhOaeColorCode}}>
                                            {numeral(hxhOae).format('0%')}
                                        </h1>
                            }
                        </KpiWrapper>)
                    : <Empty/>
                 }

                </Card>

            </Col>

            <Col {...responsiveProps}>

                <Card 
                    title={getppmhTitle(laborHours)}
                    size="small"
                    className="b--black-10"
                    loading={isProductionDataLoading}
                    extra={
                        <Text type="secondary" className="b">Target: {numeral(ppmhTarget).format('0')}</Text>
                    }
                >
                {
                    productionData 
                    ? (<KpiWrapper>
                            <h1 style={{color: ppmhColorCode}} className="b">{numeral(ppmh).format('0')}</h1>
                        </KpiWrapper>)
                    : <Empty/>
                 }

                </Card>

            </Col>

            <Col {...responsiveProps}>

                <Card 
                    title={`MTD Production (${moment(prodScrap?.startDate ?? '').format(dateFormat)} - ${moment(prodScrap?.endDate ?? '').format(dateFormat)})`}
                    size="small"
                    className="b--black-10"
                    loading={isProdScrapLoading}
                >

                {
                    prodScrap 
                    ? (<KpiWrapper>
                            <h1 style={{color: "#19a974"}}>{numeral(prodScrap?.sapProd ?? 0).format('0,0')}</h1>
                        </KpiWrapper>)
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
                    loading={isProductionDataLoading}
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
                            <Statistic title="Purchase Scrap Qty" value={purchaseScrapByCode?.total ?? 0} />
                        </Col>

                        <Col span={12}>
                            <Statistic title="Purchase Scrap %" value={numeral(purchaseScrapByCode?.scrapRate ?? 0).format('0.00%')} />
                        </Col>
                    </Row>
                    <Collapse>

                        <Panel header="SB Scrap Details" key="1">                     
                            <ScrapByCodeTable 
                                className="mt3"
                                scrapData={sbScrapByCode?.details ?? []}
                                isLoading={isProductionDataLoading} />
                        </Panel>
                        <Panel header="Purchased Scrap Detail" key="2">
                            <ScrapByCodeTable 
                                className="mt3"
                                scrapData={purchaseScrapByCode?.details ?? []}
                                isLoading={isProductionDataLoading} />
                        </Panel>

                    </Collapse>

                </Card>
            </Col>

            <Col {...responsiveProps}>
                <Card 
                    title="Production Details" 
                    size="small"
                    className="b--black-10"
                    loading={isProductionDataLoading}
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
                                value={numeral(departmentScrap?.scrapRate ?? 0).format('0.00%')} 
                                suffix={<small>({numeral(departmentScrap?.total ?? 0).format('0,0')})</small>}
                            />
                        </Col>
                    </Row>

                    <Collapse>                 
                        <Panel header="SAP Production by Type Details" key="1">
                            <ProductionByTypeTable 
                                prodData={sapProductionByType?.details ?? []}
                                isLoading={isProductionDataLoading}
                                className="mt3" />
                        </Panel>
                        <Panel header="Department Scrap Details" key="2">
                            <ScrapByDeptTable 
                                scrapData={departmentScrap?.details ?? []}
                                isLoading={isProductionDataLoading}
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
                    loading={isProductionDataLoading}
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
                    loading={isProdScrapLoading}
                >

                    {
                        prodScrap ?
                        (<>
                            <Row gutter={16} className="b--black-10">
                                <Col span={8}>
                                    <Statistic title="Production" value={numeral(prodScrap?.sapProd ?? 0).format('0,0')} valueStyle={fontGreen} />
                                </Col>
                                <Col span={8}>
                                    <Statistic title="SB Scrap" value={numeral(prodScrap?.sbScrap ?? 0).format('0,0')} />
                                </Col>
                                <Col span={8}>
                                    <Statistic title="Purchased Scrap %" value={numeral(prodScrap?.purchasedScrap ?? 0).format('0,0')} />
                                </Col>
                            </Row>

                            <Row gutter={16} className="b--black-10">
                                <Col span={8}>
                                    <Statistic title="SAP OAE %" value={numeral(prodScrap?.sapOae ?? 0).format('0.0%')} />
                                </Col>
                                <Col span={8}>
                                    <Statistic title="SB Scrap %" value={numeral(prodScrap?.sbScrapRate ?? 0).format('0.00%')} />
                                </Col>
                                <Col span={8}>
                                    <Statistic title="Purchased Scrap %" value={numeral(prodScrap?.purchaseScrapRate ?? 0).format('0.00%')} />
                                </Col>
                            </Row>
                        </>)
                        : <Empty/>
                    }

                    <Collapse>

                        <Panel header="SB Scrap Details" key="1">                     
                            <ScrapByCodeTable 
                                className="mt3"
                                scrapData={prodScrap?.sbScrapDetail ?? []}
                                isLoading={isProdScrapLoading} />
                        </Panel>
                        <Panel header="Purchased Scrap Detail" key="2">
                            <ScrapByCodeTable 
                                className="mt3"
                                scrapData={prodScrap?.purchaseScrapDetail ?? []}
                                isLoading={isProdScrapLoading} />
                        </Panel>

                    </Collapse>

                </Card>
            </Col>

        </Row>
        
        </>

    )

 }


 export default Production;