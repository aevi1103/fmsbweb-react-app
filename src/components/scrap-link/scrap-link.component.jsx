import React from 'react'
import { 
    Button,
    Tooltip,
    Typography 
 } from "antd";

 const { Text } = Typography;

const ScrapLink = ({qty, value, onClick}) => (
    <>
        {
            qty > 0 
            ? (<Tooltip placement="top" title="Click to see details">
                    <Button type="link" onClick={onClick}>
                        <Text type="danger">{value}</Text>
                    </Button>
                </Tooltip>)
            : (
                <Button type="link">
                    <Text disabled>{value}</Text>    
                </Button>
            )
        }
    </>
)

export default ScrapLink;