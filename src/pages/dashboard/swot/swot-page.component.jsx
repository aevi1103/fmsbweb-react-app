import React from 'react';
import { connect } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom';

import { PrinterOutlined } from '@ant-design/icons';


import SwotLine from '../../../components/swot/swot-line.component'

import { 
    Layout,
    PageHeader,
    Row,
    Col,
    Card,
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
    swotCollection
 }) => {
  
    const history = useHistory();
    const { department } = useParams();

    return (
        <>
            <PageHeader
                className="site-page-header"
                title={`${department} SWOT Charts`}
                onBack={() => history.goBack() }
                extra={<Button type="primary"><PrinterOutlined /> Print</Button>}
            />

            <Content className="ma3 mt0">
            
                {
                    swotCollection.length > 0 
                    
                        ? swotCollection.map(data => (
                            <Row gutter={[16,16]} key={data.line}>
                                <Col span={24}>

                                    <SwotLine 
                                        data={data}
                                        tabList={tabList} />
                                    
                                </Col>
                            </Row>
                        ))

                    : history.push(`/dashboard/swot/settings`)
                }

            </Content>
        </>
    )

 }

 const mapStateToProps = ({ swot }) => ({
     swotCollection: swot.swotCollection
 })

 export default connect(mapStateToProps)(SwotPage);