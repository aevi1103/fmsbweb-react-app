import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'

import DatePicker from '../../../../components/single-date-range-picker/single-date-range-picker.component'

import { 
    fetchFiananceKpiStartAsync
} from '../../../../redux/morning-meeting/morning-meeting.actions'

import { 
    Layout
 } from "antd";

import '../morning-meeting.styles.scss'

import FinanceKpi from '../../../../components/finance/kpi/kpi.component'

const { Header, Content } = Layout;

const FinancePage = ({
        fetchFiananceKpiStartAsync,
        endDate
    }) => {
    
    const [ date, setDate ] = useState(endDate);

    const fetchData = () => {
        fetchFiananceKpiStartAsync(date);
    }

    const onClick = () => {
        fetchData();
    }

    const onChange = (date, dateStr) => {
        setDate(dateStr);
    }

    useEffect(() => {
        document.title = `Morning Meeting - Finance`;
        fetchData();
    }, [])

    return (
    <>
        <Header className="pa0 custom-header" >
            <h2 className="ml3">Finance: {endDate}</h2>
        </Header>

        <Content className="ma3 mt0">
            <DatePicker onButtonClick={onClick} onChange={onChange} 
                    defaultValue={moment(endDate, 'MM/DD/YYYY')} />

            <div className="mt3">
                <FinanceKpi/>
            </div>
            
        </Content>      
    </> 
)}

const mapDispatchToProps = dispatch => ({
    fetchFiananceKpiStartAsync: date => dispatch(fetchFiananceKpiStartAsync(date))
})

const mapStateToProps = ({morningMeeting}) => ({
    endDate: morningMeeting.endDate
})

export default connect(mapStateToProps, mapDispatchToProps)(FinancePage);