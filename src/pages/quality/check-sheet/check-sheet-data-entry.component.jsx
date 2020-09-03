import React, { useEffect, useReducer, useCallback, useState } from 'react'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import api from '../../../API'
import axios from 'axios'

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

    loading: false,
    machines: [],
    machinesCollection: [],
    errorMsg: null,

    checkSheetLoading: false,
    checkSheetErrorMsg: null,

    checkSheetValuesLoading: false,
    checkSheetValuesErrorMsg: null,
    
    title: '',
    subTitle: '',
    tags: null,
    
    parts: [],
    subMachines: [],
    
    machineId: null,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case 'SET_INIT_LOADING':
            return { ...state, loading: action.payload }
        case 'SET_MACHINES':
            return { ...state, machines: action.payload }
        case 'SET_MACHINES_COLLECTION':
            return { ...state, machinesCollection: action.payload }
        case 'SET_INIT_ERROR_MSG':
            return { ...state, errorMsg: action.payload }

        case 'SET_CHECK_SHEET_LOADING':
            return { ...state, checkSheetLoading: action.payload }
        case 'SET_CHECK_SHEET_ERROR_MSG':
            return { ...state, checkSheetErrorMsg: action.payload }

        case 'SET_CHECK_SHEET_VALUES_LOADING':
            return { ...state, checkSheetValuesLoading: action.payload }
        case 'SET_CHECK_SHEET_VALUES_ERROR_MSG':
            return { ...state, checkSheetValuesErrorMsg: action.payload }

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
    
    const history = useHistory();
    const { controlId, controlName, lineId, checkSheetId } = useParams();
    const [state, dispatch] = useReducer(reducer, initialState);

    const getSubMachines = (machines, machineId) => {
        const { subMachines } = machines.find(e => e.machineId === machineId);
        return subMachines.map(({ subMachineId, value }) => ({ label: value, value: subMachineId }));
    }

    const getEntries = (checkSheetId, subMachine, part) => {

        dispatch({type: 'SET_CHECK_SHEET_VALUES_LOADING', payload: true})
        api.get(`/quality/checksheets/checksheetentry?$filter=checkSheetId eq ${checkSheetId} and part eq '${part}' and subMachineId eq ${subMachine}&$expand=rechecks`)
            .then(response => {

                const data = response.data;
                setCheckSheetValues(data);
                const msg = data.length > 0 
                            ? `${data.length} records successfully loaded`
                            : `No records loaded`;
                            
                message.success(msg)
            })
            .catch(error => dispatch({type: 'SET_CHECK_SHEET_VALUES_ERROR_MSG', payload: error.message}))
            .finally(() => dispatch({type: 'SET_CHECK_SHEET_VALUES_LOADING', payload: false}))

    }

    //* Load check-sheet and machine on mount
    useEffect(() => {

        dispatch({type: 'SET_INIT_LOADING', payload: true})
        axios.all([
            api.get(`/quality/checksheets/machine?$filter=lineId eq ${lineId}&$expand=subMachines`),
            api.get(`/quality/checksheets/checksheet?$expand=controlMethod,line,organizationPart&$filter=checkSheetId eq ${checkSheetId}`)
        ])
        .then(axios.spread((...responses) => {

            const machines = responses[0].data;
            const checkSheet = responses[1].data[0]

            //* set checksheet state to redux
            setCheckSheet(checkSheet);

            const { 
                line,
                shiftDate,
                shift,
                organizationPartId,
                organizationPart: { part, parts },
                controlMethod: { method },
            } = checkSheet;
            
            //* set items to local state
            dispatch({type: 'SET_TAGS', payload: part});
            dispatch({type: 'SET_PARTS', payload: parts});
            dispatch({type: 'SET_TITLE', payload: `Line ${line.value} ${method}`});
            dispatch({type: 'SET_SUB_TITLE', payload: `Shift Date: ${moment(shiftDate).format('MM/DD/YYYY')} | Shift: ${shift}`});

            //* set machines state to local state
            dispatch({type: 'SET_MACHINES_COLLECTION', payload: machines })
            dispatch({
                type: 'SET_MACHINES',
                payload: machines.map(({ machineId, value }) => ({ label: value, value: machineId }))
            })
            
            //* update sub-mahcines items
            const { machineId } = machines.find(({ value }) => value === checkSheetMachineName);
            dispatch({type: 'SET_SUB_MACHINES', payload: getSubMachines(machines, machineId) });

            //* get characteristics
            fetchCsCharacteristicStartAsync(organizationPartId, checkSheetMachineName);

            //* fetch data entries
            getEntries(checkSheetId, checkSheetSubMachine, checkSheetPart);

        }))
        .catch(error => dispatch({type: 'SET_INIT_ERROR_MSG', payload: error.message}))
        .finally(() => dispatch({type: 'SET_INIT_LOADING', payload: false}))

    }, [])

    // * get machineId
    useEffect(() => {
        const machineId = state.machinesCollection?.find(e => e.value === checkSheetMachineName)?.machineId ?? 0;
        dispatch({ type: 'SET_MACHINE_ID', payload: machineId });
    }, [checkSheetMachineName, state.machinesCollection])

    useEffect(() => history.push(`#${checkSheetMachineName}`), [checkSheetMachineName, history])

    const onMachineChange = e => {

        const machineId = e.target.value;
        const machineName = state.machinesCollection.find(e => e.machineId === machineId).value;
        const subMachines = getSubMachines(state.machinesCollection, machineId);

        //* reset sub-machines in redux store
        setCheckSheetSubMachine(null);

        //* assign new checksheet machine in redux
        setCheckSheetMachineName(machineName);

        //* set sub-mahcines items state
        dispatch({type: 'SET_SUB_MACHINES', payload: subMachines });

        //* fetch characteristics
        fetchCsCharacteristicStartAsync(checkSheet?.organizationPartId ?? 0, machineName);
        getEntries(checkSheetId, checkSheetSubMachine, checkSheetPart);

    }

    const onSubMachineChange = e => { 

        const subMachine = e.target.value;
        setCheckSheetSubMachine(subMachine);

        //* fetch data entries, but wait for 1 seconds to finish animation on the radio button
        setTimeout(() => getEntries(checkSheetId, subMachine, checkSheetPart), 1000);

    }
    const onPartChange = e => {

        const part = e.target.value;
        setCheckSheetPart(part);

        //* fetch data entries, but wait 1 seconds to finish animation on the radio button
        setTimeout(() => getEntries(checkSheetId, checkSheetSubMachine, part), 1000);

    }

    return (
        <React.Fragment>

            <PageHeader
                className="site-page-header"
                title={state.loading ? <span><Spin/> Please wait...</span> : state.title}
                subTitle={state.subTitle}
                onBack={() => history.push(`/quality/checksheets/controlmethod/${controlName}/${controlId}/line/${lineId}`)}
                tags={<Tag color="blue">{state.tags}</Tag>}
            />

            <Content className="ma3 mt0">
                
                <Row gutter={[12,12]}>

                    {
                        state.errorMsg 
                            ? <Col span={24}><Alert message={state.errorMsg} type="error" showIcon /></Col> 
                            : null
                    }

                    <Col span={24}>

                        <Radio.Group id="machineRadio"
                            options={state.machines}
                            onChange={onMachineChange}
                            optionType="button"
                            buttonStyle="solid"
                            value={state.machineId}
                            defaultValue={state.machineId}
                            className="mr2"
                        />

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

                        {
                            !state.loading ? <CheckSheetDataEntry /> : null
                        }
                        
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