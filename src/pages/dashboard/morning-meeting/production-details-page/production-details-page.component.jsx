import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import { useLocation } from "react-router-dom";

import { 
    Layout,
    Select,
    Button,
    Tooltip
 } from "antd";

 import DateRangePicker from '../../../../components/date-range-picker/date-range-picker.component'
 import ProductionDetails from '../../../../components/production-details/production-details.component'

 import {
    fetchProductionDetailsStartAsync,
    setDetailsStartDate,
    setDetailsEndDate
 } from '../../../../redux/production-details/production-details.actions';

 import { getUrlParameter, updateUrlQryParameter } from '../../../../helpers/helpers'

const { Option } = Select;
const { Header, Content } = Layout;
const dateFormat = 'MM/DD/YYYY';
const previousDay = moment().add(-1, 'd');

const ProductionDetailsPage = ({
        fetchProductionDetailsStartAsync,
        setDetailsStartDate,
        setDetailsEndDate,
        detailsStartDate,
        detailsEndDate,
        isProductionDetailsLoading
    }) => {

    const location = useLocation();
    const { state } = location;
    const { department } = state || {}

    const dateStartQry = getUrlParameter('start');
    const dateEndQry = getUrlParameter('end');
    const shiftQry = getUrlParameter('shift');
    const defaultStartDate = dateStartQry ? dateStartQry : previousDay.format(dateFormat);
    const defaultEndDate = dateEndQry ? dateEndQry : previousDay.format(dateFormat);
    const defaultShift = shiftQry ? shiftQry : '';

    const dept = department ? department : (new URL(window.location.href)).pathname.split('/')[3];
    const fetchData = (start = detailsStartDate, end = detailsEndDate, shift = defaultShift) => fetchProductionDetailsStartAsync(start, end, dept, shift);

    const updateUrl = (start, end, shift = 'All') => {
        const qry = { start, end, shift }
        const title =  `${dept.toUpperCase()} Details: ${start} - ${end} Shift: ${shift}`;
        updateUrlQryParameter(qry, title);
    }

    useEffect(() => {
        document.title = `Morning Meeting Details`;
        fetchData();
        updateUrl(defaultStartDate, defaultEndDate, defaultShift);
        setHeaderTitle(`${dept} Details: ${startFormat} - ${endFormat} Shift: ${shift || 'All'}`);
    }, [dept])
        
    const [startFormat, setStartFormat] = useState(defaultStartDate);
    const [endFormat, setSendFormat] = useState(defaultEndDate);
    const [shift, setShift] = useState(defaultShift);
    const [headerTitle, setHeaderTitle] = useState(`${dept} Details: ${defaultStartDate} - ${defaultEndDate} Shift: ${defaultShift || 'All'}`);

    const onClick = () => {
        setDetailsStartDate(startFormat);
        setDetailsEndDate(endFormat);  
        fetchData(startFormat, endFormat, shift);
        updateUrl(startFormat, endFormat, shift);
    }

    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        const startFormat = start ? start.format(dateFormat) : null;
        const endFormat = end ? end.format(dateFormat) : null;
        setStartFormat(startFormat);
        setSendFormat(endFormat);
    }

    const onShiftChange = (value) => setShift(value);

    return (
        <React.Fragment>
            <Header className="pa0 custom-header" >
                <h2 className="ml3 ttc">{headerTitle}</h2>
            </Header>

            <Content className="ma3 mt0">
                <DateRangePicker 
                    onCalendarChange={onCalendarChange}
                    dateRangeValue={{startDate: moment(startFormat), endDate: moment(endFormat)}}
                    isRenderButton={false} />
                
                <Tooltip placement="top" title="Select Shift">
                    <Select onChange={onShiftChange} className="mr2" style={{width: '70px'}} value={shift}>
                        <Option value="">All</Option>
                        <Option value="3">3rd</Option>
                        <Option value="1">1st</Option>
                        <Option value="2">2nd</Option>
                    </Select>
                </Tooltip>

                <Button type="primary" onClick={onClick} loading={isProductionDetailsLoading}>Go</Button>

                <div className="mt3">
                    <ProductionDetails/>
                </div>

            </Content>  
        </React.Fragment>
    )
};

const mapStateToProps = ( { productionDetails, morningMeeting } ) => ({
    startDate: morningMeeting.startDate,
    endDate: morningMeeting.endDate,
    detailsStartDate: productionDetails.detailsStartDate,
    detailsEndDate: productionDetails.detailsEndDate,
    isProductionDetailsLoading: productionDetails.isProductionDetailsLoading,
})

const mapDispatchToProps = dispatch => ({
    fetchProductionDetailsStartAsync: (start, end, dept, shift) => dispatch(fetchProductionDetailsStartAsync(start, end, dept, shift)),
    setDetailsStartDate: date => dispatch(setDetailsStartDate(date)),
    setDetailsEndDate: date => dispatch(setDetailsEndDate(date))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductionDetailsPage);