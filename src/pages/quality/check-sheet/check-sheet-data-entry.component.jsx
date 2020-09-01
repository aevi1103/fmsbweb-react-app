import React, { useEffect, useReducer, useCallback, useState } from 'react'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import api from '../../../API'

import { 
    Layout,
    Spin,
    PageHeader,
    Tag,
    Alert,
    Radio,
    Row,
    Col,
    message
 } from "antd";

import {
    setCheckSheetPart,
    setCheckSheetSubMachine,
    setCheckSheetMachineName,
    setCheckSheetValues,
    setCheckSheet,
    fetchCsCharacteristicStartAsync
} from '../../../redux/quality-check-sheet/quality-check-sheet.actions'

import CheckSheetDataEntry from '../../../components/quality/check-sheet/check-sheet-data-entry.component'

const { Content } = Layout;

const initialState = {

    checkSheetLoading: false,
    checkSheetErrorMsg: null,

    checkSheetValuesLoading: false,
    checkSheetValuesErrorMsg: null,

    machinesLoading: false,
    machines: [],
    machinesCollection: [],
    machinesErrorMsg: null,
    
    title: '',
    subTitle: '',
    tags: null,
    
    parts: [],
    subMachines: [],
    
    machineId: null,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case 'SET_CHECK_SHEET_LOADING':
            return { ...state, checkSheetLoading: action.payload }
        case 'SET_CHECK_SHEET_ERROR_MSG':
            return { ...state, checkSheetErrorMsg: action.payload }

        case 'SET_CHECK_SHEET_VALUES_LOADING':
            return { ...state, checkSheetValuesLoading: action.payload }
        case 'SET_CHECK_SHEET_VALUES_ERROR_MSG':
            return { ...state, checkSheetValuesErrorMsg: action.payload }

        case 'SET_MACHINES_LOADING':
            return { ...state, machinesLoading: action.payload }
        case 'SET_MACHINES':
            return { ...state, machines: action.payload }
        case 'SET_MACHINES_COLLECTION':
            return { ...state, machinesCollection: action.payload }
        case 'SET_MACHINES_ERROR_MSG':
            return { ...state, machinesErrorMsg: action.payload }

        case 'SET_TITLE':
            return { ...state, title: action.payload }
        case 'SET_SUB_TITLE':
            return { ...state, subTitle: action.payload }

        case 'SET_SUB_SUBMACHINE':
            return { ...state, subMachine: action.payload }

        case 'SET_TAGS':
            return { tags: action.payload }      
        case 'SET_PARTS':
            return { ...state, parts: action.payload }

        case 'SET_SUB_MACHINES':
            return { ...state, subMachines: action.payload }

        case 'SET_MACHINE_ID':
            return { ...state, machineId: action.payload }
    
        default:
            return state;
    }
}

