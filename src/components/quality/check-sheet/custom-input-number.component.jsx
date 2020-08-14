import React, { useState } from 'react'
import {
    InputNumber,
    Form
} from 'antd'

const CustomInputNumber = ({
    isDisabled,
    min,
    nom,
    max
}) => {

    const [validateStatus, setValidateStatus] = useState(null);

    const onChange = (value) => {

        if (!value) {
            setValidateStatus(null)
        }

        const valueDecimal = parseFloat(value);

        if (valueDecimal < min) {
            setValidateStatus('error')
        }

        if (valueDecimal >= min && valueDecimal <= max) {
            setValidateStatus('success')
        }

        if (valueDecimal > max) {
            setValidateStatus('error')
        }
        

    }

    return (
        <Form.Item hasFeedback validateStatus={validateStatus} className="mb0">
            <InputNumber style={{ width: '100%' }} disabled={isDisabled} onChange={onChange}  />
        </Form.Item>

    )
}

export default CustomInputNumber;