import React, { useEffect, useState } from 'react';
import moment from 'moment'
import numeral from 'numeral'
import _ from 'lodash'
import { connect } from 'react-redux'
import { useParams, useHistory, Link } from 'react-router-dom';
import { exportData } from './service/export'

import {
    setChartWidth,
    setChartHeight
  } from '../../core/redux/swot/swot.actions'

import SwotLine from './components/swot-line.component'
import { red, green } from '../../core/utilities/colors'
import { getContentListDepartment } from './service/helper'

import { 
    ArrowDownOutlined,
    ArrowUpOutlined,
    DownloadOutlined
} from '@ant-design/icons';

import { 
    Layout,
    PageHeader,
    Row,
    Col,
    Card,
    Tooltip,
    Typography,
    Dropdown,
    Menu,
    Button
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


 const Swot = ({
    swotResult,
    setChartWidth,
    setChartHeight
 }) => {
  
    const history = useHistory();
    const { department } = useParams();
    const [activeKey, setActiveKey] = useState(tabList[0].key)
    const [download, setDownload] = useState(false)

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

    const { filters } = swotResult || {};
    const { startDate, endDate } = filters || {};

    const dateFormat = 'MM/DD/YYYY'
    const startDateStr = moment(startDate).format(dateFormat);
    const endDateStr = moment(endDate).format(dateFormat);
    const dateRateHeader = `${startDateStr} - ${endDateStr}`

    const dateFormatTooltip = 'MM/DD/YY'
    const { oae, net, targets } = swotResult?.departmentData || {};
    const { oaeTarget } = targets || {}
    const { dept } = filters || {};
    const style = {
        color: oae < oaeTarget ? red : green
    }

    const onDownload = () => exportData(filters, setDownload, '', true);

    const depHeader = (<>
                        <Tooltip title={`Date Range: ${moment(startDateStr).format(dateFormatTooltip)} - ${moment(endDateStr).format(dateFormatTooltip)}`}>
                            <Text style={style}>{dept}: SAP OAE: <span className="mr1">{numeral(oae).format('0%')} ~ {numeral(net).format('0,0')}</span> 
                            {oae < oaeTarget ? <ArrowDownOutlined /> : <ArrowUpOutlined />}</Text>
                        </Tooltip>
                        <Button className="ml2" type="primary" onClick={onDownload} loading={download}>
                            <DownloadOutlined /> Download
                        </Button>
                    </>) 
    
    const btnOverlay = (
        <Menu>  
            <Menu.Item key={`/dashboard/morningmeeting/${department}`}>
                <Link to={`/dashboard/morningmeeting/${department}?start=${startDateStr}&end=${endDateStr}`} >Department Details</Link>
            </Menu.Item>
            <Menu.Item key={`/dashboard/morningmeeting/${department}/details`}>
                <Link to={`/dashboard/morningmeeting/${department}/details?start=${startDateStr}&end=${endDateStr}`} >Work Center Details</Link>
            </Menu.Item>
            <Menu.Item key={`/dashboard/morningmeeting/${department}/hourly-production`} >
                <Link to={`/dashboard/morningmeeting/${department}/hourly-production?date=${endDateStr}`} >Hourly Production</Link>
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

 export default connect(mapStateToProps, mapDispathToProps)(Swot);