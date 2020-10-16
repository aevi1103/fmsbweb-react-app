import React, { useEffect, useState } from 'react';
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom';

import { PrinterOutlined } from '@ant-design/icons';
import {
    setChartWidth,
    setChartHeight
  } from '../../../redux/swot/swot.actions'

import SwotLine from '../../../components/swot/swot-line.component'

import {
    getContentListDepartment,
    colorCodes
} from '../../../components/swot/helper'

import { 
    ArrowDownOutlined,
    ArrowUpOutlined 
} from '@ant-design/icons';

import { 
    Layout,
    PageHeader,
    Row,
    Col,
    Button,
    Card,
    Tooltip,
    Typography
 } from "antd";

 const { Text } = Typography;
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
    const [activeKey, setActiveKey] = useState(tabList[0].key)

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

    const dateFormat = 'MM/DD/YYYY'
    const startDate = moment(swotResult?.filters?.startDate).format(dateFormat);
    const endDate = moment(swotResult?.filters?.endDate).format(dateFormat);
    const dateRateHeader = `${startDate} - ${endDate}`

    const onPrint = () => history.push(`/dashboard/swot/${department}/print`);
    const onDepatment = () => history.push(`/dashboard/morningmeeting/${department}?start=${startDate}&end=${endDate}`);
    const onWorkCenter = () => history.push(`/dashboard/morningmeeting/${department}/details?start=${startDate}&end=${endDate}`);
    const onActiveOrders = () => history.push(`/orderstatus/${department}`);

    const dateFormatTooltip = 'MM/DD/YY'
    const { oae, net, targets } = swotResult?.departmentData || {};
    const { oaeTarget } = targets || {}
    const style = {
        color: oae < oaeTarget ? colorCodes.red : colorCodes.green
    }
    const depHeader = (<Tooltip title={`Date Range: ${moment(startDate).format(dateFormatTooltip)} - ${moment(endDate).format(dateFormatTooltip)}`}>
                            <Text style={style}>{department}: SAP OAE: <span className="mr1">{numeral(oae).format('0%')} ~ {numeral(net).format('0,0')}</span> 
                            {oae < oaeTarget ? <ArrowDownOutlined /> : <ArrowUpOutlined />}</Text>
                        </Tooltip>) 
    
    return (
        <>
            <PageHeader
                className="site-page-header"
                title={`${department} SWOT Charts (${dateRateHeader})`}
                onBack={() => history.goBack() }
                extra={[
                    <Button key="dept" className="ml0 mr0" type="link" onClick={onDepatment}>Department Details</Button>,
                    <Button key="workCntr" className="ml0 mr0"  type="link" onClick={onWorkCenter}>Work Center Details</Button>,
                    <Button key="orders" className="ml0 mr0"  type="link" onClick={onActiveOrders}>Active Orders</Button>,
                    <Button key="print" type="primary" onClick={onPrint}><PrinterOutlined /> Print</Button>
                ]}
            />

            <Content className="ma3 mt0">
            
                {
                    swotResult?.filters?.lines === null 
                        ?   <Row gutter={[16,16]}>
                                <Col span={24}>
                                    <Card title={depHeader} 
                                        tabList={tabList} 
                                        activeTabKey={activeKey}
                                        onTabChange={key => setActiveKey(key)}
                                        extra={<Text strong>Target OAE: {numeral(oaeTarget).format('0%')}</Text>}>
            
                                        {
                                            getContentListDepartment(swotResult?.departmentData, swotResult?.filters)[activeKey]
                                        }
            
                                    </Card>
                                </Col>
                            </Row>
                        : null
                }
                
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