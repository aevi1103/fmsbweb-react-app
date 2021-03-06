import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from "react-router-dom";
import moment from 'moment';

import { fetchHourlyProdStartAsync } from '../../core/redux/hourly-production/hourly-production.actions'

import HourlyProductionChart from './components/hourly-production-chart.component'
import { dateFormat } from '../../core/utilities/helpers'
import { useQuery } from '../../core/utilities/custom-hook'

import {
    Layout,
    DatePicker,
    Button,
    PageHeader,
    Row,
    Col
} from 'antd'

const { Content } = Layout;

const HourlyProductionPage = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const query = useQuery();

    const { state } = location;
    const { department } = state || {}

    const isHourlyProdFetching = useSelector(({ hourlyProduction }) => hourlyProduction?.isHourlyProdFetching) ?? false;
    const hourlyProduction = useSelector(({ hourlyProduction }) => hourlyProduction?.hourlyProduction) ?? null;

    const dateQry = query.get('start');
    const defaultShiftDate = dateQry ? moment(dateQry) : moment();
    const dept = department ?? location.pathname.split('/')[3];

    const getTitle = date => `${_.capitalize(dept)} Hourly Production: ${date.format(dateFormat)}`

    const [title, setTitle] = useState(getTitle(defaultShiftDate));
    const [date, setDate] = useState(defaultShiftDate);
    
    const updateUrl = () => {
        const dateStr = moment(date).format(dateFormat);
        const ttl = `${dept.toUpperCase()} Hourly Production: ${dateStr}`;

        history.push(`/dashboard/morningmeeting/${dept}/hourly-production?start=${dateStr}`);
        document.title = ttl;

        setTitle(getTitle(date));
    }

    useEffect(() => {
        dispatch(fetchHourlyProdStartAsync(dept, date.format(dateFormat)))
        updateUrl(defaultShiftDate);
    }, [dept])

    const onDateChange = (value) => setDate(value);

    const onBtnClick = () => {
        dispatch(fetchHourlyProdStartAsync(dept, date.format(dateFormat)))
        updateUrl();
    }

    return (
        <React.Fragment>

            <PageHeader
                className="site-page-header"
                title={title}
                onBack={() => history.goBack() }
            />
    
            <Content className="ma3 mt0">

                <Row gutter={[12,12]}>

                    <Col span={24}>
                        <span className="mr2">Shift Date:</span>
                        <DatePicker
                            className="mr2"
                            onChange={onDateChange}
                            format={dateFormat}
                            value={date}
                            disabledDate={current => current && current > moment().endOf('day')}
                            style={{
                                width: '150px',
                            }} />
                        <Button type="primary" loading={isHourlyProdFetching} onClick={onBtnClick}>Go</Button>
                    </Col>

                    <Col span={24} style={{ height: '88vh' }}> 
                        <HourlyProductionChart data={hourlyProduction} />
                    </Col>

                </Row>
    
            </Content> 
        </React.Fragment>
        )
}

export default HourlyProductionPage;