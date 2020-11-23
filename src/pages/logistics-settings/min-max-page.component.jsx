import React, { useEffect, useState } from 'react'
import axios from 'axios';
import api from '../../API'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { 
    Layout,
    PageHeader,
    Form,
    Button,
    Space, 
    Row,
    Col,
    Select,
    InputNumber
 } from "antd";

 const { Content } = Layout;
 const { Option } = Select

const CostTargetsPage = () => {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [programs, setprograms] = useState([]);
    const [locations, setLocations] = useState([]);
    const [targets, setTargets] = useState([]);

    useEffect(() => {

        setLoading(true)

        axios.all([
            api.get(`logistics/programs`),
            api.get(`logistics/locations`),
            api.get(`logistics/program/targets`)
        ])
        .then(axios.spread((...responses) => {

            const programs = responses[0].data;
            const locations = responses[1].data;
            const targets = responses[2].data;

            setprograms(programs);
            setLocations(locations);
            setTargets(targets);

            // form.setFieldsValue({
            //     targets: targets.map(())
            // })

        }))
        .catch(error => setError(error))
        .finally(() => setLoading(false))

    }, [])

    const onFinish = values => {
        console.log('Received values of form:', values);
    };

    return (<>
        <PageHeader
            className="site-page-header"
            title="Inventory Min / Max Targets"
        />

        <Content className="ma3 mt0">

            <Row gutter={[16,16]}>

                <Col xs={24} lg={6}>

                    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" form={form}>

                        <Form.List name="targets">

                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(field => (
                                        <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">

                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'program']}
                                                fieldKey={[field.fieldKey, 'program']}
                                                rules={[{ required: true, message: 'Please select program' }]}
                                            >
                                                <Select placeholder="Program" style={{ width: '10rem'}}>
                                                    {
                                                        programs.map(program => <Option key={program}>{program}</Option>)
                                                    }
                                                </Select>
                                            </Form.Item>

                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'sloc']}
                                                fieldKey={[field.fieldKey, 'sloc']}
                                                rules={[{ required: true, message: 'Please select SLOC' }]}
                                            >
                                                <Select placeholder="SLOC" style={{ width: '10rem'}}>
                                                    {
                                                        locations.map(loc => <Option key={loc}>{loc}</Option>)
                                                    }
                                                </Select>
                                            </Form.Item>

                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'min']}
                                                fieldKey={[field.fieldKey, 'min']}
                                                rules={[{ required: true, message: 'Please enter min' }]}
                                            >
                                                <InputNumber min={0} placeholder="Min"/>
                                            </Form.Item>

                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'max']}
                                                fieldKey={[field.fieldKey, 'max']}
                                                rules={[{ required: true, message: 'Please enter max' }]}
                                            >
                                                <InputNumber min={0} placeholder="Max"/>
                                            </Form.Item>

                                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                                        </Space>
                                    ))}

                                    <Form.Item>
                                        <Button type="dashed" loading={loading} onClick={() => add()} block icon={<PlusOutlined />} >
                                            Add field
                                        </Button>
                                    </Form.Item>
                                </>
                            )}

                        </Form.List>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Submit
                            </Button>
                        </Form.Item>

                    </Form>
                
                </Col>

            </Row>
            
        

        </Content>

    </>)

}

export default CostTargetsPage;