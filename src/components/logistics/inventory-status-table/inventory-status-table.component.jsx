import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import numeral from 'numeral';
import { 
    Table
 } from "antd";


 const InventoryStatusTable = ({isStockStatusFetching, stockStatusCollection}) => {

    const { inventoryStatus } = stockStatusCollection;
    
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date'
        },
        {
            title: 'Storage Location',
            dataIndex: 'sloc'
        },
        {
            title: 'Qty',
            dataIndex: 'qty'
        },
        {
            title: 'Avg Days',
            dataIndex: 'avg'
        },
        {
            title: 'Comments',
            dataIndex: 'com'
        }
      ];
      
      const dataSource = inventoryStatus.map((rowData, i) => {

        const {
            category,
            total,
            date,
            avergageDays,
            comments
        } = rowData;

        return {
            key: i,
            date: moment(date).format('MM/DD/YYYY'),
            sloc: category,
            qty: numeral(total).format('0,0'),
            avg: avergageDays,
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

export default connect(mapStateToProps)(InventoryStatusTable);