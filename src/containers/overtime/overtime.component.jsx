import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOvertimeDataList } from './services/overtime.slice'
import OvertimeTable from './components/overtime-table.component'
import { dateFormat, disabledDate } from '../../core/utilities/helpers'

import {
    PageHeader,
    Layout,
    Row,
    Col,
    Select,
    DatePicker,
    Checkbox 
} from 'antd'

const { Content } = Layout;
const { Option } = Select;

const years = [];
const currentYear = new Date().getFullYear()
const minYear = 2021;

//* get list of years
for (let index = minYear; index <= currentYear; index++) 
    years.push(index)

const Overtime = () => {

    const today = moment();

    const dispatch = useDispatch();
    const isLoading = useSelector(({ overtime }) => overtime.isLoading)
    const data = useSelector(({ overtime }) => overtime.overtimeCollection)
    const [year, setYear] = useState(currentYear)
    const [isVoluntary, setIsVoluntary] = useState(true)
    const [type, setType] = useState('Voluntary')
    const [isTotal, setIsTotal] = useState(true)
    const [date, setDate] = useState(today)
    const [title, setTitle] = useState('')

    useEffect(() => {
        setType(isVoluntary ? 'Voluntary' : 'Mandatory')
    }, [isVoluntary])

    useEffect(() => {
        document.title = `${type} Overtime`
    }, [type])

    useEffect(() => {

        dispatch(fetchOvertimeDataList({
            year,
            typeName: type,
            date: isTotal ? null : date.format(dateFormat)
        }))

    }, [year, type, date, isTotal, dispatch])

    useEffect(() => {
         setTitle(`${!isTotal ? date.format(dateFormat) : year} ${type} Overtime`)
    }, [year, type, date, isTotal])

    const onYearChange = value => setYear(value)
    const onVoluntaryChange = e => setIsVoluntary(e.target.checked)
    const onIsTotalChange = e => setIsTotal(e.target.checked)
    const onDateChange = (date) => setDate(date)

    const extra = (
        <Row gutter={[8,8]} align="middle">
            <Col>
                <span className="mr2">Year</span>
                <Select style={{ width: '5rem' }} defaultValue={year} onChange={onYearChange}>
                    { years.map(yr => <Option key={yr} value={yr} >{yr}</Option>) }
                </Select>
            </Col>
            <Col>
                <Checkbox defaultChecked={isVoluntary} onChange={onVoluntaryChange}>Voluntary</Checkbox>
            </Col>
            <Col>
                <Checkbox defaultChecked={isTotal} onChange={onIsTotalChange}>Total Overtime Hours</Checkbox>
            </Col>
            <Col>
                <span className="mr2">Select Date</span>
                <DatePicker 
                    disabled={isTotal}
                    format={dateFormat} 
                    allowClear={false}
                    disabledDate={disabledDate}
                    defaultValue={today}
                    onChange={onDateChange} />
            </Col>
        </Row>
    )



    return (
        <>
            <PageHeader
                className="site-page-header"
                title={title}
                extra={extra}
            />

            <Content className="ma3 mt0">
                
                <Row gutter={[16,16]}>

                    <Col span={24} className="nowrap overflow-x-auto">

                        <OvertimeTable
                            data={data}
                            loading={isLoading}
                            type={type}
                            isTotal={isTotal}
                            date={date}
                        />

                    </Col>

                </Row>

            </Content>
        
        </>
    )
}

export default Overtime;