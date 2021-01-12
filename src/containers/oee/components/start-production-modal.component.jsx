import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    postOeeStartAsync
} from '../../../core/redux/oee/oee.actions'
import {
    Modal,
    Form,
    InputNumber
} from 'antd'

const StartProductionModal = ({
    visible,
    onCancel
}) => {

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const lineId = useSelector(({ oeeReducer }) => oeeReducer.line?.lineId)
    const machineName = useSelector(({ oeeReducer }) => oeeReducer.line?.machineName)

    const onFinish = async ({ clockNumber }) => {
        dispatch(postOeeStartAsync({
            lineId,
            clockNumber
        }));
        onCancel()
    }

    return (
        <Modal
            title={`${machineName} Start Production Login`}
            visible={visible}
            centered={true}
            onOk={() => form.submit()}
            okText="Submit"
            onCancel={onCancel}
        >
            <Form layout="inline" form={form} onFinish={onFinish}>
                <Form.Item
                    label="Clock Number"
                    name="clockNumber"
                    rules={[{ required: true, message: 'Please enter clock number' }]}>
                        <InputNumber style={{ width: '10rem' }} max={9999} min={0} type="number" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default StartProductionModal;