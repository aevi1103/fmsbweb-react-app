import React from 'react';
import moment from 'moment';
import { 
    Table,
    Tag
 } from "antd";

 const CheckSheetHistoryTable = ({
     data,
     loading
 }) => {

    const columns = [
        {
            title: 'View',
            dataIndex: 'view',
            render: (text, record, index) => {

                const { 
                    checkSheetId,
                    controlMethodId,
                    controlMethod: { method },
                    lineId
                 } = record;

                 const url = `/quality/checksheets/history/${method}/${controlMethodId}/line/${lineId}/checkSheet/${checkSheetId}`;
                return <a href={url} target="_blank" rel="noreferrer" >Open</a>
            }
        },
        
        {
            title: 'Control Method',
            dataIndex: 'controlMethod',
            render: (text, record, index) => {
                return record.controlMethod.method;
            }
        },
        {
            title: 'Shift Date',
            dataIndex: 'shiftDate',
            render: (text, record, index) => {
                return moment(record.shiftDate).format('l')
            },
            sorter: (a, b) => new Date(a.shiftDate) - new Date(b.shiftDate),
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Shift',
            dataIndex: 'shift',
            sorter: (a, b) => a.shift.length - b.shift.length,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Line',
            dataIndex: 'line',
            render: (text, record, index) => {
                return record.line.value;
            },
            sorter: (a, b) => a.line.value - b.line.value,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Part',
            dataIndex: 'part',
            render: (text, record, index) => {
                return record.organizationPart.part;
            },
            sorter: (a, b) => a.organizationPart.part.length - b.organizationPart.part.length,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: '# of Entries',
            dataIndex: 'records',
            render: (text, record, index) => {
                const count = record.checkSheetEntries.length;
                return count > 0 ? <Tag color="green">{count}</Tag> : count;
            },
            sorter: (a, b) => a.checkSheetEntries.length - b.checkSheetEntries.length,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Time Stamp',
            dataIndex: 'timeStamp',
            render: (text, record, index) => {
                return moment(record.timeStamp).format('lll')
            },
            sorter: (a, b) => new Date(a.timeStamp) - new Date(b.timeStamp),
            sortDirections: ['descend', 'ascend']
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
 }

 export default CheckSheetHistoryTable;