import React from 'react';
import numeral from 'numeral';
import moment from 'moment';
import { 
    Table,
    Typography,
    Tooltip 
 } from "antd";

 const { Text } = Typography;

const renderScrap = (qty, rate, targetRate) => {
    
    const type = rate >= targetRate ? 'danger' : '';
    const strong = rate >= targetRate ? true : false;
    const rateStr = numeral(rate).format('0.00%');
    const tagetrateStr = numeral(targetRate).format('0.00%')
    const qtyStr = numeral(qty).format('0,0');

    return <Tooltip title={`Qty: ${qtyStr}, Target: ${tagetrateStr}`}>
        <Text type={type} strong={strong}>{rateStr}</Text>
    </Tooltip> 

}
const renderOae = (rate, targetRate) => {
    
    const type = rate < targetRate ? 'danger' : '';
    const strong = rate < targetRate ? true : false;
    const rateStr = numeral(rate).format('0%');
    const tagetrateStr = numeral(targetRate).format('0%');

    return <Tooltip title={`Target: ${tagetrateStr}`}>
        <Text type={type} strong={strong}>{rateStr}</Text>
    </Tooltip> 
}


const EosTable = ({loading, data, summaryData}) => {

    const columns = [
        {
            title: 'HxH Link',
            dataIndex: 'hxHUrl',
            render: (text, record, index) => {
                return <a href={record.hxHUrl} target="_blank" rel="noopener noreferrer">View</a>
            },
            sorter: (a, b) => new Date(a.shiftDate) - new Date(b.shiftDate),
            sortDirections: ['descend', 'ascend'],
            width: 70,
            fixed: 'left',
        },
        {
            title: 'Shift Date',
            dataIndex: 'shiftDate',
            render: (text, record, index) => {
                return moment(record.shiftDate).format('l');
            },
            sorter: (a, b) => new Date(a.shiftDate) - new Date(b.shiftDate),
            sortDirections: ['descend', 'ascend'],
            width: 90,
            fixed: 'left',
        },
        {
            title: 'Shift',
            dataIndex: 'shift',
            sorter: (a, b) => a.shift.length - b.shift.length,
            sortDirections: ['descend', 'ascend'],
            width: 70,
            fixed: 'left',
        },
        {
            title: 'Line',
            dataIndex: 'line',
            sorter: (a, b) => a.line.length - b.line.length,
            sortDirections: ['descend', 'ascend'],
            width: 70,
            fixed: 'left',
        },
        {
            title: <span className="parent-danger">HxH</span>,
            children: [
                {
                    title: 'Gross',
                    dataIndex: 'hxHGross',
                    render: (text, record, index) => {
                        return numeral(record.hxHGross).format('0,0');
                    },
                    sorter: (a, b) => a.hxHGross - b.hxHGross,
                    sortDirections: ['descend', 'ascend'],
                    width: 70
                },
                {
                    title: 'Net',
                    dataIndex: 'hxHNet',
                    render: (text, record, index) => {
                        return numeral(record.hxHNet).format('0,0');
                    },
                    sorter: (a, b) => a.hxHNet - b.hxHNet,
                    sortDirections: ['descend', 'ascend'],
                    width: 70
                },
                {
                    title: 'OAE',
                    dataIndex: 'hxHNet',
                    render: (text, record, index) => {
                        return renderOae(record.hxHOae, record.oaeTarget)
                    },
                    sorter: (a, b) => a.hxHNet - b.hxHNet,
                    sortDirections: ['descend', 'ascend'],
                    width: 70
                },
            ]
        },
        {
            title: <span className="parent-danger">SAP</span>,
            children: [
                {
                    title: 'Net',
                    dataIndex: 'sapNet',
                    render: (text, record, index) => {
                        return numeral(record.sapNet).format('0,0');
                    },
                    sorter: (a, b) => a.sapNet - b.sapNet,
                    sortDirections: ['descend', 'ascend'],
                    width: 70
                },
                {
                    title: 'OAE',
                    dataIndex: 'sapOae',
                    render: (text, record, index) => {
                        return renderOae(record.sapOae, record.oaeTarget)
                    },
                    sorter: (a, b) => a.sapOae - b.sapOae,
                    sortDirections: ['descend', 'ascend'],
                    width: 70
                },
            ]
        },
        {
            title: <span className="parent-danger">Scrap Rates</span>,
            children: [
                {
                    title: 'SB',
                    dataIndex: 'totalSbScrap',
                    render: (text, record, index) => {
                        return renderScrap(record.totalSbScrap, record.totalSbScrapRate, record.overallScrapRateTarget)
                    },
                    sorter: (a, b) => a.totalSbScrap - b.totalSbScrap,
                    sortDirections: ['descend', 'ascend'],
                    width: 70
                },
                {
                    title: 'Purchased',
                    dataIndex: 'totalPurchaseScrap',
                    render: (text, record, index) => {
                        return renderScrap(record.totalPurchaseScrap, record.totalPurchaseScrapRate, record.overallScrapRateTarget)
                    },
                    sorter: (a, b) => a.totalPurchaseScrap - b.totalPurchaseScrap,
                    sortDirections: ['descend', 'ascend'],
                    width: 100
                },
                {
                    title: 'Overall',
                    dataIndex: 'totalScrap',
                    render: (text, record, index) => {
                        return renderScrap(record.totalScrap, record.totalScrapRate, record.overallScrapRateTarget)
                    },
                    sorter: (a, b) => a.totalScrap - b.totalScrap,
                    sortDirections: ['descend', 'ascend'],
                    width: 90
                },
                {
                    title: 'A&F',
                    dataIndex: 'totalAfScrap',
                    render: (text, record, index) => {
                        return renderScrap(record.totalAfScrap, record.totalAfScrapRate, record.afScrapRateTarget)
                    },
                    sorter: (a, b) => a.totalAfScrap - b.totalAfScrap,
                    sortDirections: ['descend', 'ascend'],
                    width: 70
                }
            ]
        },
        {
            title: 'Scrap Comment',
            dataIndex: 'scrapComment',
            sorter: (a, b) => a.line.length - b.line.length,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Downtime Comment',
            dataIndex: 'downtimeComment',
            sorter: (a, b) => a.line.length - b.line.length,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Manning',
            dataIndex: 'manning',
            sorter: (a, b) => a.line.length - b.line.length,
            sortDirections: ['descend', 'ascend'],
            width: 90
        },
        {
            title: 'PPMH',
            dataIndex: 'ppmh',
            sorter: (a, b) => a.ppmh - b.ppmh,
            sortDirections: ['descend', 'ascend'],
            width: 70
        },
        {
            title: 'Time Stamp',
            dataIndex: 'timeStamp',
            render: (text, record, index) => {
                return moment(record.timeStamp).format('MM/DD/YYYY hh:mm A')
            },
            sorter: (a, b) => new Date(a.timeStamp) - new Date(b.timeStamp),
            sortDirections: ['descend', 'ascend'],
            width: 160
        },
      ];
      
      const dataSource = data.map((data, i) => ({key: i, ...data}))

      const summary = pageData => {

        const { 
            oaeTarget,
            hxHGross,
            hxHNet,
            hxHOae,
            sapNet,
            sapOae,

            totalSbScrap,
            totalPurchaseScrap,
            totalAfScrap,
            totalScrap,

            totalSbScrapRate,
            totalPurchaseScrapRate,
            totalAfScrapRate,
            totalScrapRate,

            manning,
            ppmh
        } = summaryData;

        return (
            <React.Fragment>
                <Table.Summary.Row style={{
                    backgroundColor: '#fafafa'
                }} >
                    <Table.Summary.Cell colSpan="4">
                        <Text strong>Total</Text>
                    </Table.Summary.Cell>

                    <Table.Summary.Cell>
                        <Text strong>{numeral(hxHGross).format('0,0')}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                        <Text strong>{numeral(hxHNet).format('0,0')}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                        <Text strong>{renderOae(hxHOae, oaeTarget)}</Text>
                    </Table.Summary.Cell>

                    <Table.Summary.Cell>
                        <Text strong>{numeral(sapNet).format('0,0')}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                        <Text strong>{renderOae(sapOae, oaeTarget)}</Text>
                    </Table.Summary.Cell>

                    <Table.Summary.Cell>
                        <Text strong>{renderScrap(totalSbScrap, totalSbScrapRate)}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                        <Text strong>{renderScrap(totalPurchaseScrap, totalPurchaseScrapRate)}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                        <Text strong>{renderScrap(totalAfScrap, totalAfScrapRate)}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                        <Text strong>{renderScrap(totalScrap, totalScrapRate)}</Text>
                    </Table.Summary.Cell>

                    <Table.Summary.Cell colSpan="2"></Table.Summary.Cell>
                    
                    <Table.Summary.Cell>
                        <Text strong>{numeral(manning).format('0,0')}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell >
                        <Text strong>{numeral(ppmh).format('0,0')}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell ></Table.Summary.Cell>

                </Table.Summary.Row>
            </React.Fragment>
        )

      }

    return (
        <>
            <Table 
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                size="middle"
                bordered={true}
                pagination={false} 
                summary={data.length > 0 ? summary : null}
                scroll={{ x: 1500, y: 1500 }}
                />

        </>
        
    )
}

export default EosTable;