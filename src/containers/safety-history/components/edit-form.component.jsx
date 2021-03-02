import React from 'react'
import { useSelector } from 'react-redux';
import { longDateFormat, disabledDate } from '../../../core/utilities/helpers'

import { 
    Input,
    Form,
    Select,
    DatePicker,
    Checkbox
 } from "antd";

const { Option } = Select;
const { TextArea } = Input;

const formLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        }
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span:24,
        },
    }
};

const shiftArr = [1,2,3,'A','B','C','D','M','E']

const EditForm = ({
    form,
    isClosed,
    isRecordable,
    mitigatedTimeStamp,
    onFinish,
    onInjuryStateChange,
    onCheckBoxChange,
    onMitigatedChecked,
}) => {

    const departments = useSelector(({ safetyHistory }) => safetyHistory.departments);
    const bodyParts = useSelector(({ safetyHistory }) => safetyHistory.bodyParts);
    const injuries = useSelector(({ safetyHistory }) => safetyHistory.injuries);
    const status = useSelector(({ safetyHistory }) => safetyHistory.status);

    return (
        <Form {...formLayout} onFinish={onFinish} form={form}>

                    <Form.Item
                        label="Id"
                        hidden={true}
                        name="id">
                            <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Department"
                        name="dept"
                        rules={[
                            {
                                required: true,
                                message: 'Please select department',
                            },
                        ]}
                        hasFeedback>
                        <Select>
                            {
                                departments?.map(({ dept1 }) => <Option key={dept1} value={dept1}>{dept1}</Option>)
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Supervisor"
                        name="supervisor">
                            <Input />
                    </Form.Item>

                    <Form.Item
                        label="First Name"
                        name="fname"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter first name',
                            },
                        ]}
                        hasFeedback>
                            <Input />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="lname"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter last name',
                            },
                        ]}
                        hasFeedback>
                            <Input />
                    </Form.Item>

                    <Form.Item
                        label="Shift"
                        name="shift"
                        rules={[
                            {
                                required: true,
                                message: 'Please select shift',
                            },
                        ]}
                        hasFeedback>
                        <Select>
                            {
                                shiftArr.map(shift => <Option key={shift} value={shift}>{shift}</Option>)
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Incident Date"
                        name="accidentDate"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter incident date',
                            },
                        ]}
                        hasFeedback>

                            <DatePicker
                                disabledDate={disabledDate}
                                format={longDateFormat}
                                showTime
                                style={{
                                    width: '100%',
                                }} />
                    </Form.Item>

                    <Form.Item
                        label="Injury Type"
                        name="injuryId"
                        rules={[
                            {
                                required: true,
                                message: 'Please select injury type',
                            },
                        ]}
                        hasFeedback>
                        <Select>
                            {
                                injuries.map(({ id, injuryName }) => <Option key={id} value={id}>{injuryName}</Option>)
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Body Part"
                        name="bodyPartId"
                        rules={[
                            {
                                required: true,
                                message: 'Please select body part',
                            },
                        ]}
                        hasFeedback>
                        <Select>
                            {
                                bodyParts.map(({ id, bodyPart1 }) => <Option key={id} value={id}>{bodyPart1}</Option>)
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Injury Status"
                        name="injuryStatId"
                        rules={[
                            {
                                required: true,
                                message: 'Please select injury status',
                            },
                        ]}
                        hasFeedback>
                        <Select onChange={onInjuryStateChange}>
                            {
                                status.map(({ injuryStat1 }) => <Option key={injuryStat1} value={injuryStat1}>{injuryStat1}</Option>)
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter description',
                            },
                        ]}
                        hasFeedback>
                            <TextArea autoSize={true} />
                    </Form.Item>

                    <Form.Item
                        label="Interim Action Taken"
                        name="interimActionTaken"
                        hasFeedback>
                            <TextArea autoSize={true} />
                    </Form.Item>

                    <Form.Item
                        label="Final Corrective Action"
                        name="finalCorrectiveAction"
                        hasFeedback>
                            <TextArea autoSize={true} />
                    </Form.Item>

                    <Form.Item
                        label="Close"
                        name="isClosed"
                        valuePropName="checked"
                        hasFeedback>
                            <Checkbox onChange={onCheckBoxChange} />
                    </Form.Item>

                    <Form.Item
                        label="FM Tips Number"
                        name="fmTipsNumber"
                        rules={[
                            {
                                required: isClosed && isRecordable,
                                message: 'Please enter FM Tips Number',
                            },
                        ]}
                        hasFeedback>
                            <Input disabled={!isClosed || !isRecordable} />
                    </Form.Item>

                    <Form.Item
                        label="Mitigated"
                        name="mitigated"
                        valuePropName="checked"
                        hasFeedback>
                            <Checkbox onChange={onMitigatedChecked} />
                    </Form.Item>

                    <Form.Item
                        label="MItigated Date"
                        name="mitigatedTimeStamp"
                        rules={[
                            {
                                required: !!mitigatedTimeStamp,
                                message: 'Please enter FM Tips Number',
                            },
                        ]}
                        hasFeedback>
                            <DatePicker
                                disabledDate={disabledDate}
                                format={longDateFormat}
                                value={mitigatedTimeStamp}
                                disabled={mitigatedTimeStamp ? false : true}
                                showTime
                                style={{
                                    width: '100%',
                                }} />
                    </Form.Item>

                    <Form.Item
                        label="Notes"
                        name="notes"
                        hasFeedback>
                            <TextArea autoSize={true} />
                    </Form.Item>

                </Form>

    )
}

export default EditForm;