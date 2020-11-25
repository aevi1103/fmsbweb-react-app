import React, { useState } from 'react'
import moment from 'moment'
import { InboxOutlined } from '@ant-design/icons';
import ProductionOrder from '../../components/logistics/production-order.component'
import { 
    Layout,
    PageHeader,
    Upload,
    DatePicker,
    Button,
    Row,
    Col,
    message,
    Alert
 } from "antd";
import { useTitle } from 'react-use';

 const { Content } = Layout;
 const { Dragger } = Upload;
 const dateFormat = 'MM/DD/YYYY';

 const { 
    NODE_ENV,
    REACT_APP_DEV_API_URL,
    REACT_APP_API_URL
} = process.env;

const url = NODE_ENV === 'production' ? REACT_APP_API_URL : REACT_APP_DEV_API_URL;

const ProductionOrderFileUpload = () => {

    useTitle('Production Order');
    const today = moment();
    const [date, setDate] = useState(today);
    const [error, setError] = useState(null);
    // const [loading, setLoading] = useState(false);

    const uploadProps = {
        name: 'file',
        accept: '.xlsx',
        method:'POST',
        data: {
            date: date.format(dateFormat)
        },
        action: `${url}logistics/upload/order`,
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

    const onDateChange = date => setDate(date)
    const onClick = () => {}

    return (<>
        <PageHeader
            className="site-page-header"
            title="Production Order"
        />

        <Content className="ma3 mt0">

            <Row gutter={[12,12]}>

                <Col span={24}> 

                    <span className="mr2">Date Range:</span>
                    <DatePicker className="mr2" format={dateFormat} defaultValue={today} onChange={onDateChange} />
                    <Button type="primary" onClick={onClick} >Go</Button>

                </Col>

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

                    <ProductionOrder/>

                </Col>

            </Row>


        </Content>

    </>)

}

export default ProductionOrderFileUpload;