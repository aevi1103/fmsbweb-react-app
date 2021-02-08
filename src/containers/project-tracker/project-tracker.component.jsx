import React, { useState, useEffect } from 'react'
import moment from 'moment'

import { dateRange, disabledDate, longDateFormat, dateFormat } from '../../core/utilities/helpers'
import { fetchData, postData, deleteData } from './service/api'

import ProjectTable from './components/project-table.component'

import {
    PageHeader,
    Layout,
    Row,
    Col,
    DatePicker,
    Button,
    Modal,
    Form,
    Input,
    Select,
    message
} from 'antd'

const { RangePicker } = DatePicker
const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const defaultEndDate = moment().endOf('day').format(longDateFormat);
const defaultStartDate = moment().add(-30, 'day').startOf('day').format(longDateFormat)

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};


const ProjectTracker = () => {

    const [form] = Form.useForm();
    const [startFormat, setStartFormat] = useState(defaultStartDate);
    const [endFormat, setEndFormat] = useState(defaultEndDate);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState(false);
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)

    const getData = async () => {
     
        try {
                
            setLoading(true);

            const response = await fetchData({
                start: startFormat,
                end: endFormat
            })

            const data = response.data.map((data, i) => ({ key: i, ...data }));
            setProjects(data);
            
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        getData();
    }, [])

    const onCalendarChange = (dates, datesStr) => {

        const [start, end] = dates;
 
        setStartFormat(start.startOf('day').format(longDateFormat));
        setEndFormat(end.endOf('day').format(longDateFormat));
    }

    const onClick = () => getData();

    const handleOk = () => form.submit();

    const handleCancel = () => {
        setModalVisible(false);
        form.resetFields();
    }

    const onStartDateChange = () => {}

    const onCompletionChangeChange = () => {}

    const onFinish = async values => {

        const { startDate, completionDate, status, comments } = values;
        const body = {
            ...selectedRow,
            startDate: moment(startDate).format(dateFormat),
            completionDate: completionDate ? moment(completionDate).format(dateFormat) : null,
            status: +status,
            modifiedDate: new Date(),
            comments,
            createHxH: null
        }

        await postData(body);
        setModalVisible(false);
        form.resetFields(); 

        message.success('Successfully Updated!')
        getData();

    }

    const onDelete = async (id) => {
        await deleteData(id);
        getData();
    }

    return (
        <>
            <PageHeader title="Project Tracker" />

            <Content className="ma3 mt0">

                <Row gutter={[12,12]}>

                    <Col span={24}>

                        <span className="mr2">Date Range</span>
                        <RangePicker 
                            className="mr2"
                            onChange={() => {}}
                            format={dateFormat}
                            onCalendarChange={onCalendarChange}
                            defaultValue={[
                                moment(startFormat, longDateFormat),
                                moment(endFormat, longDateFormat)
                            ]}
                            disabledDate={disabledDate}
                            ranges={dateRange} />

                        <Button 
                            type="primary" 
                            loading={loading}
                            onClick={onClick}>Go</Button>

                    </Col>

                    <Col span={24}>
                        <ProjectTable 
                            data={projects} 
                            loading={loading} 
                            setModalVisible={setModalVisible}
                            setSelectedRow={setSelectedRow} 
                            onDelete={onDelete}
                            form={form}/>
                    </Col>

                </Row>

            </Content>

            <Modal title={`Edit ${selectedRow?.createHxH?.machines?.machineName}`} 
                visible={modalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
                okText="Submit">
                
                <Form form={form} {...layout} onFinish={onFinish}>

                    <Form.Item 
                        label="Status" 
                        name="status" 
                        rules={[{ required: true, message: 'Status is required', }]}>

                        <Select style={{ width: '100%' }} >
                            <Option key="0" value={0} >New</Option>
                            <Option key="1" value={1} >In Progress</Option>
                            <Option key="2" value={2} >Completed</Option>
                            <Option key="3" value={3} >Rejected</Option>
                        </Select>

                    </Form.Item>

                    <Form.Item
                        label="Start Date" 
                        name="startDate" 
                        rules={[{ required: true, message: 'Start Date is required', }]}>

                        <DatePicker 
                            onChange={onStartDateChange} 
                            style={{ width: '100%' }} 
                            format={dateFormat}/>

                    </Form.Item>

                    <Form.Item label="Completion Date" name="completionDate">

                        <DatePicker 
                            onChange={onCompletionChangeChange} 
                            style={{ width: '100%' }} 
                            format={dateFormat} />

                    </Form.Item>

                    <Form.Item 
                        label="Status Comment" 
                        name="comments" 
                        rules={[{ required: true, message: 'Status Comment is required', }]}>

                        <TextArea rows={5} />

                    </Form.Item>

                </Form>

            </Modal>
        </>
        
    )
}

export default ProjectTracker;