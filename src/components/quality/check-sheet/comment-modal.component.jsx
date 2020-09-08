import React, { useEffect } from 'react'
import { connect  } from 'react-redux'
import { useParams } from 'react-router-dom'
import api from '../../../API'

import {
    setCheckSheetEntry
} from '../../../redux/quality-check-sheet/quality-check-sheet.actions.js'
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
    setCheckSheetEntry
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
            checkSheetId,
            subMachineId: checkSheetSubMachine,
            characteristicId,
            part: checkSheetPart,
            frequency,
            value: isPassFail ? null : parseFloat(value),
            valueBool: isPassFail ? value : null,
            comment
        }

        api.post('/quality/checksheets/checksheetentry', body)
        .then(response => { 

            const data = response.data;
            setCheckSheetEntry(data, checkSheetValues);

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
                <Button key="submit" type="primary" onClick={onSubmitComment}>
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
                    <TextArea rows="6" allowClear placeholder="Enter comments..."/>
                </Form.Item>
            </Form>
        </Modal>
}

const mapDispatchToProps = dispatch => ({
    setCheckSheetEntry: (checkSheetEntry, checkSheetValues) => dispatch(setCheckSheetEntry(checkSheetEntry, checkSheetValues))
});

const mapStateToProps = ({qualityCheckSheet}) => ({
    checkSheetSubMachine: qualityCheckSheet.checkSheetSubMachine,
    checkSheetPart: qualityCheckSheet.checkSheetPart,
    checkSheetValues: qualityCheckSheet.checkSheetValues
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentModal)