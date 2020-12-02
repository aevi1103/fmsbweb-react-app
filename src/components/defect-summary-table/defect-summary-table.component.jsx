import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import numeral from 'numeral';
import moment from 'moment';

import { 
    Table,
    Modal,
    Button,
    Row,
    Col,
    Card,
    Typography
 } from "antd";

 import ScrapLink  from '../scrap-link/scrap-link.component'

 import {
    fetchDailyScrapByCodeStartAsync
 } from '../../core/redux/production-details/production-details.actions'

 import DailyScrapByCodeChart from '../daily-scrap-by-code-chart/daily-scrap-by-code-chart.component'

 const cardHeightStyle = { height: "300px" }
 const { Text } = Typography;

const DefectSummaryTable = React.memo(({ scrapData }) => {

    const dispatch = useDispatch()
    const isDailyScrapByCodeLoading = useSelector(({ productionDetails }) => productionDetails.isDailyScrapByCodeLoading)
    const dailyScrapByCodeCollection = useSelector(({ productionDetails }) => productionDetails?.dailyScrapByCodeCollection) ?? []

    const [modalVisible, setModalVisible] = useState(false)
    const [modalTitle, setModalTitle] = useState('');

    const onSapNetModalCancel = () => setModalVisible(false)

    const onScrapClick = data => {

        const { 
            line,
            department, 
            isPurchasedExclude, 
            scrapCode, 
            scrapDesc, 
            program,
            endDate
        } = data

        const dateFormat = 'MM/DD/YYYY';
        const start = moment(endDate).add(-30, 'd').format(dateFormat);
        const end = moment(endDate).format(dateFormat);
        const line2 = department === 'Machining' ? `Line ${line}` : line

        if (line) {
            setModalTitle(`${line2}: Daily '${scrapDesc} (${scrapCode})' Scrap by Shift - ${start} to ${end}`)
        } else {
            setModalTitle(`${program}: Daily '${scrapDesc} (${scrapCode})' Scrap by Shift - ${start} to ${end}`)
        }

        dispatch(fetchDailyScrapByCodeStartAsync(start, end, line, scrapCode, isPurchasedExclude, program, department))

        setModalVisible(true)
        
    }

    const columns = [
        {
            title: 'Area',
            dataIndex: 'area',
            render: (text, record, index) => {
                return record.area;
            },
            sorter: (a, b) => a.area.length - b.area.length,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Scrap Type',
            dataIndex: 'type',
            render: (text, record, index) => {
                return record.scrapAreaName;
            },
            sorter: (a, b) => a.scrapAreaName.length - b.scrapAreaName.length,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Scrap Code',
            dataIndex: 'code',
            render: (text, record, index) => {
                return record.scrapCode;           
            },
            sorter: (a, b) => a.scrapCode - b.scrapCode,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Scrap Description',
            dataIndex: 'desc',
            render: (text, record, index) => {
                return record.scrapDesc;  
            },
            sorter: (a, b) => a.scrapDesc.length - b.scrapDesc.length,
            sortDirections: ['descend', 'ascend']
        },
        {
            title: 'Qty',
            dataIndex: 'sapGross',
            render: (text, record, index) => {
                const value = numeral(record.qty).format('0,0'); 
                return <ScrapLink qty={record.qty} value={value} onClick={() => onScrapClick(record)}/> 
            },
            sorter: (a, b) => a.qty - b.qty,
            sortDirections: ['descend', 'ascend']
        } 
      ];
      
      const data = scrapData.map((data, i) => ({key: i, ...data}))

      const summary = pageData => {
        const totalQty = pageData.reduce((prev, { qty }) => prev + qty, 0);
        return (
            <Table.Summary.Row style={{ backgroundColor: '#fafafa'}}>
                <Table.Summary.Cell colSpan="4">
                    <Text strong>Total</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                    <Text>{numeral(totalQty).format('0,0')}</Text>
                </Table.Summary.Cell>
            </Table.Summary.Row>
        )
      }

    return (
        <>
            <Table 
                columns={columns}
                dataSource={data}
                size="middle"
                bordered={true}
                pagination={true}
                summary={summary} />   
                
                <Modal
                    title={modalTitle}
                    visible={modalVisible}
                    onCancel={onSapNetModalCancel}
                    width="80%"
                    centered
                    footer={[
                        <Button key="back" onClick={onSapNetModalCancel}>
                            Close
                        </Button>
                    ]}>
                        {
                            isDailyScrapByCodeLoading 
                            ? <span>Loading...</span>
                            : <Row gutter={[16,16]}>

                                <Col span={24}>
                                    <Card title="All Shift Daily Trend" style={cardHeightStyle} size="small">
                                        <DailyScrapByCodeChart chartData={dailyScrapByCodeCollection.allShifts} />
                                    </Card>
                                </Col>

                                {
                                    dailyScrapByCodeCollection.shift.map(({ shift, dailyScrap }) => (
                                        <Col span={8} key={shift}>
                                            <Card title={`Shift: ${shift} Daily Trend`} style={cardHeightStyle} size="small">
                                                <DailyScrapByCodeChart chartData={dailyScrap} />
                                            </Card>
                                        </Col>
                                    ))   
                                }

                             </Row>
                        }
                </Modal>
        </>
    )
})

export default DefectSummaryTable;