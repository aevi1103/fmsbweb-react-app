import React, { useEffect, useState } from 'react'
import moment from 'moment'
import http from '../../core/utilities/api'
import { Link } from "react-router-dom";
import { dateFormat, dateRange, disabledDate } from '../../core/utilities/helpers'
import IncidentsByDept from './components/incidents-by-dept-chart.component'
import OpenStatusChart from './components/open-status-by-dept-chart.component'
import MonthlyIncidentChart from './components/monthly-incidents-chart'
import InjuryChart from './components/injury-chart.component'
import BodyPartChart from './components/body-part-chart.component'
import MitigationByChart from './components/mitigation-by-dept-chart.component'
import MitigagedWithin14Days from './components/mitigated-within-14-days-chart.component'

import { 
    Layout,
    Button,
    PageHeader,
    Row,
    Col,
    DatePicker,
    Select,
    message,
    Checkbox,
    Card
 } from "antd";

const { RangePicker } = DatePicker
const { Content } = Layout;
const { Option } = Select;

const defaultRange = [moment().subtract(30, 'days'), moment()];

const SafetyDashboard = () => {

    const [departments, setDepartments] = useState([])
    const [departmentLoading, setDepartmentLoading] = useState(false)
    const [department, setDepartment] = useState(null)
    const [range, setRange] = useState(defaultRange)
    const [loading, setLoading] = useState(false)
    const [chartData, setChartData] = useState(null)
    const [isChecked, setIsChecked] = useState(false)

    const getData = async () => {

        try {

            const [start, end] = range;

            setLoading(true)
            const response = await http.get(`safety/charts`, {
                params: {
                    startDate: start.format(dateFormat),
                    endDate: end.format(dateFormat),
                    department,
                    showNearMiss: isChecked
                }
            })

            setChartData(response.data)

        } catch (error) {
            message.error('Something went wrong.')
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {

        (async function() {

            try {

                setDepartmentLoading(true)
                const response = await http.get(`safety/departments`)
                setDepartments(response.data)

            } catch (error) {
                message.error('Something went wrong.')
            } finally {
                setDepartmentLoading(false)
            }
    
        })()

    }, [])

    useEffect(() => { getData() }, [])

    const onDeptChange = value => setDepartment(value)
    const onCalendarChange = (dates) => setRange(dates)
    const onClick = () => getData();
    const onChecked = e => setIsChecked(e.target.checked)

    const extra = (
        <Row gutter={8} align="middle">
            <Col><span>Department</span></Col>
            <Col>
                <Select 
                    loading={departmentLoading} 
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
                <Checkbox onChange={onChecked}>Show Near Miss</Checkbox>
            </Col>
            <Col>
                <Button type="primary" loading={loading} onClick={onClick}>Go</Button>
            </Col>
        </Row>
    )

    const subTitle = (
        <>
            <span className="mr2">Date Range: {range[0].format(dateFormat)} - {range[1].format(dateFormat)}</span>
            <Link to="/safety/history">View History</Link>
        </>
    )

    return (
        <>
            <PageHeader
                className="site-page-header"
                title={`${department ? department : 'All'} Department Safety Dashboard`}
                subTitle={subTitle}
                extra={extra}
            />

            <Content className="ma3 mt0">

                <Row gutter={[8,8]}>

                    <Col span={8} >
                        <Card size="small">
                            {
                                chartData && <IncidentsByDept data={chartData.incidentsByDepartment} range={range} />
                            }
                        </Card>
                    </Col>

                    <Col span={8} >
                        <Card size="small">
                            {
                                chartData && <OpenStatusChart data={chartData.openStatusByDepartment} range={range} />
                            }
                        </Card>
                    </Col>

                    <Col span={8} >
                        <Card size="small">
                            {
                                chartData && <MonthlyIncidentChart 
                                                data={chartData.monthlyIncidents} 
                                                range={range} 
                                                department={department || 'All'} />
                            }
                        </Card>
                    </Col>

                    <Col span={8} >
                        <Card size="small">
                            {
                                chartData && <MonthlyIncidentChart 
                                                data={chartData.monthlyNearMissIncidents} 
                                                range={range} 
                                                department={department || 'All'} 
                                                isnearMiss={true} />
                            }
                        </Card>
                    </Col>

                    <Col span={8} >
                        <Card size="small">
                            {
                                chartData && <InjuryChart 
                                                data={chartData.injuryByDepartment} 
                                                range={range} 
                                                department={department || 'All'}/>
                            }
                        </Card>
                    </Col>

                    <Col span={8} >
                        <Card size="small">
                            {
                                chartData && <BodyPartChart 
                                                data={chartData.bodyPartByDepartment} 
                                                range={range} 
                                                department={department || 'All'} />
                            }
                        </Card>
                    </Col>

                    <Col span={8} >
                        <Card size="small">
                            {
                                chartData && <MitigationByChart 
                                                data={chartData.mitigation} 
                                                range={range}  />
                            }
                        </Card>
                    </Col>

                    <Col span={8} >
                        <Card size="small">
                            {
                                chartData && <MitigagedWithin14Days 
                                                data={chartData.mitigatedWithin14Days} 
                                                range={range}  />
                            }
                        </Card>
                    </Col>

                </Row>

            </Content>
        </>
    )
}

export default SafetyDashboard;