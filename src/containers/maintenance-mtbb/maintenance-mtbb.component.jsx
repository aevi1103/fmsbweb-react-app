import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from './services/maintenance-mtbb.slice.js'
import { dateRange, disabledDate, dateFormat } from '../../core/utilities/helpers'
import LineCard from './components/line-card.component'

import {
    PageHeader,
    Layout,
    DatePicker,
    Row,
    Col,
    Button
} from 'antd'

const { Content } = Layout;
const { RangePicker } = DatePicker

const defaultStart = moment().startOf('month');
const defaultEnd = moment();
const defaultRange = [defaultStart, defaultEnd]

const MaintenanceMtbb = () => {

    const dispatch = useDispatch();
    const isLoading = useSelector(({ maintenanceMtbb }) => maintenanceMtbb.isLoading)
    const mtbbCollection = useSelector(({ maintenanceMtbb }) => maintenanceMtbb.mtbbCollection)
    const dates = useSelector(({ maintenanceMtbb }) => maintenanceMtbb.dates)

    const [selectedRange, setSelectedRange] = useState(defaultRange)
    const [range, setRange] = useState(defaultRange)
    
    useEffect(() => {

        dispatch(fetchData({
            startDate: range[0].format(dateFormat),
            endDate: range[1].format(dateFormat)
        }))

    }, [])

    const onCalendarChange = (dates) => setSelectedRange(dates)

    const onClick = () => {

        dispatch(fetchData({
            startDate: selectedRange[0].format(dateFormat),
            endDate: selectedRange[1].format(dateFormat)
        }))

        setRange(selectedRange)

    }

    const subTitle = <span>Date Range: {range[0].format(dateFormat)} - {range[1].format(dateFormat)}</span>

    return (
        <>
            <PageHeader
                className="site-page-header"
                title="Maintenance Mean Time Before Breakdown"
                subTitle={subTitle}
                
            />
            <Content className="ma3 mt0">

                <Row gutter={[16,16]}>

                    <Col span={24}>

                        <Row>

                            <Col>
                                <RangePicker 
                                    className="mr2"
                                    allowClear={false}
                                    onChange={() => {}}
                                    format={dateFormat}
                                    onCalendarChange={onCalendarChange}
                                    defaultValue={selectedRange}
                                    disabledDate={disabledDate}
                                    ranges={dateRange} />
                            </Col>

                            <Col>
                                <Button type="primary" onClick={onClick} loading={isLoading}>Go</Button>
                            </Col>

                        </Row>

                    </Col>

                    <Col span={24}>

                        <Row gutter={[8,8]}>

                            {
                                mtbbCollection.map(data => <LineCard 
                                    key={data.line}
                                    lineData={data}
                                    dates={dates}
                                    range={range} />)
                            }

                        </Row>

                    </Col>

                </Row>

    
            </Content>
        
        </>
    )
}

export default MaintenanceMtbb;