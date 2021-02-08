import React from 'react';
import moment from 'moment';
import { dateFormat } from '../../../core/utilities/helpers'
import { 
    Table,
    Button,
    Tooltip,
    Row,
    Col,
    Popconfirm
 } from "antd";

 import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

 const ProjectTable = React.memo(({
     data,
     loading,
     setModalVisible,
     setSelectedRow,
     onDelete,
     form
 }) => {

    const onEditClick = (record) => {

        setModalVisible(true)
        setSelectedRow(record)
        
        const { comments, startDate, completionDate, status } = record;

        form.setFieldsValue({
            comments,
            startDate: startDate ? moment(startDate) : null,
            completionDate: completionDate ? moment(completionDate) : null,
            status: +status
        })
    }

    const confirm = (record) => {
        const { projectTrackerId } = record;
        onDelete(projectTrackerId)
    }

    const columns = [
        {
            title: 'Action',
            dataIndex: 'action',
            width: '5rem',
            render: (text, record) => {
                return (
                    <Row>
                        <Col>
                            <Tooltip title="Edit">
                                <Button type="text" size="small" onClick={() => onEditClick(record)} ><EditOutlined /></Button>
                            </Tooltip>
                        </Col>
                        <Col>
                            <Tooltip title="Delete">
                                <Popconfirm title="Do you want to delete this item?" onConfirm={() => confirm(record)}>
                                    <Button type="text" size="small" ><DeleteOutlined /></Button>
                                </Popconfirm>
                            </Tooltip>
                        </Col>
                    </Row>)
            }
        },
        {
            title: 'Department',
            dataIndex: 'dept',
            render: (text, record) => {
                return record.createHxH.department.deptName;
            }
        },
        {
            title: 'Line',
            dataIndex: 'line',
            render: (text, record) => {
                return record.createHxH.machines.machineName;
            }
        },
        {
            title: 'Date Requested',
            dataIndex: 'dateTimeRequested',
            render: (text, record) => {
                return moment(record.dateTimeRequested).format('lll');
            }
        },
        {
            title: 'Project Name',
            dataIndex: 'projectName'
        },
        {
            title: 'Project Description',
            dataIndex: 'projectDescription'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (text, record) => {

                switch (record.status) {
                    case 0:
                        return 'New'
                    case 1:
                        return 'In Progress'
                    case 2:
                        return 'Completed'
                    case 3:
                        return 'Rejected'
                
                    default:
                        return null;
                }

            }
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            render: (text, record) => {
                return record.startDate ? moment(record.startDate).format('lll') : null;
            }
        },
        {
            title: 'Completion Date',
            dataIndex: 'completionDate',
            render: (text, record) => {
                return record.completionDate ? moment(record.completionDate).format('lll') : null;
            }
        },
        {
            title: 'Project Status Comments',
            dataIndex: 'comments'
        },
        // {
        //     title: 'Clock Numbers',
        //     dataIndex: 'clockc',
        //     render: (text, record) => {

        //         const clocks = record.createHxH.hxhOpsClockNum.filter(({ clock }) => clock !== 1521);
        //         const clocksStr = clocks.map(({ clock }) => clock).join(',')

        //         return clocksStr
        //     }
        // },
        {
            title: 'Modified Date',
            dataIndex: 'modifiedDate',
            render: (text, record) => {
                return record.modifiedDate ? moment(record.modifiedDate).format('lll') : null;
            }
        },
    ]


    return <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        size="middle"
        bordered={true}
        pagination={false}
    />
 })

 export default ProjectTable;