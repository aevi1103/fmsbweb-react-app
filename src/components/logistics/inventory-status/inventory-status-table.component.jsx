import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import numeral from 'numeral';
import { 
    Table
 } from "antd";


 const InventoryStatusTable = () => {

    const loading = useSelector(({ morningMeeting: { isStockStatusFetching } }) => isStockStatusFetching) || false;
    const inventoryStatus = useSelector(({ morningMeeting: { stockStatusCollection } }) => stockStatusCollection.inventoryStatus) || [];

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
        }
      ];
      

      const dataSource = inventoryStatus.map((rowData, i) => {

        const {
            date,
            sloc,
            qty
        } = rowData;

        return {
            key: i,
            date: moment(date).format('MM/DD/YYYY'),
            sloc: sloc,
            qty: numeral(qty).format('0,0')
        }
        
      })

      return (
        <Table 
            size="small"
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            pagination={false} />     
    )
 }


export default InventoryStatusTable;