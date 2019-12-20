import React, { useState } from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import { 
    Table,
    Modal,
    Button,
    Tooltip
 } from "antd";

import { TextSuccess } from '../../typhography/text-status.component'

import ScrapLink  from '../../scrap-link/scrap-link.component'
import DefectSummaryTable from '../defect-summary-table/defect-summary-table.component'
import SapNetTable from '../sap-net-table/sap-net-table.component'

const getScrapRate = (data, scrapArea, onClick) => {
    const scrap = data.sbScrapAreaDetails.find(({scrapAreaName}) => scrapAreaName === scrapArea);
    const qty = scrap ? scrap.qty : 0;
    const rate = scrap ? scrap.scrapRate : 0;
    const scrapRateText = `${numeral(rate).format('0.00%')} (${numeral(qty).format('0,0')})`;
    return <ScrapLink qty={qty} value={scrapRateText} onClick={onClick}/>
}

const SummaryByLineTable = ({isProductionDetailsLoading, productionDetailsCollection}) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [scrapDetails, setScrapDetails] = useState([]);
    const [modalTitle, setModalTitle] = useState("Scrap Details");

    const [sapNetModalVisible, setSapNetModalVisible] = useState(false);
    const [sapNetModalTitle, setSapNetModalTitle] = useState("SAP Production Details");
    const [sapNetData, setSapNetData] = useState([]);

    const onModalShow = (scrapDetailsData = [], { area, line, sapGross }, scrapType) => {

        setModalVisible(true);
        setScrapDetails(scrapDetailsData);

        const totalScrap = scrapDetailsData.reduce((acc, { qty }) => acc + parseInt(qty), 0);
        const scrapRate = sapGross === 0 ? 0 : totalScrap / sapGross;
        const scrapRateText = `${numeral(scrapRate).format('0.00%')} (${numeral(totalScrap).format('0,0')})`;

        const machine = area === 'Machine Line' ? `Line ${line}` : line;
        const ttl = `${machine} ${scrapType} Scrap Details ~ ${scrapRateText}`;
        setModalTitle(ttl)
    }

    const onSapNetModalShow = (sapNetData = [], { area, line, sapNet }) => {

        setSapNetModalVisible(true);
        setSapNetData(sapNetData);

        const machine = area === 'Machine Line' ? `Line ${line}` : line;
        var ttl = `${machine} SAP Production Details ~ ${numeral(sapNet).format('0,0')}`;
        setSapNetModalTitle(ttl);

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
                const value = `${numeral(record.totalSbScrapRate).format('0.00%')} (${record.totalSbScrap})`
                return <ScrapLink qty={record.totalSbScrap} value={value} 
                            onClick={() => onModalShow(record.sbScrapDetails, record, 'SB')}/>
            }
        },
        {
            title: 'Total Purchase Scrap',
            dataIndex: 'totalPurchaseScrap',
            render: (text, record, index) => {
                const value = `${numeral(record.totalPurchaseScrapRate).format('0.00%')} (${record.totalPurchaseScrap})`
                return <ScrapLink qty={record.totalPurchaseScrap} value={value} 
                            onClick={() => onModalShow(record.purchaseScrapDetails, record, 'Purchased')}/>
            }
        },
        {
            title: 'FS',
            dataIndex: 'fs',
            render: (text, record, index) => {
                const filteredScrap = record.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Foundry')
                return getScrapRate(record, 'Foundry', 
                            () => onModalShow(filteredScrap, record, 'Foundry'))
            }
        },
        {
            title: 'MS',
            dataIndex: 'ms',
            render: (text, record, index) => {
                const filteredScrap = record.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Machining')
                return getScrapRate(record, 'Machining', 
                            () => onModalShow(filteredScrap, record, 'Machining'))
            }
        },
        {
            title: 'Anod',
            dataIndex: 'anod',
            render: (text, record, index) => {
                const filteredScrap = record.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Anodize')
                return getScrapRate(record, 'Anodize', 
                            () => onModalShow(filteredScrap, record, 'Anodize'))
            }
        },
        {
            title: 'SC',
            dataIndex: 'sc',
            render: (text, record, index) => {
                const filteredScrap = record.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Skirt Coat')
                return getScrapRate(record, 'Skirt Coat', 
                            () => onModalShow(filteredScrap, record, 'Skirt Coat'))
            }
        },
        {
            title: 'Assy',
            dataIndex: 'assy',
            render: (text, record, index) => {
                const filteredScrap = record.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Assembly')
                return getScrapRate(record, 'Assembly', 
                            () => onModalShow(filteredScrap, record, 'Assembly'))
            }
        },
        {
            title: 'Net (SAP)',
            dataIndex: 'sapNet',
            render: (text, record, index) => {
                const net =  numeral(record.sapNet).format('0,0');
                return <Tooltip placement="top" title="Click to see sap production details">
                            <Button type="link" onClick={() => onSapNetModalShow(record.sapNetDetails, record)}>
                                <TextSuccess>{net}</TextSuccess>        
                            </Button>
                        </Tooltip>
                        
            }
        },
        {
            title: 'OAE % (SAP)',
            dataIndex: 'sapOae',
            render: (text, record, index) => {
                return <TextSuccess>{numeral(record.sapOae).format('0.0%')}</TextSuccess>;
            }
        },
        {
            title: 'Net (HxH)',
            dataIndex: 'hxhNet',
            render: (text, record, index) => {
                return <TextSuccess>{numeral(record.hxHNet).format('0,0')}</TextSuccess>;
            }
        },
        {
            title: 'OAE % (HxH)',
            dataIndex: 'hxhOae',
            render: (text, record, index) => {
                return <TextSuccess>{numeral(record.hxHOae).format('0.0%')}</TextSuccess>;
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
      }

      const onSapNetModalCancel = () => {
        setSapNetModalVisible(false);
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
                title={modalTitle}
                visible={modalVisible}
                onCancel={onModalCancel}
                width="50%"
                footer={[
                    <Button key="back" onClick={onModalCancel}>
                      Close
                    </Button>
                  ]}>
                    <DefectSummaryTable scrapData={scrapDetails} />
            </Modal>

            <Modal
                title={sapNetModalTitle}
                visible={sapNetModalVisible}
                onCancel={onSapNetModalCancel}
                width="50%"
                footer={[
                    <Button key="back" onClick={onSapNetModalCancel}>
                      Close
                    </Button>
                  ]}>
                  <SapNetTable sapNetData={sapNetData}/>
            </Modal>
        </>
        
    )
}

const mapStateToProps = ({ productionDetails }) => ({
    isProductionDetailsLoading: productionDetails.isProductionDetailsLoading,
    productionDetailsCollection: productionDetails.productionDetailsCollection,
})

export default connect(mapStateToProps)(SummaryByLineTable);