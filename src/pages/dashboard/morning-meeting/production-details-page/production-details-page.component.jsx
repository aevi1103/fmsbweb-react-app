import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'

import { 
    Layout
 } from "antd";

 import DateRangePicker from '../../../../components/date-range-picker/date-range-picker.component'
 import ProductionDetails from '../../../../components/production-details/production-details.component'

 import {
    fetchProductionDetailsStartAsync,
    setTitle
 } from '../../../../redux/production-details/production-details.actions'

const { Header, Content } = Layout;
const dateFormat = 'MM/DD/YYYY';
const previousDay = moment().add(-1, 'd');

const ProductionDetailsPage = ({
        title,
        area,
        fetchProductionDetailsStartAsync,
        setTitle, 

        startDate,
        endDate
    }) => {

    const [detailsStartDate, setDetailsStartDate] = useState(startDate);
    const [detailsEndDate, setDetailsEndDate] = useState(endDate);

    const [startFormat, setStartFormat] = useState(startDate);
    const [endFormat, setSendFormat] = useState(endDate);

    const fetchData = (start = detailsStartDate, end = detailsEndDate) => {
        fetchProductionDetailsStartAsync(start, end, area);
    }

    const onClick = () => {

        setDetailsStartDate(startFormat)
        setDetailsEndDate(endFormat);  

        fetchData(startFormat, endFormat);

        setTitle({
            headerTitle: title.headerTitle,
            startDay: detailsStartDate,
            endDay: detailsEndDate
        })
    }

    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        setStartFormat(start ? start.format(dateFormat) : null);
        setSendFormat(end ? end.format(dateFormat) : null);
    }

    useEffect(() => {
        document.title = `Morning Meeting Details`;
        fetchData();
    }, [])

    return (
    <>
        <Header className="pa0 custom-header" >
            <h2 className="ml3">{`${title ? title.headerTitle : ''} Details: ${detailsStartDate} - ${detailsEndDate}`}</h2>
        </Header>

        <Content className="ma3 mt0">
            <DateRangePicker defaultValue={previousDay} onButtonClick={onClick} onCalendarChange={onCalendarChange} 
                                dateRangeValue={{startDate: startDate, endDate: endDate}} />
            
            <div className="mt3">
                <ProductionDetails/>
            </div>

        </Content>  
    </>
    )
};

const mapStateToProps = ( { productionDetails, morningMeeting } ) => ({
    title: productionDetails.title,
    area: productionDetails.area,

    startDate: morningMeeting.startDate,
    endDate: morningMeeting.endDate
})


const mapDispatchToProps = dispatch => ({
    fetchProductionDetailsStartAsync: (start, end, area) => dispatch(fetchProductionDetailsStartAsync(start, end, area)),
    setTitle: title => dispatch(setTitle(title))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductionDetailsPage);