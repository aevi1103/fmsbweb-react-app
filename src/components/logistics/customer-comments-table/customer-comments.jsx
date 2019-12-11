import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { 
    Table
 } from "antd";


 const CustomerCommentsTable = ({isStockStatusFetching, stockStatusCollection}) => {

    const { customerComments } = stockStatusCollection;
    
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
            comments
        } = rowData;

        return {
            key: i,
            date: moment(date).format('MM/DD/YYYY'),
            customer: customer,
            com: comments
        }
        
      })

      const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
      }

      return (
        <Table 
                loading={isStockStatusFetching}
                columns={columns}
                dataSource={dataSource}
                onChange={onChange}
                scroll={{y: 380}}
                pagination={false} />     
    )
 }

const mapStateToProps = ({ morningMeeting }) => ({
    isStockStatusFetching: morningMeeting.isStockStatusFetching,
    stockStatusCollection: morningMeeting.stockStatusCollection,
})

export default connect(mapStateToProps)(CustomerCommentsTable);