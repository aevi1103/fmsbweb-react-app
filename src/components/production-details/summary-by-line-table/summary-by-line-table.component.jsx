import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import 'tachyons'
import { 
    Table,
    Modal,
    Button,
    Tooltip
 } from "antd";

import ScrapLink  from '../../scrap-link/scrap-link.component'
import DefectSummaryTable from '../defect-summary-table/defect-summary-table.component'
import SapNetTable from '../sap-net-table/sap-net-table.component'

import '../production-details.styles.scss'

const getScrapRate = (data, scrapArea, onClick, isAfScrap = false, afScrapRate = 0) => {

    const { sbScrapAreaDetails, foundryScrapRateTarget, machiningScrapRateTarget, afScrapRateTarget } = data;

    let scrapTarget = 0;
    switch (scrapArea.toLowerCase()) {
        case 'foundry' :
            scrapTarget = foundryScrapRateTarget
            break;
        case 'machining' :
            scrapTarget = machiningScrapRateTarget
            break;
        default:
            scrapTarget = afScrapRateTarget;
            break;
    }

    const getTextState = (scrapRate, target) => {
        if (scrapRate < target) return 'green';
        return 'red b';
    }

    const scrap = sbScrapAreaDetails.find(({scrapAreaName}) => scrapAreaName === scrapArea);
    const qty = scrap ? scrap.qty : 0;
    const rate = scrap ? scrap.scrapRate : 0;

    const textState = getTextState(isAfScrap ? afScrapRate : rate, scrapTarget);

    const scrapRateText = `${numeral(rate).format('0.00%')} (${numeral(qty).format('0,0')})`;
    const toolTip = !isAfScrap 
                        ? `Click to see Scrap Details, Target: ${numeral(scrapTarget).format('0.00%')}`
                        : `Click to see Scrap Details, AF Total Scrap: ${numeral(afScrapRate).format('0.00%')}, Target: ${numeral(scrapTarget).format('0.00%')}`;
    return <ScrapLink qty={qty} value={scrapRateText} onClick={onClick} textState={textState} scrapTarget={scrapTarget} toolTip={toolTip}/>;

};

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
        setModalTitle(ttl);
    };

    const onSapNetModalShow = (sapNetData = [], { area, line, sapNet }) => {

        setSapNetModalVisible(true);
        setSapNetData(sapNetData);

        const machine = area === 'Machine Line' ? `Line ${line}` : line;
        var ttl = `${machine} SAP Production Details ~ ${numeral(sapNet).format('0,0')}`;
        setSapNetModalTitle(ttl);

    };

    const sortScrap = (a, b, type) => {

        const filteredDataA = a.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === type);
        const filteredDataB = b.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === type); 

        const totalA = filteredDataA.reduce((acc, {qty}) => parseInt(acc) + parseInt(qty), 0);
        const totalB = filteredDataB.reduce((acc, {qty}) => parseInt(acc) + parseInt(qty), 0);
        
        return totalA - totalB;
    };

    const columns = !productionDetailsCollection ? [] : [
        {
            title: 'Area',
            dataIndex: 'area',
            className: 'lineTbl',
            render: (text, record, index) => {
                return record.area;
            },
            sorter: (a, b) => a.area.length - b.area.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Line',
            dataIndex: 'line',
            render: (text, record, index) => {
                return record.line;
            },
            sorter: (a, b) => a.line.length - b.line.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Target',
            dataIndex: 'target',
            render: (text, record, index) => {
                return numeral(record.target).format('0,0');            
            },
            sorter: (a, b) => a.target - b.target,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'HxH Gross',
            dataIndex: 'hxhGross',
            render: (text, record, index) => {
                return numeral(record.hxHGross).format('0,0');   
            },
            sorter: (a, b) => a.hxHGross - b.hxHGross,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'SAP Gross',
            dataIndex: 'sapGross',
            render: (text, record, index) => {
                return numeral(record.sapGross).format('0,0');  
            },
            sorter: (a, b) => a.sapGross - b.sapGross,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: <span className="parent-danger">Total Scrap</span>,
            children: [
                {
                    title: 'South Bend',
                    dataIndex: 'totalSbScrap',
                    render: (text, record, index) => {
                        const value = `${numeral(record.totalSbScrapRate).format('0.00%')} (${numeral(record.totalSbScrap).format('0,0')})`
                        return <ScrapLink qty={record.totalSbScrap} value={value} 
                                    onClick={() => onModalShow(record.sbScrapDetails, record, 'SB')}/>
                    },
                    sorter: (a, b) => a.totalSbScrapRate - b.totalSbScrapRate,
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Purchased',
                    dataIndex: 'totalPurchaseScrap',
                    render: (text, record, index) => {
                        const value = `${numeral(record.totalPurchaseScrapRate).format('0.00%')} (${record.totalPurchaseScrap})`
                        return <ScrapLink qty={record.totalPurchaseScrap} value={value} 
                                    onClick={() => onModalShow(record.purchaseScrapDetails, record, 'Purchased')}/>
                    },
                    sorter: (a, b) => a.totalPurchaseScrap - b.totalPurchaseScrap,
                    sortDirections: ['descend', 'ascend'],
                },
            ]
        },
        {
            title: <span className="parent-danger">South Bend Scrap</span>,
            children: [
                {
                    title: 'FS',
                    dataIndex: 'fs',
                    render: (text, record, index) => {
                        const { sbScrapDetails } = record;
                        const filteredScrap = sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Foundry')
                        return getScrapRate(record, 'Foundry', () => onModalShow(filteredScrap, record, 'Foundry'))
                    },
                    sorter: (a, b) => sortScrap(a, b, 'Foundry'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'MS',
                    dataIndex: 'ms',
                    render: (text, record, index) => {
                        const { sbScrapDetails } = record;
                        const filteredScrap = sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Machining')
                        return getScrapRate(record, 'Machining', () => onModalShow(filteredScrap, record, 'Machining'))
                    },
                    sorter: (a, b) => sortScrap(a, b, 'Machining'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Anod',
                    dataIndex: 'anod',
                    render: (text, record, index) => {
                        const { sbScrapDetails, totalAfScrapRate } = record;
                        const filteredScrap = sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Anodize')
                        return getScrapRate(record, 'Anodize', () => onModalShow(filteredScrap, record, 'Anodize'), true, totalAfScrapRate)
                    },
                    sorter: (a, b) => sortScrap(a, b, 'Anodize'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'SC',
                    dataIndex: 'sc',
                    render: (text, record, index) => {
                        const { sbScrapDetails, totalAfScrapRate } = record;
                        const filteredScrap = sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Skirt Coat')
                        return getScrapRate(record, 'Skirt Coat', () => onModalShow(filteredScrap, record, 'Skirt Coat'), true, totalAfScrapRate)
                    },
                    sorter: (a, b) => sortScrap(a, b, 'Skirt Coat'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Assy',
                    dataIndex: 'assy',
                    render: (text, record, index) => {
                        const { sbScrapDetails, totalAfScrapRate } = record;
                        const filteredScrap = sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Assembly')
                        return getScrapRate(record, 'Assembly', () => onModalShow(filteredScrap, record, 'Assembly'), true, totalAfScrapRate)
                    },
                    sorter: (a, b) => sortScrap(a, b, 'Assembly'),
                    sortDirections: ['descend', 'ascend'],
                },
            ]
        },
        {
            title: 'OAE Target',
            dataIndex: 'oaeTarget',
            render: (text, record, index) => {
                return numeral(record.oaeTarget).format('0%');  
            },
            sorter: (a, b) => a.oaeTarget - b.oaeTarget,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: <span className="parent-success">SAP Production</span>,
            children: [
                {
                    title: 'Net',
                    dataIndex: 'sapNet',
                    render: (text, record, index) => {
                        const net =  numeral(record.sapNet).format('0,0');
                        return <Tooltip placement="top" title="Click to see sap production details">
                                    <Button type="link" onClick={() => onSapNetModalShow(record.sapNetDetails, record)}>
                                        <span>{net}</span>        
                                    </Button>
                                </Tooltip>
                                
                    },
                    sorter: (a, b) => a.sapNet - b.sapNet,
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'OAE %',
                    dataIndex: 'sapOae',
                    render: (text, record, index) => {

                        const { oaeTarget, sapOae } = record;
                        const format = '0.0%';
                        if (sapOae >= oaeTarget) {
                            return <span className="green">{numeral(sapOae).format(format)}</span>;
                        } else {
                            return <span className="red b">{numeral(sapOae).format(format)}</span>;
                        }

                    },
                    sorter: (a, b) => a.sapOae - b.sapOae,
                    sortDirections: ['descend', 'ascend'],
                },
            ]
        },
        {
            title: <span className="parent-warning">HxH Production</span>,
            children: [
                {
                    title: 'Net',
                    dataIndex: 'hxhNet',
                    render: (text, record, index) => {
                        return <span>{numeral(record.hxHNet).format('0,0')}</span>;
                    },
                    sorter: (a, b) => a.hxHNet - b.hxHNet,
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'OAE %',
                    dataIndex: 'hxhOae',
                    render: (text, record, index) => {

                        const { oaeTarget, hxHOae } = record;
                        const format = '0.0%';
                        if (hxHOae >= oaeTarget) {
                            return <span className="green">{numeral(hxHOae).format(format)}</span>;
                        } else {
                            return <span className="red b">{numeral(hxHOae).format(format)}</span>;
                        }

                    },
                    sorter: (a, b) => parseFloat(a.hxHOae) - parseFloat(b.hxHOae),
                    sortDirections: ['descend', 'ascend'],
                },
            ]
        },
        // {
        //     title: 'Component Scrap %',
        //     dataIndex: 'componentScrap',
        //     render: (text, record, index) => {
        //         return <span>{numeral(record.componentScrapRate).format('0.0%')} ({record.componentScrap})</span>
        //     },
        //     sorter: (a, b) => a.componentScrapRate - b.componentScrapRate,
        //     sortDirections: ['descend', 'ascend'],
        // },
        // {
        //     title: 'Downtime %',
        //     dataIndex: 'downtime',
        //     render: (text, record, index) => {
        //         return numeral(record.downtimeRate).format('0.0%');
        //     },
        //     sorter: (a, b) => a.downtimeRate - b.downtimeRate,
        //     sortDirections: ['descend', 'ascend'],
        // }    
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

      const addCellStyle = (className) => {
        const parent = document.querySelectorAll(className);
        parent.forEach(el => {
            const th = el.closest('th');

            if (className.includes('danger')) {        
                th.classList.add('cell-danger');
            } 
            
            if (className.includes('success')) {
                th.classList.add('cell-success');
            }

            if (className.includes('warning')) {
                th.classList.add('cell-warning');
            }
        })
      }

      useEffect(() => {
        addCellStyle('.parent-success');
        addCellStyle('.parent-danger');
        addCellStyle('.parent-warning');

      }, [])

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