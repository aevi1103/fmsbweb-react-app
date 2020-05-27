import React, { useState } from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import moment from 'moment';

import { 
    Table,
    Modal,
    Button,
    Row,
    Col,
    Card
 } from "antd";

 import ScrapLink  from '../../scrap-link/scrap-link.component'

 import {
    fetchDailyScrapByCodeStartAsync
 } from '../../../redux/production-details/production-details.actions'

 import DailyScrapByCodeChart from '../daily-scrap-by-code-chart/daily-scrap-by-code-chart.component'

 const cardHeightStyle = {
    height: "300px"
 }
const DefectSummaryTable = ({
    isProductionDetailsLoading,
    scrapData,
    detailsEndDate,

    fetchDailyScrapByCodeStartAsync,
    isDailyScrapByCodeLoading,
    dailyScrapByCodeCollection
}) => {

    const [modalVisible, setModalVisible] = useState(false)
    const [modalTitle, setModalTitle] = useState('');

    const onSapNetModalCancel = () => setModalVisible(false)
    const onScrapClick = data => {

        const f = 'MM/DD/YYYY'
        const start = moment(detailsEndDate).add('d', -30).format(f)
        const end = detailsEndDate
        const { 
            line,
            department, 
            isPurchasedExclude, 
            scrapCode, 
            scrapDesc, 
            program } = data

        const line2 = department === 'Machining' ? `Line ${line}` : line

        if (line) {
            setModalTitle(`${line2}: Daily '${scrapDesc} (${scrapCode})' Scrap by Shift - ${start} to ${end}`)
        } else {
            setModalTitle(`${program}: Daily '${scrapDesc} (${scrapCode})' Scrap by Shift - ${start} to ${end}`)
        }

        fetchDailyScrapByCodeStartAsync(start, end, line, scrapCode, isPurchasedExclude, program, department)
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

      const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
      }

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
                    onCancel={onSapNetModalCancel}
                    width="80%"
                    centered
                    footer={[
                        <Button key="back" onClick={onSapNetModalCancel}>
                            Close
                        </Button>
                    ]}>
                        {
                            isDailyScrapByCodeLoading ? <span>Loading...</span>
                            : 
                            <Row gutter={[16,16]}>
                                <Col span={24}>
                                    <Card title="All Shift Daily Trend" style={cardHeightStyle} size="small">
                                        {
                                            dailyScrapByCodeCollection 
                                                ? <DailyScrapByCodeChart chartData={dailyScrapByCodeCollection.allShifts} />
                                                : null
                                        }
                                        
                                    </Card>
                                </Col>
                                {
                                    dailyScrapByCodeCollection
                                        ? dailyScrapByCodeCollection.shift.map(d => (
                                            <Col span={8} key={d.shift}>
                                                <Card title={`Shift: ${d.shift} Daily Trend`} style={cardHeightStyle} size="small">
                                                    <DailyScrapByCodeChart chartData={d.dailyScrap} />
                                                </Card>
                                            </Col>
                                        ))
                                        : null
                                        
                                }
                            </Row>
                        }
                </Modal>

        </>
        
    )
}

const mapStateToProps = ({ productionDetails }) => ({
    isProductionDetailsLoading: productionDetails.isProductionDetailsLoading,
    isDailyScrapByCodeLoading: productionDetails.isDailyScrapByCodeLoading,
    dailyScrapByCodeCollection: productionDetails.dailyScrapByCodeCollection,
    detailsEndDate: productionDetails.detailsEndDate
})

const mapDispatchToProps = dispatch => ({
    fetchDailyScrapByCodeStartAsync: (start, end, line, scrapCode, isPurchased, program, dept) => 
                                        dispatch(fetchDailyScrapByCodeStartAsync(start, end, line, scrapCode, isPurchased, program, dept))
})

export default connect(mapStateToProps,  mapDispatchToProps)(DefectSummaryTable);