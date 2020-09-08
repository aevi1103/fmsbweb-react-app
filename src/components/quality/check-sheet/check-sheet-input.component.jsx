import React, { useCallback, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { useParams  } from 'react-router-dom'
import api from '../../../API'
import _ from 'lodash'

import ReCheckModal from './re-check-modal.component'
import CheckSheetPopOverInfo from './check-sheet-pop-over-info.compoent'
import CommentModal from './comment-modal.component'

import {
    setReChecksCollection,
    setCheckSheetValues,
    setCheckSheetEntry
} from '../../../redux/quality-check-sheet/quality-check-sheet.actions.js'

import {
    getTargets,
    getValidationStatus
} from '../../../helpers/check-sheet-helpers'

import {
    InputNumber,
    Form,
    message,
    Badge,
    Popover,
    Select
} from 'antd'

const { Option } = Select;

const initialState = {
    validateStatus: null,
    modalVisible: false,
    modalVisibleReCheck: false,

    val: null,
    dot: false,
    isRechecked: false
}

const reducer = (state = initialState, action) => {
    
    switch (action.type) {
        case 'SET_VALIDATE_STATUS':        
            return { ...state, validateStatus: action.payload }
        case 'SET_MODAL_VISIBLE':        
            return { ...state, modalVisible: action.payload }
        case 'SET_MODAL_VISIBLE_RECHECK':        
            return { ...state, modalVisibleReCheck: action.payload }

        case 'SET_DOT':        
            return { ...state, dot: action.payload }
        case 'SET_VALUE':        
            return { ...state, val: action.payload }
        case 'SET_IS_RECHECKED':        
            return { ...state, isRechecked: action.payload }
        default:
            return state;
    }

}

const CheckSheetInput = ({
    isDisabled,
    record,
    frequency,
    isPassFail = false,  
    item,

    setCheckSheetValues,
    setCheckSheetEntry,
    checkSheetSubMachine,
    checkSheetPart,
    checkSheetValues
}) => {

    const { checkSheetId } = useParams();
    const [state, dispatch] = useReducer(reducer, initialState);

    const updateStatus = useCallback((value) => {
        const stat = getValidationStatus(value, getTargets(record), isPassFail);
        dispatch({ type: 'SET_VALIDATE_STATUS', payload: stat })
    } ,[record, isPassFail])

    // * effects for set dot
    useEffect(() => {
        const isDot = (item?.comment ? true : false) || (item?.rechecks.length ?? [])> 0 ? true : false
        dispatch({ type: 'SET_DOT', payload: isDot });
    }, [item, checkSheetSubMachine, checkSheetPart, isPassFail])

    //* effects for inputs
    useEffect(() => {
        const value = isPassFail ? item?.valueBool : item?.value;
        dispatch({ type: 'SET_VALUE', payload: value ?? null});
        updateStatus(value);
    }, [item, record, checkSheetSubMachine, checkSheetPart, isPassFail, updateStatus])

    //* listen if rechecked is true then disable input
    useEffect(() => {
        const isRechecked = (item?.rechecks ?? []).length > 0 ? true : false;
        dispatch({ type: 'SET_IS_RECHECKED', payload: isRechecked })
    }, [item])

    //* post entry
    const postData = (body, entries) => {

        const key = `${record.characteristicId}_${frequency}`;
        message.loading({ content: 'Saving...', key });
        api.post('/quality/checksheets/checksheetentry', body)
            .then(response => { 

                const data = response.data;
                const { value } = data;
                message.success({
                    content: `Value of '${value}' saved for ${record.value} Frequency ${frequency}.`,
                    key,
                    duration: 10
                });

                setCheckSheetEntry(data, entries);

            })
            .catch(err => message.error(`Error: ${record.value} frequency ${frequency} => ${err.message}`, 20)) 

    }

    //* debounse post when typing
    const debouncedPostData = useCallback(_.debounce((body, entries) => postData(body, entries), 1000), []);

    //* entries
    const onChange = (e) => {

        const value = isPassFail ? e : e.target.value;
        dispatch({ type: 'SET_VALUE', payload: value});
        updateStatus(value);

        const { characteristicId } = record;

        const body = {
            checkSheetId,
            subMachineId: checkSheetSubMachine,
            characteristicId,
            part: checkSheetPart,
            frequency,
            value: isPassFail ? null : parseFloat(value),
            valueBool: isPassFail ? value : null,
            comment: item?.comment,
            isReChecked: item?.isReChecked ?? false
        };

        if (isPassFail) {
            postData(body, checkSheetValues);
        } else {
            debouncedPostData(body, checkSheetValues);
        }
        
    }

    //* comments
    const onOpenCommentModal = () => {
        dispatch({ type: 'SET_MODAL_VISIBLE', payload: true});
    }

    //* re-checks
    const onOpenReCheckModal = async () => {

        try {
            
            const response = await api.post('/quality/checksheets/checksheetentry/initialRecheck', {
                reCheckId: 0,
                checkSheetEntryId: item?.checkSheetEntryId ?? 0,
                value: isPassFail ? null : parseFloat(state.val),
                valueBool: !isPassFail ? null : state.val,
                comment: null,
                isInitialValue: true
            })

            const data = response.data;
            if (data) {
                const newArr = checkSheetValues.filter(i => i.checkSheetEntryId !== data.checkSheetEntryId);
                newArr.push(data);
                setCheckSheetValues(newArr)

                message.success({
                    content: `Re-Check added for ${record.value} Frequency ${frequency}.`,
                    duration: 10
                });
            }

        } catch (error) {
            message.error(`Error: ${record.value} frequency ${frequency} => ${error.message}`, 20)
        } finally {
            dispatch({ type: 'SET_MODAL_VISIBLE_RECHECK', payload: true });
        }

    }
    
    const onCloseReCheckModal = () => dispatch({ type: 'SET_MODAL_VISIBLE_RECHECK', payload: false });

    return (
        <>
            <Badge dot={state.dot} className="db">
                <Form.Item hasFeedback validateStatus={state.validateStatus} className="mb0">
                    <Popover 
                        title={record.value} 
                        trigger="hover" 
                        content={<CheckSheetPopOverInfo 
                                    isPassFail={isPassFail} 
                                    targets={getTargets(record)}
                                    value={state.val}
                                    dot={state.dot}
                                    validateStatus={state.validateStatus}
                                    item={item}
                                    onOpenCommentModal={onOpenCommentModal}
                                    onOpenReCheckModal={onOpenReCheckModal} />} >

                        {
                            isPassFail

                            ?   <Select 
                                    style={{ width: '100%' }} 
                                    allowClear={true} 
                                    onChange={onChange}
                                    disabled={isDisabled || state.isRechecked} 
                                    value={state.val} >
                                    <Option value={true}>Pass</Option>
                                    <Option value={false}>Fail</Option>
                                </Select>

                            :   <InputNumber type="number" 
                                    style={{ width: '100%' }} 
                                    disabled={isDisabled || state.isRechecked} 
                                    onKeyUp={onChange} 
                                    value={state.val} />
                        }
                        
                    </Popover>
                </Form.Item>
            </Badge>
            
            <CommentModal
                record={record}
                visible={state.modalVisible}
                frequency={frequency}
                isPassFail={isPassFail}
                value={state.val}
                item={item}
                dispatch={dispatch}
            />

            <ReCheckModal  
                visible={state.modalVisibleReCheck} 
                onCloseModal={onCloseReCheckModal}
                checkSheetEntryId={item?.checkSheetEntryId}
                characteristic={record.value}
                isPassFail={isPassFail}
                targets={getTargets(record)} />
        </>
    )
}

const mapDispatchToProps = dispatch => ({
    setReChecksCollection: items => dispatch(setReChecksCollection(items)),
    setCheckSheetValues: items => dispatch(setCheckSheetValues(items)),
    setCheckSheetEntry: (checkSheetEntry, checkSheetValues) => dispatch(setCheckSheetEntry(checkSheetEntry, checkSheetValues))
});

const mapStateToProps = ({qualityCheckSheet}) => ({
    checkSheetSubMachine: qualityCheckSheet.checkSheetSubMachine,
    checkSheetPart: qualityCheckSheet.checkSheetPart,
    checkSheetValues: qualityCheckSheet.checkSheetValues
})

export default connect(mapStateToProps, mapDispatchToProps)(CheckSheetInput);