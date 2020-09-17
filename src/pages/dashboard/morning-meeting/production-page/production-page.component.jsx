import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import moment from 'moment';
import axios from 'axios';
import styled from 'styled-components';
import api from '../../../../API'
import fileDownload from 'js-file-download'

import DateRangePicker from '../../../../components/date-range-picker/date-range-picker.component';
import Production from '../../../../components/production/production.component';

import { 
    DownloadOutlined,
 } from '@ant-design/icons';

import { 
    fetchProductionStatusStartAsync,
    fetchDailyScrapRateStartAsync,
    fetchDailyKpiStartAsync,
    fetchWeeklyLaborHrsStartAsync,
    fetchPpmhPerShiftStartAsync,
    fetchProdScrapStartAsync,
    setStartDate,
    setEndDate
} from '../../../../redux/morning-meeting/morning-meeting.actions';

import { 
    setTitle,
    setArea,
    setDetailsStartDate,
    setDetailsEndDate
} from '../../../../redux/production-details/production-details.actions';

import { getUrlParameter, updateUrlQryParameter } from '../../../../helpers/helpers'
import '../morning-meeting.styles.scss';

import { 
    Layout,
    Button,
    Tooltip,
    Spin,
    message
 } from "antd";

const { Header, Content } = Layout;
const dateFormat = 'MM/DD/YYYY';

const ProductionPage = ({
        setProductionData,
        fetchDailyScrapRateStartAsync,
        fetchDailyKpiStartAsync,
        fetchWeeklyLaborHrsStartAsync,
        fetchPpmhPerShiftStartAsync,
        fetchProdScrapStartAsync,
        isProdStatusFetching,
        area,
        headerTitle,
        location,
        setTitle,
        setArea,
        setStartDate,
        setEndDate,
        setDetailsStartDate,
        setDetailsEndDate,
        startDate,
        endDate,
        ppmhChartType
    }) => {
        
    const dateStartQry = getUrlParameter('start');
    const dateEndQry = getUrlParameter('end');

    const defaultStartDate = dateStartQry ? dateStartQry : startDate;
    const defaultEndDate = dateEndQry ? dateEndQry : endDate;

    const [startFormat, setStartFormat] = useState(defaultStartDate);
    const [endFormat, setSendFormat] = useState(defaultEndDate);
    const [downloadLoading, setDownloadLoading] = useState(false);

    //cancel token
    const prodTokenSrc = axios.CancelToken.source();
    const scrapRateTokenSrc = axios.CancelToken.source();
    const dailyKpiTokenSrc = axios.CancelToken.source();
    const weeklyLaborHrsKpiTokenSrc = axios.CancelToken.source();
    const prodScrapLaborHrsKpiTokenSrc = axios.CancelToken.source();
    const [downloadError, setDownloadError] = useState(null);

    const fetchData = (start, end) => {

        setStartDate(start);
        setEndDate(end);
        setDetailsStartDate(start);
        setDetailsEndDate(end);

        updateUrl(start, end);

        setProductionData(start,end,area, prodTokenSrc);

        const chartTrendStart = moment(start, dateFormat).add(-30, 'd').format(dateFormat);    
        fetchDailyScrapRateStartAsync(chartTrendStart, end, area, scrapRateTokenSrc);
        fetchDailyKpiStartAsync(chartTrendStart, end, area, dailyKpiTokenSrc);

        if (ppmhChartType === 'ppmhByShift') {
            fetchPpmhPerShiftStartAsync(start, end, area, weeklyLaborHrsKpiTokenSrc);
        } else {
            const laborHoursStart = moment(start, dateFormat).add(-9, 'w').startOf('week').format(dateFormat);
            fetchWeeklyLaborHrsStartAsync(laborHoursStart, end, area, weeklyLaborHrsKpiTokenSrc);
        }

        const mtdStart = moment(end, dateFormat).startOf('month').format(dateFormat); 
        const mtdEnd =  moment(end, dateFormat).format(dateFormat); 
        fetchProdScrapStartAsync(mtdStart, mtdEnd, area, prodScrapLaborHrsKpiTokenSrc);
    };

    const updateUrl = (start, end) => {
        const qry = { start, end }
        const title =  `Morning Meeting - ${headerTitle} : ${startFormat} - ${endFormat}`;
        updateUrlQryParameter(qry, title);
    }

    const onClick = () => fetchData(startFormat, endFormat);;

    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        setStartFormat(start ? start.format(dateFormat) : null);
        setSendFormat(end ? end.format(dateFormat) : null);
    };

    useEffect(() => {
        document.title = `Morning Meeting - ${headerTitle}`;

        fetchData(defaultStartDate, defaultEndDate);

        return function cleanup() {
            prodTokenSrc.cancel('Operation cancelled');
            scrapRateTokenSrc.cancel('Operation cancelled');
            dailyKpiTokenSrc.cancel('Operation cancelled');
            weeklyLaborHrsKpiTokenSrc.cancel('Operation cancelled');
            prodScrapLaborHrsKpiTokenSrc.cancel('Operation cancelled');
        };

    }, [area]);

    const onDetailsButtonClick = () => {

        setTitle({
            headerTitle,
            startDate,
            endDate
        });

        setArea(area);
    };

    const onDownload = async () => {

        try {    

            setDownloadLoading(true);
            const response = await api.get(`/exports/department?start=${startFormat}&end=${endFormat}&area=${area}`, {
                responseType: 'blob',
            });

            const fileName = `${area.toUpperCase()}_DATAEXPORT_${startFormat}_to_${endFormat}.xlsx`
            fileDownload(response.data, fileName);

            message.success('Data successfully exported!', 10);

        } catch (error) {
            setDownloadError(error);
            setDownloadLoading(false);
            message.error(error);
        } finally {
            if (!downloadError) {
                setDownloadLoading(false);
            }
        }
    }

    const route = location.pathname.substr(location.pathname.lastIndexOf('/')+1);

    const Container = styled.span`
        display: flex;
        align-items: center;
        justify-content: center;
        height: 140px;
        font-size: 2.5rem;
    `;

    return (
    <React.Fragment>
        <Header className="pa0 custom-header" >
            <h2 className="ml3">{headerTitle}: {startFormat} - {endFormat}</h2>
        </Header>

        <Content className="ma3 mt0">

            <DateRangePicker 
                dateRangeValue={{startDate: startFormat, endDate: endFormat}}
                onButtonClick={onClick}
                onCalendarChange={onCalendarChange}
                isLoading={isProdStatusFetching}  />
            
            <Tooltip placement="top" title={<span>Click to view Productivity Details by Work Center</span>}>
                <Button type="primary" onClick={onDetailsButtonClick} className="ml2" loading={isProdStatusFetching}>
                    <Link className="white" to={`${location.pathname}/details?start=${startFormat}&end=${endFormat}&shift=`}>Work Center Details</Link>
                </Button>
            </Tooltip>
            
            <Tooltip placement="top" title={<span>View active orders by Work Center</span>}>
                <Button type="primary" className="ml2">
                    <Link to={`/orderstatus/${route}`} target="_blank">View Active Orders</Link>
                </Button>
            </Tooltip>

            <Tooltip placement="top" title={<span>View 24 hour Production</span>}>
                <Button type="primary" className="ml2">
                    <Link to={`${location.pathname}/hourly-production`}>Hourly Production</Link>
                </Button>
            </Tooltip>

            <Button type="primary" onClick={onDownload} loading={downloadLoading || isProdStatusFetching} className="ml2">
                <DownloadOutlined />
                Data Export
            </Button>
            
            <div className="mt3">
                {
                    !isProdStatusFetching 
                        ? <Production area={area}/> 
                        : <Container><Spin tip="Loading..."/></Container>
                }
                
            </div>

        </Content>
    </React.Fragment>
)}

