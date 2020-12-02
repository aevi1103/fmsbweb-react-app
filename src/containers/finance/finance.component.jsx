import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
import moment from 'moment'

import KpiTable from './components/kpi-table.component'
import DeptForecastTable from './components/dept-forecast-table.compoennt'
import FlashProjectionTable from './components/flash-projections-table.component'

import { fetchFiananceKpiStartAsync } from '../../core/redux/finance/finance.actions'
import { dateFormat, disabledDate } from '../../core/utilities/helpers'
import { useQuery } from '../../core/utilities/custom-hook'

import { 
    Layout,
    Button,
    PageHeader,
    Row,
    Col,
    Card,
    DatePicker
 } from "antd";

const { Content } = Layout;

const responsiveProps = {
    xs: 24,
    xl: 12
}

const today = moment().format(dateFormat)

const FinancePage = () => {
    
    const history = useHistory();
    const dispatch = useDispatch();
    const query = useQuery();

    const dateQry = query.get('date') ?? today;
    const [date, setDate] = useState(dateQry);

    const financeKpi = useSelector(({ finance }) => finance?.financeKpi) ?? null;
    const loading = useSelector(({ finance }) => finance?.isFinanceKpiFetching)

    const fetchData = () => {
        history.push(`/dashboard/morningmeeting/finance?date=${date}`)
        dispatch(fetchFiananceKpiStartAsync(date))
    }
    const onClick = () => fetchData();
    const onChange = (date, dateStr) => setDate(dateStr);

    useEffect(() => {
        document.title = `Finance`;
        fetchData();
    }, [])

    return (
    <>
        <PageHeader
            className="site-page-header"
            title={`Finance: ${date}`}
        />

        <Content className="ma3 mt0">

            <Row gutter={[12,12]}>

                <Col span={24}>

                    <DatePicker 
                        className="mr2"
                        onChange={onChange}
                        format={dateFormat}
                        disabledDate={disabledDate}
                        defaultValue={moment(date, dateFormat)}/>

                    <Button type="primary" onClick={onClick} loading={loading}>Go</Button>

                    <Button type="primary" className="ml2">
                        <a href="http://10.129.224.149/FMSB/Finance/DataEntry.aspx" target="_blank" rel="noopener noreferrer">Enter Data</a>
                    </Button>
                
                </Col>

                <Col span={24}>

                    <Row gutter={[12,12]}>
                        <Col span={24}>
                            <Card 
                                title="Finance Daily KPI"
                                size="small"
                                className="ba b--black-10"
                                >       
                                    <KpiTable data={financeKpi?.dailyKpi ?? []} loading={loading} />              
                            </Card>     
                        </Col>
                        <Col {...responsiveProps}>
                            <Card 
                                title="Department Forecast"
                                size="small"
                                className="ba b--black-10"
                                >
                                <DeptForecastTable data={financeKpi?.monthlyForecast ?? []} loading={loading} />
                            </Card>
                        </Col>
                        <Col {...responsiveProps}>
                            <Card 
                                title="Flash Projections"
                                size="small"
                                className="ba b--black-10">
                                    <FlashProjectionTable data={financeKpi?.monthlyFlashProjections ?? []} loading={loading}/>
                            </Card>
                        </Col>
                    </Row>
                    
                </Col>

            </Row>

        </Content>      
    </> 
)}

export default FinancePage;