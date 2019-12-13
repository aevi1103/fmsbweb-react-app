import React from 'react';
import numeral from 'numeral';
import { 
    Table,
 } from "antd";

import { numberSorter } from '../../../helpers/helpers'

const LaborHoursTable = ({laborHoursData, isLoading, otherProps}) => {

    const columns = [
        {
            title: 'Type',
            dataIndex: 'type',
            sorter: (a, b) => a.type.length - b.type.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Role',
            dataIndex: 'role',
            sorter: (a, b) => a.role.length - b.role.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Labor Hours',
            dataIndex: 'hrs',
            sorter: (a, b) => numberSorter(a.hrs, b.hrs),
            sortDirections: ['descend', 'ascend'],
        }
      ];
      
      const data = !laborHoursData ? [] : laborHoursData.map(({type, role, hours}, i) => ({
        key: i,
        type: type,
        role: role,
        hrs: numeral(hours).format('0,0.00')
      }))

      const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
      }

    return (
        <Table 
                loading={isLoading}
                columns={columns}
                dataSource={data}
                onChange={onChange}
                pagination={false}
                {...otherProps} />     
    )
}

 export default LaborHoursTable;