import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import {
    Table
} from 'antd'

const LineComponent = ({ 
    isLineLoading,
    lineCollection,
    lineErrorMsg
}) => {

    const columns = [
        {
            title: 'Line',
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

    const data = lineCollection.map((data, i) => ({key: i, ...data}));

    return <Table 
        loading={isLineLoading}
        columns={columns}
        dataSource={data}
        size="middle"
        bordered={true}
        pagination={false} />  
}

const mapStateToProps = ({ qualityCheckSheet }) => ({
    isLineLoading: qualityCheckSheet.isLineLoading,
    lineCollection: qualityCheckSheet.lineCollection,
    lineErrorMsg: qualityCheckSheet.lineErrorMsg
})

export default connect(mapStateToProps)(LineComponent);