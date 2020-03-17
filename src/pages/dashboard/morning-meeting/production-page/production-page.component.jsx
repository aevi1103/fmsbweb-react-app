import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import moment from 'moment'
import axios from 'axios'

import DateRangePicker from '../../../../components/date-range-picker/date-range-picker.component'
import Production from '../../../../components/production/production.component'

import { 
    fetchProductionStatusStartAsync,
    fetchDailyScrapRateStartAsync,
    fetchDailyKpiStartAsync,
    fetchWeeklyLaborHrsStartAsync,
    fetchProdScrapStartAsync,

    setStartDate,
    setEndDate
} from '../../../../redux/morning-meeting/morning-meeting.actions'

import { 
    setTitle,
    setArea
} from '../../../../redux/production-details/production-details.actions'

import { 
    Layout,
    Button,
    Tooltip
 } from "antd";

import '../morning-meeting.styles.scss'

const { Header, Content } = Layout;

const dateFormat = 'MM/DD/YYYY';

const ProductionPage = ({
        setProductionData,
        fetchDailyScrapRateStartAsync,
        fetchDailyKpiStartAsync,
        fetchWeeklyLaborHrsStartAsync,
        fetchProdScrapStartAsync,

        area,
        headerTitle,

        location,

        setTitle,
        setArea,

        setStartDate,
        setEndDate,

        startDate,
        endDate
    }) => {
    
    const [startFormat, setStartFormat] = useState(startDate);
    const [endFormat, setSendFormat] = useState(endDate);

    //cancel token
    const prodTokenSrc = axios.CancelToken.source();
    const scrapRateTokenSrc = axios.CancelToken.source();
    const dailyKpiTokenSrc = axios.CancelToken.source();
    const weeklyLaborHrsKpiTokenSrc = axios.CancelToken.source();
    const prodScrapLaborHrsKpiTokenSrc = axios.CancelToken.source();

    const fetchData = (start = startDate, end = endDate) => {

        setProductionData(start,end,area, prodTokenSrc);

        const chartTrendStart = moment(start, dateFormat).add(-30, 'd').format(dateFormat);    
        fetchDailyScrapRateStartAsync(chartTrendStart, end, area, scrapRateTokenSrc);
        fetchDailyKpiStartAsync(chartTrendStart, end, area, dailyKpiTokenSrc);

        const laborHoursStart = moment(start, dateFormat).add(-9, 'w').startOf('week').format(dateFormat);
        fetchWeeklyLaborHrsStartAsync(laborHoursStart, end, area, weeklyLaborHrsKpiTokenSrc);

        const mtdStart = moment(end, dateFormat).startOf('month').format(dateFormat); 
        const mtdEnd =  moment(end, dateFormat).format(dateFormat); 

        fetchProdScrapStartAsync(mtdStart, mtdEnd, area, prodScrapLaborHrsKpiTokenSrc);
    }

    const onClick = () => {
        setStartDate(startFormat)
        setEndDate(endFormat)
        fetchData(startFormat, endFormat);
    }

    const onCalendarChange = (dates) => {

        const [start, end] = dates;
        setStartFormat(start ? start.format(dateFormat) : null);
        setSendFormat(end ? end.format(dateFormat) : null);
    }

    useEffect(() => {
        document.title = `Morning Meeting - ${headerTitle}`;
        fetchData();

        return function cleanup() {
            prodTokenSrc.cancel('Operation cancelled');
            scrapRateTokenSrc.cancel('Operation cancelled');
            dailyKpiTokenSrc.cancel('Operation cancelled');
            weeklyLaborHrsKpiTokenSrc.cancel('Operation cancelled');
            prodScrapLaborHrsKpiTokenSrc.cancel('Operation cancelled');
        }

    }, [])

    const onDetailsButtonClick = () => {

        setTitle({
            headerTitle,
            startDate,
            endDate
        })

        setArea(area);
    }

    const route = location.pathname.substr(location.pathname.lastIndexOf('/')+1);
    console.log(location, route)

    return (
    <>
        <Header className="pa0 custom-header" >
            <h2 className="ml3">{headerTitle}: {startDate} - {endDate}</h2>
        </Header>

        <Content className="ma3 mt0">
            <DateRangePicker 
                dateRangeValue={{startDate: startDate, endDate: endDate}}
                onButtonClick={onClick}
                onCalendarChange={onCalendarChange}  />
            
            <Tooltip placement="top" title={<span>Click to view Productivity Details by Work Center</span>}>
                <Button type="primary" onClick={onDetailsButtonClick} className="ml2">
                    <Link to={`${location.pathname}/details`}>Work Center Details</Link>
                </Button>
            </Tooltip>
            
            <Tooltip placement="top" title={<span>View active orders by Work Center</span>}>
                <Button type="primary" className="ml2">
                    <Link to={`/orderstatus/${route}`} target="_blank">View Active Orders</Link>
                </Button>
            </Tooltip>
            
            <div className="mt3">
                <Production/>
            </div>

        </Content>      
    </> 
)}

const mapDispatchToProps = dispatch => ({
    setProductionData: (start, end, area, cancelToken) => dispatch(fetchProductionStatusStartAsync(start, end, area, cancelToken)),
    fetchDailyScrapRateStartAsync: (start, end, area, cancelToken) => dispatch(fetchDailyScrapRateStartAsync(start, end, area, cancelToken)),
    fetchDailyKpiStartAsync: (start, end, area, cancelToken) => dispatch(fetchDailyKpiStartAsync(start, end, area, cancelToken)),
    fetchWeeklyLaborHrsStartAsync: (start, end, area, cancelToken) => dispatch(fetchWeeklyLaborHrsStartAsync(start, end, area, cancelToken)),
    fetchProdScrapStartAsync: (start, end, area, cancelToken) => dispatch(fetchProdScrapStartAsync(start, end, area, cancelToken)),

    setTitle: title => dispatch(setTitle(title)),
    setArea: area => dispatch(setArea(area)),

    setStartDate: (date) => dispatch(setStartDate(date)),
    setEndDate: (date) => dispatch(setEndDate(date))
})

const mapStateToProps = ({morningMeeting}) => ({
    startDate: morningMeeting.startDate,
    endDate: morningMeeting.endDate
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProductionPage));