import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import {
    Table,
    Button
} from 'antd'

const LineComponent = ({ 
    isMachineLoading,
    machineCollection,
    machineErrorMsg
}) => {

    const columns = [
        {
            title: 'Line',
            dataIndex: 'value',
            render: (text, record, index) => {
                return record.line.value
            },
            key: 'value',
        },
        {
            title: 'Machine',
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

    const data = machineCollection.map((data, i) => ({key: i, ...data}));

    return (
        <React.Fragment>
            <Button type="primary" className="mb2">Add</Button>
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
    machineCollection: qualityCheckSheet.machineCollection,
    machineErrorMsg: qualityCheckSheet.machineErrorMsg
})

export default connect(mapStateToProps)(LineComponent);