import React from 'react';
import { Result, Button, Layout } from 'antd';
const { Content } = Layout;

const NotFound = () => (
    <Content>
        <Result
            style={{ top: '50%', transform: 'translateY(50%)' }}
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary"><a href="/" >Back to Home</a></Button>}
        />
    </Content>

)

export default NotFound;