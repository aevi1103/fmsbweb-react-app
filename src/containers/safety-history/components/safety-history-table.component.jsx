import React, { useState } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { longDateFormat, disabledDate } from '../../../core/utilities/helpers'
import http from '../../../core/utilities/api'
import { dispatchIncidentsQry } from '../services/api'
import { 
    Table,
    Menu,
    Dropdown,
    Typography,
    Modal,
    message,
    Input,
    Form,
    Select,
    DatePicker,
    Checkbox
 } from "antd";

import {
    DeleteOutlined,
    EditOutlined,
    PaperClipOutlined
} from '@ant-design/icons';

const { Link } = Typography;
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

const menu = (record, setIsModalVisible, form, setIsClosed) => {

    console.log({record})

    const { confirm } = Modal;
    const { id } = record;

    const onEditClick = () => {
        
        form.resetFields();
        form.setFieldsValue({
            ...record,
            accidentDate: moment(record.accidentDate)
        })

        setIsModalVisible(true)
        setIsClosed(record.isClosed)
    }

    const showConfirmDelete = () => {
        confirm({
            title: 'Do you Want to delete these item?',
            onOk() {
             
                return new Promise((resolve, reject) => {
                    http.delete(`safety/${id}`).then(data => {
                        resolve(data)
                        //* delete row
                    }).catch(err => reject(err))
                })
                .catch(() => message.error('Something went wrong while deleting the record.'))

            }
          });
    }

    return (
        <Menu>
            <Menu.Item onClick={onEditClick}>
                <EditOutlined />
                <span>Edit</span>
            </Menu.Item>
            <Menu.Item onClick={showConfirmDelete}>
                <DeleteOutlined />
                <span>Delete</span>
            </Menu.Item>
            <Menu.Item disabled>
                <PaperClipOutlined />
                <span>Attachments</span>
            </Menu.Item>
        </Menu>
    )
}

