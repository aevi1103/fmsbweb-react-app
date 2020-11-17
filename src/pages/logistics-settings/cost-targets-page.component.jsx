import React, { useState, useEffect } from 'react'
import api from '../../API'
import numeral from 'numeral'
import moment from 'moment'
import { 
    Layout,
    PageHeader,
    Form,
    Button,
    Select,
    InputNumber,
    Row,
    Col,
    Table
 } from "antd";

const { Content } = Layout;
const { Option } = Select

const CostTargetsPage = () => {

    const [form] = Form.useForm();
    const [types, setTypes] = useState([]);
    const [targets, setTargets] = useState([])
    const [typesLoading, setTypesLoading] = useState(false);
    const [targetsLoading, setTargetsLoading] = useState(false)

    useEffect(() => {

        const getTypes = async () => {

            try {
                
                setTypesLoading(true)
                const response = await api.get(`logistics/cost/types`);
                const data = response.data;
                setTypes(data);

            } catch (error) {
                console.error(error)
            } finally { 
                setTypesLoading(false)
            }

        }

        const getTargets = async () => {

            try {

                setTargetsLoading(true)
                const response = await api.get(`logistics/cost/targets`);
                const targets = response.data;
                setTargets(targets);

            } catch (error) {
                console.error(error)
            } finally {
                setTargetsLoading(false)
            }

        }

        getTypes();
        getTargets();

    }, [])

    const onFinish = async values => {
        
        const response = await api.post(`logistics/cost/targets`, values);

        console.log(response)

    }

    const onSelectChange = value => {
        const { target } = targets.find(({ logisticsInventoryCostType }) => logisticsInventoryCostType?.logisticsInventoryCostTypeId === value) || 0
        form.setFieldsValue({
            target
        })
    }

    const columns = [
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type'
        },
        {
          title: 'Target',
          dataIndex: 'target',
          key: 'target',
          render: value => numeral(value).format('0,0')
        },
        {
          title: 'Time Stamp',
          dataIndex: 'stamp',
          key: 'stamp',
          render: date => moment(date).format('lll')
        }
    ];

    const data = targets.map(d => ({
        key: d.logisticsInventoryCostTargetId,
        type: d.logisticsInventoryCostType.type,
        target: d.target,
        stamp: d.timeStamp
    }))

    return (<>
        <PageHeader
            title="Costs Targets"
        />

        <Content className="ma3 mt0">

            <Row gutter={[16,16]}>

                <Col span={24}>
                
                    <Form 
                        form={form}
                        layout="inline"
                        onFinish={onFinish}>

                        <Form.Item 
                            label="Cost Type"
                            name="logisticsInventoryCostTypeId"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select type',
                                },
                            ]}>

                            <Select style={{ width: '12rem' }} onChange={onSelectChange}>
                                {
                                    types.map(({ logisticsInventoryCostTypeId, type }) => <Option 
                                        key={logisticsInventoryCostTypeId} 
                                        value={logisticsInventoryCostTypeId}>{type}</Option>)
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item 
                            label="Target"
                            name="target"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter target',
                                },
                            ]}>
                            <InputNumber style={{ width: '12rem' }} />
                        </Form.Item>

                        <Form.Item >
                            <Button type="primary" htmlType="submit" >Save</Button>
                        </Form.Item>

                    </Form>

                </Col>

                <Col span={24}>
                    <Table loading={targetsLoading} bordered={true} columns={columns} dataSource={data} />
                </Col>

            </Row>

            

        </Content>

    </>)


}

export default CostTargetsPage;