import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components'

import ScrapByDefectChart from './components/scrap-by-defect-chart.component'
import ScrapByShiftChart from './components/scrap-by-shift-chart.component'
import ScrapByAreaChart from './components/scrap-by-area-chart.component'
import ScrapByAreaDefectChartWrapper from './components/scrap-by-area-defect-chart-wrapper.component'
import MonthlyWeeklyChartWrapper from './components/monthly-weekly-scrap-chart-wrapper.component'

import HourlyProductionChart from './components/hourly-production-chart.component'
import DailyProductionChart from './components/daily-production-chart.component'
import ProductionByShiftChart from './components/production-by-shift-chart.component'
import MonthlyWeeklyOaeChartWrapper from './components/monthly-weekly-oae-chart-wrapper.component'

import DowntimeParetoByReasonChart from './components/downtime-pareto-by-reason-chart.component'
import DowntimeParetoByMachineChart from './components/downtime-pareto-by-machine.component'
import DailyDowntimeByReasonChart from './components/daily-downtime-by-reason-chart.component'
import DailyDowntimeByMachineChart from './components/daily-downtime-by-machine-chart.component'


import {
  setChartWidth,
  setChartHeight,
  setChartPrintWidth,
  setChartPrintHeight
} from '../../core/redux/swot/swot.actions'

import {
  InputNumber,
  Button
} from 'antd'

const Container = styled.div`
  @media print {
    display: none;
  }

  margin: 1rem;
`

