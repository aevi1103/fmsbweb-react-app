import React from 'react';

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';
import numeral from 'numeral';

import { 
    Row,
    Col,
    Card,
    Spin
 } from "antd";

 FusionCharts.options.creditLabel = false;
 ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const Safety = ({isLoading, data}) => { 
    
    const chartData = data.map(({month, incidentRate, manHours, numberOfRecordable}) => 
        (
            {
                label: month.substr(0,3),
                value: incidentRate,
                color: month === 'YTD' ? '#ff5722' : '',
                toolText: `<b>Month: </b> ${month} <br>
                            <b>Man Hours: </b> ${numeral(manHours).format('0,0')} <br>
                            <b>Recordables: </b> ${numeral(numberOfRecordable).format('0,0')} <br>
                            <b>Incident Rate: </b> ${incidentRate} <br>`
            }
        ));
    
    const dataSource = {
        chart: {
          xAxisName: 'Months',
          yAxisName: 'Incident Rate',
          showValues: '1',
          theme: 'fusion'
        },
        data: chartData
      };
      
      const chartConfigs = {
        type: 'column2d',
        width: '100%',
        height: 400,
        dataFormat: 'json',
        dataSource: dataSource
      };

    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Monthly Incident Date" bordered={true} size="small" className="tc">                     
                        {
                            isLoading ? <Spin/> : <ReactFC {...chartConfigs} />
                        }
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Incident Occurence by Department" bordered={true} size="small">
                        Card content
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Incidents" bordered={true} size="small">
                        Card content
                    </Card>
                </Col>
            </Row>
        </div>
    ) 
};

export default Safety;