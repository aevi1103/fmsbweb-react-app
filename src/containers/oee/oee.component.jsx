import React, { useEffect, useReducer, useState } from 'react'
import moment from 'moment'
import { useParams, useHistory } from 'react-router-dom'
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useWindowUnloadEffect  } from '../../core/utilities/custom-hook'

import api from '../../core/utilities/api'
import { baseUrl } from '../../core/utilities/base-url'
import SuccessButton from '../../components/success-button/success-button.component'
import { green, darkGray } from '../../core/utilities/colors'
import { initialState, reducer } from './services/reducer'
import { getSummary, getLine } from './services/api'

import { ExclamationCircleOutlined } from '@ant-design/icons';

import { 
    Layout,
    PageHeader,
    Row,
    Col,
    Button,
    Tag,
    Modal,
    Form,
    InputNumber
} from "antd";

import OeeCards from './components/oee-cards.component'

const { Content } = Layout;
const { confirm } = Modal;

const Oee = () => {

    const history = useHistory();
    const { guid, department } = useParams(); 
    const [state, dispatch] = useReducer(reducer, initialState)

    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const getSummaryData = async () => {
        const summaryResponse = await getSummary(guid)
        dispatch({ type: 'SET_OEE', payload: summaryResponse.data })
    }

    //* on mount get line and oee data
    useEffect(() => {

        (async function () {

            try {
                        
                dispatch({ type: 'SET_LOADING', payload: true })
        
                //* get line
                const lineResponse = await getLine(guid);
                document.title = `${lineResponse.data.groupName} OEE`;
                dispatch({ type: 'SET_LINE', payload: lineResponse.data })

                //* get OEE
                getSummaryData();


            } catch (error) {           
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false })
            }

        })()

    }, [])

    //* unsubscribe to group hubs
    useWindowUnloadEffect(() => {

        if (state.counterConnection) 
            state.counterConnection.invoke('RemoveToGroup', state.line?.tagName)
        
        if (state.downtimeConnection) 
            state.downtimeConnection.invoke('RemoveToGroup', state.line?.groupName)

        if (state.scrapConnection) 
            state.scrapConnection.invoke('RemoveToGroup', state.line?.workCenter)
    
    }, true)

    //* open signalr connections
    useEffect(() => {

        //* counter connection
        const counterConn = new HubConnectionBuilder()
            .withUrl(`${baseUrl}/counterhub`)
            .withAutomaticReconnect()
            .build();

        dispatch({ type: 'SET_COUNTER_CONN', payload: counterConn })

        //* downtime connection
        const downtimeConn = new HubConnectionBuilder()
            .withUrl(`${baseUrl}/downtimehub`)
            .withAutomaticReconnect()
            .build();

        dispatch({ type: 'SET_DOWNTIME_CONN', payload: downtimeConn })

        //* scrap connection
        const scrapConn = new HubConnectionBuilder()
            .withUrl(`${baseUrl}/scraphub`)
            .withAutomaticReconnect()
            .build();

        dispatch({ type: 'SET_SCRAP_CONN', payload: scrapConn })

    }, [])

    //* subscribe to group hubs
    useEffect(() => {

        if (state.counterConnection && state.line) {
            state.counterConnection.start()
                .then(() => {

                    const conn = state.counterConnection;
                    
                    //* add client to group
                    conn.invoke('AddToGroup', state.line.tagName)

                    //* listner

                    conn.on('BroadCastChange', data => {
                        console.log('counter', data)

                        //* update data
                        getSummaryData();

                    });

                    conn.on('onJoin', data => {
                        console.log(`%c counter join: ${data}`, 'color: green; font-size: 15px; font-weight: bold;')
                    });

                    conn.on('onLeave', data => {
                        console.log(`%c counter leave: ${data}`, 'color: red; font-size: 15px; font-weight: bold;')
                    });
                })
                .catch(error => console.error(error))
        }

    }, [state.counterConnection, state.line])

    useEffect(() => {

        if (state.downtimeConnection && state.line) {
            state.downtimeConnection.start()
                .then(() => {

                    const conn = state.downtimeConnection;

                    //* add client to group
                    conn.invoke('AddToGroup', state.line.groupName)

                    //* listnen on value change in the db
                    conn.on('BroadCastChange', data => {

                        console.log('downtime', data)
                        //* update data
                        getSummaryData();

                    });

                    conn.on('onJoin', data => {
                        console.log(`%c downtime join: ${data}`, 'color: green; font-size: 15px; font-weight: bold;')
                    });

                    conn.on('onLeave', data => {
                        console.log(`%c downtime leave: ${data}`, 'color: red; font-size: 15px; font-weight: bold;')
                    });
                })
                .catch(error => console.error(error))
        }

    }, [state.downtimeConnection, state.line])

    useEffect(() => {

        if (state.scrapConnection && state.line) {
            state.scrapConnection.start()
                .then(() => {

                    const conn = state.scrapConnection;

                    //* add client to group
                    conn.invoke('AddToGroup', state.line.workCenter)

                    //* listnen on value change in the db
                    conn.on('BroadCastChange', data => {
                        console.log('scrap', data)
                        //* update data

                        getSummaryData();
                    });
                    
                    conn.on('onJoin', data => {
                        console.log(`%c scrap join: ${data}`, 'color: green; font-size: 15px; font-weight: bold;')
                    });

                    conn.on('onLeave', data => {
                        console.log(`%c scrap leave: ${data}`, 'color: red; font-size: 15px; font-weight: bold;')
                    });
                })
                .catch(error => console.error(error))
        }

    }, [state.scrapConnection, state.line])

    //* other side effects
    useEffect(() => {

        if (state.oee) {

            const { line: { startDateTime } } = state.oee;
            const subTitle = `Production Started at ${moment(startDateTime).format('lll')}`
            dispatch({ type: 'SET_SUB_TITLE', payload: subTitle })
            dispatch({ type: 'SET_START_BUTTON_DISABLE', payload: true })

        } else {

            dispatch({ type: 'SET_SUB_TITLE', payload: null })
            dispatch({ type: 'SET_START_BUTTON_DISABLE', payload: false })

        }

    }, [state.oee])

    useEffect(() => {
        history.push(`/oee/assembly/${guid}?id=${state.oee?.line?.oeeId ?? ''}`)
    }, [state.oee, guid, history])

    //* events
    const onStartClick = () => setVisible(true)

    const onEndConfirm = () => {

        confirm({
            title: `Do you want to stop ${state.line?.groupName} production?`,
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            centered: true,
            cancelText: 'No',
            async onOk() {

                const response = await api.post(`/oee`, {
                    oeeId: state.oee?.line?.oeeId,
                    LineId: guid,
                    endDateTime: new Date(),
                    timestamp: state.oee?.line?.timestamp,
                })
    
                dispatch({ type: 'SET_OEE', payload: response.data })

            }
        })

    }
  
    const onSubmit = () => form.submit();

    const onFinish = async ({ clockNumber }) => {

        try {

            const response = await api.post(`/oee`, { LineId: guid, clockNumber })
            dispatch({ type: 'SET_OEE', payload: response.data });
            setVisible(false)

        } catch (error) {
            
        }

    }

    const onCancelModal = () => setVisible(false)

    return (
        <>
    
            <PageHeader
                className="site-page-header"
                title={`${state.line?.groupName} OEE`}
                subTitle={state.subTitle}
                tags={state.oee?.line?.endDateTime === undefined 
                        ? <Tag color={darkGray}>Not Running</Tag> 
                        : <Tag color={green}>Running</Tag>}
                onBack={() => history.push(`/oee/${department}`)}
            />

            <Content className="ma3 mt0">

                <Row gutter={[12,12]}>

                    <Col span={24}>

                        <SuccessButton 
                            disabled={state.startButtonDisabled}
                            onClick={onStartClick}
                            size="large" 
                            className="mr2" 
                            style={{ width: '12rem' }} >
                                Start Production
                        </SuccessButton>

                        <Button 
                            type="primary" 
                            disabled={!state.startButtonDisabled}
                            size="large" 
                            onClick={onEndConfirm}
                            style={{ width: '12rem' }} 
                            danger >
                                Stop Production
                        </Button>
                    
                    </Col>

                    <Col span={24}>

                        <OeeCards state={state} />

                    </Col>

                </Row>

            </Content>

            <Modal
                title={`${state.line?.groupName} Start Production Login`}
                visible={visible}
                centered={true}
                onOk={onSubmit}
                okText="Submit"
                onCancel={onCancelModal}
            >
                <Form layout="inline" form={form} onFinish={onFinish}>
                
                    <Form.Item
                        label="Clock Number"
                        name="clockNumber"
                        rules={[{ required: true, message: 'Please enter clock number' }]}>

                            <InputNumber style={{ width: '10rem' }} max={9999} min={0} type="number" />

                    </Form.Item>

                </Form>

            </Modal>
        
        </>

    )
 }

 export default Oee;