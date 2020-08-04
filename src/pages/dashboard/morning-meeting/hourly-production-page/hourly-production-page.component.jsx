import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import moment from 'moment';

import {
    Layout,
    DatePicker,
    Button
} from 'antd'

import {
    fetchHourlyProdStartAsync
} from '../../../../redux/morning-meeting/morning-meeting.actions'

import HourlyProductionChart from '../../../../components/hourly-production/hourly-production-chart/hourly-production-chart.component'

const { Header, Content } = Layout;
const dateFormat = 'MM/DD/YYYY';

const HourlyProductionPage = ({
    location,
    fetchHourlyProdStartAsync,
    isHourlyProdFetching,
    hourlyProdCollection
}) => {

    const today = moment();
    const dept = location.pathname.split('/')[3];
    const getTitle = date => `${dept} Hourly Production: ${date.format(dateFormat)}`

    const [title, setTitle] = useState(getTitle(today));
    const [date, setDate] = useState(today);
    

    useEffect(() => {
        fetchHourlyProdStartAsync(dept, date.format(dateFormat));
    }, [])

    const onDateChange = (value) => {
        setDate(value);
        setTitle(getTitle(value));
    }

    const onBtnClick = () => {
        fetchHourlyProdStartAsync(dept, date.format(dateFormat));
    }

    return (
        <React.Fragment>
            <Header className="pa0 custom-header" >
                <h2 className="ml3 ttc">{title}</h2>
            </Header>
    
            <Content className="ma3 mt0">

                <span className="mr2">Shift Date:</span>
                <DatePicker
                    className="mr2"
                    onChange={onDateChange}
                    format={dateFormat}
                    value={date}
                    style={{
                        width: '150px',
                    }} />
                <Button type="primary" loading={isHourlyProdFetching} onClick={onBtnClick}>Go</Button>
                
                <div className="mt3">
                    <HourlyProductionChart data={hourlyProdCollection} />
                </div>
    
            </Content> 
        </React.Fragment>
        )
}

const mapStateToProps =({ morningMeeting }) => ({
    isHourlyProdFetching: morningMeeting.isHourlyProdFetching,
    hourlyProdCollection: morningMeeting.hourlyProdCollection,
    hourlyProdErrorMsg: morningMeeting.hourlyProdErrorMsg
})

const mapDispatchToProps = dispatch => ({
    fetchHourlyProdStartAsync: (dept, shiftDate) => dispatch(fetchHourlyProdStartAsync(dept, shiftDate))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HourlyProductionPage));