import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import api from '../../core/utilities/api'
import { 
    Layout,
    PageHeader,
    Select,
    Form,
    Button,
    Alert,
    message,
    InputNumber
 } from "antd";

import { 
    LoginOutlined
} from '@ant-design/icons';

import 'antd/dist/antd.css';

const { Content } = Layout;
const { Option } = Select

const CheckSheetLogInPage = ({
    checkSheetMachineName
}) => {

    const history = useHistory();
    const { controlId, controlName, lineId } = useParams();

    if (!controlId && !lineId) history.push('/')

    const [form] = Form.useForm();
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [checkSheetId, setCheckSheetId] = useState(null);
    const [title, setTitle] = useState(null);

    useEffect(() => {

        setLoading(true)
        api.get(`quality/checksheets/organizationpart?$filter=controlMethodId eq ${controlId}`)
            .then(response => setParts(response.data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))

    }, [])

    useEffect(() => {

        const ttl = `Line ${lineId}: ${controlName} Login`
        document.title = ttl;
        setTitle(ttl)

    }, [controlName, lineId])

    const onFinish = values => {
        console.log(values)

        setSubmitLoading(true);
        setCheckSheetId(null)
        api.post('/quality/checksheets/checksheet', {
            ...values,
            controlMethodId: controlId,
            lineId
        })
        .then(response => {
            form.resetFields();
            setCheckSheetId(response.data.checkSheetId);
            message.success('Successfully Logged in');
        })
        .catch(err => {
            setError(err.message)
            setSubmitLoading(false);
        })
    }

    useEffect(() => {
        if (checkSheetId) {
            const redirect = `/quality/checksheets/${controlName}/${controlId}/line/${lineId}/checkSheet/${checkSheetId}#${checkSheetMachineName}`;
            history.push(redirect)
        }
    }, [checkSheetId, history, controlName, controlId, lineId, checkSheetMachineName])

    const layout = {
        labelCol: {
            sm: {
                span: 5,
            },
            lg: {
                span: 2
            }
        },
        wrapperCol: {
            sm: {
                span:12,
            },
            lg: {
                span: 5
            }
        }
      };

    const tailLayout = {
        wrapperCol: {
            lg: { offset: 2, span: 4 },
            sm: { offset: 5, span: 4 }
        },
    };

    return (
        <>
            <PageHeader
                className="site-page-header"
                title={title}
                onBack={() => history.push(`/quality/checksheets/controlmethod/${controlId}`)}
            />

            <Content className="ma3 mt0">
                    
                {
                    error ? <Alert className="mb3 w-100" message={error} type="error" showIcon /> : null
                }

                <Form {...layout} form={form} onFinish={onFinish} >
                
                    <Form.Item
                        label="Clock Number"
                        name="clockNumber"
                        rules={[{ required: true, message: 'Please input your clock number' }]}
                    >
                        <InputNumber min={0} className="w-100" type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Part Number"
                        name="organizationPartId"
                        rules={[{ required: true, message: 'Please select your part number' }]}
                    >
                        <Select loading={loading}>
                            {
                                parts.map(({organizationPartId, part}) => (
                                    <Option key={organizationPartId} value={organizationPartId}>{part}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" loading={submitLoading} className="mr2">
                            <LoginOutlined /> Login
                        </Button>
                    </Form.Item>

                </Form>

            </Content>
        </>
    )
}

const mapStateToProps = ({qualityCheckSheet}) => ({
    checkSheetMachineName: qualityCheckSheet.checkSheetMachineName
})

export default connect(mapStateToProps)(CheckSheetLogInPage);