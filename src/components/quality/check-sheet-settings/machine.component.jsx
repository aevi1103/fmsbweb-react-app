import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import {
    Table,
    Button
} from 'antd'

import {
    fetchMachineStartAsync
} from './../../../core/redux/quality-check-sheet/quality-check-sheet.actions'

import { PlusOutlined } from '@ant-design/icons';

const LineComponent = ({ 
    fetchMachineStartAsync,
    isMachineLoading,
    machineCollection
}) => {

    useEffect(() => {
        fetchMachineStartAsync('$select=line,value,timestamp&$expand=line($select=value)');
    }, [])

    const columns = [
        {
            title: 'Line',
            dataIndex: 'line',
            render: (text, record, index) => {
                return record.line.value
            },
            key: 'line',
            sorter: (a, b) => a.line.value - b.line.value,
            filters:  [...new Set(machineCollection.map(({ line }) => line.value))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.line.value.indexOf(value) === 0
        },
        {
            title: 'Machine',
            dataIndex: 'value',
            key: 'value',
            sorter: (a, b) => a.value.length - b.value.length,
            filters:  [...new Set(machineCollection.map(({ value }) => value))].map(i => ({text: i, value: i})),
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

    const data = machineCollection.map((data, i) => ({key: i, ...data}));

    return (
        <React.Fragment>
            <Button type="primary" className="mb2"><PlusOutlined/> New Machine</Button>
            <Table 
                loading={isMachineLoading}
                columns={columns}
                dataSource={data}
                size="middle"
                bordered={true}
                pagination={false} />
        </React.Fragment>) 
}

const mapStateToProps = ({ qualityCheckSheet }) => ({
    isMachineLoading: qualityCheckSheet.isMachineLoading,
    machineCollection: qualityCheckSheet.machineCollection
})

const mapDispatchToProps = dispatch => ({
    fetchMachineStartAsync: (odataQry) => dispatch(fetchMachineStartAsync(odataQry)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LineComponent);