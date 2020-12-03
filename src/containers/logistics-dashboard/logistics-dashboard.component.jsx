import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom'
import moment from 'moment'
import 'tachyons'

import Logistics from './components/logistics.component' 

import { useQuery } from '../../core/utilities/custom-hook'

import { 
    fetchLogisticsStockOverviewStartAsync,
    fetchLogisticsStockOverviewSlocStartAsync,
    fetchLogisticsStatusStartAsync
} from '../../core/redux/logistics/logistics.actions'

import { dateFormat, disabledDate } from '../../core/utilities/helpers'

import { 
    Layout,
    Button,
    PageHeader,
    Row,
    Col,
    DatePicker
 } from "antd";

const { Content } = Layout;
const today = moment().format(dateFormat)

const LogisticsDashboard = () => {
    
    const query = useQuery();
    const dispatch = useDispatch();
    const history = useHistory();

    //* url query string
    const dateQry = query.get('start') ?? today;
    const [date, setDate] = useState(dateQry);

    //* selectors
    const { 
        isStockOverviewFetching,
        isStockOverviewSlocFetching,
        isStockStatusFetching
    } = useSelector(({ logistics }) => logistics)

    const fetchData = useCallback(() => {

        history.push(`/dashboard/morningmeeting/logistics?start=${date}`);
        document.title = `Logistics: ${date}`;

        dispatch(fetchLogisticsStockOverviewSlocStartAsync(date))
        dispatch(fetchLogisticsStockOverviewStartAsync(date))
        dispatch(fetchLogisticsStatusStartAsync(date))

    }, [date, dispatch, history])

    const onClick = () => fetchData();
    const onChange = (date, dateStr) => setDate(dateStr);

    useEffect(() => {
        fetchData();
    }, [])

    return (
    <>
        <PageHeader
            className="site-page-header"
            title={`Logistics: ${date}`}
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

                    <Button 
                        type="primary" 
                        onClick={onClick} 
                        loading={isStockOverviewFetching || isStockOverviewSlocFetching || isStockStatusFetching}>Go</Button>

                    <Button type="primary" className="ml2">
                        <Link to="/dashboard/morningmeeting/logistics/settings/inventory" >Enter Data</Link>
                    </Button>

                </Col>

                <Col span={24}>
                    <Logistics/>
                </Col>

            </Row>
            
        </Content>      
    </> 
)}

export default LogisticsDashboard;