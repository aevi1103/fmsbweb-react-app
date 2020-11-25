import React from 'react';
import moment from 'moment';
import numeral from 'numeral';
import { 
    Table
 } from "antd";


 const InventoryDetailsTable = ({ details = [], loading = true }) => {

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            fixed: true,
            width: '6rem',
            render: (text,record, i) => {
                return moment(text).format('MM/DD/YYYY')
            }
        },
        {
            title: 'Program',
            dataIndex: 'program',
            fixed: true,
            width: '5rem',
        },
        {
            title: 'Material',
            dataIndex: 'material',
            fixed: true,
            width: '9rem',
        },
        {
            title: 'Description',
            dataIndex: 'materialDescription',
            width: '10rem',
        },
        {
            title: 'Valuation Class',
            dataIndex: 'valuationClass',
            width: '6rem',
        },
        {
            title: 'Per',
            dataIndex: 'per',
            width: '5rem',
        },
        {
            title: 'Standard Price',
            dataIndex: 'standardPrice',
            width: '5rem',
            render: (text, record) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: 'Unrestricted Inv.',
            dataIndex: 'totalUnrestInv',
            width: '5rem',
            render: (text, record) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: 'Safety Stock',
            dataIndex: 'safetyStock',
            width: '5rem',
            render: (text, record) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '0111',
            dataIndex: '_0111',
            width: '4rem',
            render: (text, record) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '0115',
            dataIndex: '_0115',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '4001',
            dataIndex: '_4001',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '4002',
            dataIndex: '_4002',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '4003',
            dataIndex: '_4003',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '4004',
            dataIndex: '_4004',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '4005',
            dataIndex: '_4005',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '4006',
            dataIndex: '_4006',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '4007',
            dataIndex: '_4007',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '4008',
            dataIndex: '_4008',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '4009',
            dataIndex: '_4009',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '4010',
            dataIndex: '_4010',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '5001',
            dataIndex: '_5001',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '5002',
            dataIndex: '_5002',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '5003',
            dataIndex: '_5003',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '5004',
            dataIndex: '_5004',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '5005',
            dataIndex: '_5005',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '5006',
            dataIndex: '_5006',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '5007',
            dataIndex: '_5007',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '5008',
            dataIndex: '_5008',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '5009',
            dataIndex: '_5009',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '5010',
            dataIndex: '_5010',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: 'QC01',
            dataIndex: 'qc01',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: 'QC02',
            dataIndex: 'qc02',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: 'QC03',
            dataIndex: 'qc03',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: 'QC04',
            dataIndex: 'qc04',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: 'QC05',
            dataIndex: 'qc05',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '0130',
            dataIndex: '_0130',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '0131',
            dataIndex: '_0131',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '0135',
            dataIndex: '_0135',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '0160',
            dataIndex: '_0160',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '0400',
            dataIndex: '_0300',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '0125',
            dataIndex: '_0125',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: '0140',
            dataIndex: '_0140',
            width: '4rem',
            render: (text) => {
                return numeral(parseFloat(text)).format('0,0')
            }
        },
        {
            title: 'Upload Date Time',
            dataIndex: 'uploadDateTime',
            width: '10rem',
            render: (text,record, i) => {
                return moment(text).format('lll')
            }
        }
      ];
      

      const dataSource = details.map((data, i) => {

        return {
            key: i,
            ...data
        }
        
      })

      return <Table 
        size="small"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        scroll={{
            x: '100%',
            y: '530px'
        }}
        pagination={true} />  

 }


export default InventoryDetailsTable;