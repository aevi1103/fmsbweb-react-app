import React, { useState, useCallback, useEffect } from 'react'
import { CloseOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import api from '../../../API'
import _ from 'lodash'
import moment from 'moment';
import {
    getValidationStatus
} from '../../../helpers/check-sheet-helpers'

import {
    setReChecksCollection,
    setCheckSheetValues
} from '../../../redux/quality-check-sheet/quality-check-sheet.actions.js'

import {
    InputNumber,
    Form,
    Input,
    Select,
    Space,
    message,
    Typography,
    Col,
    Row,
    Spin
} from 'antd'

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography

const ReCheckInput = ({ 
    isPassFail,
    targets,
    checkSheetEntryId,
    item,

    reChecksCollection,
    setReChecksCollection,
    checkSheetValues,
    setCheckSheetValues
}) => {

    const [validateStatus, setValidateStatus] = useState(null);
    const [entryId, setEntryid] = useState(checkSheetEntryId);

    const [value, setValue] = useState(item.value);
    const [valueBool, setValueBool] = useState(item.valueBool);
    const [comment, setComment] = useState(item.comment);
    const [timeStamp, setTimeStamp] = useState(item.timeStamp);
    const [reCheckId, setReCheckId] = useState(item.reCheckId);

    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [errMsg, setErrMsg] = useState(null);

    // todo: add a post to update check status in check sheet entry model

    const getCheckSheetEntry = () => {

        api.get(`/quality/checksheets/checksheetentry?$filter=checkSheetEntryId eq ${entryId}&$expand=rechecks`)
            .then(response => {

                const data = response.data[0];
                const newArr = checkSheetValues.filter(i => i.checkSheetEntryId !== entryId);
                newArr.push(data);

                setCheckSheetValues(newArr);

            })
            .catch(err => console.error(err))

    }

    const postData = (body, collection) => {
        setLoading(true);
        setErrMsg(null);
        api.post(`/quality/checksheets/rechecks`, body)
            .then(response => {

                const data =  response.data;
                const { reCheckId, timeStamp } = data;

                setReCheckId(reCheckId);
                setTimeStamp(timeStamp);

                //* update state
                const newArr = collection.map(i => {
                    if (i.key === item.key) return { ...data, key: item.key }
                    return i
                });

                setReChecksCollection(newArr);
                getCheckSheetEntry();
                message.success(`Successfully Saved!`);
            })
            .catch(err => setErrMsg(err.message))
            .finally(() => setLoading(false));
    }

    const debouncedPostData = useCallback(_.debounce((body, collection) => postData(body, collection), 500), []);

    //* update validation status
    useEffect(() => {
        const val = isPassFail ? valueBool : value;
        const stat = getValidationStatus(val, targets, isPassFail);
        setValidateStatus(stat);
    }, [value, valueBool, isPassFail, targets])

    const onCommentChange = e => {
        setComment(e.target.value);
        const body = {
            reCheckId: reCheckId ?? 0,
            checkSheetEntryId: entryId,
            value,
            valueBool,
            comment: e.target.value
        }
        debouncedPostData(body, reChecksCollection);
    }

    const onNumberChange = e => {
        setValue(e.target.value);
        const body = {
            reCheckId: reCheckId ?? 0,
            checkSheetEntryId: entryId,
            value: parseFloat(e.target.value),
            valueBool: null,
            comment
        }
        debouncedPostData(body, reChecksCollection);
    }

    const onPassFailChange = value => {
        setValueBool(value);
        const body = {
            reCheckId: reCheckId ?? 0,
            checkSheetEntryId: entryId,
            value: null,
            valueBool: value,
            comment
        }
        postData(body, reChecksCollection);
    }

    const remove = () => {

        const removeItem = (id) => {
            const newArr = reChecksCollection.filter(({ reCheckId }) => reCheckId !== id)
            setReChecksCollection(newArr)
        }

        if (reCheckId > 0) {
            setDeleteLoading(true);
            setErrMsg(null);
            api.delete(`/quality/checksheets/rechecks/${reCheckId}`)
                .then(response => {
                    message.success('Successfully deleted!')
                    removeItem(reCheckId);
                    getCheckSheetEntry();
                })
                .catch(err => setErrMsg(err.message))
                // .finally(() => setDeleteLoading(false))
        } else {
            removeItem();
        }

    }

    return  <Col span={24}>

                <Row gutter={[12,12]}>

                    <Col span={1} className="v-mid">
                        {
                            deleteLoading ? <Spin /> : <CloseOutlined onClick={remove} />
                        }
                    </Col>

                    <Col span={7}>
                        <Form.Item hasFeedback validateStatus={validateStatus} className="mb0">
                            {
                                !isPassFail 
                                    ?   <InputNumber style={{ width: '100%' }} 
                                            placeholder="Enter Re-Check Value" 
                                            type="number" 
                                            onKeyUp={onNumberChange} 
                                            value={value} />

                                    :   <Select style={{ width: '100%' }} 
                                            allowClear={true} 
                                            onChange={onPassFailChange} 
                                            placeholder="Select Re-Check Value" 
                                            value={valueBool} >
                                            <Option value={true}>Pass</Option>
                                            <Option value={false}>Fail</Option>
                                        </Select>
                            }
                        </Form.Item>
                    </Col>

                    <Col span={7}>
                        <TextArea placeholder="Enter Comments" autoSize={true} onChange={onCommentChange} value={comment} />
                    </Col>

                    <Col span={9}>
                            {
                                loading ? <span><Spin/> Saving...</span> : <Text>{!timeStamp ? null : moment(timeStamp).format('lll')}</Text>
                            }
                    </Col>

                </Row>

                {
                    errMsg 
                    ?   <Row gutter={[12,12]}>
                            <Col span={1}></Col>
                            <Col span={23}>
                                <span className="red">{errMsg}</span>
                            </Col>
                        </Row>
                    : null
                }
    
            </Col>

}

const mapDispatchToProps = dispatch => ({
    setReChecksCollection: items => dispatch(setReChecksCollection(items)),
    setCheckSheetValues: items => dispatch(setCheckSheetValues(items))
});

const mapStateToProps = ({ qualityCheckSheet }) => ({
    reChecksCollection: qualityCheckSheet.reChecksCollection,
    checkSheetValues: qualityCheckSheet.checkSheetValues
})

export default connect(mapStateToProps, mapDispatchToProps)(ReCheckInput);