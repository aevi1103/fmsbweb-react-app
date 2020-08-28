import React, { useEffect, useReducer, useCallback } from 'react'
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
    Tabs,
    Radio,
    Row,
    Col,
    message
 } from "antd";

import {
    setCheckSheetPart,
    setCheckSheetSubMachine,
    setCheckSheetMachineName,
    setCheckSheetValues
} from '../../../redux/quality-check-sheet/quality-check-sheet.actions'

import CheckSheetDataEntry from '../../../components/quality/check-sheet/check-sheet-data-entry.component'

const { Content } = Layout;
const { TabPane } = Tabs;

const initialState = {

    checkSheetLoading: false,
    checkSheet: null,
    checkSheetErrorMsg: null,

    checkSheetValuesLoading: false,
    checkSheetValues: [],
    checkSheetValuesErrorMsg: null,

    machinesLoading: false,
    machinesCollection: [],
    machinesErrorMsg: null,
    
    title: '',
    subTitle: '',
    characteristics: [],
    tags: null,
    parts: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case 'SET_CHECK_SHEET_LOADING':
            return {
                ...state,
                checkSheetLoading: action.payload
            }
        case 'SET_CHECK_SHEET':
            return {
                ...state,
                checkSheet: action.payload
            }
        case 'SET_CHECK_SHEET_ERROR_MSG':
            return {
                ...state,
                checkSheetErrorMsg: action.payload
            }

        case 'SET_CHECK_SHEET_VALUES_LOADING':
            return {
                ...state,
                checkSheetValuesLoading: action.payload
            }
        case 'SET_CHECK_SHEET_VALUES':
            return {
                ...state,
                checkSheetValues: action.payload
            }
        case 'SET_CHECK_SHEET_VALUES_ERROR_MSG':
            return {
                ...state,
                checkSheetValuesErrorMsg: action.payload
            }

        case 'SET_MACHINES_LOADING':
            return {
                ...state,
                machinesLoading: action.payload
            }
        case 'SET_MACHINES':
            return {
                ...state,
                machinesCollection: action.payload
            }
        case 'SET_MACHINES_ERROR_MSG':
            return {
                ...state,
                machinesErrorMsg: action.payload
            }

        case 'SET_TITLE':
            return {
                ...state,
                title: action.payload
            }
        case 'SET_SUB_TITLE':
            return {
                ...state,
                subTitle: action.payload
            }
        case 'SET_SUB_SUBMACHINE':
            return {
                ...state,
                subMachine: action.payload
            }

        case 'SET_CHARACTERISTICS':
            return {
                ...state,
                characteristics: action.payload
            }

        case 'SET_TAGS':
            return {
                ...state,
                tags: action.payload
            }
            
        case 'SET_PARTS':
            return {
                ...state,
                parts: action.payload
            }
        
        default:
            return state;
    }
}

const CheckSheetDataEntryPage = ({
    setCheckSheetPart,
    setCheckSheetSubMachine,
    setCheckSheetMachineName,

    checkSheetPart,
    checkSheetSubMachine,
    checkSheetMachineName
}) => {
    
    const { hash } = useLocation();
    const history = useHistory();
    const { controlId, controlName, lineId, checkSheetId } = useParams();
    const [state, dispatch] = useReducer(reducer, initialState);

    const getCharacteristics = useCallback((checkSheet, machineName) => {
        if (!machineName) return;
        const { organizationPart: { characteristics } } = checkSheet;
        return characteristics
                .filter(d => d.machineName.toLowerCase().trim() === machineName.toLowerCase().trim())
                .map(d => ({...d, key: d.characteristicId}))
    }, [])

    const getValues = useCallback((checkSheetId, subMachineId, part) => {
        dispatch({type: 'SET_CHECK_SHEET_VALUES_LOADING', payload: true})
        api.get(`/quality/checksheets/checksheetentry?$filter=checkSheetId eq ${checkSheetId} and part eq '${part}' and subMachineId eq ${subMachineId}&$expand=rechecks`)
            .then(response => {

                // setCheckSheetValues(response.data);
                dispatch({type: 'SET_CHECK_SHEET_VALUES', payload: response.data});

                const msg = response.data.length > 0 
                            ? `${response.data.length} records successfully loaded`
                            : `No records loaded`;
                            
                message.success(msg)
            })
            .catch(error => dispatch({type: 'SET_CHECK_SHEET_VALUES_ERROR_MSG', payload: error.message}))
            .finally(() => dispatch({type: 'SET_CHECK_SHEET_VALUES_LOADING', payload: false}))
            
    }, [])

    useEffect(() => {

        const getMachines = lineId => {
            dispatch({type: 'SET_MACHINES_LOADING', payload: true})
            api.get(`/quality/checksheets/machine?$filter=lineId eq ${lineId}&$expand=subMachines`)
                .then(response => dispatch({type: 'SET_MACHINES', payload: response.data}))
                .catch(error => dispatch({type: 'SET_MACHINES_ERROR_MSG', payload: error.message}))
                .finally(() => dispatch({type: 'SET_MACHINES_LOADING', payload: false}))
        }

        //get check sheet
        dispatch({type: 'SET_CHECK_SHEET_LOADING', payload: true})
        api.get(`/quality/checksheets/checksheet?$expand=controlMethod,line,organizationPart($expand=characteristics($expand=displayAs))&$filter=checkSheetId eq ${checkSheetId}`)
            .then(response => {

                const data = response.data[0];

                dispatch({type: 'SET_CHECK_SHEET', payload: data});
                getMachines(data.lineId);

                dispatch({type: 'SET_TAGS', payload: data.organizationPart.part})
                dispatch({type: 'SET_PARTS', payload: data.organizationPart.parts})

                //check characteristics on load
                if (checkSheetSubMachine && checkSheetMachineName) 
                    dispatch({type: 'SET_CHARACTERISTICS', payload: getCharacteristics(data, checkSheetMachineName)})  

            })
            .catch(error => dispatch({type: 'SET_CHECK_SHEET_ERROR_MSG', payload: error.message}))
            .finally(() => dispatch({type: 'SET_CHECK_SHEET_LOADING', payload: false}))


    }, [])

    useEffect(() => {

        if (state.checkSheet) {

            const { 
                line,
                shiftDate,
                shift,
                controlMethod: { method },
            } = state.checkSheet;
            
            dispatch({type: 'SET_TITLE', payload: `Line ${line.value} ${method}`});
            dispatch({type: 'SET_SUB_TITLE', payload: `Shift Date: ${moment(shiftDate).format('MM/DD/YYYY')} | Shift: ${shift}`});
        }

    }, [state.checkSheet])

    useEffect(() => {

        if (checkSheetId && checkSheetSubMachine && checkSheetPart && state.checkSheet) {
            getValues(checkSheetId, checkSheetSubMachine, checkSheetPart)
        }

    }, [checkSheetId, checkSheetSubMachine, checkSheetPart, state.checkSheet, getValues])
    
    const onTabClick = (key) => {
        history.push(key);
        setCheckSheetSubMachine(null);
        const machineName = key.replace(/_/g, ' ').replace('#','');
        setCheckSheetMachineName(machineName);
        dispatch({type: 'SET_CHARACTERISTICS', payload: getCharacteristics(state.checkSheet, machineName)})  
    }
    const onSubMachineChange = e => {
        setCheckSheetSubMachine(e.target.value);
        dispatch({type: 'SET_CHARACTERISTICS', payload: getCharacteristics(state.checkSheet, checkSheetMachineName)})
    }

    const onPartChange = e => setCheckSheetPart(e.target.value);
    const mapSubMachines = data => data.map(({ subMachineId, value }) => ({ label: value, value: subMachineId }))
    const mapParts = data => data.map(part => ({ label: part, value: part }))

    return (
        <React.Fragment>

            <PageHeader
                className="site-page-header"
                title={state.checkSheetLoading ? <span><Spin/> Loading...</span> : state.title}
                subTitle={state.subTitle}
                onBack={() => history.push(`/quality/checksheets/controlmethod/${controlName}/${controlId}/line/${lineId}`)}
                tags={<Tag color="blue">{state.tags}</Tag>}
                extra={
                    <Radio.Group
                        onChange={onPartChange}
                        optionType="button"
                        buttonStyle="solid"
                        defaultValue={checkSheetPart}
                        options={mapParts(state.parts)}
                    />
                }
            />

            <Content className="ma3 mt0">
                
                {
                    state.checkSheetErrorMsg ? <Alert message={state.checkSheetErrorMsg} type="error" showIcon /> : null
                }

                {
                    state.machinesLoading 
                    ? <span><Spin /> Getting Machines...</span>  
                    : <Tabs onChange={onTabClick} defaultActiveKey={hash}>
                        {
                            state.machinesCollection.map(({value, subMachines}) => (
                                <TabPane tab={value} key={`#${value.replace(/\s/g, '_')}`}>

                                    <Row gutter={[16,16]}>
                                        <Col span={24}>

                                            {
                                                !checkSheetPart 
                                                    ? <Alert message="Please select part number" type="warning" showIcon className="mb2" />
                                                    : !checkSheetSubMachine
                                                        ? <Alert message="Please select sub-machine" type="warning" showIcon className="mb2" />
                                                        : null
                                            }

                                            <Radio.Group
                                                options={mapSubMachines(subMachines)}
                                                onChange={onSubMachineChange}
                                                optionType="button"
                                                buttonStyle="solid"
                                                value={checkSheetSubMachine}
                                                defaultValue={checkSheetSubMachine}
                                            />

                                        </Col>

                                        <Col span={24}>
                                            <CheckSheetDataEntry data={state.characteristics} values={state.checkSheetValues} />
                                        </Col>
                                        
                                    </Row>

                                </TabPane>
                            ))
                        }
                    </Tabs>
                }

            </Content>
        </React.Fragment>
    )
}

const mapStateToProps = ({qualityCheckSheet}) => ({
    checkSheetPart: qualityCheckSheet.checkSheetPart,
    checkSheetSubMachine: qualityCheckSheet.checkSheetSubMachine,
    checkSheetMachineName: qualityCheckSheet.checkSheetMachineName,
})

const mapDispatchToProps = dispatch => ({
    setCheckSheetPart: value => dispatch(setCheckSheetPart(value)),
    setCheckSheetSubMachine: value => dispatch(setCheckSheetSubMachine(value)),
    setCheckSheetMachineName: value => dispatch(setCheckSheetMachineName(value)),
    setCheckSheetValues: collection => dispatch(setCheckSheetValues(collection))
})

export default connect(mapStateToProps, mapDispatchToProps)(CheckSheetDataEntryPage)