const SwotPrint = ({
  swotResult,

  setChartWidth,
  setChartHeight,
  setChartPrintWidth,
  setChartPrintHeight,

  chartPrintWidth,
  chartPrintHt
}) => {

  const history = useHistory();
  const { department } = useParams();
  const [collection, setCollection] = useState([])

  useEffect(() => {
    document.title = `Print SWOT: ${department}`
  }, [])


  useEffect(() => {
    const { lineData, filters } = swotResult || {};

    if (lineData?.length === 0 || !lineData) {

      history.push(`/dashboard/swot/settings/${department}`);

    }  else {

      setCollection(lineData.map(data => ({ ...data, filters })))

    }
  
  }, [swotResult, history, department])

  useEffect(() => {
  
    setChartWidth(chartPrintWidth);
    setChartHeight(chartPrintHt);

    return () => {
      setChartWidth('100%');
      setChartHeight('400');
    }

  }, [])

  const onWidthChange = value => {
    setChartWidth(value);
    setChartPrintWidth(value);
  };
  const onHeightChange = value => {
    setChartHeight(value);
    setChartPrintHeight(value);
  }
  const onPrint = () => window.print();
  const onBack = () => history.push(`/dashboard/swot/settings/${department}`);

  return (
      <>
          <Container className="w-50">

            <span>Width: </span>
            <InputNumber 
              min={100} 
              className="mr2 w-20" 
              value={chartPrintWidth} 
              placeholder="Enter Width" 
              onChange={onWidthChange}  />

            <span>Height: </span>
            <InputNumber 
              min={100} 
              className="mr2 w-20" 
              value={chartPrintHt} 
              placeholder="Enter Height" 
              onChange={onHeightChange} />

            <Button className="mr2" type="primary" onClick={onPrint} >Print</Button>
            <Button type="primary" onClick={onBack} >Cancel</Button>

          </Container>

          {
              collection.map(({line, filters, swotTarget, scrapCharts, productionCharts, downtimeCharts }) => (
                <div key={line}>

                  {/* Scrap */}

                  {
                    scrapCharts.scrapPareto.data.length > 0 

                      ? <ScrapByDefectChart 
                          scrapData={scrapCharts.scrapPareto} 
                          line={line} 
                          filters={filters} />  

                      : null
                  }

                  {
                    scrapCharts.scrapParetoByShift.data.length > 0 

                      ? <ScrapByShiftChart 
                          scrapData={scrapCharts.scrapParetoByShift} 
                          line={line} 
                          filters={filters} />  

                      : null
                  }

                  {
                    department !== 'Foundry' 
                        ?  scrapCharts.scrapParetoByArea?.data?.length > 0 
                              ? <ScrapByAreaChart 
                                  scrapData={scrapCharts.scrapParetoByArea} 
                                  line={line} 
                                  filters={filters} /> 
                              : null
                        : null
                  }
                  
                  {
                    scrapCharts.scrapParetoByArea?.data?.length > 0 
                      ? <ScrapByAreaDefectChartWrapper 
                          scrapParetoByArea={scrapCharts.scrapParetoByArea}
                          filters={filters}
                          line={line}
                          isPrint={true} />
                      : null
                  }
                  
                  {
                    scrapCharts.monthlyScrapRates?.data?.length > 0 && 
                    scrapCharts.weeklyScrapRates?.data?.length > 0 
                      ? <MonthlyWeeklyChartWrapper 
                          monthlyScrapRates={scrapCharts.monthlyScrapRates}
                          weeklyScrapRates={scrapCharts.weeklyScrapRates}
                          filters={filters}
                          line={line} />
                      : null
                    
                  }

                  {/* Production */}

                  {
                    productionCharts.hourlyProduction.data.length > 0 
                      ? <HourlyProductionChart 
                          prodData={productionCharts.hourlyProduction} 
                          line={line} />
                      : null
                  }

                  {
                    productionCharts.dailyProduction?.data?.length > 0 
                      ? <DailyProductionChart 
                          prodData={productionCharts.dailyProduction} 
                          line={line}
                          filters={filters}
                          targets={swotTarget} />
                      : null
                  }

                  {
                    productionCharts.productionByShift?.data.length > 0 
                      ? <ProductionByShiftChart 
                          prodData={productionCharts.productionByShift} 
                          line={line}
                          targets={swotTarget} />
                      : null
                  }

                  {
                    productionCharts.monthlyOae?.data.length > 0 && 
                    productionCharts.weeklyOae?.data.length > 0 
                      ?  <MonthlyWeeklyOaeChartWrapper
                          monthlyOae={productionCharts.monthlyOae} 
                          weeklyOae={productionCharts.weeklyOae} 
                          filters={filters} 
                          targets={swotTarget} 
                          line={line} />
                      : null
                  }

                  {/* Downtime */}

                  {
                    downtimeCharts.downtimeByReason.data.length > 0 
                      ? <DowntimeParetoByReasonChart 
                          downtimeData={downtimeCharts.downtimeByReason} 
                          line={line} 
                          filters={filters}
                          calculatedDateRange={false}/> 
                      : null
                  }
                  
                  {
                    downtimeCharts.downtimeByMachine.data.length > 0 
                     ? <DowntimeParetoByMachineChart
                        downtimeData={downtimeCharts.downtimeByMachine} 
                        line={line} 
                        filters={filters}
                        calculatedDateRange={false} />
                      : null
                  }

                  {
                    downtimeCharts.lastDowntimeByReason?.data.length > 0 
                      ? <DowntimeParetoByReasonChart 
                        downtimeData={downtimeCharts.lastDowntimeByReason} 
                        line={line} 
                        filters={filters}
                        calculatedDateRange={true} /> 
                      : null
                  }
                  
                  {
                    downtimeCharts.lastDowntimeByMachine?.data.length > 0 
                      ? <DowntimeParetoByMachineChart
                          downtimeData={downtimeCharts.lastDowntimeByMachine} 
                          line={line} 
                          filters={filters}
                          calculatedDateRange={true} />
                      : null
                  }
                  
                  {
                    downtimeCharts.dailyDowntimeByReason?.data.length > 0 
                      ? <DailyDowntimeByReasonChart 
                          downtimeData={downtimeCharts.dailyDowntimeByReason} 
                          line={line}
                          filters={filters}
                          calculatedDateRange={true} />
                      : null
                  }
                  
                  {
                    downtimeCharts.dailyDowntimeByMachine?.data.length > 0 
                      ? <DailyDowntimeByMachineChart
                          downtimeData={downtimeCharts.dailyDowntimeByMachine} 
                          line={line}
                          filters={filters}
                          calculatedDateRange={true} /> 
                      : null
                  }
                  
                </div>
              ))
          }
      </>
  )
}

const mapStateToProps = ({ swot }) => ({
  swotResult: swot.swotResult,
  chartPrintWidth: swot.chartPrintWidth,
  chartPrintHt: swot.chartPrintHt
})

const mapDispathToProps = dispatch => ({

  setChartWidth: width => dispatch(setChartWidth(width)),
  setChartHeight: height => dispatch(setChartHeight(height)),

  setChartPrintWidth: width => dispatch(setChartPrintWidth(width)),
  setChartPrintHeight: height => dispatch(setChartPrintHeight(height))
})

export default connect(mapStateToProps, mapDispathToProps)(SwotPrint);