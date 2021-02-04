import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import numeral from 'numeral';
import Highlighter from 'react-highlight-words';
import { EditOutlined } from '@ant-design/icons';
import api from '../../../../core/utilities/api'
import { setLogisticsStatus } from '../../../../core/redux/logistics/logistics.actions'

// import { numberSorter } from '../../../../core/utilities/helpers';
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

import { getColorRowClass } from '../../service/helper'

const DaysOnHandTable = () => {

  let searchInput = null;

  const dispatch = useDispatch();
  const logistics = useSelector(({ logistics }) => logistics);
  const { isStockStatusFetching, stockStatus } = logistics || {};
  const loading = isStockStatusFetching;
  const daysOnHand = (stockStatus?.daysOnHand ?? []).map((i, key) => ({ ...i, key }));

  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

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
      days: record?.safetyDays?.days
    })
    
  }

  const onFinish = async ({ days }) => {
  
    try {
      
      const { safetyDays, material, safetyStock, qty } = selectedRecord || {};

      const response = await api.post(`/logistics/days`, {
        stockSafetyDaysId: safetyDays?.stockSafetyDaysId,
        materialNumber: material,
        days: +days
      })

      message.success(`Successfully submitted!`)
      setModalVisible(false)

      const safetyStockOverDays = days === 0 ? 0 : safetyStock / days;
      const doh = safetyStockOverDays === 0 ? 0 : qty / safetyStockOverDays;

      const clone = { ...selectedRecord };

      if (clone.safetyDays) {
        clone.safetyDays.days = +days;
      } else {
        clone.safetyDays = {
          days: +days,
          materialNumber: selectedRecord?.material,
          stockSafetyDaysId: response.data.stockSafetyDaysId
        }
      }

      clone.daysOnHand = doh;

      const newStockStat = { ...stockStatus }
      const newDaysOnHand = [ ...daysOnHand.filter(({ material }) => material !== selectedRecord?.material), clone]
      newStockStat.daysOnHand = newDaysOnHand.sort((a, b) => b.qty - a.qty);

      dispatch(setLogisticsStatus(newStockStat))

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
           render: (text, record, index) => {       
              const { date } = record;
              return  moment(date).format('MM/DD/YYYY')    
          }
       },
       {
           title: 'Program',
           dataIndex: 'program',
           ...getColumnSearchProps('program'),
           render: (text, record, index) => {       
              const { program } = record;
              return  program
          }
       },
       {
           title: 'Material',
           dataIndex: 'material',
           ...getColumnSearchProps('material'),
          render: (text, record, index) => {       
              const { material } = record;
              return  material
          }
       },
       {
           title: 'Stock Qty',
           dataIndex: 'qty',
           render: (text, record, index) => {       
              const { qty } = record;
              return  numeral(qty).format('0,0')
          }
      },
      {
         title: 'Safety Stock',
         dataIndex: 'safetyStock',
         render: (text, record, index) => {       
            const { safetyStock } = record;
            return  numeral(safetyStock).format('0,0')
        }
      },
      {
          title: 'Days',
          dataIndex: 'safetyDays',
          render: (text, record, index) => {       
              const { safetyDays } = record;
              return (
                <>
                  <span className="mr2">{safetyDays?.days ?? 0}</span> 
                  <Tooltip title="Edit days">
                    <span style={{ cursor: 'pointer' }} onClick={() => onEdit(record)} aria-hidden="true" ><EditOutlined /></span>
                  </Tooltip>
                </>
              )
                
          }
      },
      {
          title: 'Days On Hand',
          dataIndex: 'daysOnHand',
          render: (text, record, index) => {       
              const { daysOnHand } = record;
              return  numeral(daysOnHand).format('0.00')
          }
      }
     ];

     return (
       <>
          <Table 
            size="small"
            loading={loading}
            columns={columns}
            dataSource={daysOnHand}
            pagination={false}
            rowClassName={(record, index) => {

              const { daysOnHand, safetyStock } = record;
              const rowClass = getColorRowClass(parseFloat(daysOnHand), parseFloat(safetyStock));

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