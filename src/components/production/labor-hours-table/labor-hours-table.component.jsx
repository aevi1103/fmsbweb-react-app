import React from 'react';
import numeral from 'numeral';
import { 
    Table,
 } from "antd";

const LaborHoursTable = ({laborHoursData, isLoading, otherProps}) => {

    const columns = [
        {
            title: 'Type',
            dataIndex: 'type'
        },
        {
            title: 'Role',
            dataIndex: 'role'
        },
        {
            title: 'Labor Hours',
            dataIndex: 'hrs'
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