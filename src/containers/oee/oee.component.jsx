import React, { useEffect, useReducer } from 'react'
import moment from 'moment'
import { useParams, useHistory } from 'react-router-dom'
import { HubConnectionBuilder } from '@microsoft/signalr';
import short from 'short-uuid'
import { useWindowUnloadEffect  } from '../../core/utilities/custom-hook'

import api from '../../core/utilities/api'
import { baseUrl } from '../../core/utilities/base-url'
import SuccessButton from '../../components/success-button/success-button.component'
import { green, darkGray } from '../../core/utilities/colors'

import { 
    Layout,
    PageHeader,
    List,
    Row,
    Col,
    Button,
    Tag,
    Popconfirm
 } from "antd";

const { Content } = Layout;

const initialState = {
    loading: false,
    line: null, 
    oee: null,
    items: [],
    subTitle: null,

    counterConnection: null,
    downtimeConnection: null, 
    scrapConnection: null, 

    startLoading: false,
    startButtonDisabled: false,

    counter: null, 
    downtime: null, 
    scrap: null
}

const reducer = (state = initialState, action) => {

    switch (action.type) {

        case 'SET_LOADING':
            return { ...state,  loading: action.payload }

        case 'SET_LINE':
            return { ...state,  line: action.payload }

        case 'SET_OEE':
            return { ...state,  oee: action.payload }

        case 'SET_ITEMS':
            return { ...state,  items: action.payload }

        case 'SET_SUB_TITLE':
            return { ...state,  subTitle: action.payload }

        case 'SET_COUNTER_CONN':
            return { ...state,  counterConnection: action.payload }

        case 'SET_DOWNTIME_CONN':
            return { ...state,  downtimeConnection: action.payload }

        case 'SET_SCRAP_CONN':
            return { ...state,  scrapConnection: action.payload }

        case 'SET_START_LOADING':
            return { ...state,  startLoading: action.payload }

        case 'SET_START_BUTTON_DISABLE':
            return { ...state,  startButtonDisabled: action.payload }

        //* temp
        case 'SET_COUNTER':
            return { ...state,  counter: action.payload }

        case 'SET_DOWNTIME':
            return { ...state,  downtime: action.payload }

        case 'SET_SCRAP':
            return { ...state,  scrap: action.payload }

        default:
            return state;
    }

}

