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
            ? (<Tooltip placement="top" title="Click to see scrap details">
                    <Button type="link" onClick={onClick}>
                        <span>{value}</span>
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