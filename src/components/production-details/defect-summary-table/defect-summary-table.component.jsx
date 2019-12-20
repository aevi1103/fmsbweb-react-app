import React, { useState } from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import { 
    Table
 } from "antd";

 import ScrapLink  from '../../scrap-link/scrap-link.component'

const DefectSummaryTable = ({isProductionDetailsLoading, scrapData}) => {

    const columns = [
        {
            title: 'Area',
            dataIndex: 'area',
            render: (text, record, index) => {
                return record.area;
            },
            sorter: (a, b) => a.area.length - b.area.length,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Scrap Type',
            dataIndex: 'type',
            render: (text, record, index) => {
                return record.scrapAreaName;
            },
            sorter: (a, b) => a.scrapAreaName.length - b.scrapAreaName.length,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Scrap Code',
            dataIndex: 'code',
            render: (text, record, index) => {
                return record.scrapCode;           
            },
            sorter: (a, b) => a.scrapCode - b.scrapCode,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Scrap Description',
            dataIndex: 'desc',
            render: (text, record, index) => {
                return record.scrapDesc;  
            },
            sorter: (a, b) => a.scrapDesc.length - b.scrapDesc.length,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Qty',
            dataIndex: 'sapGross',
            render: (text, record, index) => {
                const value = numeral(record.qty).format('0,0'); 
                return <ScrapLink qty={record.qty} value={value} onClick={() => {}}/> 
            },
            sorter: (a, b) => a.qty - b.qty,
            sortDirections: ['descend', 'ascend']
        } 
      ];
      
      const data = scrapData.map((data, i) => ({key: i, ...data}))

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

export default connect(mapStateToProps)(DefectSummaryTable);