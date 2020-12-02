import React from 'react'
import { 
    Button,
    Tooltip
 } from "antd";

const ScrapLink = React.memo(({
    qty,
    value,
    onClick,
    textState = '',
    toolTip = 'Click to see Scrap Details'
}) => (<Tooltip placement="top" title={qty > 0 ? toolTip : ''}>
            <Button 
                type="link" 
                onClick={onClick} 
                className={`pa0 ${textState}`} 
                disabled={qty === 0} 
                style={{ padding: 0 }}>

                <span>{value}</span>

            </Button>
        </Tooltip>)
)

export default ScrapLink;