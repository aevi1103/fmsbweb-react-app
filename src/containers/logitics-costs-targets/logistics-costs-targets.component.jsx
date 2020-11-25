import React, { useState, useEffect } from 'react'
import api from '../../core/utilities/api'
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
import { useTitle } from 'react-use';

const { Content } = Layout;
const { Option } = Select

const LogisticsCostsTargets = () => {

    useTitle('Costs Targets');

    const [form] = Form.useForm();
    const [types, setTypes] = useState([]);
    const [targets, setTargets] = useState([])
    const [typesLoading, setTypesLoading] = useState(false);
    const [targetsLoading, setTargetsLoading] = useState(false);
    const [targetId, setTargetId] = useState(0);
    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

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

        getTypes();
        getTargets();

    }, [])

    const onFinish = async values => {
        
        try {
            
            setSaveLoading(true);
            const response = await api.post(`logistics/cost/targets`, {
                ...values,
                logisticsInventoryCostTargetId: targetId
            });
    
            const { logisticsInventoryCostTargetId } = response.data;
            setTargetId(logisticsInventoryCostTargetId);

            getTargets();

        } catch (error) {
            alert('Something went wrong')
        } finally {
            setSaveLoading(false);
        }

    }

    const onSelectChange = value => {
        const { target, logisticsInventoryCostTargetId } = targets.find(({ logisticsInventoryCostType }) => logisticsInventoryCostType?.logisticsInventoryCostTypeId === value) || {}
        setTargetId(logisticsInventoryCostTargetId ?? 0)
        form.setFieldsValue({
            target
        })
    }

    const onDelete = async () => {

        try {

            setDeleteLoading(true);
            await api.delete(`logistics/cost/targets/${targetId}`);

            form.resetFields();
            setTargetId(0);
            getTargets();

        } catch (error) {
            console.error('Something went wrong')
        } finally {
            setDeleteLoading(false)
        }
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
            className="site-page-header"
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
                            <Button type="primary" htmlType="submit" loading={saveLoading}>
                                {
                                    targetId ? 'Update' : 'Add'
                                }
                            </Button>
                        </Form.Item>

                        {
                            targetId
                            ?   <Form.Item >
                                    <Button type="danger" onClick={onDelete} loading={deleteLoading} >Delete</Button>
                                </Form.Item>
                            : null
                        }
                        
                    </Form>

                </Col>

                <Col span={24}>
                    <Table loading={targetsLoading} bordered={true} columns={columns} dataSource={data} />
                </Col>

            </Row>

            

        </Content>

    </>)


}

export default LogisticsCostsTargets;