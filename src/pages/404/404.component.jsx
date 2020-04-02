import React from 'react';
import { Empty, Layout } from 'antd';
const { Content } = Layout;

const NotFound = () => (
    <Layout>
        <Empty style={{marginTop: '15rem'}} description="Page Not Found"/>
    </Layout>
)

export default NotFound;