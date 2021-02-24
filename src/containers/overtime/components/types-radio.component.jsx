import React, { useState } from 'react'
import { getOptions, onTypeChange } from '../services/helper'

import { 
    Radio
 } from "antd";

const TypesRadio = ({ type, record }) => {

    const [value, setValue] = useState();
    const onChange = (e) => onTypeChange(e, setValue, record)

    const props = {
        onChange,
        buttonStyle: "solid",
        options: getOptions(type),
        optionType: "button",
        value
    }

    return <Radio.Group {...props}/>
}

export default TypesRadio;