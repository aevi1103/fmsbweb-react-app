import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import {
    Table,
    Button
} from 'antd'

const LineComponent = ({ 
    isSubMachineLoading,
    subMachineCollection,
    subMachineErrorMsg
}) => {

    const columns = [
        {
            title: 'Line',
            dataIndex: 'value',
            render: (text, record, index) => {
                return record.machine.line.value
            },
            key: 'value',
        },
        {
            title: 'Machine',
            dataIndex: 'value',
            render: (text, record, index) => {
                return record.machine.value
            },
            key: 'value',
        },
        {
            title: 'Sub-Machine',
            dataIndex: 'value',
            key: 'value',
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
            <Button type="primary" className="mb2">Add</Button>
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

export default connect(mapStateToProps)(LineComponent);