import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom';

import { PrinterOutlined } from '@ant-design/icons';
import {
    setChartWidth,
    setChartHeight
  } from '../../../redux/swot/swot.actions'

import SwotLine from '../../../components/swot/swot-line.component'

import { 
    Layout,
    PageHeader,
    Row,
    Col,
    Button
 } from "antd";

const { Content } = Layout;

const tabList =[
    {
        key: 'scrap',
        tab: 'Scrap',
    },
    {
        key: 'prod',
        tab: 'Production',
    },
    {
        key: 'dt',
        tab: 'Downtime',
    },
]


 const SwotPage = ({
    swotResult,
    setChartWidth,
    setChartHeight
 }) => {
  
    const history = useHistory();
    const { department } = useParams();

    useEffect(() => {

        const { lineData } = swotResult || {};

        if (lineData?.length === 0 || !lineData) {
          history.push(`/dashboard/swot/settings`)
        }
        
      }, [swotResult, history])

    useEffect(() => {
        document.title = `SWOT: ${department}`
    },[])

    useEffect(() => {
        setChartWidth('100%');
        setChartHeight('400');
    }, [])

    const onPrint = () => history.push(`/dashboard/swot/${department}/print`);

    return (
        <>
            <PageHeader
                className="site-page-header"
                title={`${department} SWOT Charts`}
                onBack={() => history.goBack() }
                extra={<Button type="primary" onClick={onPrint}><PrinterOutlined /> Print</Button>}
            />

            <Content className="ma3 mt0">
            
                {
                    swotResult?.lineData.map(data => (
                        <Row gutter={[16,16]} key={data.line}>
                            <Col span={24}>
                                <SwotLine data={data} filters={swotResult?.filters} tabList={tabList} />           
                            </Col>
                        </Row>
                    ))
                }

            </Content>
        </>
    )

 }

 const mapStateToProps = ({ swot }) => ({
    swotResult: swot.swotResult,
     chartWidth: swot.chartWidth,
     chartHeight: swot.chartHeight
 })

 const mapDispathToProps = dispatch => ({
    setChartWidth: width => dispatch(setChartWidth(width)),
    setChartHeight: height => dispatch(setChartHeight(height)),
  })

 export default connect(mapStateToProps, mapDispathToProps)(SwotPage);