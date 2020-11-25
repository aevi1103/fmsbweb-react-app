import React, { useState, useEffect } from 'react'
import short from 'short-uuid'
import { HubConnectionBuilder } from '@microsoft/signalr';

import {
    PageHeader,
    Layout,
    Card,
    Input,
    Button,
    Row,
    Col,
    Form
} from 'antd'

const { Content } = Layout;
const { TextArea } = Input;

const formLayout = {
    labelCol: {
        sm: {
            span: 2,
        }
    },
    wrapperCol: {
        sm: {
            span:6,
        },
    }
};

const ChatPage = () => {

    const [connection, setConnection] = useState(null);
    const [chat, setChat] = useState(null);
    const [items, setItems] = useState([])

    useEffect(() => {

        // const conn = new HubConnectionBuilder()
        //     .withUrl(`https://localhost:44384/chathub`)
        //     .withAutomaticReconnect()
        //     .build();

        const conn = new HubConnectionBuilder()
            .withUrl(`https://localhost:44384/counterhub`)
            .withAutomaticReconnect()
            .build();

        console.log(conn)

        setConnection(conn);

    }, [])

    useEffect(() => {

        if (connection) {

            // connection.start()
            //     .then(result => {
            //         console.log('Connected')
            //         connection.on('ReceiveMessage', ( user, message ) => {
            //             const msg = { user, message }
            //             setChat(msg)
            //         })
            //     })
            //     .catch(error => console.error(error))

            connection.start()
                .then(() => {
                    console.log('Connected');

                    connection.on('BroadCastChange', data => {
                        console.log(data)
                    })
                })
                .catch(error => console.error(error))

        }

    }, [connection])

    useEffect(() => {
        const newItems =  [...items];
        newItems.push(chat);
        setItems(newItems.filter(i => i))
    }, [chat])

    const onFinish = async values => {
        const { user, message } = values;
        if (connection) {
            await connection.send('SendMessage', user, message)
        }
    }

    return (

        <>
            <PageHeader title="Chat via SignalR" className="site-page-header" />

            <Content>

                <Row className="ma3">

                    <Col span={24}>

                        <Form {...formLayout} onFinish={onFinish} >

                            <Form.Item 
                                hasFeedback
                                label="User" 
                                name="user"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}>

                                <Input/>

                            </Form.Item>

                            <Form.Item 
                                hasFeedback
                                label="Message" 
                                name="message"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}>

                                <TextArea rows={4}/>

                            </Form.Item>
                            
                            <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 2 }}>

                                <Button htmlType="submit" type="primary" >Send</Button>

                            </Form.Item>

                        </Form>

                    </Col>
                    
                </Row>

                <Row>

                    <Col span={24} >

                        {
                            items.length === 0 
                                ? <span className="ml4">No Items Found</span>
                                : items.map(({ user, message }) => (
                                        <Card key={short.generate()} title={user} > 
                                            <p>{message}</p>
                                        </Card>
                                    ))
                        }

                    </Col>

                </Row>

            </Content>

        </>

    )

}

export default ChatPage;