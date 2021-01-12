import React, { useEffect, useState, useCallback } from 'react'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useWindowUnloadEffect  } from '../../core/utilities/custom-hook'
import { startConnection } from './services/helper'
import {
    fetchLineStartAsync,
    fetchOeeStartAsync,
    fetchReason1StartAsync,
    postOeeStartAsync,
    setSubTitle
} from '../../core/redux/oee/oee.actions'

import { baseUrl } from '../../core/utilities/base-url'
import SuccessButton from '../../components/success-button/success-button.component'
import { green, darkGray } from '../../core/utilities/colors'
import { ExclamationCircleOutlined } from '@ant-design/icons';

import DowntimeForm from './components/downtime-form.component'
import StartProductionModal from './components/start-production-modal.component'

import { 
    Layout,
    PageHeader,
    Row,
    Col,
    Button,
    Tag,
    Modal,
    message
} from "antd";

import OeeCards from './components/oee-cards.component'

const { Content } = Layout;
const { confirm } = Modal;

const Oee = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const { guid, department } = useParams(); 

    //* redux state
    const line = useSelector(({ oeeReducer }) => oeeReducer.line)
    const { machineName, tagName, workCenter, groupName } = line || {}

    const subTitle = useSelector(({ oeeReducer }) => oeeReducer.subTitle)
    const isLinefetching = useSelector(({ oeeReducer }) => oeeReducer.isLinefetching)
    const isOeeFetching = useSelector(({ oeeReducer }) => oeeReducer.isOeeFetching)

    const startDateTime = useSelector(({ oeeReducer }) => oeeReducer.oee?.line?.startDateTime)
    const endDateTime = useSelector(({ oeeReducer }) => oeeReducer.oee?.line?.endDateTime)
    const oeeId = useSelector(({ oeeReducer }) => oeeReducer.oee?.line?.oeeId)
    const timestamp = useSelector(({ oeeReducer }) => oeeReducer.oee?.line?.timestamp)

    //* Hubs connection states
    const [counterConn, setCounterConn] = useState(null);
    const [downtimeConn, setDownitmeConn] = useState(null);
    const [scrapConn, setScrapConn] = useState(null);
    
    const [startModalVisible, setStartModalVisible] = useState(false);
    const [downtimeModalVisible, setDowntimeVisible] = useState(false);

    //* on mount get line and oee data
    useEffect(() => {
        dispatch(fetchLineStartAsync(guid))
        dispatch(fetchOeeStartAsync(guid))
        dispatch(fetchReason1StartAsync())
    }, [])

    useEffect(() => {
        document.title = `${machineName} OEE`;
    }, [machineName])

    //* unsubscribe to group hubs and reset state
    useWindowUnloadEffect(() => {

        if (counterConn) {
            counterConn.invoke('RemoveToGroup', tagName)
        }
            
        if (downtimeConn) {
            downtimeConn.invoke('RemoveToGroup', groupName)
        }
            
        if (scrapConn) {
            scrapConn.invoke('RemoveToGroup', workCenter)
        }
            
    }, true)

    //* open signalr connections
    useEffect(() => {

        //* counter connection
        const counterConn = new HubConnectionBuilder()
            .withUrl(`${baseUrl}/counterhub`)
            .withAutomaticReconnect()
            .build();

        setCounterConn(counterConn)

        //* downtime connection
        const downtimeConn = new HubConnectionBuilder()
            .withUrl(`${baseUrl}/downtimehub`)
            .withAutomaticReconnect()
            .build();

        setDownitmeConn(downtimeConn)

        //* scrap connection
        const scrapConn = new HubConnectionBuilder()
            .withUrl(`${baseUrl}/scraphub`)
            .withAutomaticReconnect()
            .build();

        setScrapConn(scrapConn)

    }, [])

    const onHubChange = useCallback(() => {
        dispatch(fetchOeeStartAsync(guid))
    }, [dispatch, guid])

    //* subscribe to group hubs
    useEffect(() => {
        startConnection(counterConn, line, onHubChange)
    }, [counterConn, line, onHubChange])

    useEffect(() => {
        startConnection(downtimeConn, line, onHubChange)
    }, [downtimeConn, line, onHubChange])

    useEffect(() => {
        startConnection(scrapConn, line, onHubChange)
    }, [scrapConn, line, onHubChange])

    //* other side effects
    useEffect(() => {

        if (startDateTime) {
            const subTitle = `Production Started at ${moment(startDateTime).format('lll')}`
            dispatch(setSubTitle(subTitle))
        } else {
            dispatch(setSubTitle(null))
        }

    }, [startDateTime, dispatch])

    useEffect(() => {
        history.push(`/oee/assembly/${guid}?id=${oeeId ?? ''}`)
    }, [oeeId, guid, history])

    //* events
    const onStartClick = () => setStartModalVisible(true)

    const onEndConfirm = () => {

        confirm({
            title: `Do you want to stop ${machineName} production?`,
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            centered: true,
            cancelText: 'No',
            async onOk() {

                dispatch(postOeeStartAsync({
                    oeeId,
                    LineId: guid,
                    endDateTime: new Date(),
                    timestamp,
                }));

            }
        })

    }
  
    return (
        <>
    
            <PageHeader
                className="site-page-header"
                title={`${machineName} OEE`}
                subTitle={subTitle}
                tags={endDateTime === undefined 
                        ? <Tag color={darkGray}>Not Running</Tag> 
                        : <Tag color={green}>Running</Tag>}
                onBack={() => history.push(`/oee/${department}`)}
                extra={<Row gutter={[6,6]}>
                            <Col>
                                <SuccessButton 
                                    loading={isOeeFetching}
                                    disabled={!!oeeId}
                                    onClick={onStartClick}
                                    size="large" 
                                    className="mr2" 
                                    style={{ width: '12rem' }} >
                                        Start Production
                                </SuccessButton>
                            </Col>
                            <Col>
                                <Button 
                                    loading={isOeeFetching}
                                    type="primary" 
                                    disabled={!(!!oeeId)}
                                    size="large" 
                                    onClick={onEndConfirm}
                                    style={{ width: '12rem' }} 
                                    danger >
                                        Stop Production
                                </Button>
                            </Col> 
                            <Col>
                                <Button 
                                    type="primary" 
                                    disabled={!(!!oeeId)}
                                    size="large" 
                                    style={{ width: '12rem' }} 
                                    onClick={() => setDowntimeVisible(true)}
                                     >
                                        Enter Downtime
                                </Button>
                            </Col> 
                        </Row>}
            />

            <Content className="ma3 mt0">
                <Row gutter={[12,12]}>
                    <Col span={24}>
                        <OeeCards />
                    </Col>
                </Row>
            </Content>

            <StartProductionModal visible={startModalVisible} onCancel={() => setStartModalVisible(false)} />

            <Modal
                title={`${machineName} Downtime`}
                visible={downtimeModalVisible}
                onOk={() => {}}
                okText="Submit"
                onCancel={() => setDowntimeVisible(false)}
                footer={null}
                width="1500px"
            >
                <DowntimeForm />
            </Modal>
        
        </>

    )
 }

 export default Oee;