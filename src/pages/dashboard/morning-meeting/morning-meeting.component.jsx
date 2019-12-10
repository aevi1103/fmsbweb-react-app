import React from 'react';
import { connect } from 'react-redux';
import { 
    fetchSafetyMonthlyIncidentRateStartAsync,
    fetchSafetyIncidentByDeptStartAsync,
    fetchSafetyIncidentStartAsync,
    fetchLogisticsStockOverviewStartAsync,
    fetchLogisticsStockOverviewSlocStartAsync
 } from '../../../redux/morning-meeting/morning-meeting.actions'
import moment from 'moment'

import { 
    Layout,
    Tabs,
    DatePicker,
    Button
 } from "antd";

 import Safety from '../../../components/safety/safety.component'
 import Logistics from '../../../components/logistics/logistics.component'

const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const headerStyles = { 
    background: "#f0f2f5",
    boxShadow: "0 12px 10px -10px rgba( 0, 0, 0, 0.1 )" 
}

const dateFormat = 'MM/DD/YYYY';
const previousDay = moment().add(-1, 'd');

class MorningMeeting extends React.Component { 
    
    constructor(props){
        super(props)
        this.state = {
            startDate: previousDay.format(dateFormat),
            endDate: previousDay.format(dateFormat)
        }
    }

    componentDidMount() {
        this.fetchData();       
    }

    fetchData = () => {

        const { 
            setMonthlyIncidentRate,
            setIncidentByDept,
            setIncidents,
            setStockOverview,
            setStockOverviewSloc
        } = this.props;

        const {
            startDate,
            endDate
        } = this.state;

        setMonthlyIncidentRate();
        setIncidentByDept();
        setIncidents(startDate, endDate);
        setStockOverview(moment(endDate, dateFormat).add(1, 'd').format(dateFormat));
        setStockOverviewSloc(moment(endDate, dateFormat).add(1, 'd').format(dateFormat));
    }

    onClick = () => {
        this.fetchData();  
    }

    onCalendarChange = (dates) => {
        const [start, end] = dates;
        this.setState({
            startDate: start ? start.format(dateFormat) : null,
            endDate: end ? end.format(dateFormat) : null
        })    
    }

    render() {

        return ( 
            <>
                <Header className="pa0 mb3" style={headerStyles} >
                    <h2 className="ml3">Plant Status</h2>
                </Header>

                <Content className="ma3">

                    <span className="mr2">Select Date Range:</span>
                    <RangePicker 
                        className="mr2"
                        onChange={() => {}}
                        format={dateFormat}
                        onCalendarChange={this.onCalendarChange}
                        defaultValue={
                            [
                                moment(previousDay, dateFormat),
                                moment(previousDay, dateFormat)
                            ]
                        } />

                    <Button type="primary" onClick={this.onClick}>Go</Button>

                    <Tabs defaultActiveKey="1" onChange={() => {}}>
                        <TabPane tab="Safety" key="1">                   
                            <Safety/>
                        </TabPane>
                        <TabPane tab="Quality" key="2">
                            Quality
                        </TabPane>
                        <TabPane tab="Logistics" key="3">
                            <Logistics/>
                        </TabPane>
                        <TabPane tab="Production" key="4">
                            Prod
                        </TabPane>
                        <TabPane tab="Finance" key="5">
                            Finance
                        </TabPane>
                        <TabPane tab="Maintenance" key="6">
                            Maint
                        </TabPane>
                    </Tabs>

                </Content>      
            </> 
        ) 
    }
}



const mapDispatchToProps = dispatch => ({
    setMonthlyIncidentRate: () => dispatch(fetchSafetyMonthlyIncidentRateStartAsync()),
    setIncidentByDept: () => dispatch(fetchSafetyIncidentByDeptStartAsync()),
    setIncidents: (start, end) => dispatch(fetchSafetyIncidentStartAsync(start, end)),
    setStockOverview: (day) => dispatch(fetchLogisticsStockOverviewStartAsync(day)),
    setStockOverviewSloc: (day) => dispatch(fetchLogisticsStockOverviewSlocStartAsync(day)),
})

export default connect(null, mapDispatchToProps)(MorningMeeting);