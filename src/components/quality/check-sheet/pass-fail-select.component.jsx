import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { useParams  } from 'react-router-dom'
import api from '../../../API'
import {
    Select,
    Form,
    message
} from 'antd'

const { Option } = Select;

const PassFailSelect = ({
    isDisabled,
    frequency,
    record,
    defaultValue,

    checkSheetSubMachine,
    checkSheetPart
}) => {

    const { checkSheetId } = useParams();
    const [validateStatus, setValidateStatus] = useState(null);
    const [val, setVal] = useState(null);

    const updateStatus = useCallback((value) => {
        if (!value) setValidateStatus("error");
        if (value) setValidateStatus("success");
        if (value === undefined || value === null) setValidateStatus(null);
    }, []);

    useEffect(() => {
        setVal(defaultValue);
        updateStatus(defaultValue);
    }, [defaultValue, updateStatus, record, checkSheetPart]);

    const onChange = (value) => {

        setVal(value);
        updateStatus(value);

        const { characteristicId } = record;
        const key = `${record.characteristicId}_${frequency}`;
        
        api.post('/quality/checksheets/checksheetentry', {
            checkSheetId,
            subMachineId: checkSheetSubMachine,
            characteristicId,
            part: checkSheetPart,
            frequency,
            valueBool: value,
            comment: null
        })
            .then(response => {
                const { valueBool } = response.data;
                message.success({
                    content: `${record.value} Frequency ${frequency} changed to ${valueBool ? 'Passed' : 'Failed'}`,
                    key,
                    duration: 10
                });
            })
            .catch(err => message.error(`Error: ${record.value} frequency ${frequency} => ${err.message}`, 20));

    }

    return (
        <Form.Item hasFeedback validateStatus={validateStatus} className="mb0">
            <Select style={{ width: '100%' }} allowClear={true} onChange={onChange} disabled={isDisabled} value={val} >
                <Option value={true}>Pass</Option>
                <Option value={false}>Fail</Option>
            </Select>
        </Form.Item>

    )
}

const mapStateToProps = ({qualityCheckSheet}) => ({
    checkSheetSubMachine: qualityCheckSheet.checkSheetSubMachine,
    checkSheetPart: qualityCheckSheet.checkSheetPart,
})

export default connect(mapStateToProps)(PassFailSelect);