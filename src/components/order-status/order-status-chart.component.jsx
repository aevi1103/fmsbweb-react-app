import React, { useState, useEffect } from 'react';
import api from '../../API'
import axios from 'axios'

import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import CustomSpinner from '../../components/custom-spinner/custom-spinner.component'
import Error from '../../components/error-empty-container/error-empty-container.component'

import { Typography } from 'antd';
const { Text } = Typography;

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const OrderStatusChart = ({ 
    workCenter,
    url,
    lastUpdate,
    token
}) => {

    const [isLoading, setIsLoading] = useState(false); 
    const [isError, setIserror] = useState(false); 
    const [errMsg, setErrMsg] = useState(""); 
    const [chartConfigs, setChartConfigs] = useState({}); 

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const fetchData = () => {
        
        setIsLoading(true);

        api.get(url, {
            cancelToken: source.token
          })
            .then(response => {

                const result = response.data;
                const category = result.map(({ orderNumber, material }) => ({ label: `${orderNumber} (${material})` }));
                const target = result.map(({ target }) => ({ value: target }));
                const actual = result.map(({ trueActual }) => ({ value: trueActual }));
        
                const dataSource = {
                    chart: {
                        caption: `${workCenter} Active Production Order`,
                        subCaption: `${lastUpdate}`,
                        placevaluesinside: "1",
                        showvalues: "1",
                        theme: "fusion",
                        paletteColors: "#015eaa, #19bc9c",
                        valueFontColor: "#000000",
                        valueBgColor: "#FFFFFF",
                        valueBgAlpha: "50",
                        formatNumberScale: "0"
                    },
                    categories: [
                        {
                            category: category
                        }
                    ],
                    dataset: [
                        {
                            seriesname: "Target",
                            data: target
                        },
                        {
                            seriesname: "Actual",
                            data: actual
                        }
                    ]
                }
        
                const config = {
                        type: 'msbar2d',
                        width: '100%',
                        height: '85%',
                        dataFormat: 'json',
                        dataSource: dataSource
                    }
                
                setChartConfigs(config);

            })
            .catch(thrown => {

                if (axios.isCancel(thrown)) {
                    console.error('Request canceled', url, thrown.message);
                } else {
                    console.error(thrown);
                    setIserror(true);
                    setErrMsg(thrown.message);
                }

            })
            .finally(() => {

                setIsLoading(false);

                if (isError) {             
                    setIserror(false);
                    console.error(url, 'retrying in one minute', isError);
                    setTimeout(() => fetchData(), 60000);
                }

            })

    }

    useEffect(() => {

        fetchData();
        return function cleanup() {
            source.cancel(url, 'Operation cancelled');
        }
        
    }, [lastUpdate])
    
    return (
        <>
            {        
                isLoading
                    ? (<CustomSpinner/>)
                    : isError
                        ?   (
                                <div>
                                    <Error/>
                                    <Text type="danger">{errMsg}</Text>
                                </div>
                            )
                        : (<ReactFC {...chartConfigs} />)
            } 
        </> 
    )

    

}

export default OrderStatusChart;