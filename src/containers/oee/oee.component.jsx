import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { HubConnectionBuilder } from '@microsoft/signalr';
import short from 'short-uuid'
import { useWindowUnloadEffect  } from '../../core/utilities/custom-hook'

import api from '../../core/utilities/api'
import { baseUrl } from '../../core/utilities/base-url'

import { 
    Layout,
    PageHeader,
    List,
    Row,
    Col,
    Button
 } from "antd";

 const { Content } = Layout;

 const Oee = () => {

    const history = useHistory();
    const { guid, department } = useParams(); 

    const [loading, setLoading] = useState(false);
    const [counterConnection, setCounterConnection] = useState(null);
    const [downtimeConnection, setDowntimeConnection] = useState(null);
    const [scrapConnection, setScrapConnection] = useState(null);
    const [items, setItems] = useState([])
    const [tag, setTag] = useState(null); 

    //* event state (temp)
    const [counter, setCounter] = useState(null)
    const [downtime, setDowntime] = useState(null)
    const [scrap, setScrap] = useState(null)

    //* mount
    useEffect(() => {

        (async function getLine() {

            try {
                        
                setLoading(true);
                const response = await api.get(`oee/lines/${guid}`)

                const data = response.data;
                document.title = `${data.groupName} OEE`

                setTag(data)
    
            } catch (error) {
                
            } finally {
                setLoading(false);
            }

        })()

    }, [])

    //* unmount
    useWindowUnloadEffect(() => {

        if (counterConnection) {
            counterConnection.invoke('RemoveToGroup', tag.tagName)
        }

        if (downtimeConnection) {
            downtimeConnection.invoke('RemoveToGroup', tag.groupName)
        }

        if (scrapConnection) {
            scrapConnection.invoke('RemoveToGroup', tag.workCenter)
        }

    }, true)


    //* counter
    useEffect(() => {

        const counterConn = new HubConnectionBuilder()
            .withUrl(`${baseUrl}/counterhub`)
            .withAutomaticReconnect()
            .build();

        setCounterConnection(counterConn);

    }, [])

    useEffect(() => {

        if (counterConnection && tag) {
            counterConnection.start()
                .then(() => {

                    counterConnection.invoke('AddToGroup', tag.tagName)

                    counterConnection.on('BroadCastChange', data => {
                        console.log('counter', data)
                        setCounter({ type: 'counter', ...data })
                    });

                    counterConnection.on('onJoin', data => {
                        console.log(`%c counter join: ${data}`, 'color: green; font-size: 15px; font-weight: bold;')
                    });

                    counterConnection.on('onLeave', data => {
                        console.log(`%c counter leave: ${data}`, 'color: red; font-size: 15px; font-weight: bold;')
                    });
                })
                .catch(error => console.error(error))
        }

    }, [counterConnection, tag])

    //* downtime
    useEffect(() => {

        const downtimeConn = new HubConnectionBuilder()
            .withUrl(`${baseUrl}/downtimehub`)
            .withAutomaticReconnect()
            .build();

        setDowntimeConnection(downtimeConn);
        
    }, [])

    useEffect(() => {

        if (downtimeConnection && tag) {
            downtimeConnection.start()
                .then(() => {
                    downtimeConnection.invoke('AddToGroup', tag.groupName)

                    downtimeConnection.on('BroadCastChange', data => {
                        console.log('downtime', data)
                        setDowntime({ type: 'downtime', ...data })
                    });

                    downtimeConnection.on('onJoin', data => {
                        console.log(`%c downtime join: ${data}`, 'color: green; font-size: 15px; font-weight: bold;')
                    });

                    downtimeConnection.on('onLeave', data => {
                        console.log(`%c downtime leave: ${data}`, 'color: red; font-size: 15px; font-weight: bold;')
                    });
                })
                .catch(error => console.error(error))
        }

    }, [downtimeConnection, tag])

    //* scrap
    useEffect(() => {

        const scrapConn = new HubConnectionBuilder()
            .withUrl(`${baseUrl}/scraphub`)
            .withAutomaticReconnect()
            .build();

        setScrapConnection(scrapConn);
        
    }, [])

    useEffect(() => {

        if (scrapConnection && tag) {
            scrapConnection.start()
                .then(() => {

                    scrapConnection.invoke('AddToGroup', tag.workCenter)

                    scrapConnection.on('BroadCastChange', data => {
                        console.log('scrap', data)
                        setScrap({ type: 'scrap', ...data })
                    });
                    
                    scrapConnection.on('onJoin', data => {
                        console.log(`%c scrap join: ${data}`, 'color: green; font-size: 15px; font-weight: bold;')
                    });

                    scrapConnection.on('onLeave', data => {
                        console.log(`%c scrap leave: ${data}`, 'color: red; font-size: 15px; font-weight: bold;')
                    });
                })
                .catch(error => console.error(error))
        }

    }, [scrapConnection, tag])


    useEffect(() => {
        setItems([...items, counter])
    }, [counter])

    useEffect(() => {
        setItems([...items, downtime])
    }, [downtime])

    useEffect(() => {
        setItems([...items, scrap])
    }, [scrap])
  
    return (
        <>
    
            <PageHeader
                className="site-page-header"
                title={`${tag?.groupName} OEE`}
                onBack={() => history.push(`/oee/${department}`)}
            />

            <Content className="ma3 mt0">

                <Row>

                    <Col span={24}>

                        <Button type="primary" size="large" className="mr2" success>Start</Button>
                        <Button size="large" >End</Button>
                    
                    </Col>

                </Row>

                <List>
                    {
                        items.map(e => {

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