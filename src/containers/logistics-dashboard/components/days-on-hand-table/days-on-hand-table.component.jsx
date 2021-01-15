import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import numeral from 'numeral';
import Highlighter from 'react-highlight-words';
import { EditOutlined } from '@ant-design/icons';
import api from '../../../../core/utilities/api'

import { numberSorter } from '../../../../core/utilities/helpers';
import { SearchOutlined } from '@ant-design/icons';
import { 
  Table,
  Input,
  Button,
  Tooltip,
  Modal,
  Form,
  message
} from "antd";

import { getColorCode, getColorRowClass } from '../../service/helper'

const DaysOnHandTable = () => {

  let searchInput = null;
  const loading = useSelector(({ logistics: { isStockStatusFetching } }) => isStockStatusFetching) || false;
  const daysOnHand = useSelector(({ logistics: { stockStatusCollection } }) => stockStatusCollection.daysOnHand) || [];

  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([])
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {

      const ds = daysOnHand.map((rowData, i) => {

            const {
                date,
                program,
                material,
                qty,
                daysOnHand,
                safetyStock,
                safetyDays
            } = rowData;

            return {
                key: i,
                ...rowData,
                date: moment(date).format('MM/DD/YYYY'),
                prog: program,
                mat: material,
                stock: numeral(qty).format('0,0'),
                safetyStock: numeral(safetyStock).format('0,0'),
                safetyStockQty: safetyStock,
                safetyDays: safetyDays?.days ?? 0,
                stockSafetyDaysId: safetyDays?.stockSafetyDaysId ?? 0,
                doh: numeral(daysOnHand).format('0.00'),
                bgColor: getColorCode(daysOnHand, safetyStock)
            }
      })

      setDataSource(ds)

  }, [daysOnHand])

  useEffect(() => {

    console.log(selectedRecord)


  }, [selectedRecord])

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
       setSearchText(selectedKeys[0]);
       setSearchedColumn(dataIndex);
   };

   const handleReset = clearFilters => {
       clearFilters();
       setSearchText('');
   };

  const onEdit = record => {

    form.resetFields()

    setModalVisible(true)
    setSelectedRecord(record)

    form.setFieldsValue({
      days: record?.safetyDays
    })
    
  }

  const onFinish = ({ days }) => {
  
    try {
      
      const { stockSafetyDaysId, material, safetyStockQty, qty } = selectedRecord || {};

      api.post(`/logistics/days`, {
        stockSafetyDaysId: stockSafetyDaysId,
        materialNumber: material,
        days: +days
      })

      message.success(`Successfully submitted!`)
      setModalVisible(false)

      const safetyStockOverDays = days === 0 ? 0 : safetyStockQty / days;
      const daysOnHand = safetyStockOverDays === 0 ? 0 : qty / safetyStockOverDays;

      const rowObject = {
        ...selectedRecord,
        safetyDays: days,
        daysOnHand,
        doh: numeral(daysOnHand).format('0.00')
      }

      const newDataSource = [...dataSource.filter(({ material }) => material !== selectedRecord?.material), rowObject]
      const sortDataSource = newDataSource.sort((a, b) => b.qty - a.qty)

      setDataSource(sortDataSource)

    } catch (error) {
      message.error(`Something went wrong!`)
    }

  }

  const onSubmit = () => form.submit()

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
          //  sorter: (a, b) => new Date(a.date) - new Date(b.date),
          //  sortDirections: ['descend', 'ascend']
       },
       {
           title: 'Program',
           dataIndex: 'prog',
          //  sorter: (a, b) => a.prog.localeCompare(b.prog),
          //  sortDirections: ['descend', 'ascend'],
           ...getColumnSearchProps('prog')
       },
       {
           title: 'Material',
           dataIndex: 'mat',
          //  sorter: (a, b) =>  a.mat.localeCompare(b.mat),
          //  sortDirections: ['descend', 'ascend'],
           ...getColumnSearchProps('mat')
       },
       {
           title: 'Stock Qty',
           dataIndex: 'stock',
          //  sorter: (a, b) => numberSorter(a.stock, b.stock),
          //  sortDirections: ['descend', 'ascend']
      },
      {
         title: 'Safety Stock',
         dataIndex: 'safetyStock',
        //  sorter: (a, b) => numberSorter(a.safetyStock, b.safetyStock),
        //  sortDirections: ['descend', 'ascend']
      },
      {
          title: 'Days',
          dataIndex: 'safetyDays',
          // sorter: (a, b) => numberSorter(a.safetyDays.days, b.safetyStock.days),
          // sortDirections: ['descend', 'ascend'],
          render: (text, record, index) => {       

              const { safetyDays } = record;

              return (
                <>
                  <span className="mr2">{safetyDays}</span> 
                  <Tooltip title="Edit days">
                    <span style={{ cursor: 'pointer' }} onClick={() => onEdit(record)} aria-hidden="true" ><EditOutlined /></span>
                  </Tooltip>
                </>
              )
                
          }
      },
      {
           title: 'Days On Hand',
           dataIndex: 'doh',
          //  sorter: (a, b) => numberSorter(a.doh, b.doh),
          //  sortDirections: ['descend', 'ascend'],
      }
     ];
     
     

     return (
       <>
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

            }}
            onRow={(record, rowIndex) => {

              const antRowClassName = 'ant-table-row'

              return {
                onMouseEnter: e => {
                  if (parseInt(record.safetyStock)  > 0) {
                    e.target.parentElement.classList.remove(antRowClassName)
                  }
                },
                onMouseLeave: e => {
                  if (parseInt(record.safetyStock)  > 0) {
                    e.target.parentElement.classList.add(antRowClassName)
                  }
                }
              }

            }} />    

          <Modal 
            title={`Edit ${selectedRecord?.material} Days`} 
            visible={modalVisible} 
            onOk={onSubmit} 
            okText="Submit"
            onCancel={() => setModalVisible(false)}>

            <Form form={form} onFinish={onFinish}>
              <Form.Item label="Days" name="days" rules={[{ required: true, message: 'Please enter days' }]}>
                <Input placeholder="Enter days" />
              </Form.Item>
            </Form>

          </Modal>
       </>
   )
}

export default DaysOnHandTable;