const IncidentHistoryTable = ({ department, range }) => {

    const dispatch = useDispatch();

    const incidents = useSelector(({ safetyHistory }) => safetyHistory.incidents);
    const incidentsLoading = useSelector(({ safetyHistory }) => safetyHistory.isLoading);
    const departments = useSelector(({ safetyHistory }) => safetyHistory.departments);
    const bodyParts = useSelector(({ safetyHistory }) => safetyHistory.bodyParts);
    const injuries = useSelector(({ safetyHistory }) => safetyHistory.injuries);
    const status = useSelector(({ safetyHistory }) => safetyHistory.status);

    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isClosed, setIsClosed] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)

    const handleOk = () => form.submit();

    const onFinish = async values => {

        try {
            
            setSubmitLoading(true)

            const { accidentDate, mitigated } = values;

            await http.post(`safety`, {
                ...values,
                modifieddate: new Date(),
                accidentDate: moment(accidentDate).format(longDateFormat), 
                mitigatedTimeStamp: mitigated ? new Date() : null
            })

            dispatchIncidentsQry({ department, range }, dispatch)
            setIsModalVisible(false)
            message.success('Record successfully edited.');
            
        } catch (error) {
            message.error('Something went wrong please try again.')
        } finally {
            setSubmitLoading(false)
        }

    }

    const onCheckBoxChange = e => setIsClosed(e.target.checked)
    const handleCancel = () => setIsModalVisible(false)
    const onDatePickerChange = () => {}

    const columns = [
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => {
                return (<Dropdown overlay={() => menu(record, setIsModalVisible, form, setIsClosed)}>
                    <Link>Action</Link>
                </Dropdown>)
            }
        },
        {
            title: 'Status',
            dataIndex: 'isClosed',
            sorter: (a, b) => a.isClosed - b.isClosed,
            sortDirections: ['descend', 'ascend'],
            render: (text, { isClosed }) => {
                return isClosed ? 'Closed' : 'Open'
            }
        },
        {
            title: 'Mitigated',
            dataIndex: 'mitigated',
            sorter: (a, b) => a.mitigated - b.mitigated,
            sortDirections: ['descend', 'ascend'],
            render: (text, { mitigated }) => {
                return mitigated ? 'Yes' : 'No'
            }
        },
        {
            title: 'Mitigated Timestamp',
            dataIndex: 'mitigatedTimeStamp',
            sorter: (a, b) => new Date(a.mitigatedTimeStamp) - new Date(b.mitigatedTimeStamp),
            sortDirections: ['descend', 'ascend'],
            render: (text, { mitigatedTimeStamp }) => {
                return mitigatedTimeStamp ? moment(mitigatedTimeStamp).format(longDateFormat) : 'N/A'
            }
        },
        {
            title: 'Department',
            dataIndex: 'dept',
            sorter: (a, b) => a.dept.length - b.dept.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'First Name',
            dataIndex: 'fname',
            sorter: (a, b) => a.fname.length - b.fname.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Last Name',
            dataIndex: 'lname',
            sorter: (a, b) => a.lname.length - b.lname.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Shift',
            dataIndex: 'shift',
            sorter: (a, b) => a.shift - b.shift,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Incident Date',
            dataIndex: 'accidentDate',
            sorter: (a, b) => new Date(a.accidentDate) - new Date(b.accidentDate),
            sortDirections: ['descend', 'ascend'],
            render: (text, { accidentDate }) => {
                return moment(accidentDate).format(longDateFormat)
            }
        },
        {
            title: 'Injury',
            dataIndex: 'injury',
            sorter: (a, b) => a.injury.injuryName.length - b.injury.injuryName.length,
            sortDirections: ['descend', 'ascend'],
            render: (text, { injury }) => {
                return injury.injuryName
            }
        },
        {
            title: 'Body Part',
            dataIndex: 'bodyPart',
            sorter: (a, b) => a.bodyPart.bodyPart1.length - b.bodyPart.bodyPart1.length,
            sortDirections: ['descend', 'ascend'],
            render: (text, { bodyPart }) => {
                return bodyPart.bodyPart1
            }
        },
        {
            title: 'Supervisor',
            dataIndex: 'supervisor',
            sorter: (a, b) => a.supervisor.length - b.supervisor.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Injury Status',
            dataIndex: 'injuryStatId',
            sorter: (a, b) => a.injuryStatId.length - b.injuryStatId.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: 500,
            sorter: (a, b) => a.description.length - b.description.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Interim Action Taken',
            dataIndex: 'interimActionTaken',
            sorter: (a, b) => a.interimActionTaken.length - b.interimActionTaken.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Final Corrective Action',
            dataIndex: 'finalCorrectiveAction',
            sorter: (a, b) => a.finalCorrectiveAction.length - b.finalCorrectiveAction.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Reason Supporting ORIR Status',
            dataIndex: 'reasonSupportingOrirstat',
            sorter: (a, b) => a.reasonSupportingOrirstat?.length - b.reasonSupportingOrirstat?.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Time Stamp',
            dataIndex: 'modifieddate',
            sorter: (a, b) => new Date(a.modifieddate) - new Date(b.modifieddate),
            sortDirections: ['descend', 'ascend'],
            render: (text, { modifieddate }) => {
                return moment(modifieddate).format(longDateFormat)
            }
        }
    ];
      
    const dataSource = incidents.map((item, i) => ({ key: i, ...item }))

    return (
        <>
            <Table 
                size="small"
                loading={incidentsLoading}
                columns={columns}
                dataSource={dataSource} />  

            <Modal
                title="Edit" 
                visible={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
                okText="Submit"
                okButtonProps={{
                    loading: submitLoading
                }} 
                width={700}>
                
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
                                onChange={onDatePickerChange}
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
                        <Select>
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
                                required: isClosed,
                                message: 'Please enter FM Tips Number',
                            },
                        ]}
                        hasFeedback>
                            <Input disabled={!isClosed} />
                    </Form.Item>

                    <Form.Item
                        label="Mitigated"
                        name="mitigated"
                        valuePropName="checked"
                        hasFeedback>
                            <Checkbox />
                    </Form.Item>

                    <Form.Item
                        label="Notes"
                        name="notes"
                        hasFeedback>
                            <TextArea autoSize={true} />
                    </Form.Item>

                </Form>

            </Modal>
        </>
           
    )
}

export default IncidentHistoryTable;