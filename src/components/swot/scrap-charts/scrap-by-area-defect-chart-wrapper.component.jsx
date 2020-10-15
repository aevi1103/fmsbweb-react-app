import React from 'react';
import { useParams } from 'react-router-dom';
import ScrapByAreaDefectChart from './scrap-by-area-defect-chart.component'

import { 
    Col,
 } from "antd";

const ScrapByAreaDefectChartWrapper = ({
    scrapParetoByArea,
    line,
    filters,
    isPrint = false   
}) => {

    const { department } = useParams();
    const { data, startDate, endDate } = scrapParetoByArea;

    if (data.length === 0) return null;
    if (department === 'Foundry') return null;

    return (
        <>
          {
            data.map(scrapData => {

                const { scrapAreaName } =  scrapData;
                
                return isPrint 

                    ? (<ScrapByAreaDefectChart key={scrapAreaName} 
                        scrapData={scrapData} 
                        start={startDate}
                        end={endDate}
                        line={line}
                        filters={filters}  />)

                    : (<Col span={6} key={scrapAreaName}>
                            <ScrapByAreaDefectChart
                                scrapData={scrapData} 
                                start={startDate}
                                end={endDate}
                                line={line}
                                filters={filters} />
                        </Col>)

            })
          }
        </>
    )
}

export default ScrapByAreaDefectChartWrapper;