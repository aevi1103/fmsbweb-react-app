import React, { useState, useEffect } from 'react';
import numeral from 'numeral';
import { useParams } from 'react-router-dom'
import { 
    Table,
    Modal,
    Button,
    Tooltip
 } from "antd";

import ScrapLink  from '../../../components/scrap-link/scrap-link.component'
import DefectSummaryTable from '../../../components/defect-summary-table/defect-summary-table.component'
import SapNetTable from '../../../components/sap-net-table/sap-net-table.component'
import ProductionDetailsTableFooter from './production-details-table-footer.component'

const getScrapRate = (data, scrapArea, onClick) => {
    const scrap = data.sbScrapAreaDetails.find(({scrapAreaName}) => scrapAreaName === scrapArea);
    const qty = scrap ? scrap.qty : 0;
    const rate = scrap ? scrap.scrapRate : 0;
    const scrapRateText = `${numeral(rate).format('0.00%')} (${numeral(qty).format('0,0')})`;
    return <ScrapLink qty={qty} value={scrapRateText} onClick={onClick}/>
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

const sortScrap = (a, b, type) => {

    const filteredDataA = a.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === type);
    const filteredDataB = b.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === type); 

    const totalA = filteredDataA.reduce((acc, {qty}) => parseInt(acc) + parseInt(qty), 0);
    const totalB = filteredDataB.reduce((acc, {qty}) => parseInt(acc) + parseInt(qty), 0);
    
    return totalA - totalB;
}

