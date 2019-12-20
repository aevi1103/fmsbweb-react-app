import React, { useState } from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import { 
    Table,
    Modal,
    Button
 } from "antd";

 import ScrapLink  from '../../scrap-link/scrap-link.component'
 import DefectSummaryTable from '../defect-summary-table/defect-summary-table.component'

const getScrapRate = (data, scrapArea, onClick) => {
    const scrap = data.sbScrapAreaDetails.find(({scrapAreaName}) => scrapAreaName === scrapArea);
    const qty = scrap ? scrap.qty : 0;
    const rate = scrap ? scrap.scrapRate : 0;
    const value = `${numeral(rate).format('0.00%')} (${numeral(qty).format('0,0')})`;

    return <ScrapLink qty={qty} value={value} onClick={onClick}/>
}

const SummaryByLineTable = ({isProductionDetailsLoading, productionDetailsCollection}) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [scrapDetails, setScrapDetails] = useState([]);

    const onModalShow = (scrapDetailsData = []) => {
        setModalVisible(true);
        setScrapDetails(scrapDetailsData);
    }

    const columns = !productionDetailsCollection ? [] : [
        {
            title: 'Area',
            dataIndex: 'area',
            render: (text, record, index) => {
                return record.area;
            }
        },
        {
            title: 'Line',
            dataIndex: 'line',
            render: (text, record, index) => {
                return record.line;
            }
        },
        {
            title: 'Target',
            dataIndex: 'target',
            render: (text, record, index) => {
                return numeral(record.target).format('0,0');            
            }
        },
        {
            title: 'HxH Gross',
            dataIndex: 'hxhGross',
            render: (text, record, index) => {
                return numeral(record.hxHGross).format('0,0');   
            }
        },
        {
            title: 'SAP Gross',
            dataIndex: 'sapGross',
            render: (text, record, index) => {
                return numeral(record.sapGross).format('0,0');  
            }
        },
        {
            title: 'Total SB Scrap',
            dataIndex: 'totalSbScrap',
            render: (text, record, index) => {
                const value = `${numeral(record.totalSbScrapRate).format('0.0%')} (${record.totalSbScrap})`
                return <ScrapLink qty={record.totalSbScrap} value={value} onClick={() => onModalShow(record.sbScrapDetails)}/>
            }
        },
        {
            title: 'Total Purchase Scrap',
            dataIndex: 'totalPurchaseScrap',
            render: (text, record, index) => {
                const value = `${numeral(record.totalPurchaseScrapRate).format('0.0%')} (${record.totalPurchaseScrap})`
                return <ScrapLink qty={record.totalPurchaseScrap} value={value} onClick={() => onModalShow(record.purchaseScrapDetails)}/>
            }
        },
        {
            title: 'FS',
            dataIndex: 'fs',
            render: (text, record, index) => {
                const filteredScrap = record.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Foundry')
                return getScrapRate(record, 'Foundry', onModalShow)
            }
        },
        {
            title: 'MS',
            dataIndex: 'ms',
            render: (text, record, index) => {
                const filteredScrap = record.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Machining')
                return getScrapRate(record, 'Machining', onModalShow)
            }
        },
        {
            title: 'Anod',
            dataIndex: 'anod',
            render: (text, record, index) => {
                const filteredScrap = record.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Anodize')
                return getScrapRate(record, 'Anodize', onModalShow)
            }
        },
        {
            title: 'SC',
            dataIndex: 'sc',
            render: (text, record, index) => {
                const filteredScrap = record.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Skirt Coat')
                return getScrapRate(record, 'Skirt Coat', onModalShow)
            }
        },
        {
            title: 'Assy',
            dataIndex: 'assy',
            render: (text, record, index) => {
                const filteredScrap = record.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Assembly')
                return getScrapRate(record, 'Assembly', onModalShow)
            }
        },
        {
            title: 'Net (SAP)',
            dataIndex: 'sapNet',
            render: (text, record, index) => {
                return numeral(record.sapNet).format('0,0');
            }
        },
        {
            title: 'OAE % (SAP)',
            dataIndex: 'sapOae',
            render: (text, record, index) => {
                return numeral(record.sapOae).format('0.0%');
            }
        },
        {
            title: 'Net (HxH)',
            dataIndex: 'hxhNet',
            render: (text, record, index) => {
                return numeral(record.hxHNet).format('0,0');
            }
        },
        {
            title: 'OAE % (HxH)',
            dataIndex: 'hxhOae',
            render: (text, record, index) => {
                return numeral(record.hxHOae).format('0.0%');
            }
        },
        {
            title: 'Component Scrap %',
            dataIndex: 'componentScrap',
            render: (text, record, index) => {
                return <span>{numeral(record.componentScrapRate).format('0.0%')} ({record.componentScrap})</span>
            }
        },
        {
            title: 'Downtime %',
            dataIndex: 'downtime',
            render: (text, record, index) => {
                return numeral(record.downtimeRate).format('0.0%');
            }
        }    
      ];
      
      const data = !productionDetailsCollection 
                    ? [] 
                    : productionDetailsCollection.detailsByLine.map((data, i) => ({key: i, ...data}))

      const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
      }

      const onModalCancel = () => {
        setModalVisible(false);
        setScrapDetails([]);
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
                    <DefectSummaryTable scrapData={scrapDetails} />
            </Modal>
        </>
        
    )
}

const mapStateToProps = ({ productionDetails }) => ({
    isProductionDetailsLoading: productionDetails.isProductionDetailsLoading,
    productionDetailsCollection: productionDetails.productionDetailsCollection,
})

export default connect(mapStateToProps)(SummaryByLineTable);