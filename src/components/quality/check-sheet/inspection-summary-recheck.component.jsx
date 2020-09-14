import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { connect } from 'react-redux'
import api from '../../../API'
import _ from 'lodash'
import moment from 'moment'

import ToloranceBar from './tolerance-bar.component'

import {
    getTargets,
    getValidationStatus,
    focusOnNextRow,
    getInputId,
    isKeyboardNavKeys
} from '../../../helpers/check-sheet-helpers'

import {
    setReChecksCollection,
    setCheckSheetEntry
} from '../../../redux/quality-check-sheet/quality-check-sheet.actions.js'

import {
    InputNumber,
    Form,
    message,
    Badge,
    Popover,
    Select,
    Modal,
    Row,
    Col,
    Input,
    Button
} from 'antd'

const { TextArea } = Input;
const { Option } = Select;

const initialState = {
    validateStatus : null,
    dot: false,
    val: null,
    recheckDisabled: false,
    reCheckId: 0,
    reCheck: null,
    loading: false,
    error: null,
    modalVisible: false
}

const reducer = (state = initialState, action) => {
    
    switch (action.type) {
        case 'SET_VALIDATE_STATUS':        
            return { ...state, validateStatus: action.payload }
        case 'SET_DOT':        
            return { ...state, dot: action.payload }
        case 'SET_VALUE':        
            return { ...state, val: action.payload }
        case 'SET_RECHECK_DISABLE':        
            return { ...state, recheckDisabled: action.payload }
        case 'SET_LOADING':        
            return { ...state, loading: action.payload }
        case 'SET_ERROR':        
            return { ...state, error: action.payload }
        case 'SET_RE_CHECK':        
            return { ...state, reCheck: action.payload }
        case 'SET_MODAL_VISIBLE':        
            return { ...state, modalVisible: action.payload }
        default:
            return state;
    }

}

