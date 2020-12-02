import React from 'react';
import numeral from 'numeral';
import { 
    Table
 } from "antd";
import moment from 'moment';

const DeptForecastTable = React.memo(({ data, loading }) => {

    const columns = [
        {
            title: 'year',
            dataIndex: 'yr'
        },
        {
          title: 'Month',
          dataIndex: 'month'
        },
        {
          title: 'Department',
          dataIndex: 'dept'
        },
        {
            title: 'Total Units Forecast',
            dataIndex: 'units'
        },
        {
          title: 'OAE Forecast',
          dataIndex: 'oae'
        }
      ];
      
      const dataSource = data.map(({ year, monthNum, dept, totalUnitFcst, oaeFcst }, i) => ({
        key: i,
        yr: year,
        month: moment().month(monthNum).format('MMMM'),
        dept: dept,
        units: numeral(totalUnitFcst).format('0,0'),
        oae: oaeFcst + '%',
      }))

    return <Table 
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      pagination={false} />     
    
})

export default DeptForecastTable;