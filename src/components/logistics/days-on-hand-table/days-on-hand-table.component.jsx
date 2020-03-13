import React, { useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import numeral from 'numeral';
import Highlighter from 'react-highlight-words';

import { numberSorter } from '../../../helpers/helpers';

import { 
    Table,
    Input,
    Button,
    Icon
 } from "antd";

 const DaysOnHandTable = ({isStockStatusFetching, stockStatusCollection}) => {

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const { daysOnHand } = stockStatusCollection;   

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
              icon="search"
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
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
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
            sortDirections: ['descend', 'ascend'],
            // filters: getFilter('date'),
            // onFilter: (value, record) => record.date.includes(value)
        },
        {
            title: 'Program',
            dataIndex: 'prog',
            sorter: (a, b) => a.prog.length - b.prog.length,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('prog')
        },
        {
            title: 'Material',
            dataIndex: 'mat',
            sorter: (a, b) => a.mat.length - b.mat.length,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('mat')
        },
        {
            title: 'Stock Qty',
            dataIndex: 'stock',
            sorter: (a, b) => numberSorter(a.stock, b.stock),
            sortDirections: ['descend', 'ascend'],
            // ...getColumnSearchProps('stock')
        },
        {
          title: 'Safety Stock',
          dataIndex: 'safetyStock',
          sorter: (a, b) => numberSorter(a.stock, b.stock),
          sortDirections: ['descend', 'ascend'],
          // ...getColumnSearchProps('stock')
      },
        {
            title: 'Days On Hand',
            dataIndex: 'doh',
            sorter: (a, b) => numberSorter(a.doh, b.doh),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                const { bgColor } = record;
                return <span className="b" style={{color: bgColor}}>{text}</span>
            },
            // ...getColumnSearchProps('doh')
        }
      ];
      
      const dataSource = !daysOnHand 
        ? [] 
        : daysOnHand.map((rowData, i) => {

        const {
            date,
            program,
            material,
            finGoodIn0300,
            daysOnHand,
            colorCode,
            safetyStock
        } = rowData;

        const { bgColor, fontColor } = colorCode;

        return {
            key: i,
            date: moment(date).format('MM/DD/YYYY'),
            prog: program,
            mat: material,
            stock: numeral(finGoodIn0300).format('0,0'),
            safetyStock: numeral(safetyStock).format('0,0'),
            doh: daysOnHand,
            bgColor,
            fontColor
        }
        
      })

      const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
      }

      return (
        <Table 
                loading={isStockStatusFetching}
                columns={columns}
                dataSource={dataSource}
                onChange={onChange}
                pagination={false} />     
    )
 }

const mapStateToProps = ({ morningMeeting }) => ({
    isStockStatusFetching: morningMeeting.isStockStatusFetching,
    stockStatusCollection: morningMeeting.stockStatusCollection,
})

export default connect(mapStateToProps)(DaysOnHandTable);