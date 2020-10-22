import React, { useEffect, useState } from 'react';
import moment from 'moment'
import numeral from 'numeral'
import _ from 'lodash'
import { connect } from 'react-redux'
import { useParams, useHistory, Link } from 'react-router-dom';

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
    Typography,
    Dropdown,
    Menu
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
          history.push(`/dashboard/swot/settings/${department}`)
        }
        
      }, [swotResult, history, department])

    useEffect(() => {
        document.title = `SWOT: ${_.capitalize(department)}`
    },[])

    useEffect(() => {
        setChartWidth('100%');
        setChartHeight('400');
    }, [])

    const dateFormat = 'MM/DD/YYYY'
    const startDate = moment(swotResult?.filters?.startDate).format(dateFormat);
    const endDate = moment(swotResult?.filters?.endDate).format(dateFormat);
    const dateRateHeader = `${startDate} - ${endDate}`

    const dateFormatTooltip = 'MM/DD/YY'
    const { oae, net, targets } = swotResult?.departmentData || {};
    const { oaeTarget } = targets || {}
    const { dept } = swotResult?.filters || {};
    const style = {
        color: oae < oaeTarget ? colorCodes.red : colorCodes.green
    }
    const depHeader = (<Tooltip title={`Date Range: ${moment(startDate).format(dateFormatTooltip)} - ${moment(endDate).format(dateFormatTooltip)}`}>
                            <Text style={style}>{dept}: SAP OAE: <span className="mr1">{numeral(oae).format('0%')} ~ {numeral(net).format('0,0')}</span> 
                            {oae < oaeTarget ? <ArrowDownOutlined /> : <ArrowUpOutlined />}</Text>
                        </Tooltip>) 
    
    const btnOverlay = (
        <Menu>  
            <Menu.Item key={`/dashboard/morningmeeting/${department}`}>
                <Link to={`/dashboard/morningmeeting/${department}?start=${startDate}&end=${endDate}`} >Department Details</Link>
            </Menu.Item>
            <Menu.Item key={`/dashboard/morningmeeting/${department}/details`}>
                <Link to={`/dashboard/morningmeeting/${department}/details?start=${startDate}&end=${endDate}`} >Work Center Details</Link>
            </Menu.Item>
            <Menu.Item key={`/dashboard/morningmeeting/${department}/hourly-production`} >
                <Link to={`/dashboard/morningmeeting/${department}/hourly-production?date=${endDate}`} >Hourly Production</Link>
            </Menu.Item>
            <Menu.Item key={`/orderstatus/${department}`}>
                <Link to={`/orderstatus/${department}`}>Active Orders</Link>
            </Menu.Item>
            <Menu.Item key="targets">
                <a href="http://10.129.224.149/FMSB/SWOT/Targets.aspx" target="_blank" rel="noreferrer">Adjust Targets</a>
            </Menu.Item>
        </Menu>
    )

    const extraMenu = (
        <Dropdown.Button type="primary" overlay={btnOverlay}>
            <Link to={`/dashboard/swot/${department}/print`} >Print</Link>
        </Dropdown.Button>
    )

    return (
        <>
            <PageHeader
                className="site-page-header"
                title={`${dept} SWOT Charts (${dateRateHeader})`}
                onBack={() => history.push(`/dashboard/swot/settings/${department}`) }
                extra={extraMenu}
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