import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import numeral from 'numeral';
import Highlighter from 'react-highlight-words';

import { numberSorter } from '../../../../core/utilities/helpers';
import { SearchOutlined } from '@ant-design/icons';
import { Table, Input, Button, Tag } from "antd";

import { getColorCode, getColorRowClass } from '../../service/helper'
import './styles.scss'

const DaysOnHandTable = () => {

  const loading = useSelector(({ morningMeeting: { isStockStatusFetching } }) => isStockStatusFetching) || false;
  const daysOnHand = useSelector(({ morningMeeting: { stockStatusCollection } }) => stockStatusCollection.daysOnHand) || [];

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
       setSearchText(selectedKeys[0]);
       setSearchedColumn(dataIndex);
   };

   const handleReset = clearFilters => {
       clearFilters();
       setSearchText('');
   };

   let searchInput = null;

   const getColumnSearchProps = dataIndex => ({
       filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
         <div style={{ padding: 8 }}>
           <Input
             ref={node => {
               searchInput = node;
             }}
             placeholder={`Search ${dataIndex}`}
             value={selectedKeys[0]}
             onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
             onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
             style={{ width: 188, marginBottom: 8, display: 'block' }}
           />
           <Button
             type="primary"
             onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
             icon={<SearchOutlined />}
             size="small"
             style={{ width: 90, marginRight: 8 }}
           >
             Search
           </Button>
           <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
             Reset
           </Button>
         </div>
       ),
       filterIcon: filtered => (
         <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
       ),
       onFilter: (value, record) =>
         record[dataIndex]
           .toString()
           .toLowerCase()
           .includes(value.toLowerCase()),
       onFilterDropdownVisibleChange: visible => {
         if (visible) {
           setTimeout(() => searchInput.select());
         }
       },
       render: text =>
         searchedColumn === dataIndex ? (
           <Highlighter
             highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
             searchWords={[searchText]}
             autoEscape
             textToHighlight={text.toString()}
           />
         ) : (
           text
         ),
     });
   


   const columns = [
       {
           title: 'Date',
           dataIndex: 'date',
           sorter: (a, b) => new Date(a.date) - new Date(b.date),
           sortDirections: ['descend', 'ascend']
       },
       {
           title: 'Program',
           dataIndex: 'prog',
           sorter: (a, b) => a.prog.localeCompare(b.prog),
           sortDirections: ['descend', 'ascend'],
           ...getColumnSearchProps('prog')
       },
       {
           title: 'Material',
           dataIndex: 'mat',
           sorter: (a, b) =>  a.mat.localeCompare(b.mat),
           sortDirections: ['descend', 'ascend'],
           ...getColumnSearchProps('mat')
       },
       {
           title: 'Stock Qty',
           dataIndex: 'stock',
           sorter: (a, b) => numberSorter(a.stock, b.stock),
           sortDirections: ['descend', 'ascend'],
        //    render: (text, record, index) => {
        //      const { bgColor } = record;
        //      return <Tag color={bgColor}>{text}</Tag>          
        //  }
       },
       {
         title: 'Safety Stock',
         dataIndex: 'safetyStock',
         sorter: (a, b) => numberSorter(a.safetyStock, b.safetyStock),
         sortDirections: ['descend', 'ascend']
     },
       {
           title: 'Days On Hand',
           dataIndex: 'doh',
           sorter: (a, b) => numberSorter(a.doh, b.doh),
           sortDirections: ['descend', 'ascend'],
          //  render: (text, record, index) => {       
          //      const { bgColor } = record;
          //    return <Tag color={bgColor}>{text}</Tag>      
          //  }
       }
     ];
     


     const dataSource = daysOnHand
        // .filter(({ qty, safetyStock }) => qty > 0 && safetyStock > 0)
        .map((rowData, i) => {

          const {
              date,
              program,
              material,
              qty,
              daysOnHand,
              safetyStock
          } = rowData;

          return {
              key: i,
              date: moment(date).format('MM/DD/YYYY'),
              prog: program,
              mat: material,
              stock: numeral(qty).format('0,0'),
              safetyStock: numeral(safetyStock).format('0,0'),
              doh: numeral(daysOnHand).format('0.00'),
              bgColor: getColorCode(daysOnHand, safetyStock)
          }
       
     })

     return (
       <Table 
          size="small"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          rowClassName={(record, index) => {

            const { doh, safetyStock } = record;
            const rowClass = getColorRowClass(parseFloat(doh), parseFloat(safetyStock));

            return `${rowClass}`;

          }} />     
   )
}

export default DaysOnHandTable;