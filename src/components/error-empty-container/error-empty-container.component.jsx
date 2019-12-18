import React from 'react';

import { 
    Empty, Typography 
 } from "antd";

 const { Text } = Typography;

 const ErrorEmptyContainer = ({errorMsg}) => (

    <Empty
        image={require('../../assets/error-icon-25240.png')}
        imageStyle={{
        height: 50,
        }}
        description={
            <Text type="danger">{errorMsg}</Text>
        }
        >
    
    </Empty>

 )

 export default ErrorEmptyContainer;