const InspectionSummaryReCheckInput = ({
    isPassFail,
    item,
    frequency,
    record,
    isDisabled,

    setCheckSheetEntry,
    checkSheetValues,

    checkSheetSubMachine,
    checkSheetPart,
    csCharacteristicsCollection,
    isCheckSheetReadOnly
}) => {

    const [form] = Form.useForm()
    const [state, dispatch] = useReducer(reducer, initialState);

    const updateStatus = useCallback((value) => {
        const stat = getValidationStatus(value, getTargets(record), isPassFail);
        dispatch({ type: 'SET_VALIDATE_STATUS', payload: stat })
    } ,[record, isPassFail])

    //* efects for disabling recheck inputs
    useEffect(() => {
        if (!item?.checkSheetEntryId) {
            dispatch({ type: 'SET_RECHECK_DISABLE', payload: false });
        } else {
            dispatch({ type: 'SET_RECHECK_DISABLE', payload: true });
        }
    }, [item]);

    //* effects when setting value on init and status color
    useEffect(() => {

        const rechecks = item?.rechecks.sort((a,b) => a.reCheckId - b.reCheckId) ?? [];
        const freq = frequency - 2;
        const reCheck = rechecks[freq]
        dispatch({ type: 'SET_RE_CHECK', payload: reCheck })

        const { value, valueBool, comment } = reCheck || {};
        const val = isPassFail ? valueBool : value;
        dispatch({ type: 'SET_VALUE', payload: val });

        const dot = (comment ?? '').length > 0 ? true : false;
        dispatch({ type: 'SET_DOT', payload: dot});

        //* update status
        updateStatus(val);

    }, [item, record, frequency, isPassFail, updateStatus, checkSheetSubMachine, checkSheetPart])

    const postData = async (body, values, fnSuccess = () => {}) => {

        try {
            
            const key = `${record.characteristicId}_${frequency}`;
            message.loading({ content: 'Saving...', key });
            dispatch({ type: 'SET_LOADING', payload: true });

            const response = await api.post(`/quality/checksheets/rechecks`, body);
    
            const data =  response.data;
            const { status, result } = data;
            const { reCheck, checkSheetEntry } = result || {};
            const { value, valueBool } = reCheck || {};
            const val = isPassFail ? (valueBool ? 'Pass' : 'Fail') : value;

            switch (status) {

                case 0: // * null entry, dont do anything
                    
                    break;

                case 1: //* delete, remove item in store
                    
                    dispatch({ type: 'SET_VALUE', payload: null });
                    setCheckSheetEntry(checkSheetEntry, values, 2);

                    message.warn({
                        content: `Entry removed at ${record.value}, Recheck # ${frequency - 1}.`,
                        key,
                        duration: 10
                    });
                
                    break;

                case 2://* add/update item in store
                    
                    dispatch({ type: 'SET_VALUE', payload: isPassFail ? valueBool : value });
                    setCheckSheetEntry(checkSheetEntry, values, 2);
                    fnSuccess(result);

                    message.success({
                        content: `Enterd '${val}' at ${record.value}, Recheck # ${frequency - 1} successfully saved!`,
                        key,
                        duration: 10
                    });

                    break;
            
                default:
                    break;
            }

        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error });
            message.error(`Unabe to save recheck entry please make sure you entered your '1st check' firstr.`, 10)
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }

    }

    const debouncedPostData = useCallback(_.debounce((body, values) => postData(body, values), 1000), []);

    const onNumberChange = e => {

        if (isKeyboardNavKeys(e)) {
            debouncedPostData({     
                reCheckId: state.reCheck?.reCheckId ?? 0,
                checkSheetEntryId: item?.checkSheetEntryId ?? 0,
                value: parseFloat(e.target.value),
                valueBool: null,
                comment: state.reCheck?.comment
            }, checkSheetValues);
        } else {
            focusOnNextRow(e, csCharacteristicsCollection, record, frequency);
        }
    }

    const passFailChange = value => {

        postData({
            reCheckId: state.reCheck?.reCheckId ?? 0,
            checkSheetEntryId: item?.checkSheetEntryId ?? 0,
            value: null,
            valueBool: value,
            comment: state.reCheck?.comment
        }, checkSheetValues);

    }

    const onKeyUpPassFail = e => focusOnNextRow(e, csCharacteristicsCollection, record, frequency);

    const onBtnCommentClick = () => {
        dispatch({ type: 'SET_MODAL_VISIBLE', payload: true});
        form.setFieldsValue({
            comment: state.reCheck?.comment
        });  
    }
    const onCommentModalClose = () => dispatch({ type: 'SET_MODAL_VISIBLE', payload: false});

    const onFinish = values => {

        const body = {
            reCheckId: state.reCheck?.reCheckId ?? 0,
            checkSheetEntryId: item?.checkSheetEntryId ?? 0,
            value: isPassFail ? null : parseFloat(state.val),
            valueBool: !isPassFail ? null : state.val,
            comment: values.comment
        }

        const fnSuccess = data => {
            const { reCheck } = data;
            dispatch({ type: 'SET_RE_CHECK', payload: reCheck })
            dispatch({ type: 'SET_MODAL_VISIBLE', payload: false});
        }

        postData(body, checkSheetValues, fnSuccess);
    }

    const onSubmitComment = () => form.submit();

    return (
        <>
            <Badge dot={state.dot} className="db">
                <Form.Item hasFeedback validateStatus={state.validateStatus} className="mb0">
                    <Popover 
                        title={`Recheck ${frequency - 1}: ${record.value}`} 
                        trigger={isCheckSheetReadOnly ? 'hover' : 'focus'}
                        content={<Row gutter={[12,12]} style={{width: '300px'}}>
                                    <ToloranceBar isPassFail={isPassFail} targets={getTargets(record)} />

                                    {
                                        !state.reCheck?.comment
                                        ?   null 
                                        :   <Col span={24}>
                                                <b className="db">Comment:</b>
                                                <p>{state.reCheck?.comment}</p>
                                            </Col>
                                    }

                                    {
                                        state.reCheck?.timeStamp
                                        ? <Col span={24}>
                                            <b className="db">Last Updated:</b>
                                            <span>{moment(state.reCheck?.timeStamp).format('lll')}</span>
                                        </Col>
                                        : null
                                    }

                                    <Col span={24}>
                                        {
                                            isCheckSheetReadOnly 
                                                ?   <Button type="primary" onClick={onBtnCommentClick}>View Comment</Button> 
                                                :   item?.checkSheetEntryId
                                                        ? <Button type="primary" onClick={onBtnCommentClick}>{ state.reCheck?.comment ? 'Edit' : 'Add' } Comment</Button> 
                                                        : null
                                        }
                                    </Col>

                                </Row>} 
                        >

                        {
                            isPassFail

                            ?   <Select id={getInputId(record?.characteristicId, frequency)}
                                    style={{ width: '100%' }} 
                                    allowClear={true} 
                                    onChange={passFailChange}
                                    onKeyUp={onKeyUpPassFail}
                                    disabled={isDisabled || !state.recheckDisabled} 
                                    value={state.val} >
                                    <Option value={true}>Pass</Option>
                                    <Option value={false}>Fail</Option>
                                </Select>

                            :   <InputNumber type="number" 
                                    id={getInputId(record?.characteristicId, frequency)}
                                    style={{ width: '100%' }} 
                                    disabled={isDisabled || !state.recheckDisabled} 
                                    onKeyUp={onNumberChange} 
                                    value={state.val} />
                        }
                        
                    </Popover>
                </Form.Item>
            </Badge> 

            <Modal 
                title="Recheck Comment"
                visible={state.modalVisible}
                onCancel={onCommentModalClose}
                footer={[
                    <Button key="back" onClick={onCommentModalClose}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={onSubmitComment} disabled={isCheckSheetReadOnly}>
                        Submit
                    </Button>,
                ]}>

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
                            <TextArea rows="6" allowClear placeholder="Enter comments..." disabled={isCheckSheetReadOnly} />
                        </Form.Item>
                    </Form>

            </Modal>
        </>
        
    )

}

const mapDispatchToProps = dispatch => ({
    setReChecksCollection: items => dispatch(setReChecksCollection(items)),
    setCheckSheetEntry: (checkSheetEntry, checkSheetValues, status) => dispatch(setCheckSheetEntry(checkSheetEntry, checkSheetValues, status))
});

const mapStateToProps = ({ qualityCheckSheet }) => ({
    reChecksCollection: qualityCheckSheet.reChecksCollection,
    checkSheetValues: qualityCheckSheet.checkSheetValues,
    checkSheetSubMachine: qualityCheckSheet.checkSheetSubMachine,
    checkSheetPart: qualityCheckSheet.checkSheetPart,
    csCharacteristicsCollection: qualityCheckSheet.csCharacteristicsCollection,
    isCheckSheetReadOnly: qualityCheckSheet.isCheckSheetReadOnly
})


export default connect(mapStateToProps, mapDispatchToProps)(InspectionSummaryReCheckInput)