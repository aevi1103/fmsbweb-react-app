import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import numeral from 'numeral';
import { 
    Table
 } from "antd";


 const InventoryCostTable = ({isStockStatusFetching, stockStatusCollection}) => {

    const { inventoryCost } = stockStatusCollection;
    
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
            category,
            cost,
            date,
            target
        } = rowData;

        return {
            key: i,
            date: moment(date).format('MM/DD/YYYY'),
            type: category,
            actual: numeral(cost).format('0,0'),
            target: numeral(target).format('0,0')
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

export default connect(mapStateToProps)(InventoryCostTable);