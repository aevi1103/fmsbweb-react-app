import React, { useState, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams  } from 'react-router-dom'
import api from '../../../API'
import _ from 'lodash'
import {
    InputNumber,
    Form,
    message,
    Input,
    Popconfirm,
    Modal
} from 'antd'

const { TextArea } = Input;

const CustomInputNumber = ({
    isDisabled,
    record,
    frequency,
    defaultValue,

    checkSheetSubMachine,
    checkSheetPart
}) => {

    const { checkSheetId } = useParams();
    const [validateStatus, setValidateStatus] = useState(null);
    const [val, setVal] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();

    const updateStatus = useCallback((value) => {

        const { min, nom, max } = record;
        if (!value) setValidateStatus(null);
        const valueDecimal = parseFloat(value);
        if (valueDecimal < min) setValidateStatus('error')
        if (valueDecimal >= min && valueDecimal <= max) setValidateStatus('success')
        if (valueDecimal > max) setValidateStatus('error')

    },[record])

    useEffect(() => {
        setVal(defaultValue);
        updateStatus(defaultValue);
    }, [defaultValue, updateStatus, record, checkSheetPart])

    const postData = (body) => {
        const key = `${record.characteristicId}_${frequency}`;
        message.loading({ content: 'Saving...', key });
        api.post('/quality/checksheets/checksheetentry', body)
            .then(response => { 
                const { value } = response.data;
                message.success({
                    content: `Value of '${value}' saved for ${record.value} Frequency ${frequency}.`,
                    key,
                    duration: 10
                });
            })
            .catch(err => message.error(`Error: ${record.value} frequency ${frequency} => ${err.message}`, 20))
    }

    const debouncedPostData = useCallback(_.debounce((body) => postData(body), 500), [])

    const onChange = (e) => {

        const value = e.target.value;
        setVal(value);

        updateStatus(value);

        const { characteristicId} = record;
        const body = {
            checkSheetId,
            subMachineId: checkSheetSubMachine,
            characteristicId,
            part: checkSheetPart,
            frequency,
            value: parseFloat(value),
            comment: null
        }

       debouncedPostData(body)

    }

    const onOpenModal = () => {
        setModalVisible(true);

        const { characteristicId } = record;
        api.get(`/quality/checksheets/checksheetentry?
                    $filter=characteristicId eq ${characteristicId} 
                    and frequency eq ${frequency} 
                    and part eq '${checkSheetPart}' 
                    and subMachineId eq ${checkSheetSubMachine}`)
                .then(response => {
                    form.setFieldsValue({
                        comment: response.data[0].comment
                    });              
                })
                .catch(err => message.error(err.message, 10))

    }
    const onCloseModal = () => {
        setModalVisible(false);
        form.resetFields();
    }

    const onSubmitComment = () => form.submit();

    const onFinish = values => {

        const { comment } = values;
        const { characteristicId} = record;
        postData({
            checkSheetId,
            subMachineId: checkSheetSubMachine,
            characteristicId,
            part: checkSheetPart,
            frequency,
            value: parseFloat(val),
            comment
        });

        setModalVisible(false);    

    }

    return (
        <React.Fragment>
        <Form.Item hasFeedback validateStatus={validateStatus} className="mb0">
            <Input.Group>
                <Popconfirm placement="top" title="Do you want to add comment?" onConfirm={onOpenModal} okText="Yes" cancelText="No">
                    <InputNumber style={{ width: '100%' }} disabled={isDisabled} onKeyUp={onChange} value={val} />
                </Popconfirm>
                
            </Input.Group>
            
        </Form.Item>
        <Modal
            title="Add Comment"
            visible={modalVisible}
            onOk={onSubmitComment}
            onCancel={onCloseModal}
        >
            <Form onFinish={onFinish} form={form}>
            <Form.Item
                name="comment"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please select your comments',
                    },
                ]}>
                <TextArea rows="6" allowClear placeholder="Enter comments..."/>
            </Form.Item>

            </Form>
        </Modal>
        
        </React.Fragment>


    )
}

const mapStateToProps = ({qualityCheckSheet}) => ({
    checkSheetSubMachine: qualityCheckSheet.checkSheetSubMachine,
    checkSheetPart: qualityCheckSheet.checkSheetPart,
})

export default connect(mapStateToProps)(CustomInputNumber);