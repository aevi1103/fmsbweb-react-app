import React from 'react';
import numeral from 'numeral';
import { 
    Table,
 } from "antd";

import { numberSorter, percentSorter } from '../../../core/utilities/helpers'

const ScrapByDeptTable = ({scrapData, isLoading, otherProps}) => {

    const columns = [
        {
            title: 'Area',
            dataIndex: 'area',
            sorter: (a, b) => a.area.length - b.area.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Scrap Category',
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
      
      const data = scrapData.map(({area, scrapType, qty, scrapRate}, i) => ({
        key: i,
        area: area,
        type: scrapType,
        qty: numeral(qty).format('0,0'),
        rate: numeral(scrapRate).format('0.00%')
      }))

    return (
        <Table 
                loading={isLoading}
                columns={columns}
                dataSource={data}
                pagination={false}
                {...otherProps} />     
    )
}

 export default ScrapByDeptTable;