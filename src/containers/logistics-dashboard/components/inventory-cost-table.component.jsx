import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import numeral from 'numeral';
import { 
    Table
 } from "antd";


 const InventoryCostTable = () => {

    const loading = useSelector(({ morningMeeting: { isStockStatusFetching } }) => isStockStatusFetching) || false;
    const inventoryCost = useSelector(({ morningMeeting: { stockStatusCollection } }) => stockStatusCollection.inventoryCost) || [];

    
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date'
        },
        {
            title: 'Type',
            dataIndex: 'type'
        },
        {
            title: 'Actual',
            dataIndex: 'actual'
        },
        {
            title: 'Target',
            dataIndex: 'target'
        }
      ];
      
      const dataSource = !inventoryCost ? [] : inventoryCost.map((rowData, i) => {

        const {
            date,
            costType,
            cost,
            target
        } = rowData;

        return {
            key: i,
            date: moment(date).format('MM/DD/YYYY'),
            type: costType,
            actual: numeral(cost).format('$0,0'),
            target: numeral(target).format('$0,0')
        }
        
      })

      const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
      }

      return (
        <Table 
            size="small"
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            onChange={onChange}
            pagination={false} />     
    )
 }

export default InventoryCostTable;