const mapStateToProps = ({morningMeeting}) => ({
    startDate: morningMeeting.startDate,
    endDate: morningMeeting.endDate,
    ppmhChartType: morningMeeting.ppmhChartType,
    isProdStatusFetching: morningMeeting.isProdStatusFetching,
})

const mapDispatchToProps = dispatch => ({
    setProductionData: (start, end, area, cancelToken) => dispatch(fetchProductionStatusStartAsync(start, end, area, cancelToken)),
    fetchDailyScrapRateStartAsync: (start, end, area, cancelToken) => dispatch(fetchDailyScrapRateStartAsync(start, end, area, cancelToken)),
    fetchDailyKpiStartAsync: (start, end, area, cancelToken) => dispatch(fetchDailyKpiStartAsync(start, end, area, cancelToken)),
    fetchWeeklyLaborHrsStartAsync: (start, end, area, cancelToken) => dispatch(fetchWeeklyLaborHrsStartAsync(start, end, area, cancelToken)),
    fetchPpmhPerShiftStartAsync: (start, end, area, cancelToken) => dispatch(fetchPpmhPerShiftStartAsync(start, end, area, cancelToken)),
    fetchProdScrapStartAsync: (start, end, area, cancelToken) => dispatch(fetchProdScrapStartAsync(start, end, area, cancelToken)),

    setTitle: title => dispatch(setTitle(title)),
    setArea: area => dispatch(setArea(area)),

    setStartDate: (date) => dispatch(setStartDate(date)),
    setEndDate: (date) => dispatch(setEndDate(date)),
    setDetailsStartDate: date => dispatch(setDetailsStartDate(date)),
    setDetailsEndDate: date => dispatch(setDetailsEndDate(date))
})


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProductionPage));