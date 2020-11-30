import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { 
    Table
 } from "antd";

const IncidentTable = ({isIncidentFetching, incidentCollection}) => {

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
      
      const data = incidentCollection.map(({dept, description, injuryStatus, incidentDate}, i) => ({
        key: i,
        dept: dept,
        stat: injuryStatus,
        date: moment(incidentDate).format('LLL'),
        desc: description
      }))

      const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
      }

    return (
        <Table 
                loading={isIncidentFetching}
                columns={columns}
                dataSource={data}
                onChange={onChange}
                pagination={false}
                scroll={{y: 380}} />     
    )
}

const mapStateToProps = ({ morningMeeting }) => ({
    isIncidentFetching: morningMeeting.isIncidentFetching,
    incidentCollection: morningMeeting.incidentCollection,
})

export default connect(mapStateToProps)(IncidentTable);