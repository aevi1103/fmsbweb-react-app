import React from 'react';
import { 
    Table,
 } from "antd";

const CustomerComplaintTable = React.memo(({ loading, data }) => {

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
      
      const dataSource = data.map(({date, prr, pir, qr, prrCom, pirCom, qrCom, newIssue, criticalIssue}, i) => ({
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

    return <Table 
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false} />
})

export default CustomerComplaintTable;