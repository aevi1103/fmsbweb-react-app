import React, { useState, useCallback, useEffect } from 'react'
import { CloseOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import api from '../../../API'
import _ from 'lodash'
import moment from 'moment';
import {
    getValidationStatus,
    getCheckSheetEntry
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

    const setCheckSheetEntry = async (data) => {
        const {checkSheetEntry, reCheck: { checkSheetEntryId } } = data;
        const newArr = checkSheetValues.filter(i => i.checkSheetEntryId !== checkSheetEntryId);
        newArr.push(checkSheetEntry);
        setCheckSheetValues(newArr);
    }

    const postData = async (body, collection) => {

        try {
            
            setLoading(true);
            setErrMsg(null);
            const response = await api.post(`/quality/checksheets/rechecks`, body);

            const data =  response.data;
            const { reCheck  } = data;
            const { reCheckId, timeStamp } = reCheck

            setReCheckId(reCheckId);
            setTimeStamp(timeStamp);

            //* update state
            const newArr = collection.map(i => {
                if (i.key === item.key) return { ...reCheck, key: item.key }
                return i;
            });

            setReChecksCollection(newArr);
            setCheckSheetEntry(data);

            message.success(`Successfully Saved!`);

        } catch (error) {
            setErrMsg(error);
        } finally {
            setLoading(false);
        }

    }

    const debouncedPostData = useCallback(_.debounce((body, collection) => postData(body, collection), 800), []);

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

    const remove = async () => {

        const removeItem = () => {
            const newArr = reChecksCollection.filter(({ key }) => key !== item.key)
            setReChecksCollection(newArr)
        }

        if (reCheckId > 0) {
            setDeleteLoading(true);
            setErrMsg(null);

            try {
                
                const response =  await api.delete(`/quality/checksheets/rechecks/${reCheckId}`);
                const data = response.data;

                message.success('Successfully deleted!')
                removeItem();
                setCheckSheetEntry(data);

            } catch (error) {
                setErrMsg(error)
            }

        } else {
            removeItem();
        }

    }

    return  <Col span={24}>

                <Row gutter={[12,12]}>

                    <Col span={1} className="v-mid">
                        {
                            deleteLoading 
                                ? <Spin /> 
                                : !item.isInitialValue
                                    ? <CloseOutlined onClick={remove} />
                                    : null
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
                                            disabled={item.isInitialValue}
                                            value={value} />

                                    :   <Select style={{ width: '100%' }} 
                                            allowClear={true} 
                                            onChange={onPassFailChange} 
                                            placeholder="Select Re-Check Value" 
                                            disabled={item.isInitialValue}
                                            value={valueBool} >
                                            <Option value={true}>Pass</Option>
                                            <Option value={false}>Fail</Option>
                                        </Select>
                            }
                        </Form.Item>
                    </Col>

                    <Col span={7}>
                        <TextArea placeholder="Enter Comments" 
                            autoSize={true} 
                            onChange={onCommentChange} 
                            value={comment} 
                            disabled={item.isInitialValue} />
                    </Col>

                    <Col span={9}>
                            {
                                loading 
                                    ?   <span><Spin/> Saving...</span> 
                                    :   <React.Fragment>
                                            <Text>{ !timeStamp ? null : moment(timeStamp).format('lll') }</Text> 
                                            { item.isInitialValue ? <small className="ml2">(1st Check)</small> : null }
                                        </React.Fragment> 
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