const Oee = () => {

    const history = useHistory();
    const { guid, department } = useParams(); 
    const [state, dispatch] = useReducer(reducer, initialState)

    //* mount
    useEffect(() => {

        (async function getLine() {

            try {
                        
                dispatch({ type: 'SET_LOADING', payload: true })
        
                const response = await api.get(`oee/lines/${guid}`)
                const data = response.data;
                document.title = `${data.groupName} OEE`

                dispatch({ type: 'SET_LINE', payload: data })

                //* get OEE data
                const oeeResponse =  await api.get(`oee?$filter=oeeLineId eq ${guid} and endDateTime eq null`);
                const oeeData = oeeResponse.data[0];
                dispatch({ type: 'SET_OEE', payload: oeeData })

                
    
            } catch (error) {
                
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false })
            }

        })()

    }, [])

    //* unmount
    useWindowUnloadEffect(() => {

        if (state.counterConnection) 
            state.counterConnection.invoke('RemoveToGroup', state.line?.tagName)
        
        if (state.downtimeConnection) 
            state.downtimeConnection.invoke('RemoveToGroup', state.line?.groupName)

        if (state.scrapConnection) 
            state.scrapConnection.invoke('RemoveToGroup', state.line?.workCenter)
    
    }, true)

    //* counter onChange effects
    useEffect(() => {

        const counterConn = new HubConnectionBuilder()
            .withUrl(`${baseUrl}/counterhub`)
            .withAutomaticReconnect()
            .build();

        dispatch({ type: 'SET_COUNTER_CONN', payload: counterConn })

    }, [])

    useEffect(() => {

        if (state.counterConnection && state.line) {
            state.counterConnection.start()
                .then(() => {

                    state.counterConnection.invoke('AddToGroup', state.line.tagName)

                    state.counterConnection.on('BroadCastChange', data => {
                        console.log('counter', data)

                        dispatch({ type: 'SET_COUNTER', payload: { type: 'counter', ...data } })
                    });

                    state.counterConnection.on('onJoin', data => {
                        console.log(`%c counter join: ${data}`, 'color: green; font-size: 15px; font-weight: bold;')
                    });

                    state.counterConnection.on('onLeave', data => {
                        console.log(`%c counter leave: ${data}`, 'color: red; font-size: 15px; font-weight: bold;')
                    });
                })
                .catch(error => console.error(error))
        }

    }, [state.counterConnection, state.line])

    //* downtime onChange effects
    useEffect(() => {

        const downtimeConn = new HubConnectionBuilder()
            .withUrl(`${baseUrl}/downtimehub`)
            .withAutomaticReconnect()
            .build();

        dispatch({ type: 'SET_DOWNTIME_CONN', payload: downtimeConn })
        
    }, [])

    useEffect(() => {

        if (state.downtimeConnection && state.line) {
            state.downtimeConnection.start()
                .then(() => {
                    state.downtimeConnection.invoke('AddToGroup', state.line.groupName)

                    state.downtimeConnection.on('BroadCastChange', data => {
                        console.log('downtime', data)

                        dispatch({ type: 'SET_DOWNTIME', payload: { type: 'downtime', ...data } })
         
                    });

                    state.downtimeConnection.on('onJoin', data => {
                        console.log(`%c downtime join: ${data}`, 'color: green; font-size: 15px; font-weight: bold;')
                    });

                    state.downtimeConnection.on('onLeave', data => {
                        console.log(`%c downtime leave: ${data}`, 'color: red; font-size: 15px; font-weight: bold;')
                    });
                })
                .catch(error => console.error(error))
        }

    }, [state.downtimeConnection, state.line])

    //* scrap onChange effects
    useEffect(() => {

        const scrapConn = new HubConnectionBuilder()
            .withUrl(`${baseUrl}/scraphub`)
            .withAutomaticReconnect()
            .build();

        dispatch({ type: 'SET_SCRAP_CONN', payload: scrapConn })
        
    }, [])

    useEffect(() => {

        if (state.scrapConnection && state.line) {
            state.scrapConnection.start()
                .then(() => {

                    state.scrapConnection.invoke('AddToGroup', state.line.workCenter)

                    state.scrapConnection.on('BroadCastChange', data => {
                        console.log('scrap', data)
                        dispatch({ type: 'SET_SCRAP', payload: { type: 'scrap', ...data } })
                    });
                    
                    state.scrapConnection.on('onJoin', data => {
                        console.log(`%c scrap join: ${data}`, 'color: green; font-size: 15px; font-weight: bold;')
                    });

                    state.scrapConnection.on('onLeave', data => {
                        console.log(`%c scrap leave: ${data}`, 'color: red; font-size: 15px; font-weight: bold;')
                    });
                })
                .catch(error => console.error(error))
        }

    }, [state.scrapConnection, state.line])

    //* temp
    useEffect(() => {
        dispatch({ type: 'SET_ITEMS', payload: [...state.items, state.counter] })
    }, [state.counter])

    useEffect(() => {
        dispatch({ type: 'SET_ITEMS', payload: [...state.items, state.downtime] })
    }, [state.downtime])

    useEffect(() => {
        dispatch({ type: 'SET_ITEMS', payload: [...state.items, state.scrap] })
    }, [state.scrap])

    useEffect(() => {

        if (state.oee) {
            const { startDateTime } = state.oee;
            const subTitle = `Production Started at ${moment(startDateTime).format('lll')}`
            dispatch({ type: 'SET_SUB_TITLE', payload: subTitle })
        } else {
            dispatch({ type: 'SET_SUB_TITLE', payload: null })
        }

    }, [state.oee])

    useEffect(() => {

        if (state.oee) {
            //* disable start button
            dispatch({ type: 'SET_START_BUTTON_DISABLE', payload: true })
        } else {
            //* enable start button
            dispatch({ type: 'SET_START_BUTTON_DISABLE', payload: false })
        }

    }, [state.oee])

    //history.push(`/oee/assembly/${guid}?oee=${oeeData.oeeId}`)

    useEffect(() => {
        history.push(`/oee/assembly/${guid}?oee=${state.oee?.oeeId ?? ''}`)
    }, [state.oee, guid, history])

    //* events

    const onStart = async () => {

        try {
            
            dispatch({ type: 'SET_START_LOADING', payload: true })

            const response = await api.post(`/oee`, {
                oeeLineId: guid
            })

            dispatch({ type: 'SET_OEE', payload: response.data })

        } catch (error) {
            
        } finally {
            dispatch({ type: 'SET_START_LOADING', payload: false })
        }

    }

    const onStop = async () => {

        try {
            
            dispatch({ type: 'SET_START_LOADING', payload: true })

            const response = await api.post(`/oee`, {
                oeeId: state.oee?.oeeId,
                oeeLineId: guid,
                endDateTime: new Date(),
                timestamp: state.oee?.timestamp,
            })

            dispatch({ type: 'SET_OEE', payload: response.data })

        } catch (error) {
            
        } finally {
            dispatch({ type: 'SET_START_LOADING', payload: false })
        }

    }
  
    return (
        <>
    
            <PageHeader
                className="site-page-header"
                title={`${state.line?.groupName} OEE`}
                subTitle={state.subTitle}
                tags={state.oee?.endDateTime === undefined 
                        ? <Tag color={darkGray}>Not Running</Tag> 
                        : <Tag color={green}>Running</Tag>}
                onBack={() => history.push(`/oee/${department}`)}
            />

            <Content className="ma3 mt0">

                <Row>

                    <Col span={24}>

                        <Popconfirm 
                            placement="top" 
                            title={"Are you sure you want to start production?"} 
                            onConfirm={onStart} 
                            okText="Yes" 
                            cancelText="No">

                            <SuccessButton 
                                disabled={state.startButtonDisabled}
                                loading={state.loading}
                                size="large" 
                                className="mr2" 
                                style={{ width: '6rem' }} >
                                    Start
                            </SuccessButton>
                            
                        </Popconfirm>

                        <Popconfirm 
                            placement="top" 
                            title={"Are you sure you want to stop production?"} 
                            onConfirm={onStop} 
                            okText="Yes" 
                            cancelText="No">

                            <Button 
                                type="primary" 
                                size="large" 
                                style={{ width: '6rem' }} 
                                danger >
                                    Stop
                            </Button>

                        </Popconfirm>
                        
                    </Col>

                    <Col span={24}>
                    
                    </Col>

                </Row>

                <List>
                    {
                        state.items.map(e => {

                            let className = ''
                            switch (e?.type) {
                                case 'counter':
                                    className = 'bg-green'
                                    break;
                                case 'downtime':
                                    className = 'bg-yellow'
                                    break;
                                case 'scrap':
                                    className = 'bg-red'
                                    break;
                                default:
                                    break;
                            }

                            return <List.Item key={short.generate()} className={className} >{ JSON.stringify(e) }</List.Item>

                        })
                    }
                </List>

            </Content>
        
        </>

    )
 }

 export default Oee;