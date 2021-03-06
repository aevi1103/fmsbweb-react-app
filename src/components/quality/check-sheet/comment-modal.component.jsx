import React, { useEffect } from 'react'
import { connect  } from 'react-redux'
import { useParams } from 'react-router-dom'
import api from '../../../core/utilities/api'

import {
    setCheckSheetEntry
} from '../../../core/redux/quality-check-sheet/quality-check-sheet.actions.js'
import {
    Modal,
    Button,
    Form,
    Input,
    message
} from 'antd'

const { TextArea } = Input;

const CommentModal = ({
    record,
    visible,
    frequency,
    isPassFail,
    value,
    item,
    dispatch,

    checkSheetSubMachine,
    checkSheetPart,
    checkSheetValues,
    setCheckSheetEntry,
    isCheckSheetReadOnly
}) => {

    const { checkSheetId } = useParams();
    const [form] = Form.useForm();

    useEffect(() => {

        if (visible) {
            form.setFieldsValue({
                comment: item?.comment
            });  
        }

    }, [visible, item, form])

    const onFinish = values => {

        const { comment } = values;
        const { characteristicId } = record;

        const body = {
            checkSheetId: parseFloat(checkSheetId),
            subMachineId: checkSheetSubMachine,
            characteristicId,
            part: checkSheetPart,
            frequency,
            value: isPassFail ? null : parseFloat(value),
            valueBool: isPassFail ? value : null,
            comment,
            checkSheetEntryId: item?.checkSheetEntryId ?? 0
        }

        api.post('/quality/checksheets/checksheetentry', body)
        .then(response => { 

            const data = response.data;
            const { status, result } = data;

            setCheckSheetEntry(result, checkSheetValues, status);

            message.success('Comment Added');
            dispatch({ type: 'SET_MODAL_VISIBLE', payload: false});
        })
        .catch(err => message.error(`Error: ${record.value} frequency ${frequency} => ${err.message}`, 20));

    }

    const onSubmitComment = () => form.submit();

    const onCloseModal = () => {
        dispatch({ type: 'SET_MODAL_VISIBLE', payload: false});
        form.resetFields();
    }

    return <Modal
            title={`Comment: ${record.value}`}
            visible={visible}
            onCancel={onCloseModal}
            footer={[
                <Button key="back" onClick={onCloseModal}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={onSubmitComment} disabled={isCheckSheetReadOnly}>
                    Submit
                </Button>,
            ]}
        >
            <Form onFinish={onFinish} form={form}>
                <Form.Item
                    name="comment"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your comments',
                        },
                    ]}>
                    <TextArea rows="6" allowClear placeholder="Enter comments..." disabled={isCheckSheetReadOnly}/>
                </Form.Item>
            </Form>
        </Modal>
}

const mapDispatchToProps = dispatch => ({
    setCheckSheetEntry: (checkSheetEntry, checkSheetValues, status) => dispatch(setCheckSheetEntry(checkSheetEntry, checkSheetValues, status))
});

const mapStateToProps = ({qualityCheckSheet}) => ({
    checkSheetSubMachine: qualityCheckSheet.checkSheetSubMachine,
    checkSheetPart: qualityCheckSheet.checkSheetPart,
    checkSheetValues: qualityCheckSheet.checkSheetValues,
    isCheckSheetReadOnly: qualityCheckSheet.isCheckSheetReadOnly
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentModal)