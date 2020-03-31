import React from 'react';
import numeral from 'numeral';
import { 
    Table
 } from "antd";

import { numberSorter, percentSorter } from '../../../helpers/helpers'

const ScrapByCodeTable = ({scrapData, isLoading, otherProps}) => {

    const columns = [
        {
          title: 'Area Found',
          dataIndex: 'area',
          sorter: (a, b) => a.area.length - b.area.length,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: 'Scrap Type',
          dataIndex: 'type',
          sorter: (a, b) => a.type.length - b.type.length,
          sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            sorter: (a, b) => numberSorter(a.qty, b.qty),
            sortDirections: ['descend', 'ascend'],
        },
        {
          title: 'Scrap Rate',
          dataIndex: 'rate',
          sorter: (a, b) => percentSorter(a.rate, b.rate),
            sortDirections: ['descend', 'ascend'],
        },
      ];
      
      const data = scrapData.map(({area, scrapAreaName, qty, scrapRate}, i) => ({
        key: i,
        area: area,
        type: scrapAreaName,
        qty: numeral(qty).format('0,0'),
        rate: numeral(scrapRate).format('0.00%')
      }))

      const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
      }

    return (
        <Table loading={isLoading}
                columns={columns}
                dataSource={data}
                onChange={onChange}
                pagination={false}
                {...otherProps} />     
    )
}

 export default ScrapByCodeTable;