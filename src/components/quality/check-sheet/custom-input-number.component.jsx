import React, { useState, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams  } from 'react-router-dom'
import api from '../../../API'
import _ from 'lodash'
import numeral from 'numeral'
import moment from 'moment';

import {
    InputNumber,
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

const { TextArea } = Input;

const CustomInputNumber = ({
    isDisabled,
    record,
    frequency,
    defaultValue,
    defaultComment,
    defaultTimeStamp,

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

    const getTargets = record => {

        const { min, max } = record;
        const nom = (max + min) / 2;
        const lowerBound = ((min + nom) / 2);
        const upperBound = ((max + nom) / 2);
    
        return {
            min,
            lowerBound,
            nom,
            upperBound,
            max
        }
    }

    const updateStatus = useCallback((value) => {

        if (!value) setValidateStatus(null);
        const { min, max, lowerBound, upperBound } = getTargets(record);
        const result = parseFloat(value);

        if (result < min) setValidateStatus('error');
        if (result >= min && result <= lowerBound) setValidateStatus('warning'); 
        if (result > lowerBound && result < upperBound) setValidateStatus('success');
        if (result >= upperBound && result <= max) setValidateStatus('warning');     
        if (result > max) setValidateStatus('error');

    },[record])

    useEffect(() => {
        setVal(defaultValue);
        updateStatus(defaultValue);
    }, [defaultValue, updateStatus, record, checkSheetPart])

    useEffect(() => {
        setDot(defaultComment ? true : false);
        setCurrentComment(defaultComment);
        setCurrentTimeStamp(defaultTimeStamp);
    }, [defaultComment, defaultTimeStamp, checkSheetSubMachine, checkSheetPart])

    const debouncedPostData = useCallback(_.debounce((body) => {

        const key = `${record.characteristicId}_${frequency}`;
        message.loading({ content: 'Saving...', key });

        api.post('/quality/checksheets/checksheetentry', body)
            .then(response => { 

                const { value, timeStamp } = response.data;

                message.success({
                    content: `Value of '${value}' saved for ${record.value} Frequency ${frequency}.`,
                    key,
                    duration: 10
                });

                setCurrentTimeStamp(timeStamp);

            })
            .catch(err => message.error(`Error: ${record.value} frequency ${frequency} => ${err.message}`, 20))
            
    }, 500), [])

    const onChange = (e) => {

        const value = e.target.value;
        setVal(value);
        updateStatus(value);

        const { characteristicId } = record;

        debouncedPostData({
                checkSheetId,
                subMachineId: checkSheetSubMachine,
                characteristicId,
                part: checkSheetPart,
                frequency,
                value: parseFloat(value),
                comment: null
            })
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

    const onCloseModal = () => {
        setModalVisible(false);
        form.resetFields();
    }

    const onSubmitComment = () => form.submit();

    const onFinish = values => {

        const { comment } = values;
        const { characteristicId } = record;
        const body = {
            checkSheetId,
            subMachineId: checkSheetSubMachine,
            characteristicId,
            part: checkSheetPart,
            frequency,
            value: parseFloat(val),
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

        const { min, max, lowerBound, upperBound } = getTargets(record);
    
        const format = '0.[00]'
        const minStr = numeral(min).format(format)
        const maxStr = numeral(max).format(format)
        const lowerStr = numeral(lowerBound).format(format)
        const upperStr = numeral(upperBound).format(format)

        return (
            <Row gutter={[12,12]} style={{width: '300px'}}>
                <Col span={24}>
                    <Row className="tc">
                        <b>Tolerance:</b>
                    </Row>
                    <Row className="tc">
                        <Col span={4} className="bg-red pt1 pb1">{`<${minStr}`}</Col>
                        <Col span={5} className="bg-yellow pt1 pb1">{`${minStr} - ${lowerStr}`}</Col>
                        <Col span={6} className="bg-green pt1 pb1">{`${lowerStr} - ${upperStr}`}</Col>
                        <Col span={5} className="bg-yellow pt1 pb1">{`${upperStr} - ${maxStr}`}</Col>
                        <Col span={4} className="bg-red pt1 pb1">{`>${maxStr}`}</Col>
                    </Row>
                </Col>

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

            <Badge dot={dot}>
                <Form.Item hasFeedback validateStatus={validateStatus} className="mb0">
                    <Popover content={PopOverInfo(record)} title={record.value} trigger="hover">
                        <InputNumber type="number" style={{ width: '100%' }} disabled={isDisabled} onKeyUp={onChange} value={val} />
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

export default connect(mapStateToProps)(CustomInputNumber);