import React, { useState, useEffect } from 'react'
import moment from 'moment'
import api from '../../API'
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

 import InventoryDetailsTable from '../../components/logistics/inventory-details-table.component'
 import CustomerComments from '../../components/logistics/customer-comments.components'
 
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
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState([]);
    const [settingsError, setSettingsError] = useState(null);
    const [header, setHeader] = useState(null)

    const getData = async () => {
        try {
                
            setLoading(true);
            const dateStr = date.format(dateFormat);
            const response = await api.get(`logistics/settings?date=${dateStr}`);
            setSettings(response.data);
            setHeader(`Logistics Settings: ${dateStr}`)

        } catch (error) {
            setSettingsError(error.message)
            console.error('error', error.message)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

        getData();

    }, [])

    const onDateChange = date => setDate(date)
    const onClick = () => getData();

    const uploadProps = {
        name: 'file',
        accept: '.xlsx',
        method:'POST',
        data: {
            date: date.format(dateFormat)
        },
        action: `${url}logistics/upload/inventory`,
        onChange(info) {

            const { status } = info.file;
            const { file: { name } } = info;
    
            console.log(status, info)
        
            if (status === 'done') {
                message.success(`${name} file uploaded successfully for date ${date.format(dateFormat)}`);
                setError(null);
                getData();
            } 
            
            if (status === 'error') {
                const { file: { response } } = info;
                setError(response);
                message.error(`${name} file upload failed, ${response}`);
            }
    
        },
    };

    return (<>
    
            <PageHeader
                className="site-page-header"
                title={header}
            />

            <Content className="ma3 mt0">

                <Row>

                    <Col span={24}> 

                        <span className="mr2">Date Range:</span>
                        <DatePicker className="mr2" format={dateFormat} defaultValue={today} onChange={onDateChange} />
                        <Button type="primary" onClick={onClick} loading={loading} >Go</Button>

                    </Col>

                    <Col span={24}> 

                        <Tabs defaultActiveKey="inventory" >

                            <TabPane tab="Upload" key="upload">

                                <Row gutter={[12,12]}>

                                    <Col span={24}>

                                        {
                                            error ? <Alert className="mb2" message={error} type="error" showIcon /> : null
                                        }

                                        <div>
                                            <Dragger {...uploadProps}>
                                                <p className="ant-upload-drag-icon">
                                                    <InboxOutlined />
                                                </p>
                                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                                <p className="ant-upload-hint">
                                                    Support for a single .xlsx file upload.
                                                </p>
                                            </Dragger>
                                        </div>
                                        
                                    </Col>

                                    <Col span={24}>

                                        { settingsError ?  <Alert message={settingsError} type="error" showIcon /> : null }
                                        <InventoryDetailsTable details={settings?.stockOverviewDetails ?? []} loading={loading}  />

                                    </Col>

                                </Row>

                            </TabPane>

                            <TabPane tab="Customer Comments" key="customerComments">
                                
                                <CustomerComments 
                                    comments={settings?.customerComments ?? []}
                                    loading={loading} 
                                    date={date.format(dateFormat)} />

                            </TabPane>

                        </Tabs>
                    
                    </Col>

                </Row>

                

                

            </Content>

    </>)
}

export default InventoryPage;