import React, { useState } from 'react'
import moment from 'moment'
import { InboxOutlined } from '@ant-design/icons';
import { 
    Tabs,
    Layout,
    PageHeader,
    DatePicker,
    Button,
    Row,
    Col,
    Upload,
    message,
    Alert
 } from 'antd';
 
const { Dragger } = Upload;
const { Content } = Layout;
const { TabPane } = Tabs;
const dateFormat = 'MM/DD/YYYY';

const { 
    NODE_ENV,
    REACT_APP_DEV_API_URL,
    REACT_APP_API_URL
} = process.env;

const url = NODE_ENV === 'production' ? REACT_APP_API_URL : REACT_APP_DEV_API_URL;

const InventoryPage = () => {

    const today = moment();
    const [date, setDate] = useState(today);
    const [error, setError] = useState(null)

    const props = {
        name: 'file',
        accept: '.xlsx',
        method:'POST',
        data: {
            date: date.format(dateFormat)
        },
        action: `${url}logistics/upload`,
        onChange(info) {

            const { status } = info.file;
            const { file: { name } } = info;
    
            console.log(status, info)
        
            if (status === 'done') {
                message.success(`${name} file uploaded successfully for date ${date.format(dateFormat)}`);
                setError(null);
            } 
            
            if (status === 'error') {
                const { file: { response } } = info;
                setError(response);
                message.error(`${name} file upload failed, ${response}`);
            }
    
        },
    };

    const onDateChange = date => {
        setDate(date)
    }

    return (<>
    
            <PageHeader
                className="site-page-header"
                title={`Logistics Setting: ${date.format(dateFormat)}`}
            />

            <Content className="ma3 mt0">

                <Row>

                    <Col span={24}> 

                        <span className="mr2">Date Range:</span>
                        <DatePicker className="mr2" format={dateFormat} defaultValue={today} onChange={onDateChange} />
                        <Button type="primary">Go</Button>

                    </Col>

                    <Col span={24}> 

                        <Tabs defaultActiveKey="inventory" >

                            <TabPane tab="Upload" key="upload">

                                {
                                    error ? <Alert className="mb2" message={error} type="error" showIcon /> : null
                                }

                                <div >
                                    <Dragger {...props}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">
                                            Support for a single .xlsx file upload.
                                        </p>
                                    </Dragger>
                                </div>

                                

                            </TabPane>

                            <TabPane tab="Inventory Details" key="details">
                                details
                            </TabPane>

                            <TabPane tab="SLOC Comments" key="sloComments">
                                sloc comments
                            </TabPane>

                            <TabPane tab="Costs Comments" key="costsComments">
                                costs comments
                            </TabPane>

                            <TabPane tab="Customer Comments" key="customerComments">
                                customer comemnt
                            </TabPane>

                        </Tabs>
                    
                    </Col>

                </Row>

                

                

            </Content>

    </>)
}

export default InventoryPage;