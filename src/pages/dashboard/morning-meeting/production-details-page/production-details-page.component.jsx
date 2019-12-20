import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'

import { 
    Layout
 } from "antd";

 import DateRangePicker from '../../../../components/date-range-picker/date-range-picker.component'
 import ProductionDetails from '../../../../components/production-details/production-details.component'


 import {
    fetchProductionDetailsStartAsync
 } from '../../../../redux/production-details/production-details.actions'

const { Header, Content } = Layout;
const dateFormat = 'MM/DD/YYYY';
const previousDay = moment().add(-1, 'd');
const previousDayFormatted = previousDay.format(dateFormat);

const ProductionDetailsPage = ({title, area, fetchProductionDetailsStartAsync}) => {
    
    const [ startDay, setStartDay ] = useState(previousDayFormatted);
    const [ endDay, setEndDay ] = useState(previousDayFormatted);

    const fetchData = () => {
        const start = moment(startDay, dateFormat).format(dateFormat);
        const end = moment(endDay, dateFormat).format(dateFormat);
        fetchProductionDetailsStartAsync(start, end, area);
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
        document.title = `Morning Meeting Details`;
        fetchData();
    }, [])

    return (
    <>
        <Header className="pa0 custom-header" >
            <h2 className="ml3">{title}</h2>
        </Header>

        <Content className="ma3 mt0">
            <DateRangePicker defaultValue={previousDay} onButtonClick={onClick} onCalendarChange={onCalendarChange}  />
            
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
})


const mapDispatchToProps = dispatch => ({
    fetchProductionDetailsStartAsync: (start, end, area) => dispatch(fetchProductionDetailsStartAsync(start, end, area)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductionDetailsPage);