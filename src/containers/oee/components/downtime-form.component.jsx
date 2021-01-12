import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import api from '../../../core/utilities/api'

import {
    getMachineGroup,
    getReason2,
    getDowntimeList,
    deleteRecord
} from '../services/api'

import DowntimeTable from './downtime-table.component'

import {
    Row,
    Col,
    Form,
    Button,
    Input,
    InputNumber,
    Switch,
    Select,
    message
} from 'antd'

const { Option } = Select;
const { TextArea } = Input

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
};

const DowntimeForm = React.memo(() => {

    const mahcineGroup = useSelector(({ oeeReducer }) => oeeReducer.line?.machineGroups ?? [])
    const oeeId = useSelector(({ oeeReducer }) => oeeReducer.oee?.status?.oeeId)

    const primaryReason = useSelector(({ oeeReducer }) => oeeReducer.reason1Collection)

    const [form] = Form.useForm();
    const [mahcines, setMachines] = useState([])
    const [machinesLoading, setMachinesLoading] = useState(false)
    const [reason2, setReason2] = useState([])
    const [reason2Loading, setReason2LOading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [downtime, setDowntime] = useState([])
    const [record, setRecord] = useState(null)

    //* methods
    const reset = () => {
        form.resetFields()
        setRecord(null)
        setMachines([])
        setReason2([])
    }

    //* effects
    useEffect(() => {

        if (oeeId) {
            (async function () {
                const response = await getDowntimeList(oeeId);
                setDowntime(response.data)
            })()
        }

    }, [oeeId])

    useEffect(() => {

        if (record) {

            console.log(record)

            form.resetFields()
            const { groupId, primaryReasonId } = record;

            setMachinesLoading(true)
            setReason2LOading(true)

            Promise.allSettled([
                getMachineGroup(groupId),
                getReason2(primaryReasonId)
            ])
            .then(results => {

                setMachines(results[0].value.data)
                setReason2(results[1].value.data)
                form.setFieldsValue(record)

            })
            .finally(() => {
                setMachinesLoading(false)
                setReason2LOading(false)
            })
            
        }

    }, [record, form])

    //* event handlers
    const onMachineGroupChange = async value => {

        try {

            setMachinesLoading(true)
            const response = await getMachineGroup(value);
            setMachines(response.data)

            form.setFieldsValue({ machineId: '' })

        } catch (error) {
        } finally {
            setMachinesLoading(false)
        }

    }

    const onPrimaryReasonChange = async value => {

        try {

            setReason2LOading(true)
            const response = await getReason2(value);
            setReason2(response.data)

            form.setFieldsValue({ secondaryReasonId: '' })

        } catch (error) {
        } finally {
            setReason2LOading(false)
        }

    }

    const onSubmit = async values => {

        try {
            
            setSubmitLoading(true)
            await api.post(`/downtimereasons`, values);
            
            const response = await getDowntimeList(oeeId);
            setDowntime(response.data)
            reset()

            message.success('Record successfully saved!')

        } catch (error) {
        } finally {
            setSubmitLoading(false)
        }

    }

    const onDelete = async record => {

        try {

            const { downtimeId, timestamp } = record;

            await deleteRecord(downtimeId, timestamp)

            const newDowntime = downtime.filter(({ downtimeEventId }) => downtimeEventId !== downtimeId)
            setDowntime(newDowntime)

            message.success('record successfully deleted!')

        } catch (error) {
        }

    }

    return (
        <>
            <Form {...layout} form={form} onFinish={onSubmit} initialValues={{ oeeId, plannedDowntime: false }}>

                <Form.Item hidden={true} name="downtimeId" className="dn">
                    <Input type="hidden"></Input>
                </Form.Item>

                <Form.Item hidden={true} name="oeeId" className="dn">
                    <Input type="hidden"></Input>
                </Form.Item>

                <Form.Item hidden={true} name="timestamp" className="dn">
                    <Input type="hidden"></Input>
                </Form.Item>

                <Form.Item label="Planned Downtime" name="plannedDowntime" valuePropName="checked" >
                    <Switch />
                </Form.Item>

                <Form.Item
                    label="Machine Group"
                    name="groupId"
                    rules={[{ required: true, message: 'Please select machine group.' }]}
                >
                    <Select onChange={onMachineGroupChange}>
                        {
                            mahcineGroup.map(({ machineGroupId, groupName }) => <Option key={machineGroupId} value={machineGroupId}>{groupName.toUpperCase()}</Option>)
                        }
                    </Select>

                </Form.Item>

                <Form.Item
                    label="Machine"
                    name="machineId"
                    rules={[{ required: true, message: 'Please select machine.' }]}
                >
                    <Select loading={machinesLoading}>
                        {
                            mahcines.map(({ machineId, machineName }) => <Option key={machineId} value={machineId}>{machineName.toUpperCase()}</Option>)
                        }
                    </Select>

                </Form.Item>

                <Form.Item
                    label="Primary Reason"
                    name="primaryReasonId"
                    rules={[{ required: true, message: 'Please select primary reason.' }]}
                >
                    <Select onChange={onPrimaryReasonChange}>
                        {
                            primaryReason.map(({ primaryReasonId, reason }) => <Option key={primaryReasonId} value={primaryReasonId}>{reason.toUpperCase()}</Option>)
                        }
                    </Select>

                </Form.Item>

                <Form.Item
                    label="Secondary Reason"
                    name="secondaryReasonId"
                    rules={[{ required: true, message: 'Please select secondary reason.' }]}
                >
                    <Select loading={reason2Loading}>
                        {
                            reason2.map(({ secondaryReasonId, reason }) => <Option key={secondaryReasonId} value={secondaryReasonId}>{reason.toUpperCase()}</Option>)
                        }
                    </Select>

                </Form.Item>

                <Form.Item
                    label="Downtime Loss"
                    name="downtime"
                    rules={[{ required: true, message: 'Please enter downtime.' }]}
                >
                    <InputNumber min={0} max={60} />

                </Form.Item>

                <Form.Item
                    label="Comment"
                    name="comment"
                    rules={[{ required: true, message: 'Please enter comment' }]}
                >
                    <TextArea rows={5}></TextArea>

                </Form.Item>

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
                    <Row gutter={[3,3]}>
                        <Col>
                            <Button type="primary" htmlType="submit" loading={submitLoading} className="mr2" >
                                {
                                    record ? 'Update' : 'Save'
                                }
                            </Button>
                        </Col>
                        <Col>
                            <Button type="primary" onClick={reset} >
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </Form.Item>

            </Form>

            <DowntimeTable 
                data={downtime} 
                loading={submitLoading}
                setRecord={setRecord}
                onDelete={onDelete} />
        </>
    )
})

export default DowntimeForm;