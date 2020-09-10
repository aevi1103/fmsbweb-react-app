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
    setCheckSheetEntry
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
    setCheckSheetEntry
}) => {

    const [validateStatus, setValidateStatus] = useState(null);
    const [entryId] = useState(checkSheetEntryId);
    const [value, setValue] = useState(item.value);

    const [valueBool, setValueBool] = useState(item.valueBool);
    const [comment, setComment] = useState(item.comment);
    const [timeStamp, setTimeStamp] = useState(item.timeStamp);
    const [reCheckId, setReCheckId] = useState(item.reCheckId);
    
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [errMsg, setErrMsg] = useState(null);

    const postData = async (body, reChecksCollection) => {

        try {
            
            const mapReCheckCollection = (reCheckCollection, reCheck) => reCheckCollection.map(i => {
                return i.key === item.key ? { ...reCheck, key: item.key } : i;
            });

            setLoading(true);
            setErrMsg(null);
            const key = `${body.reCheckId}_${body.checkSheetEntryId}_${isPassFail ? body.valueBool : body.value}`;

            message.loading({ content: 'Saving...', key })

            const response = await api.post(`/quality/checksheets/rechecks`, body);
            const data =  response.data;
            const { status, result } = data;

            const { reCheck, checkSheetEntry } = result || {};
            const { reCheckId, timeStamp } = reCheck || {}

            switch (status) {

                case 0: // * null entry, dont do anything
                    
                    message.error({
                        content: `Invalid Entry!`,
                        key,
                        duration: 10
                    });

                    setLoading(false);
                    break;

                case 1: //* delete, remove item in store
                    
                    setReCheckId(0);
                    setTimeStamp(null);

                    //* remove the deleted item from the collection
                    const items = reChecksCollection.filter(e => e.reCheckId !== reCheckId);
                    setReChecksCollection(mapReCheckCollection(items, reCheck));

                    //* always set to 2 or add/update because you dont want to delete the checksheet entry
                    setCheckSheetEntry(checkSheetEntry, checkSheetValues, 2);

                    message.warn({
                        content: `Entry Removed!`,
                        key,
                        duration: 10
                    });

                    break;

                case 2://* add/update item in store
                    
                    setReCheckId(reCheckId);
                    setTimeStamp(timeStamp);
        
                    //* update state
                    setReChecksCollection(mapReCheckCollection(reChecksCollection, reCheck));

                    //* always set to 2 or add/update because you dont want to delete the checksheet entry
                    setCheckSheetEntry(checkSheetEntry, checkSheetValues, 2);
        
                    message.success({
                        content: `Successfully Saved!`,
                        key,
                        duration: 10
                    });

                    setLoading(false);

                    break;
            
                default:
                    break;
            }

        } catch (error) {
            setErrMsg(error);
            setLoading(false);
        } 

    }

    const debouncedPostData = useCallback(_.debounce((body, collection) => postData(body, collection), 1000), []);

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
        debouncedPostData({
            reCheckId: reCheckId ?? 0,
            checkSheetEntryId: entryId,
            value: parseFloat(e.target.value),
            valueBool: null,
            comment
        }, reChecksCollection);
    }

    const onPassFailChange = value => {
        setValueBool(value);
        postData({
            reCheckId: reCheckId ?? 0,
            checkSheetEntryId: entryId,
            value: null,
            valueBool: value,
            comment
        }, reChecksCollection);
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
                const { result: { checkSheetEntry } } = data;

                message.success('Successfully deleted!')
                removeItem();

                 //* always set to 2 or add/update because you dont want to delete the checksheet entry
                setCheckSheetEntry(checkSheetEntry, checkSheetValues, 2);

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
    setCheckSheetEntry: (checkSheetEntry, checkSheetValues, status) => dispatch(setCheckSheetEntry(checkSheetEntry, checkSheetValues, status))
});

const mapStateToProps = ({ qualityCheckSheet }) => ({
    reChecksCollection: qualityCheckSheet.reChecksCollection,
    checkSheetValues: qualityCheckSheet.checkSheetValues
})

export default connect(mapStateToProps, mapDispatchToProps)(ReCheckInput);