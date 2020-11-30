import React from 'react';
import moment from 'moment';
import { 
    Table
 } from "antd";


 const CustomerCommentsTable = ({ customerComments = [], loading = false }) => {

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date'
        },
        {
            title: 'Customer',
            dataIndex: 'customer'
        },
        {
            title: 'Comments',
            dataIndex: 'com'
        }
      ];
      
      const dataSource = customerComments.map((rowData, i) => {

        const {
            date,
            customer,
            comment
        } = rowData;

        return {
            key: i,
            date: moment(date).format('MM/DD/YYYY'),
            customer: customer,
            com: comment
        }
        
      })

      return <Table 
                size="small"
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                pagination={false} />
 }

export default CustomerCommentsTable;