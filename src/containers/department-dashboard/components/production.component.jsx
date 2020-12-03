import React from 'react';
import { useSelector } from 'react-redux';

import SbScrapRateKpi from './sb-scrap-rate-kpi.component'
import OaeKpi from './oae-kpi.component'
import PpmhKpi from './ppmh-kpi.component'
import MtdProdKpi from './mtd-prod-kpi.component'

import DailyScrapRate from './daily-scrap-rate.component'
import DailyKpi from './daily-kpi.component'
import PpmhWrapper from './ppmh-wrapper.component'
import MtdProd from './mtd-prod.component'

import ScrapDetails from './scrap-details.component'
import ProductionDetasils from './production-details.component'
import PpmhDetails from './ppmh-details.component'
import MtdDetails from './mtd-details.component'

import { 
    Row
 } from "antd";

const cardHeightStyle = { height: "400px" };
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

    //* loading selectors
    const isProductionDataLoading = useSelector(({ departmentDashboard }) => departmentDashboard.isProductionDataLoading)
    const isDailyScrapRateLoading = useSelector(({ departmentDashboard }) => departmentDashboard.isDailyScrapRateLoading)
    const isDailyKpiLoading = useSelector(({ departmentDashboard }) => departmentDashboard.isDailyKpiLoading)
    const isPpmhLoading = useSelector(({ departmentDashboard }) => departmentDashboard.isPpmhLoading)
    const isWeeklyLaborHrsLoading = useSelector(({ departmentDashboard }) => departmentDashboard.isWeeklyLaborHrsLoading)
    const isProdScrapLoading = useSelector(({ departmentDashboard }) => departmentDashboard.isProdScrapLoading)

    //* state selectors
    const productionData = useSelector(({ departmentDashboard }) => departmentDashboard?.productionData ) ?? null;
    const prodScrap = useSelector(({ departmentDashboard }) => departmentDashboard?.prodScrap) ?? null
    const ppmhChartType = useSelector(({ departmentDashboard }) => departmentDashboard?.ppmhChartType)

    return (

        <>
            <Row gutter={[12,12]}>
            
                <SbScrapRateKpi 
                    responsiveProps={responsiveProps} 
                    loading={isProductionDataLoading}
                    data={productionData} />

                <OaeKpi 
                    area={area} 
                    responsiveProps={responsiveProps} 
                    loading={isProductionDataLoading}
                    data={productionData} />

                <PpmhKpi 
                    responsiveProps={responsiveProps}
                    loading={isProductionDataLoading}
                    data={productionData} />

                <MtdProdKpi 
                    responsiveProps={responsiveProps} 
                    loading={isProdScrapLoading}
                    data={prodScrap} />

            </Row>

            <Row gutter={[12,12]}>
            
                <DailyScrapRate 
                    responsiveProps={responsiveProps} 
                    cardHeightStyle={cardHeightStyle} 
                    loading={isDailyScrapRateLoading} />

                <DailyKpi 
                    responsiveProps={responsiveProps} 
                    cardHeightStyle={cardHeightStyle} 
                    loading={isDailyKpiLoading}
                />

                <PpmhWrapper
                    responsiveProps={responsiveProps} 
                    cardHeightStyle={cardHeightStyle} 
                    loading={isPpmhLoading || isWeeklyLaborHrsLoading}
                    area={area} 
                    startDate={startDate} 
                    endDate={endDate}
                    ppmhChartType={ppmhChartType} />

                <MtdProd 
                    responsiveProps={responsiveProps} 
                    cardHeightStyle={cardHeightStyle} 
                    loading={isProdScrapLoading} />

            </Row>

            <Row gutter={[12,12]}>

                <ScrapDetails 
                    responsiveProps={responsiveProps}
                    loading={isProductionDataLoading}
                    data={productionData} />

                <ProductionDetasils
                    responsiveProps={responsiveProps}
                    loading={isProductionDataLoading}
                    data={productionData}
                    area={area} />

                <PpmhDetails
                    responsiveProps={responsiveProps}
                    loading={isProductionDataLoading}
                    data={productionData} />

                <MtdDetails
                    responsiveProps={responsiveProps}
                    loading={isProdScrapLoading}
                    data={prodScrap}  />

            </Row>
        </>

    )

 }


 export default Production;