import React, { useEffect, useState } from 'react'
import api from '../../API'

import CustomerCommentsTable from '../../components/logistics/customer-comments-table'

import {
    Form,
    Button,
    Input,
    Row,
    Col,
    Select,
    Alert
} from 'antd'

const { Option } = Select;
const { TextArea } = Input;

const layout = {
    labelCol: {
        xs: { span: 24 },
        lg: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        lg: { span: 8 },
      },
  };
  const tailLayout = {
    wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        lg: {
          span: 24,
          offset: 2,
        },
      },
  };

const CustomerComments = ({ comments = [], loading = false, date }) => {

    const [form] = Form.useForm();
    const [error, setError] = useState(null);
    const [customer, setCustomer] = useState(null);

    const [customersCollection, setCustomersCollection] = useState([]);
    const [customerLoading, setCustomerLoading] = useState(false);

    const [commentCollection, setCommentCollection] = useState([]);
    const [commentLoading, setCommentLoading] = useState(false)

    const getCustomers = async () => {

        try {
            
            setCustomerLoading(true)
            const response = await api.get(`logistics/customers`);
            setCustomersCollection(response.data);

        } catch (error) {
            setError(error.message);
        } finally {
            setCustomerLoading(false)
        }

    }

    useEffect(() => {
        getCustomers();
    }, [])

    useEffect(() => {
        setCommentCollection(comments);
        setCommentLoading(loading)
    }, [comments, loading]);

    const onFinish = async values => {
        
        try {
            
            setCommentLoading(true)
            const { logisticsId, id } = customer || {};
            const body = { 
                customer: { 
                    customer: values.customer,
                    comment: values.comment,
                    logisticsId: logisticsId ?? 0,
                    id: id ?? 0,
                    modifiedDate: new Date()
                },
                date
             }

            const response = await api.post(`logistics/customers/comments`, body);
            const data = response.data;

            setCustomer(data.customer);
            setCommentCollection(data.comments);

        } catch (error) {
            setError(error.message)
        } finally { 
            setCommentLoading(false)
        }

    }

    const onCustomerChange = value => { 
        const data = commentCollection.find(({ customer }) => customer === value) ?? null;
        setCustomer(data);

        console.log({data, value})

        if (data) { 
            form.setFieldsValue({ 
                customer: data.customer,
                comment: data.comment
            })
        } else { 
            form.setFieldsValue({
                comment: ''
            });
        }
     }

     const onDelete = async () => {

        try {
            
            setCommentLoading(true)
            const { id } = customer || {};
            const response = await api.delete(`logistics/customers/comments/${id}?date=${date}`);
            const data = response.data;

            setCustomer(null);
            setCommentCollection(data);

        } catch (error) {
            setError(error.message)
        } finally { 
            setCommentLoading(false)
        }

     }

    return (
        <Row>

            <Col span={24} >

                {
                    error ? <Alert className="mb2" message={error} type="error" showIcon /> : null
                }

                <Form {...layout} onFinish={onFinish} form={form}>

                    <Form.Item
                        label="Customer"
                        name="customer"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please select customer',
                            }
                        ]}>
                        
                        <Select loading={customerLoading} onChange={onCustomerChange}>
                            { 
                                customersCollection.map(({ logisticCustomerNameId }) => <Option 
                                    key={logisticCustomerNameId} 
                                    value={logisticCustomerNameId}>
                                        {logisticCustomerNameId}
                                    </Option>)
                            }
                        </Select>
                        
                    </Form.Item>

                    <Form.Item
                        label="Comment"
                        name="comment"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please enter comment',
                            }
                        ]}>
                        
                        <TextArea rows={5} />
                        
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        
                        <Button htmlType="submit" type="primary" loading={commentLoading} className="mr2">
                            {
                                customer ? 'Update' : 'Add'
                            }
                        </Button>

                        { 
                            customer ? <Button type="danger" onClick={onDelete}>Delete</Button> : null
                        }
                    </Form.Item>

                </Form>

            </Col>

            <Col span={24}>
            
                <CustomerCommentsTable customerComments={commentCollection} loading={commentLoading} />

            </Col>

        </Row>

    )
}

export default CustomerComments;