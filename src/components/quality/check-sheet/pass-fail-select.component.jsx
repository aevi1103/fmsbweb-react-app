import React, { useState } from 'react'
import {
    Select,
    Form
} from 'antd'

const { Option } = Select;

const PassFailSelect = ({
    isDisabled
}) => {

    const [validateStatus, setValidateStatus] = useState(null);

    const onChange = (value) => !value ? setValidateStatus("error") : setValidateStatus("success")

    return (
        <Form.Item hasFeedback validateStatus={validateStatus} className="mb0">
            <Select style={{ width: '100%' }} allowClear={true} onChange={onChange} disabled={isDisabled} >
                <Option value={true}>Pass</Option>
                <Option value={false}>Fail</Option>
            </Select>
        </Form.Item>

    )
}

export default PassFailSelect;