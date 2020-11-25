import React, { useEffect, useState } from 'react'
import axios from 'axios';
import api from '../../core/utilities/api'
import { PlusOutlined } from '@ant-design/icons';
import { useTitle } from 'react-use'
import MinMaxFieldRow from '../../components/logistics/min-max-field-row.component'
import { 
    Layout,
    PageHeader,
    Form,
    Button,
    Row,
    Col
 } from "antd";

 const { Content } = Layout;

const InventoryMinMaxTargets = () => {

    useTitle('Inventory Min / Max Targets')

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [programs, setprograms] = useState([]);
    const [locations, setLocations] = useState([]);

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

            form.setFieldsValue({
                targets
            })

            setprograms(programs);
            setLocations(locations);

        }))
        .catch(error => setError(error))
        .finally(() => setLoading(false))

    }, [])


    return (<>
        <PageHeader
            className="site-page-header"
            title="Inventory Min / Max Targets"
        />

        <Content className="ma3 mt0">

            <Row gutter={[16,16]}>

                <Col xs={24} lg={6}>

                    <Form name="dynamic_form_nest_item" autoComplete="off" form={form}>

                        <Form.List name="targets">

                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(field => (
                                        <MinMaxFieldRow key={field.key}
                                            field={field} 
                                            remove={remove}
                                            programs={programs}
                                            locations={locations}
                                            form={form} />
                                    ))}

                                    <Form.Item>
                                        <Button type="dashed" loading={loading} onClick={() => add()} block icon={<PlusOutlined />} >
                                            Add field
                                        </Button>
                                    </Form.Item>
                                </>
                            )}

                        </Form.List>

                        {/* <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Submit
                            </Button>
                        </Form.Item> */}

                    </Form>
                
                </Col>

            </Row>
            
        

        </Content>

    </>)

}

export default InventoryMinMaxTargets;