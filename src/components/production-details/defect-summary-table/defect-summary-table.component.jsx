import React, { useState } from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import { 
    Table,
    Modal,
    Button
 } from "antd";

 import ScrapLink  from '../../scrap-link/scrap-link.component'

const DefectSummaryTable = ({isProductionDetailsLoading, scrapData}) => {

    const [modalVisible, setModalVisible] = useState(false);

    const onModalShow = () => {
        setModalVisible(true);
    }

    const columns = [
        {
            title: 'Area',
            dataIndex: 'area',
            render: (text, record, index) => {
                return record.area;
            }
        },
        {
            title: 'Scrap Type',
            dataIndex: 'type',
            render: (text, record, index) => {
                return record.scrapAreaName;
            }
        },
        {
            title: 'Scrap Code',
            dataIndex: 'code',
            render: (text, record, index) => {
                return record.scrapCode;           
            }
        },
        {
            title: 'Scrap Description',
            dataIndex: 'hxhGross',
            render: (text, record, index) => {
                return record.scrapDesc;  
            }
        },
        {
            title: 'Qty',
            dataIndex: 'sapGross',
            render: (text, record, index) => {
                const value = numeral(record.qty).format('0,0'); 
                return <ScrapLink qty={record.qty} value={value} onClick={onModalShow}/> 
            }
        } 
      ];
      
      const data = scrapData.map((data, i) => ({key: i, ...data}))

      const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
      }

      const onModalCancel = () => {
        setModalVisible(false);
      }

    return (
        <>
            <Table 
                loading={isProductionDetailsLoading}
                columns={columns}
                dataSource={data}
                onChange={onChange}
                pagination={false} />     

            <Modal
                title="Scrap Detail by Line"
                visible={modalVisible}
                onCancel={onModalCancel}
                width="50%"
                footer={[
                    <Button key="back" onClick={onModalCancel}>
                      Cancel
                    </Button>
                  ]}>
            </Modal>
        </>
        
    )
}

const mapStateToProps = ({ productionDetails }) => ({
    isProductionDetailsLoading: productionDetails.isProductionDetailsLoading
})

export default connect(mapStateToProps)(DefectSummaryTable);