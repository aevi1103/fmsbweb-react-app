import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import {
    Table,
    Button
} from 'antd'

import {
    fetchSubMachineStartAsync
} from './../../../redux/quality-check-sheet/quality-check-sheet.actions'

import { PlusOutlined } from '@ant-design/icons';

const LineComponent = ({ 
    fetchSubMachineStartAsync,
    isSubMachineLoading,
    subMachineCollection,
    subMachineErrorMsg
}) => {

    useEffect(() => {
        fetchSubMachineStartAsync('$select=value,machine,timestamp&$expand=machine($expand=line($select=value))');
    }, [])

    const columns = [
        {
            title: 'Line',
            dataIndex: 'line',
            render: (text, record, index) => {
                return record.machine.line.value
            },
            key: 'line',
            sorter: (a, b) => a.machine.line.value - b.machine.line.value,
            filters:  [...new Set(subMachineCollection.map(({ machine }) => machine.line.value))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.machine.line.value.indexOf(value) === 0
        },
        {
            title: 'Machine',
            dataIndex: 'value',
            render: (text, record, index) => {
                return record.machine.value
            },
            key: 'value',
            sorter: (a, b) => a.machine.value.length - b.machine.value.length,
            filters:  [...new Set(subMachineCollection.map(({ machine }) => machine.value))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.machine.value.indexOf(value) === 0
        },
        {
            title: 'Sub-Machine',
            dataIndex: 'value',
            key: 'value',
            sorter: (a, b) => a.value - b.value,
            filters:  [...new Set(subMachineCollection.map(({ value }) => value))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.value.indexOf(value) === 0
        },
        {
            title: 'Time Stamp',
            dataIndex: 'timeStamp',
            render: (text, record, index) => {
                return moment(record.timeStamp).format('llll');
            },
            key: 'timeStamp',
        },
    ]

    const data = subMachineCollection.map((data, i) => ({key: i, ...data}));

    return (
        <React.Fragment>
            <Button type="primary" className="mb2"><PlusOutlined/> New Sub-Machine</Button>
            <Table 
                loading={isSubMachineLoading}
                columns={columns}
                dataSource={data}
                size="middle"
                bordered={true}
                pagination={false} />
        </React.Fragment>) 
}

const mapStateToProps = ({ qualityCheckSheet }) => ({
    isSubMachineLoading: qualityCheckSheet.isSubMachineLoading,
    subMachineCollection: qualityCheckSheet.subMachineCollection,
    subMachineErrorMsg: qualityCheckSheet.subMachineErrorMsg
})

const mapDispatchToProps = dispatch => ({
    fetchSubMachineStartAsync: (odataQry) => dispatch(fetchSubMachineStartAsync(odataQry)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LineComponent);