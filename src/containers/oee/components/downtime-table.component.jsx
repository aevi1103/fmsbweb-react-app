import React from 'react';
import moment from 'moment';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { 
    Table,
    Button,
    Tooltip,
    Tag,
    Popconfirm
 } from "antd";

const DowntimeTable = React.memo(({ 
    data,
    loading,
    setRecord,
    onDelete
 }) => {

    const columns = [
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record, index) => {

                return <>
                    <Tooltip title="Edit">
                        <Button size="small" type="text" onClick={() => setRecord(record)} ><EditOutlined /></Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Are you sure to delete this record?"
                            onConfirm={() => onDelete(record)}
                            okText="Yes"
                            cancelText="No">
                                <Button size="small" type="text"><DeleteOutlined /></Button>
                        </Popconfirm>
                    </Tooltip>
                </>
            },
        },
        {
            title: 'Planned Downtime',
            dataIndex: 'group',
            width: 100,
            sorter: (a, b) => a.group.length - b.group.length,
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                const { plannedDowntime } = record;
                return plannedDowntime ? <Tag color="green" >Yes</Tag> : 'No'
            },
        },
        {
            title: 'Machine Group',
            dataIndex: 'group',
            sorter: (a, b) => a.group.length - b.group.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Machine',
            dataIndex: 'machineName',
            sorter: (a, b) => a.machineName.length - b.machineName.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Primary Reason',
            dataIndex: 'reason1',
            sorter: (a, b) => a.reason1.length - b.reason1.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Secondary Reason',
            dataIndex: 'reason2',
            sorter: (a, b) => a.reason2.length - b.reason2.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Downtime Loss',
            dataIndex: 'downtime',
            sorter: (a, b) => a.downtime - b.downtime,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            sorter: (a, b) => a.comment.length - b.comment.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Time Stamp',
            dataIndex: 'stamp',
            sorter: (a, b) => new Date(a.stamp) - new Date(b.stamp),
            sortDirections: ['descend', 'ascend'],
        },
      ];
      
      const dataSource = data.map((d, i) => {

        const { machine, secondaryReason, dateModified, downtimeEventId, downtimeEventType } = d;

        return {
            key: i,
            ...d,
            plannedDowntime: downtimeEventType === 2 ? false : true,
            group: machine.machineGroup.groupName.toUpperCase(),
            machineName: machine.machineName.toUpperCase(),
            reason1: secondaryReason.primaryReason.reason.toUpperCase(),
            reason2: secondaryReason.reason.toUpperCase(),
            stamp: moment(dateModified).format('lll'),
            groupId: machine.machineGroupId,
            primaryReasonId: secondaryReason.primaryReasonId,
            downtimeId: downtimeEventId,
        }
            
      })

    return <Table loading={loading}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false} /> 
})

 export default DowntimeTable;