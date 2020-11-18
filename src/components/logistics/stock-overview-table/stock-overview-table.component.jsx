import React from 'react';
import { connect } from 'react-redux';
// import moment from 'moment';
import numeral from 'numeral';

import { numberSorter } from '../../../helpers/helpers';

import { 
    Table,
    Popover,
    Tag
 } from "antd";

 const numberFormat = "0,0";
 const renderWithIcon = (targets, value, program, sloc) => {

    value = numeral(value).format('0');

    const target = targets.find(t => (t.program.toLowerCase().trim() === program.toLowerCase().trim() 
                                        && t.sloc.toLowerCase().trim() === sloc.toLowerCase().trim()));
    let color = "";

    if (target) {

        const content = (
            <div>
                <p><span className="b mb1">Program:</span> {program}</p>
                <p><span className="b mb1">Min:</span> {numeral(target.min).format(numberFormat)}</p>
                <p><span className="b mb1">Max:</span> {numeral(target.max).format(numberFormat)}</p>
                <p><span className="b mb1">Qty:</span> {numeral(value).format(numberFormat)}</p>
            </div>   
        )

        if (value < target.min) {
            color = "#dc3545";
        } else if (value >= target.min && value <= target.max) {
            color = "#28a745";
        } else {
            color = "#ffc107";
        }

        return (
            <Popover content={content} title="Target" trigger="hover">
                <Tag className="b" color={color}>{numeral(value).format(numberFormat)}</Tag>
            </Popover>
        )

    }

    return <span>{numeral(value).format(numberFormat)}</span>

 }

 const StockOverviewTable = ({isStockOverviewFetching, stockOVerviewCollection}) => {

    const { data, targets } = stockOVerviewCollection;
    
    const columns = [
        {
            title: 'Program',
            dataIndex: 'prog',
            sorter: (a, b) => a.prog.length - b.prog.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Heat Treat (0111)',
            dataIndex: 'ht',
            sorter: (a, b) => numberSorter(a.ht, b.ht),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return renderWithIcon(targets, text, record.prog, '0111');
            }
        },
        {
            title: 'Grocery Store (0115)',
            dataIndex: 'gs',
            sorter: (a, b) => numberSorter(a.gs, b.gs),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return renderWithIcon(targets, text, record.prog, '0115');
            }
        },
        {
            title: 'Machine In (4000)',
            dataIndex: 'machIn',
            sorter: (a, b) => numberSorter(a.machIn, b.machIn),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return renderWithIcon(targets, text, record.prog, '4000');
            }
        },
        {
            title: 'Machine Out (5000)',
            dataIndex: 'machOut',
            sorter: (a, b) => numberSorter(a.machOut, b.machOut),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return renderWithIcon(targets, text, record.prog, '5000');
            }
        },
        {
            title: 'QC In (QC01)',
            dataIndex: 'qcIn',
            sorter: (a, b) => numberSorter(a.qcIn, b.qcIn),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return renderWithIcon(targets, text, record.prog, 'QC01');
            }
        },
        {
            title: 'QC Out (QC02)',
            dataIndex: 'qcOut',
            sorter: (a, b) => numberSorter(a.qcOut, b.qcOut),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return renderWithIcon(targets, text, record.prog, 'QC02');
            }
        },
        {
            title: 'Foundry Hold (QC03)',
            dataIndex: 'qcFoundry',
            sorter: (a, b) => numberSorter(a.qcFoundry, b.qcFoundry),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return renderWithIcon(targets, text, record.prog, 'QC02');
            }
        },
        {
            title: 'Machining Hold (QC04)',
            dataIndex: 'qcMach',
            sorter: (a, b) => numberSorter(a.qcMach, b.qcMach),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return renderWithIcon(targets, text, record.prog, 'QC02');
            }
        },
        {
            title: 'A&F Hold (QC05)',
            dataIndex: 'qcAf',
            sorter: (a, b) => numberSorter(a.qcAf, b.qcAf),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return renderWithIcon(targets, text, record.prog, 'QC02');
            }
        },
        {
            title: 'Finishing (0130)',
            dataIndex: 'fin',
            sorter: (a, b) => numberSorter(a.fin, b.fin),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return renderWithIcon(targets, text, record.prog, '0130');
            }
        },
        {
            title: 'Assembly (0131)',
            dataIndex: 'assy',
            sorter: (a, b) =>  numberSorter(a.assy, b.assy),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return renderWithIcon(targets, text, record.prog, '0131');
            }
        },
        {
            title: 'Dock (0135)',
            dataIndex: 'dock',
            sorter: (a, b) => numberSorter(a.dock, b.dock),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return renderWithIcon(targets, text, record.prog, '0135');
            }
        },
        {
            title: 'WH (0400)',
            dataIndex: 'wh',
            sorter: (a, b) => numberSorter(a.wh, b.wh),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return renderWithIcon(targets, text, record.prog, '0300');
            }
        },
        {
            title: 'Error (0125)',
            dataIndex: 'err',
            sorter: (a, b) => numberSorter(a.err, b.err),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return renderWithIcon(targets, text, record.prog, '0125');
            }
        },
        {
            title: '0160',
            dataIndex: 'hold',
            sorter: (a, b) => numberSorter(a.hold, b.hold),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return renderWithIcon(targets, text, record.prog, '0160');
            }
        },
        {
            title: 'Total',
            dataIndex: 'total',
            sorter: (a, b) => numberSorter(a.total, b.total),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return renderWithIcon(targets, text, record.prog, 'Total');
            }
        }
      ];
      
      const dataSource = !data ? [] : data.map((rowData, i) => {

        const {
            program,
            qc01,
            qc02,
            qc03,
            qc04,
            qc05,
            total,
            _0111,
            _0115,
            _0125,
            _0130,
            _0131,
            _0135,
            _0160,
            _0300,
            _4000,
            _5000
        } = rowData;

        return {
            key: i,
            prog: program,
            ht: numeral(_0111).format(numberFormat),
            gs: numeral(_0115).format(numberFormat),
            machIn: numeral(_4000).format(numberFormat),
            machOut: numeral(_5000).format(numberFormat),

            qcIn: numeral(qc01).format(numberFormat),
            qcOut: numeral(qc02).format(numberFormat),
            qcFoundry: numeral(qc03).format(numberFormat),
            qcMach: numeral(qc04).format(numberFormat),
            qcAf: numeral(qc05).format(numberFormat),

            fin: numeral(_0130).format(numberFormat),
            assy: numeral(_0131).format(numberFormat),
            dock: numeral(_0135).format(numberFormat),
            wh: numeral(_0300).format(numberFormat),
            err: numeral(_0125).format(numberFormat),
            hold: numeral(_0160).format(numberFormat),
            total: numeral(total).format(numberFormat)
        }
        
      })

      const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
      }

      return (
        <Table 
            size="small"
            loading={isStockOverviewFetching}
            columns={columns}
            dataSource={dataSource}
            onChange={onChange}
            pagination={false} />     
    )
 }

const mapStateToProps = ({ morningMeeting }) => ({
    isStockOverviewFetching: morningMeeting.isStockOverviewFetching,
    stockOVerviewCollection: morningMeeting.stockOVerviewCollection,
})

export default connect(mapStateToProps)(StockOverviewTable);