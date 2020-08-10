import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import {
    Table
} from 'antd'

import {
    fetchLineStartAsync
} from './../../../redux/quality-check-sheet/quality-check-sheet.actions'

const LineComponent = ({ 
    fetchLineStartAsync,
    isLineLoading,
    lineCollection,
    lineErrorMsg
}) => {

    useEffect(() => {
        fetchLineStartAsync();
    }, [])

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

const mapDispatchToProps = dispatch => ({
    fetchLineStartAsync: (odataQry) => dispatch(fetchLineStartAsync(odataQry)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LineComponent);