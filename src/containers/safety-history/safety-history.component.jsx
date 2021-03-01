import React, { useEffect, useState } from 'react'
import moment from 'moment'
import axios from 'axios'
import http from '../../core/utilities/api'
import { useDispatch, useSelector } from 'react-redux';
import { dateFormat, dateRange, disabledDate } from '../../core/utilities/helpers'
import { setDropdowns } from './services/safety-history.slice'
import { dispatchIncidentsQry } from './services/api'
import IncidentHistoryTable from './components/safety-history-table.component'
import { 
    Layout,
    Button,
    PageHeader,
    Row,
    Col,
    DatePicker,
    Select,
    message
 } from "antd";

const { RangePicker } = DatePicker
const { Content } = Layout;
const { Option } = Select;

const defaultRange = [moment().subtract(30, 'days'), moment()];

const SafetyHistory = () => {

    const dispatch = useDispatch();
    const departments = useSelector(({ safetyHistory }) => safetyHistory.departments);
    const incidentsLoading = useSelector(({ safetyHistory }) => safetyHistory.isLoading);

    const [range, setRange] = useState(defaultRange)
    const [department, setDepartment] = useState('')
    const [dropDownloading, setDropdownLoading] = useState(false)

    const getIncidents = () => dispatchIncidentsQry({ department, range }, dispatch)

    useEffect(() => { document.title = 'Safety History' }, [])

    useEffect(() => {

        setDropdownLoading(true)

        axios.all([
            http.get(`safety/departments`),
            http.get(`safety/bodyParts`),
            http.get(`safety/Injuries`),
            http.get(`safety/status`),
        ])
        .then(axios.spread((...responses) => {

            dispatch(setDropdowns({
                departments: responses[0].data,
                bodyParts: responses[1].data,
                injuries: responses[2].data,
                status: responses[3].data
            }))

        }))
        .catch(errors => {
            message.error('Something went wrong.')
        })
        .finally(() => setDropdownLoading(false))

        
    }, [])

    useEffect(() => getIncidents(), [])

    const onCalendarChange = (dates) => setRange(dates)
    const onDeptChange = value => setDepartment(value)
    const onClick = () => getIncidents()

    const extra = (
        <Row gutter={8} align="middle">
            <Col><span>Department</span></Col>
            <Col>
                <Select 
                    loading={dropDownloading} 
                    style={{ width: '10rem' }} 
                    allowClear={true} 
                    onChange={onDeptChange}>
                    {
                        departments?.map(({ dept1 }) => <Option key={dept1} value={dept1}>{dept1}</Option>)
                    }
                </Select>
            </Col>

            <Col><span>Date Range</span></Col>
            <Col>
                <RangePicker 
                    onChange={() => {}}
                    format={dateFormat}
                    onCalendarChange={onCalendarChange}
                    defaultValue={range}
                    disabledDate={disabledDate}
                    ranges={dateRange} />
            </Col>
            <Col>
                <Button type="primary" loading={incidentsLoading} onClick={onClick}>Go</Button>
            </Col>
        </Row>
    )

    return (
        <>
            <PageHeader
                className="site-page-header"
                title={`${department ? department : 'All'} Department Safety History`}
                subTitle={`Date Range: ${range[0].format(dateFormat)} - ${range[1].format(dateFormat)}`}
                extra={extra}
            />

            <Content className="ma3 mt0">

                <Row gutter={[8,8]}>

                    <Col span={24} >
                        <IncidentHistoryTable department={department} range={range} />
                    </Col>

                </Row>

            </Content>
        </>
    )
}

export default SafetyHistory;