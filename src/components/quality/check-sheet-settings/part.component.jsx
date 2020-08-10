import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import {
    Table,
    Button
} from 'antd'

import {
    fetchPartStartAsync
} from './../../../redux/quality-check-sheet/quality-check-sheet.actions'

import { PlusOutlined } from '@ant-design/icons';

const LineComponent = ({ 
    fetchPartStartAsync,
    isPartLoading,
    partCollection,
    partErrorMsg
}) => {

    useEffect(() => {
        fetchPartStartAsync();
    }, [])

    const columns = [
        {
            title: 'Left Hand',
            dataIndex: 'leftHandPart',
            key: 'leftHandPart',
        },
        {
            title: 'Right Hand',
            dataIndex: 'rightHandPart',
            key: 'rightHandPart',
        },
        {
            title: 'Part',
            dataIndex: 'part',
            key: 'part',
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

    const data = partCollection.map((data, i) => ({key: i, ...data}));

    return (
        <React.Fragment>
            <Button type="primary" className="mb2"><PlusOutlined/> New Part</Button>
            <Table 
                loading={isPartLoading}
                columns={columns}
                dataSource={data}
                size="middle"
                bordered={true}
                pagination={false} />
        </React.Fragment>) 
}

const mapStateToProps = ({ qualityCheckSheet }) => ({
    isPartLoading: qualityCheckSheet.isPartLoading,
    partCollection: qualityCheckSheet.partCollection,
    partErrorMsg: qualityCheckSheet.partErrorMsg
})

const mapDispatchToProps = dispatch => ({
    fetchPartStartAsync: (odataQry) => dispatch(fetchPartStartAsync(odataQry))
})

export default connect(mapStateToProps, mapDispatchToProps)(LineComponent);