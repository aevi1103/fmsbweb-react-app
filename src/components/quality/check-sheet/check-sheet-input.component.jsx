import React, { useCallback, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { useParams  } from 'react-router-dom'
import api from '../../../API'
import _ from 'lodash'

import ReCheckModal from './re-check-modal.component'
import CheckSheetPopOverInfo from './check-sheet-pop-over-info.compoent'

import {
    setReChecksCollection
} from '../../../redux/quality-check-sheet/quality-check-sheet.actions.js'

import {
    getTargets,
    getValidationStatus
} from '../../../helpers/check-sheet-helpers'

import {
    InputNumber,
    Form,
    message,
    Input,
    Modal,
    Button,
    Badge,
    Popover,
    Select
} from 'antd'

const { TextArea } = Input;
const { Option } = Select;

const initialState = {

    validateStatus: null,
    modalVisible: false,
    modalVisibleReCheck: false,

    item: null,
    val: null,
    dot: false,
}

const reducer = (state = initialState, action) => {
    
    switch (action.type) {

        case 'SET_VALIDATE_STATUS':        
            return { ...state, validateStatus: action.payload }
        case 'SET_MODAL_VISIBLE':        
            return { ...state, modalVisible: action.payload }
        case 'SET_MODAL_VISIBLE_RECHECK':        
            return { ...state, modalVisibleReCheck: action.payload }

        case 'SET_ITEM':        
            return { ...state, item: action.payload }
            
        case 'SET_DOT':        
            return { ...state, dot: action.payload }
        case 'SET_VALUE':        
            return { ...state, val: action.payload }

        default:
            break;
    }

}

const CheckSheetInput = ({
    isDisabled,
    record,
    frequency,
    isPassFail = false,  
    item,
    checkSheetSubMachine,
    checkSheetPart
}) => {

    const { checkSheetId } = useParams();
    const [form] = Form.useForm();
    const [state, dispatch] = useReducer(reducer, initialState);

    const updateStatus = useCallback((value) => {
        const stat = getValidationStatus(value, getTargets(record), isPassFail);
        dispatch({ type: 'SET_VALIDATE_STATUS', payload: stat })
    } ,[record, isPassFail])

    // * update input status
    useEffect(() => {
        
        const value = isPassFail ? item?.valueBool : item?.value;
        dispatch({ type: 'SET_VALUE', payload: value ?? null});
        updateStatus(value);

    }, [item, updateStatus, record, checkSheetPart, isPassFail])

    // * set initial values
    useEffect(() => {

        dispatch({ type: 'SET_ITEM', payload: item });

        const isDot = (item?.comment ? true : false) || (item?.rechecks.length ?? [])> 0 ? true : false
        dispatch({ type: 'SET_DOT', payload: isDot });

        const value = isPassFail ? item?.valueBool : item?.value;
        dispatch({ type: 'SET_VALUE', payload: value ?? null});

    }, [item, checkSheetSubMachine, checkSheetPart, isPassFail])

    const postData = body => {

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

                dispatch({ type: 'SET_ITEM', payload: data });

            })
            .catch(err => message.error(`Error: ${record.value} frequency ${frequency} => ${err.message}`, 20)) 

    }

    const debouncedPostData = useCallback(_.debounce(body => postData(body), 500), []);
    const onSubmitComment = () => form.submit();

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
            comment: state.item?.comment,
            isReChecked: state.item?.isReChecked ?? false
        };

        if (isPassFail) {
            postData(body);
        } else {
            debouncedPostData(body);
        }
        
    }

    const onOpenModal = () => {
        dispatch({ type: 'SET_MODAL_VISIBLE', payload: true});
        form.setFieldsValue({
            comment: state.item?.comment
        });  
    }

    const onCloseModal = () => {
        dispatch({ type: 'SET_MODAL_VISIBLE', payload: false});
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
            value: isPassFail ? null : parseFloat(state.val),
            valueBool: isPassFail ? state.val : null,
            comment
        }

        api.post('/quality/checksheets/checksheetentry', body)
        .then(response => { 

            const data = response.data;
            dispatch({ type: 'SET_ITEM', payload: data });
        
            if (comment.length > 0) {
                dispatch({ type: 'SET_DOT', payload: true });
            }

            message.success('Comment Added');
            dispatch({ type: 'SET_MODAL_VISIBLE', payload: false});   
        })
        .catch(err => message.error(`Error: ${record.value} frequency ${frequency} => ${err.message}`, 20))

    }

    //re-checks
    const onOpenReCheckModal = () => {
        dispatch({ type: 'SET_MODAL_VISIBLE_RECHECK', payload: true });

        
    }
    const onCloseReCheckModal = () => dispatch({ type: 'SET_MODAL_VISIBLE_RECHECK', payload: false });

    return (
        <React.Fragment>

            <Badge dot={state.dot} className="db">
                <Form.Item hasFeedback validateStatus={state.validateStatus} className="mb0">
                    <Popover title={record.value} trigger="hover" content={<CheckSheetPopOverInfo 
                                                                                isPassFail={isPassFail} 
                                                                                targets={getTargets(record)}
                                                                                state={state}
                                                                                onOpenModal={onOpenModal}
                                                                                onOpenReCheckModal={onOpenReCheckModal} />} >

                        {
                            isPassFail
                            ?   <Select style={{ width: '100%' }} allowClear={true} onChange={onChange} disabled={isDisabled} value={state.val} >
                                    <Option value={true}>Pass</Option>
                                    <Option value={false}>Fail</Option>
                                </Select>
                            :   <InputNumber type="number" style={{ width: '100%' }} disabled={isDisabled} onKeyUp={onChange} value={state.val} />
                        }
                        
                    </Popover>
                </Form.Item>
            </Badge>

            <Modal
                title={`Comment: ${record.value}`}
                visible={state.modalVisible}
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

            <ReCheckModal  
                visible={state.modalVisibleReCheck} 
                onCloseModal={onCloseReCheckModal}
                checkSheetEntryId={state.item?.checkSheetEntryId}
                characteristic={record.value}
                isPassFail={isPassFail}
                targets={getTargets(record)} />

        </React.Fragment>
    )
}

const mapDispatchToProps = dispatch => ({
    setReChecksCollection: items => dispatch(setReChecksCollection(items))
});

const mapStateToProps = ({qualityCheckSheet}) => ({
    checkSheetSubMachine: qualityCheckSheet.checkSheetSubMachine,
    checkSheetPart: qualityCheckSheet.checkSheetPart,
})

export default connect(mapStateToProps, mapDispatchToProps)(CheckSheetInput);