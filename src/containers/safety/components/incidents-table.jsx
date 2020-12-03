import React from 'react';
import moment from 'moment';
import { 
    Table
 } from "antd";

const IncidentTable = React.memo(({ data, loading }) => {

    const columns = [
        {
          title: 'Dept',
          dataIndex: 'dept',
          sorter: (a, b) => a.dept.length - b.dept.length,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: 'Injury Status',
          dataIndex: 'stat',
          sorter: (a, b) => a.stat.length - b.stat.length,
          sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Date',
            dataIndex: 'date',
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
            sortDirections: ['descend', 'ascend'],
        },
        {
          title: 'Description',
          dataIndex: 'desc',
          sorter: (a, b) => a.desc.length - b.desc.length,
          sortDirections: ['descend', 'ascend'],
        },
      ];
      
      const dataSource = data.map(({dept, description, injuryStatus, incidentDate}, i) => ({
          key: i,
          dept: dept,
          stat: injuryStatus,
          date: moment(incidentDate).format('LLL'),
          desc: description
      }))

    return (
        <Table 
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                scroll={{y: 380}} />     
    )
})

export default IncidentTable;