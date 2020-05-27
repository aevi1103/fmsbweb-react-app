import React from 'react'
import { 
    Button,
    Tooltip,
    Typography 
 } from "antd";

 const { Text } = Typography;

const ScrapLink = ({qty, value, onClick, scrapTarget = 0, textState = '', toolTip = 'Click to see Scrap Details'}) => (
    <>
        {
            qty > 0 
            ? (<Tooltip placement="top" title={toolTip}>
                    <Button type="link" onClick={onClick} className={`pa0 ${textState}`}>
                        <span>{value}</span>
                    </Button>
                </Tooltip>)
            : (
                <Button type="link" className="pa0">
                    <Text disabled>{value}</Text>    
                </Button>
            )
        }
    </>
)

export default ScrapLink;