const CheckSheetDataEntryPage = ({
    setCheckSheetPart,
    setCheckSheetSubMachine,
    setCheckSheetMachineName,
    setCheckSheetValues,
    setCheckSheet,

    checkSheet,
    checkSheetPart,
    checkSheetSubMachine,
    checkSheetMachineName,

    fetchCsCharacteristicStartAsync
}) => {
    
    const { hash } = useLocation();
    const history = useHistory();
    const { controlId, controlName, lineId, checkSheetId } = useParams();
    const [state, dispatch] = useReducer(reducer, initialState);

    const getSubMachines = (machines, machineId) => {
        const { subMachines } = machines.find(e => e.machineId === machineId);
        return subMachines.map(({ subMachineId, value }) => ({ label: value, value: subMachineId }));
    }

    // todo: combine fetch of characteristics and values into one request.

    useEffect(() => {

        const getMachines = lineId => {

            dispatch({type: 'SET_MACHINES_LOADING', payload: true})
            api.get(`/quality/checksheets/machine?$filter=lineId eq ${lineId}&$expand=subMachines`)
                .then(response => {

                    const data = response.data;
                    dispatch({type: 'SET_MACHINES_COLLECTION', payload: data })

                    const machines = data.map(({ machineId, value, subMachines }) => ({ label: value, value: machineId }));
                    dispatch({type: 'SET_MACHINES', payload: machines })
                    
                    //* update sub-mahcines items
                    const { machineId } = data.find(({ value }) => value === checkSheetMachineName);
                    dispatch({type: 'SET_SUB_MACHINES', payload: getSubMachines(data, machineId) });

                })
                .catch(error => dispatch({type: 'SET_MACHINES_ERROR_MSG', payload: error.message}))
                .finally(() => dispatch({type: 'SET_MACHINES_LOADING', payload: false}))

        }

        //* get check sheet object
        dispatch({type: 'SET_CHECK_SHEET_LOADING', payload: true})
        api.get(`/quality/checksheets/checksheet?$expand=controlMethod,line,organizationPart&$filter=checkSheetId eq ${checkSheetId}`)
            .then(response => {

                const data = response.data[0];

                setCheckSheet(data);
                getMachines(data.lineId);

                dispatch({type: 'SET_TAGS', payload: data.organizationPart.part});
                dispatch({type: 'SET_PARTS', payload: data.organizationPart.parts});

                const { 
                    line,
                    shiftDate,
                    shift,
                    controlMethod: { method },
                } = data;
                
                dispatch({type: 'SET_TITLE', payload: `Line ${line.value} ${method}`});
                dispatch({type: 'SET_SUB_TITLE', payload: `Shift Date: ${moment(shiftDate).format('MM/DD/YYYY')} | Shift: ${shift}`});

                //* get characteristics
                fetchCsCharacteristicStartAsync(data.organizationPartId, checkSheetMachineName);

            })
            .catch(error => dispatch({type: 'SET_CHECK_SHEET_ERROR_MSG', payload: error.message}))
            .finally(() => dispatch({type: 'SET_CHECK_SHEET_LOADING', payload: false}))

    }, [])

    //* effect to get checksheet entries
    useEffect(() => {

        if (checkSheetId && checkSheetSubMachine && checkSheetPart) {

            dispatch({type: 'SET_CHECK_SHEET_VALUES_LOADING', payload: true})
            api.get(`/quality/checksheets/checksheetentry?$filter=checkSheetId eq ${checkSheetId} and part eq '${checkSheetPart}' and subMachineId eq ${checkSheetSubMachine}&$expand=rechecks`)
                .then(response => {
    
                    setCheckSheetValues(response.data);
                    const msg = response.data.length > 0 
                                ? `${response.data.length} records successfully loaded`
                                : `No records loaded`;
                                
                    message.success(msg)
                })
                .catch(error => dispatch({type: 'SET_CHECK_SHEET_VALUES_ERROR_MSG', payload: error.message}))
                .finally(() => dispatch({type: 'SET_CHECK_SHEET_VALUES_LOADING', payload: false}))
        }

    }, [checkSheetId, checkSheetSubMachine, checkSheetPart, setCheckSheetValues])

    // * get machineId
    useEffect(() => {
        const machineId = state.machinesCollection?.find(e => e.value === checkSheetMachineName)?.machineId ?? 0;
        dispatch({type: 'SET_MACHINE_ID', payload: machineId});
    }, [checkSheetMachineName, state.machinesCollection])

    useEffect(() => history.push(`#${checkSheetMachineName}`), [checkSheetMachineName, history])

    const onMachineChange = e => {

        //* reset sub-machines in redux store
        setCheckSheetSubMachine(null);

        const machineId = e.target.value;
        const machineName = state.machinesCollection.find(e => e.machineId === machineId).value;

        //* assign new checksheet machine inr redux
        setCheckSheetMachineName(machineName);

        //* update sub-mahcines items
        dispatch({type: 'SET_SUB_MACHINES', payload: getSubMachines(state.machinesCollection, machineId) });

        //* get characteristics
        fetchCsCharacteristicStartAsync(checkSheet?.organizationPartId ?? 0, machineName)
    }

    const onSubMachineChange = e => { 

        setCheckSheetSubMachine(e.target.value);

        //* get characteristics
        fetchCsCharacteristicStartAsync(checkSheet?.organizationPartId ?? 0, checkSheetMachineName)
    }
    const onPartChange = e => {

        setCheckSheetPart(e.target.value);

         //* get characteristics
         fetchCsCharacteristicStartAsync(checkSheet?.organizationPartId ?? 0, checkSheetMachineName)

    }

    return (
        <React.Fragment>

            <PageHeader
                className="site-page-header"
                title={state.checkSheetLoading ? <span><Spin/> Loading...</span> : state.title}
                subTitle={state.subTitle}
                onBack={() => history.push(`/quality/checksheets/controlmethod/${controlName}/${controlId}/line/${lineId}`)}
                tags={<Tag color="blue">{state.tags}</Tag>}
            />

            <Content className="ma3 mt0">
                
                <Row gutter={[12,12]}>

                    {
                        state.checkSheetErrorMsg 
                            ? <Col span={24}><Alert message={state.checkSheetErrorMsg} type="error" showIcon /></Col> 
                            : null
                    }

                    <Col span={24}>

                        {
                            state.machinesLoading 
                            ?   <span><Spin /> Loading Machines...</span>  
                            :   <Radio.Group 
                                    options={state.machines}
                                    onChange={onMachineChange}
                                    optionType="button"
                                    buttonStyle="solid"
                                    value={state.machineId}
                                    defaultValue={state.machineId}
                                    className="mr2"
                                    
                                />
                        }

                        <Radio.Group
                            options={state.subMachines}
                            onChange={onSubMachineChange}
                            optionType="button"
                            buttonStyle="solid"
                            value={checkSheetSubMachine}
                            defaultValue={checkSheetSubMachine}
                            className="mr2"
                        />

                        <Radio.Group
                            onChange={onPartChange}
                            optionType="button"
                            buttonStyle="solid"
                            defaultValue={checkSheetPart}
                            className="mr2"
                            options={state.parts?.map(part => ({ label: part, value: part }))}
                        />
                    
                    </Col>

                    {
                        !checkSheetPart 
                            ?   <Col span={24}><Alert message="Please select part number" type="warning" showIcon className="mb2" /></Col>
                            :   !checkSheetSubMachine
                                ?   <Col span={24}><Alert message="Please select sub-machine" type="warning" showIcon className="mb2" /></Col>
                                :   null
                    }

                    <Col span={24}>
                    
                        <CheckSheetDataEntry />

                    </Col>

                </Row>

            </Content>
        </React.Fragment>
    )
}

const mapStateToProps = ({qualityCheckSheet}) => ({
    checkSheetPart: qualityCheckSheet.checkSheetPart,
    checkSheetSubMachine: qualityCheckSheet.checkSheetSubMachine,
    checkSheetMachineName: qualityCheckSheet.checkSheetMachineName,
    checkSheet: qualityCheckSheet.checkSheet
})

const mapDispatchToProps = dispatch => ({
    setCheckSheetPart: value => dispatch(setCheckSheetPart(value)),
    setCheckSheetSubMachine: value => dispatch(setCheckSheetSubMachine(value)),
    setCheckSheetMachineName: value => dispatch(setCheckSheetMachineName(value)),
    setCheckSheetValues: collection => dispatch(setCheckSheetValues(collection)),
    setCheckSheet: collection => dispatch(setCheckSheet(collection)),

    fetchCsCharacteristicStartAsync: (partId, machineName) => dispatch(fetchCsCharacteristicStartAsync(partId, machineName))
})

export default connect(mapStateToProps, mapDispatchToProps)(CheckSheetDataEntryPage)