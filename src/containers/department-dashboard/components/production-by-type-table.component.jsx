import React from 'react';
import numeral from 'numeral';
import { 
    Table,
 } from "antd";

import { numberSorter } from '../../../core/utilities/helpers'

const ProductionByTypeTable = ({prodData, isLoading, otherProps}) => {

    const columns = [
        {
          title: 'Area',
          dataIndex: 'area',
          sorter: (a, b) => a.area.length - b.area.length,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: 'SAP Type',
          dataIndex: 'type',
          sorter: (a, b) => a.type.length - b.type.length,
          sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'SAP Net',
            dataIndex: 'net',
            sorter: (a, b) => numberSorter(a.net, b.net),
            sortDirections: ['descend', 'ascend'],
        }
      ];
      
      const data = prodData.map(({area, sapType, sapNet}, i) => ({
        key: i,
        area: area,
        type: sapType,
        net: numeral(sapNet).format('0,0')
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

 export default ProductionByTypeTable;