import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { HubConnectionBuilder } from '@microsoft/signalr';
import short from 'short-uuid'

import api from '../../core/utilities/api'

import { 
    Layout,
    PageHeader,
    List
 } from "antd";

 const { Content } = Layout;

 const Oee = () => {

    const { guid } = useParams(); 

    const [loading, setLoading] = useState(false);

    const [counterConnection, setCounterConnection] = useState(null);
    const [downtimeConnection, setDowntimeConnection] = useState(null);
    const [scrapConnection, setScrapConnection] = useState(null);

    const [items, setItems] = useState([])
    const [tag, setTag] = useState(null); 

    //* event state
    const [counter, setCounter] = useState(null)
    const [downtime, setDowntime] = useState(null)
    const [scrap, setScrap] = useState(null)

    useEffect(() => {

        (async function getLine() {

            try {
                        
                setLoading(true);
                const response = await api.get(`oee/group/${guid}`)
                setTag(response.data)
    
            } catch (error) {
                
            } finally {
                setLoading(false);
            }

        })()

    }, [])

    //* counter
    useEffect(() => {

        const counterConn = new HubConnectionBuilder()
            .withUrl(`https://localhost:44384/counterhub`)
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
                })
                .catch(error => console.error(error))
        }

    }, [counterConnection, tag])

    //* downtime
    useEffect(() => {

        const downtimeConn = new HubConnectionBuilder()
            .withUrl(`https://localhost:44384/downtimehub`)
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
                })
                .catch(error => console.error(error))
        }

    }, [downtimeConnection, tag])


    //* scrap
    useEffect(() => {

        const scrapConn = new HubConnectionBuilder()
            .withUrl(`https://localhost:44384/scraphub`)
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
                />

                <Content className="ma3 mt0">

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