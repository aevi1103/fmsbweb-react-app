import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { useParams  } from 'react-router-dom'
import api from '../../../API'
import moment from 'moment'
import {
    Select,
    Form,
    message,
    Input,
    Modal,
    Button,
    Badge,
    Popover,
    Row,
    Col
} from 'antd'

const { Option } = Select;
const { TextArea } = Input;

const PassFailSelect = ({
    isDisabled,
    frequency,
    record,
    defaultValue,
    defaultTimeStamp,
    defaultComment,

    checkSheetSubMachine,
    checkSheetPart
}) => {

    const { checkSheetId } = useParams();
    const [validateStatus, setValidateStatus] = useState(null);
    const [val, setVal] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [dot, setDot] = useState(defaultComment ? true : false);
    const [currentComment, setCurrentComment] = useState(defaultComment);
    const [currentTimeStamp, setCurrentTimeStamp] = useState(defaultTimeStamp);

    const [form] = Form.useForm();

    const updateStatus = useCallback((value) => {
        if (!value) setValidateStatus("error");
        if (value) setValidateStatus("success");
        if (value === undefined || value === null) setValidateStatus(null);
    }, []);

    useEffect(() => {
        setVal(defaultValue);
        updateStatus(defaultValue);
    }, [defaultValue, updateStatus, record, checkSheetPart]);

    useEffect(() => {
        setDot(defaultComment ? true : false);
        setCurrentComment(defaultComment);
        setCurrentTimeStamp(defaultTimeStamp);
    }, [defaultComment, defaultTimeStamp, checkSheetSubMachine, checkSheetPart])

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
                const { valueBool, timeStamp } = response.data;
                message.success({
                    content: `${record.value} Frequency ${frequency} changed to ${valueBool ? 'Passed' : 'Failed'}`,
                    key,
                    duration: 10
                });
                setCurrentTimeStamp(timeStamp);
            })
            .catch(err => message.error(`Error: ${record.value} frequency ${frequency} => ${err.message}`, 20));
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
                    if (response.data.length === 0) return;
                    form.setFieldsValue({
                        comment: response.data[0].comment
                    });              
                })
                .catch(err => message.error(err.message, 10))
    }

    const onSubmitComment = () => form.submit();

    const onCloseModal = () => {
        setModalVisible(false);
        form.resetFields();
    }

    const onFinish = values => {

        const { comment } = values;
        const { characteristicId } = record;
        const body = {
            checkSheetId,
            subMachineId: checkSheetSubMachine,
            characteristicId,
            part: checkSheetPart,
            frequency,
            valueBool: val,
            comment
        }

        api.post('/quality/checksheets/checksheetentry', body)
            .then(response => { 

                const { comment, timeStamp } = response.data;
                setCurrentComment(comment);
                setCurrentTimeStamp(timeStamp);
            
                if (comment.length > 0) {
                    setDot(true);
                }

                message.success('Comment Added');
                setModalVisible(false);    
            })
            .catch(err => message.error(`Error: ${record.value} frequency ${frequency} => ${err.message}`, 20))

    }

    const PopOverInfo = record => {

        return (
            <Row gutter={[12,12]} style={{width: '300px'}}>

                {
                    dot 
                    ?   <Col span={24}>
                            <b className="db">Comment:</b>
                            <p>{currentComment}</p>
                        </Col>
                    : null
                }

                <Col span={24}>
                    <Button onClick={onOpenModal} type="primary">{  dot ? 'Edit Comment' : 'Add Comment' }</Button>
                </Col>
                
                {
                    currentTimeStamp 
                    ? <Col span={24}>
                        <b className="db">Last Updated:</b>
                        <span>{moment(currentTimeStamp).format('lll')}</span>
                    </Col>
                    : null
                }
            
            </Row>
        )
    }

    return (
        <React.Fragment>

            <Badge dot={dot} className="db" >
                <Form.Item hasFeedback validateStatus={validateStatus} className="mb0">
                    <Popover content={PopOverInfo(record)} title={record.value} trigger="hover">
                        <Select style={{ width: '100%' }} allowClear={true} onChange={onChange} disabled={isDisabled} value={val} >
                            <Option value={true}>Pass</Option>
                            <Option value={false}>Fail</Option>
                        </Select>
                    </Popover>
                </Form.Item>
            </Badge>
            
            <Modal
                title="Comment"
                visible={modalVisible}
                onOk={onSubmitComment}
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

export default connect(mapStateToProps)(PassFailSelect);