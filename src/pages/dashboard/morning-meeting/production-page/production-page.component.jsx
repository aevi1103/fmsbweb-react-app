import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'


import DateRangePicker from '../../../../components/date-range-picker/date-range-picker.component'
import Production from '../../../../components/production/production.component'

import { 
    fetchProductionStatusStartAsync,
    fetchDailyScrapRateStartAsync,
    fetchDailyKpiStartAsync,
    fetchWeeklyLaborHrsStartAsync
} from '../../../../redux/morning-meeting/morning-meeting.actions'

import { 
    Layout
 } from "antd";

import '../morning-meeting.styles.scss'

const { Header, Content } = Layout;

const dateFormat = 'MM/DD/YYYY';
const previousDay = moment().add(-1, 'd');
const previousDayFormatted = previousDay.format(dateFormat);

const ProductionPage = ({
        setProductionData,
        fetchDailyScrapRateStartAsync,
        fetchDailyKpiStartAsync,
        fetchWeeklyLaborHrsStartAsync,
        area,
        headerTitle
    }) => {
    
    const [ startDay, setStartDay ] = useState(previousDayFormatted);
    const [ endDay, setEndDay ] = useState(previousDayFormatted);

    const fetchData = () => {

        const start = moment(startDay, dateFormat).format(dateFormat);
        const chartTrendStart = moment(startDay, dateFormat).add(-30, 'd').format(dateFormat);
        const laborHoursStart = moment(startDay, dateFormat).add(-9, 'w').startOf('week').format(dateFormat);

        const end = moment(endDay, dateFormat).format(dateFormat);

        setProductionData(start,end,area);
        fetchDailyScrapRateStartAsync(chartTrendStart, end, area);
        fetchDailyKpiStartAsync(chartTrendStart, end, area);
        fetchWeeklyLaborHrsStartAsync(laborHoursStart, end, area);
    }

    const onClick = () => {
        fetchData();
    }

    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        setStartDay((start ? start.format(dateFormat) : null))
        setEndDay((end ? end.format(dateFormat) : null))
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
    <>
        <Header className="pa0 custom-header" >
            <h2 className="ml3">{headerTitle}</h2>
        </Header>

        <Content className="ma3 mt0">
            <DateRangePicker defaultValue={previousDay} onButtonClick={onClick} onCalendarChange={onCalendarChange}  />
            <div className="mt3">
                <Production/>
            </div>
            
        </Content>      
    </> 
)}

const mapDispatchToProps = dispatch => ({
    setProductionData: (start, end, area) => dispatch(fetchProductionStatusStartAsync(start, end, area)),
    fetchDailyScrapRateStartAsync: (start, end, area) => dispatch(fetchDailyScrapRateStartAsync(start, end, area)),
    fetchDailyKpiStartAsync: (start, end, area) => dispatch(fetchDailyKpiStartAsync(start, end, area)),
    fetchWeeklyLaborHrsStartAsync: (start, end, area) => dispatch(fetchWeeklyLaborHrsStartAsync(start, end, area)),
})

export default connect(null, mapDispatchToProps)(ProductionPage);