const SummaryByProgramTable = React.memo(({ data, loading }) => {

    const { department } = useParams();
    const detailsByProgram = data?.detailsByProgram ?? [];

    const [modalVisible, setModalVisible] = useState(false);
    const [scrapDetails, setScrapDetails] = useState([]);
    const [modalTitle, setModalTitle] = useState("Scrap Details");
    const [sapNetModalVisible, setSapNetModalVisible] = useState(false);
    const [sapNetModalTitle, setSapNetModalTitle] = useState("SAP Production Details");
    const [sapNetData, setSapNetData] = useState([]);

    useEffect(() => {
        addCellStyle('.parent-success');
        addCellStyle('.parent-danger');
        addCellStyle('.parent-warning');
      }, [])

    const onModalShow = (scrapDetailsData = [], { program, sapGross }, scrapType) => {

        setModalVisible(true);
        setScrapDetails(scrapDetailsData);

        const totalScrap = scrapDetailsData.reduce((acc, { qty }) => acc + parseInt(qty), 0);
        const scrapRate = sapGross === 0 ? 0 : totalScrap / sapGross;
        const scrapRateText = `${numeral(scrapRate).format('0.00%')} (${numeral(totalScrap).format('0,0')})`;

        const ttl = `${program} ${scrapType} Scrap Details ~ ${scrapRateText}`;
        setModalTitle(ttl)
    }

    const onSapNetModalShow = (sapNetData = [], { program, sapNet }) => {

        setSapNetModalVisible(true);
        setSapNetData(sapNetData);

        var ttl = `${program} SAP Production Details ~ ${numeral(sapNet).format('0,0')}`;
        setSapNetModalTitle(ttl);

    }

    const columns = [
        {
            title: 'Area',
            dataIndex: 'area',
            render: (text, record, index) => {
                return record.area;
            },
            sorter: (a, b) => a.area.length - b.area.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Program',
            dataIndex: 'program',
            render: (text, record, index) => {
                return record.program;
            },
            sorter: (a, b) => a.program.length - b.program.length,
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
            title: <span>Gross</span>,
            children: [
                {
                    title: `${department === 'machining' ? 'EOS' : 'HxH'} ${department === 'foundry' ? 'w/ warmers' : ''}`,
                    dataIndex: 'hxhGross',
                    render: (text, record, index) => {
                        return numeral(record.hxHGross).format('0,0');   
                    },
                    sorter: (a, b) => a.hxHGross - b.hxHGross,
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'SAP',
                    dataIndex: 'sapGross',
                    render: (text, record, index) => {
                        return numeral(record.sapGross).format('0,0');  
                    },
                    sorter: (a, b) => a.sapGross - b.sapGross,
                    sortDirections: ['descend', 'ascend'],
                },
            ]
        },
        
        {
            title: <span>Total Scrap</span>,
            children: [
                {
                    title: 'South Bend',
                    dataIndex: 'totalSbScrap',
                    render: (text, record, index) => {
                        const value = `${numeral(record.totalSbScrapRate).format('0.00%')} (${record.totalSbScrap})`
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
            title: <span>South Bend Scrap</span>,
            children: [
                {
                    title: 'Warmers',
                    dataIndex: 'totalWarmers',
                    render: (text, record, index) => {
                        return record.totalWarmers;
                    },
                    sorter: (a, b) => a.totalWarmers - b.totalWarmers,
                    sortDirections: ['descend', 'ascend']
                },
                {
                    title: 'FS',
                    dataIndex: 'fs',
                    render: (text, record, index) => {
                        const filteredScrap = record.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Foundry')
                        return getScrapRate(record, 'Foundry', 
                                    () => onModalShow(filteredScrap, record, 'Foundry'))
                    },
                    sorter: (a, b) => sortScrap(a, b, 'Foundry'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'MS',
                    dataIndex: 'ms',
                    render: (text, record, index) => {
                        const filteredScrap = record.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Machining')
                        return getScrapRate(record, 'Machining', 
                                    () => onModalShow(filteredScrap, record, 'Machining'))
                    },
                    sorter: (a, b) => sortScrap(a, b, 'Machining'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Anod',
                    dataIndex: 'anod',
                    render: (text, record, index) => {
                        const filteredScrap = record.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Anodize')
                        return getScrapRate(record, 'Anodize', 
                                    () => onModalShow(filteredScrap, record, 'Anodize'))
                    },
                    sorter: (a, b) => sortScrap(a, b, 'Anodize'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'SC',
                    dataIndex: 'sc',
                    render: (text, record, index) => {
                        const filteredScrap = record.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Skirt Coat')
                        return getScrapRate(record, 'Skirt Coat', 
                                    () => onModalShow(filteredScrap, record, 'Skirt Coat'))
                    },
                    sorter: (a, b) => sortScrap(a, b, 'Skirt Coat'),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Assy',
                    dataIndex: 'assy',
                    render: (text, record, index) => {
                        const filteredScrap = record.sbScrapDetails.filter(({scrapAreaName}) => scrapAreaName === 'Assembly')
                        return getScrapRate(record, 'Assembly', 
                                    () => onModalShow(filteredScrap, record, 'Assembly'))
                    },
                    sorter: (a, b) => sortScrap(a, b, 'Assembly'),
                    sortDirections: ['descend', 'ascend'],
                },
            ]
        },
        {
            title: <span>SAP Production</span>,
            children: [
                {
                    title: 'Net',
                    dataIndex: 'sapNet',
                    render: (text, record, index) => {
                        const net =  numeral(record.sapNet).format('0,0');
                        return <Tooltip placement="top" title="Click to see sap production details">
                                    <Button className="pl0" type="link" onClick={() => onSapNetModalShow(record.sapNetDetails, record)}>
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
                        return <span>{numeral(record.sapOae).format('0%')}</span>;
                    },
                    sorter: (a, b) => a.sapOae - b.sapOae,
                    sortDirections: ['descend', 'ascend'],
                },
            ]
        },
        {
            title: <span>{ department === 'machining' ? 'EOS Production' : 'HxH Production' }</span>,
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
                        return <span>{numeral(record.hxHOae).format('0%')}</span>;
                    },
                    sorter: (a, b) => a.hxhOae - b.hxhOae,
                    sortDirections: ['descend', 'ascend'],
                },
            ]
        }   
    ];
      
    const dataSource = detailsByProgram.map((data, i) => ({key: i, ...data}))

    const onModalCancel = () => setModalVisible(false);
    const onSapNetModalCancel = () => setSapNetModalVisible(false);

    return (
        <>
            <Table 
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                size="middle"
                bordered={true}
                pagination={false}
                summary={() => <ProductionDetailsTableFooter data={data} />} />     

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
})

export default SummaryByProgramTable;