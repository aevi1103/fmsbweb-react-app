import React from 'react';
import { connect } from 'react-redux';
import { 
    Table,
 } from "antd";

const CustomerComplaintTable = ({isQualityFetching, qualityCollection}) => {

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date'
        },
        {
            title: 'PRR',
            dataIndex: 'prr'
        },
        {
            title: 'PIR',
            dataIndex: 'pir'
        },
        {
            title: 'QR',
            dataIndex: 'qr'
        },
        {
            title: 'PRR Comment',
            dataIndex: 'prrCom'
        },
        {
            title: 'PIR Comment',
            dataIndex: 'pirCom'
        },
        {
            title: 'QR Comment',
            dataIndex: 'qrCom'
        },
        {
            title: 'New Issues (Internal / External)',
            dataIndex: 'new'
        },
        {
            title: 'Critical Issue',
            dataIndex: 'critical'
        }  
      ];
      
      const data = !qualityCollection ? [] : qualityCollection.customerComplaintList.map(
            ({date, prr, pir, qr, prrCom, pirCom, qrCom, newIssue, criticalIssue}, i) => ({
        key: i,
        date: date,
        prr: prr,
        pir: pir,
        qr: qr,
        prrCom: prrCom,
        pirCom: pirCom,
        qrCom: qrCom,
        new: newIssue,
        critical: criticalIssue,
      }))

      const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
      }

    return (
        <Table 
                loading={isQualityFetching}
                columns={columns}
                dataSource={data}
                onChange={onChange}
                pagination={false} />     
    )
}

const mapStateToProps = ({ morningMeeting }) => ({
    isQualityFetching: morningMeeting.isQualityFetching,
    qualityCollection: morningMeeting.qualityCollection
})

export default connect(mapStateToProps)(CustomerComplaintTable);