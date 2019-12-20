import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'

import { 
    Layout
 } from "antd";

 import DateRangePicker from '../../../../components/date-range-picker/date-range-picker.component'
 import ProductionDetails from '../../../../components/production-details/production-details.component'


 import {
    fetchProductionDetailsStartAsync,
    setTitle,
    setDetailsStartDate,
    setDetailsEndDate
 } from '../../../../redux/production-details/production-details.actions'

const { Header, Content } = Layout;
const dateFormat = 'MM/DD/YYYY';
const previousDay = moment().add(-1, 'd');

const ProductionDetailsPage = ({title, area, fetchProductionDetailsStartAsync, setTitle, 
                                detailsStartDate, detailsEndDate, setDetailsStartDate, setDetailsEndDate }) => {

    const fetchData = () => {
        fetchProductionDetailsStartAsync(detailsStartDate, detailsEndDate, area);
    }

    const onClick = () => {
        fetchData();
        setTitle({
            headerTitle: title.headerTitle,
            startDay: detailsStartDate,
            endDay: detailsEndDate
        })
    }

    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        setDetailsStartDate((start ? start.format(dateFormat) : null))
        setDetailsEndDate((end ? end.format(dateFormat) : null));    
    }

    useEffect(() => {
        document.title = `Morning Meeting Details`;
        fetchData();
    }, [])

    return (
    <>
        <Header className="pa0 custom-header" >
            <h2 className="ml3">{`${title.headerTitle} Details ~ ${title.startDay} - ${title.endDay}`}</h2>
        </Header>

        <Content className="ma3 mt0">
            <DateRangePicker defaultValue={previousDay} onButtonClick={onClick} onCalendarChange={onCalendarChange} 
                                dateRangeValue={{startDate: detailsStartDate, endDate: detailsEndDate}} />
            
            <div className="mt3">
                <ProductionDetails/>
            </div>

        </Content>  
    </>
    )
};

const mapStateToProps = ( { productionDetails } ) => ({
    title: productionDetails.title,
    area: productionDetails.area,
    detailsStartDate: productionDetails.detailsStartDate,
    detailsEndDate: productionDetails.detailsEndDate, 
})


const mapDispatchToProps = dispatch => ({
    fetchProductionDetailsStartAsync: (start, end, area) => dispatch(fetchProductionDetailsStartAsync(start, end, area)),
    setTitle: title => dispatch(setTitle(title)),
    setDetailsStartDate: date => dispatch(setDetailsStartDate(date)),
    setDetailsEndDate: date => dispatch(setDetailsEndDate(date)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductionDetailsPage);