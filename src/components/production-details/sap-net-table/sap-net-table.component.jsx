import React from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import moment from 'moment';
import { 
    Table
 } from "antd";


const SapNetTable = ({isProductionDetailsLoading, sapNetData}) => {

    const columns = [
        {
            title: 'Date Scanned',
            dataIndex: 'scanned',
            render: (text, record, index) => {
                return moment(record.dateScanned).format('llll');
            },
            sorter: (a, b) => new Date(a.dateScanned) - new Date(b.dateScanned),
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Shift Date',
            dataIndex: 'shiftDate',
            render: (text, record, index) => {
                return moment(record.dateScanned).format('l');
            },
            sorter: (a, b) => new Date(a.shiftDate) - new Date(b.shiftDate),
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Shift',
            dataIndex: 'shift',
            render: (text, record, index) => {
                return record.shift;           
            },
            sorter: (a, b) => a.shift.length - b.shift.length,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Line',
            dataIndex: 'line',
            render: (text, record, index) => {
                return record.line;  
            },
            sorter: (a, b) => a.line.length - b.line.length,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Material',
            dataIndex: 'mat',
            render: (text, record, index) => {
                return record.part;  
            },
            sorter: (a, b) => a.part.length - b.part.length,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'User',
            dataIndex: 'user',
            render: (text, record, index) => {
                return record.user;  
            },
            sorter: (a, b) => a.user.length - b.user.length,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Qty',
            dataIndex: 'sapGross',
            render: (text, record, index) => {
                return numeral(record.sapNet).format('0,0');
            },
            sorter: (a, b) => a.sapNet - b.sapNet,
            sortDirections: ['descend', 'ascend']
        } 
      ];
      
      const data = sapNetData.map((data, i) => ({key: i, ...data}))

      const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
      }

    return (
        <>
            <Table 
                loading={isProductionDetailsLoading}
                columns={columns}
                dataSource={data}
                onChange={onChange}
                size="middle"
                bordered={true}
                pagination={false} />    

        </>
        
    )
}

const mapStateToProps = ({ productionDetails }) => ({
    isProductionDetailsLoading: productionDetails.isProductionDetailsLoading
})

export default connect(mapStateToProps)(SapNetTable);