import React, { useCallback, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { useParams  } from 'react-router-dom'
import api from '../../../core/utilities/api'
import _ from 'lodash'

import ReCheckModal from './re-check-modal.component'
import CheckSheetPopOverInfo from './check-sheet-pop-over-info.compoent'
import CommentModal from './comment-modal.component'

import {
    setReChecksCollection,
    setCheckSheetValues,
    setCheckSheetEntry
} from '../../../core/redux/quality-check-sheet/quality-check-sheet.actions.js'

import {
    getTargets,
    getValidationStatus,
    focusOnNextRow,
    getInputId,
    isKeyboardNavKeys
} from '../../../core/utilities/check-sheet-helpers'

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
    isRechecked: false,
    popOverTrigger: 'focus',
    checkSheetEntryId: 0
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
        case 'SET_POP_OVER_TRIGGER':        
            return { ...state, popOverTrigger: action.payload }
        case 'SET_CHECK_SHEET_ENTRY_ID':        
            return { ...state, checkSheetEntryId: action.payload }
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
    checkSheetValues,
    csCharacteristicsCollection,
    isCheckSheetReadOnly
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
    }, [item]);

    //* post entry
    const postData = (body, entries) => {

        const key = `${record.characteristicId}_${frequency}`;
        message.loading({ content: 'Saving...', key });
        api.post('/quality/checksheets/checksheetentry', body)
            .then(response => { 

                const data = response.data;
                const { status, result } = data;

                switch (status) {
                    case 0: //* null entry, dont do anything
                        
                        break;

                    case 1: //* delete, remove item in store
                        
                        message.warn({
                            content: `Entry removed at ${record.value}, Hour # ${frequency}.`,
                            key,
                            duration: 10
                        });

                        setCheckSheetEntry(result, entries, status);

                        break;

                    case 2: //* add/update item in store

                        const { value, valueBool } = result;
                        const val = isPassFail ? (valueBool ? 'Pass' : 'Fail') : value;

                        message.success({
                            content: `Entered '${val}' at ${record.value}, Hour # ${frequency} successfully saved!`,
                            key,
                            duration: 10
                        });

                        setCheckSheetEntry(result, entries, status);
                        
                        break;
                
                    default:
                        break;
                }


            })
            .catch(err => message.error(`Error: ${record.value} frequency ${frequency} => ${err.message}`, 20)) 

    }

    //* efect for pop over trigger
    useEffect(() => {
        dispatch({ type: 'SET_POP_OVER_TRIGGER', payload: state.dot ? 'hover' : 'focus' })
    }, [state.dot])

    //* debounse post when typing
    const debouncedPostData = useCallback(_.debounce((body, entries) => postData(body, entries), 1000), []);

    //* entries
    const onInputNumberKeyUp = e => {

        //* check if key code is 13 or enter key, if not save entry else just go to next row
        if (isKeyboardNavKeys(e)) {

            const value = e.target.value;
            dispatch({ type: 'SET_VALUE', payload: value});
            updateStatus(value);
    
            const { characteristicId } = record;
    
            debouncedPostData({
                checkSheetId,
                subMachineId: checkSheetSubMachine,
                characteristicId,
                part: checkSheetPart,
                frequency,
                value: parseFloat(value),
                valueBool: null,
                comment: item?.comment,
                isReChecked: item?.isReChecked ?? false,
                checkSheetEntryId: item?.checkSheetEntryId ?? 0
            }, checkSheetValues);

        } else {
            focusOnNextRow(e, csCharacteristicsCollection, record, frequency)
        }

    }

    const onPassFailChange = value => {

        dispatch({ type: 'SET_VALUE', payload: value});
        updateStatus(value);

        const { characteristicId } = record;

        postData({
            checkSheetId,
            subMachineId: checkSheetSubMachine,
            characteristicId,
            part: checkSheetPart,
            frequency,
            value: null,
            valueBool: value,
            comment: item?.comment,
            isReChecked: item?.isReChecked ?? false,
            checkSheetEntryId: item?.checkSheetEntryId ?? 0
        }, checkSheetValues);
        
    }

    const onKeyUpPassFail = e => focusOnNextRow(e, csCharacteristicsCollection, record, frequency);

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
                        trigger={isCheckSheetReadOnly ? 'hover' : state.popOverTrigger}
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

                            ?   <Select id={getInputId(record?.characteristicId, frequency)}
                                    style={{ width: '100%' }} 
                                    allowClear={true} 
                                    onChange={onPassFailChange}
                                    onKeyUp={onKeyUpPassFail}
                                    disabled={isDisabled || state.isRechecked} 
                                    value={state.val} >
                                        <Option value={true}>Pass</Option>
                                        <Option value={false}>Fail</Option>
                                </Select>

                            :   <InputNumber type="number" 
                                    id={getInputId(record?.characteristicId, frequency)} 
                                    style={{ width: '100%' }} 
                                    disabled={isDisabled || state.isRechecked} 
                                    onKeyUp={onInputNumberKeyUp} 
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
    setCheckSheetEntry: (checkSheetEntry, checkSheetValues, status) => dispatch(setCheckSheetEntry(checkSheetEntry, checkSheetValues, status))
});

const mapStateToProps = ({qualityCheckSheet}) => ({
    checkSheetSubMachine: qualityCheckSheet.checkSheetSubMachine,
    checkSheetPart: qualityCheckSheet.checkSheetPart,
    checkSheetValues: qualityCheckSheet.checkSheetValues,
    csCharacteristicsCollection: qualityCheckSheet.csCharacteristicsCollection,
    isCheckSheetReadOnly: qualityCheckSheet.isCheckSheetReadOnly
})

export default connect(mapStateToProps, mapDispatchToProps)(CheckSheetInput);