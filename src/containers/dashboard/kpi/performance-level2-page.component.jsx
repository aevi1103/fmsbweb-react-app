import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import api from '../../../core/utilities/api'
import fileDownload from 'js-file-download'

import { 
    DownloadOutlined,
 } from '@ant-design/icons';

import { 
    setStartDate,
    setEndDate,

    fetchScrapVariancePerDeptStartAsync,
    fetchScrapVariancePerShiftStartAsync,
    fetchDowntimeByOwnerStartAsync,
    fetchDowntimeIconicsStartAsync,
    fetchOvertimePercentPerDeptStartAsync,
    fetchOvertimePercentPerShiftStartAsync,

    setPerformaceSelectedDepartment
} from '../../../core/redux/morning-meeting/morning-meeting.actions';

//level 0 charts
import ScrapVariancePerDeptChart from '../../../components/performance/level-2/scrap-variance-per-dept.component';
import ScrapVariancePerShiftChart from '../../../components/performance/level-3/scrap-variance-per-shift.component';
import DowntimeByOwnerChart from '../../../components/performance/level-2/downtime-by-owner-chart.component';
import DowntimeIconics from '../../../components/performance/level-3/downtime-iconics-chart.component';
import OvertimePercentPerDeptChart from '../../../components/performance/level-2/overtime-percent-per-dept.component';
import OvertimePercentPerSiftChart from '../../../components/performance/level-3/overtime-percent-per-shift.component';

import DateRangePicker from '../../../components/date-range-picker/date-range-picker.component';
import SelectScrapType from '../../../components/select-scrap-type/seclect-scrap-type.components';
import DeptSelect from '../../../components/performance/dept-select.component';
import { useTitle } from 'react-use'

import { 
    Layout,
    Row,
    Col,
    Card,
    Button,
    Tooltip,
    DatePicker,
    Input,
    message,
    PageHeader
 } from "antd";

 const { Header, Content } = Layout;
 const { RangePicker } = DatePicker;

 const dateFormat = 'MM/DD/YYYY';

 const cardHeightStyle = {
    height: "500px"
}

const PerformanceLevel2Page = ({
    setStartDate,
    setEndDate,
    startDate,
    endDate,

    setPerformaceSelectedDepartment,
    performaceSelectedDepartment,

    fetchScrapVariancePerDeptStartAsync,
    fetchScrapVariancePerShiftStartAsync,
    fetchDowntimeByOwnerStartAsync,
    fetchDowntimeIconicsStartAsync,
    fetchOvertimePercentPerDeptStartAsync,
    fetchOvertimePercentPerShiftStartAsync
}) => {

    useTitle('Performance: L2 - L3')

    const previousDay = moment().add(-1, 'days').format(dateFormat);
    const scrapTypeDefault = 'SB';
    /** Hooks */

    //date range for quartery charts
    const lastTwelveMonths = moment().add(-12, 'month').startOf('quarter').format(dateFormat);
    const [monthStartFormart, setMonthStartFormat] = useState(lastTwelveMonths);
    const [monthEndFormat, setMonthEndFormat] = useState(previousDay);

    //scrap type
    const [scrapByDeptScrapType, setScrapByDeptScrapType] = useState(scrapTypeDefault);
    const [scrapByShiftScrapType, setScrapByShiftScrapType] = useState(scrapTypeDefault);

    //scrap area name title
    const [deptTitle, setDeptTitle] = useState(performaceSelectedDepartment);

    //downtime event
    const [minDowntimeEvt, setMinDowntimeEvt] = useState(10);
    const [maxDowntimeEvt, setMaxDowntimeEvt] = useState(null);

    const [downloadLoading, setDownloadLoading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);

    const fetchQuarterly = (start = monthStartFormart, end = monthEndFormat) => {
        fetchOvertimePercentPerDeptStartAsync(start, end, performaceSelectedDepartment);
    };
    
    const fetch = (start = startDate, end = endDate) => {
        fetchScrapVariancePerDeptStartAsync(start, end, scrapByDeptScrapType);
        fetchScrapVariancePerShiftStartAsync(start, end, performaceSelectedDepartment, scrapByDeptScrapType);
        fetchDowntimeByOwnerStartAsync(start, end, performaceSelectedDepartment);
        fetchDowntimeIconicsStartAsync(start, end, performaceSelectedDepartment, minDowntimeEvt, maxDowntimeEvt);
        fetchOvertimePercentPerShiftStartAsync(start, end, performaceSelectedDepartment);
    };

    const setTitleFn = (dept) => {
        switch (dept) {
            case 'Skirt Coat' :
                return 'Finishing';
            case 'Foundry Cell' :
                return 'Foundry';
            case 'Machine Line':
                return 'Machining';
            default:
                return dept;
        }
    };

    const disabledDate = (current) => current && current > moment().endOf('day');

    //events handlers
    const onClick = () => {
        setDeptTitle(setTitleFn(performaceSelectedDepartment));
        fetchQuarterly(monthStartFormart, monthEndFormat);
        fetch(startDate, endDate);
    };

    const onSelectChange = (value) => setPerformaceSelectedDepartment(value);

    const onMonthChange = (date, dateString) => {

        let [start, end] = date;
        const [startStr, endStr] = dateString;
        const currentMonthYear = moment().format('YYYY-MM');

        if (endStr === currentMonthYear) {
            end = moment().add(-1, 'days');
        } else {
            end = end.endOf('month');
        }

        setMonthStartFormat(start ? start.format(dateFormat) : null);
        setMonthEndFormat(end ? end.format(dateFormat) : null);  
    };

    const onCalendarChange = (date, dateString) => {
        const [start, end] = date;
        setStartDate(start ? start.format(dateFormat) : null);
        setEndDate(end ? end.format(dateFormat) : null);  
    };

    const onScrapByDeptChange = (value) => {
        setScrapByDeptScrapType(value);
        fetchScrapVariancePerDeptStartAsync(startDate, endDate, value);
    };

    const onScrapByShiftChange = (value) => {
        setScrapByShiftScrapType(value);
        fetchScrapVariancePerShiftStartAsync(startDate, endDate, performaceSelectedDepartment, value);
    };

    const isNumeric = (value) => {
        const reg = /^-?[0-9]*(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') return true;
        return false;
    };

    const onChangeMinDowntimeEvt = (e) => {
        const { value } = e.target;
        
        if (isNumeric(value)) {
            setMinDowntimeEvt(value);
        }
    };

    const onChangeMaxDowntimeEvt = (e) => {
        const { value } = e.target;
        if (isNumeric(value)) {
            setMaxDowntimeEvt(value);   
        }
    };

    const onDowntimeEvtClick = () => {
        fetchDowntimeIconicsStartAsync(startDate, endDate, performaceSelectedDepartment, minDowntimeEvt, maxDowntimeEvt);
    };

    useEffect(() => {
        document.title = `Performance: L0 - L1`;
        setDeptTitle(setTitleFn(performaceSelectedDepartment));
        fetchQuarterly();
        fetch();
    }, []);

    const responsiveProps = {
        xs: 24,
        xl: 8
    }

    const onDownload = async () => {

        try {    

            setDownloadError(null);
            setDownloadLoading(true);
            const isPurchasedScrap = scrapByDeptScrapType === 'SB' ? false : true;
            const response = await api.get(`/exports/performance/level/2?start=${startDate}&end=${endDate}
                                            &area=${performaceSelectedDepartment}
                                            &isPurchasedScrap=${isPurchasedScrap}
                                            &monthStart=${monthStartFormart}&monthEnd=${monthEndFormat}`, {
                responseType: 'blob',
            });

            const fileName = `${performaceSelectedDepartment.toUpperCase()}_PERFORMANCE_LVL1&2_DATA_EXPORT_${new Date().getTime()}.xlsx`
            fileDownload(response.data, fileName);

            message.success('Data successfully exported!', 10);
            setDownloadLoading(false);

        } catch (error) {
            setDownloadError(`${error}: Unable to export something went wrong!`);
            setDownloadLoading(false);
            // message.error(error);
        } finally {
            if (!downloadError) {
                setDownloadLoading(false);
            }
        }
    }

    return (
        <>
            <PageHeader
                className="site-page-header"
                title={`${deptTitle} Department Performace Level 2 - 3`}
            />
    
            <Content className="ma3 mt0">
            
                <Tooltip placement="top" title={
                    (<div>
                        <b>Update Charts:</b>
                        <ul>
                            <li>Overtime percentage per department</li>
                        </ul>
                    </div>)}>

                    <span className="mr2">Month Range:</span>
                </Tooltip>
                
                <RangePicker picker="month" onChange={onMonthChange} className="mr2" disabledDate={disabledDate}
                    defaultValue={[
                        moment(monthStartFormart, dateFormat),
                        moment(monthEndFormat, dateFormat)
                    ]} />

                <Tooltip placement="top" title={
                    (<div>
                        <b>Update Charts:</b>
                        <ul>
                            <li>Scrap Variance per Dept</li>
                            <li>Scrap Variance per Shift</li>
                            <li>Overtime Variance per Shift</li>
                            <li>Downtime by Owner</li>
                            <li>Downtime Pareto PLC</li>
                        </ul>
                    </div>)}>

                    <span className="mr2">Date Range:</span>
                </Tooltip>

                <DateRangePicker 
                    dateRangeValue={{startDate: startDate, endDate: endDate}}
                    onCalendarChange={onCalendarChange}
                    isRenderButton={false}/>
                
                <span className="mr2">Department:</span>
                <DeptSelect defaultValue={performaceSelectedDepartment} onChange={onSelectChange} type="dept" />
                                
                <Tooltip placement="top" title={<span>Click to reload dashboard</span>}>
                    <Button type="primary" onClick={onClick}>Go</Button>
                </Tooltip>

                <Button type="primary" onClick={onDownload} loading={downloadLoading} className="ml2">
                    <DownloadOutlined />
                    Export
                </Button>

                <div className="mt3">
                    <Row gutter={[12,12]}>  

                        <Col {...responsiveProps}>
                         
                            <Card 
                                title={`Lvl 2: Scrap Variance per Dept (${startDate} - ${endDate})`}
                                size="small"
                                className="ba b--black-10"
                                style={cardHeightStyle}
                                extra={<SelectScrapType onChange={onScrapByDeptChange} />}
                            >
                                <ScrapVariancePerDeptChart/>
                            </Card>         
                        </Col>

                        <Col {...responsiveProps}>
                            <Card 
                                title={`Lvl 2: ${deptTitle} Dept Overtime  percentage (${monthStartFormart} - ${monthEndFormat})`}
                                size="small"
                                className="ba b--black-10"
                                style={cardHeightStyle}
                            >
                                <OvertimePercentPerDeptChart/>
                            </Card>         
                        </Col>

                        <Col {...responsiveProps}>
                            <Card 
                                title={`Lvl 2: ${deptTitle} Dept Downtime by Owner (${startDate} - ${endDate})`}
                                size="small"
                                className="ba b--black-10"
                                style={cardHeightStyle}
                            >
                                <DowntimeByOwnerChart/>
                            </Card>         
                        </Col>

                    </Row>

                    <Row gutter={[12,12]}>  

                        <Col {...responsiveProps}>
                            <Card 
                                title={`Lvl 3: ${deptTitle} Dept Scrap Variance per Shift (${startDate} - ${endDate})`}
                                size="small"
                                className="ba b--black-10"
                                style={cardHeightStyle}
                                extra={<SelectScrapType onChange={onScrapByShiftChange} />}
                            >
                                <ScrapVariancePerShiftChart/>
                            </Card>         
                        </Col>

                        <Col {...responsiveProps}>
                            <Card 
                                title={`Lvl 3: ${deptTitle} Overtime Variance per Shift (${startDate} - ${endDate})`}
                                size="small"
                                className="ba b--black-10"
                                style={cardHeightStyle}
                            >
                                <OvertimePercentPerSiftChart/>
                            </Card>         
                        </Col>

                        <Col {...responsiveProps}>
                            <Card 
                                title={`Lvl 3: ${deptTitle} Downtime pareto - PLC (${startDate} - ${endDate})`}
                                size="small"
                                className="ba b--black-10"
                                style={cardHeightStyle}
                                extra={
                                    <Tooltip title="Set Min and Max Downtime Event">
                                        <Input.Group compact size="small">
                                            <Input style={{ width: 100, textAlign: 'center' }} 
                                                    placeholder="Minimum"
                                                    value={minDowntimeEvt} 
                                                    onChange={onChangeMinDowntimeEvt} />
                                            <Input
                                                className="site-input-split"
                                                style={{
                                                    width: 30,
                                                    borderLeft: 0,
                                                    borderRight: 0,
                                                    pointerEvents: 'none',
                                                }}
                                                placeholder="~"
                                                disabled
                                            />
                                            <Input
                                                className="site-input-right"
                                                onChange={onChangeMaxDowntimeEvt}
                                                value={maxDowntimeEvt}
                                                style={{
                                                width: 100,
                                                textAlign: 'center',
                                                }}
                                                placeholder="Maximum"
                                            />
                                            <Button type="primary" size="small" onClick={onDowntimeEvtClick}>Go</Button>
                                        </Input.Group>
                                        
                                    </Tooltip>
                                    
                                }
                            >
                                <DowntimeIconics/>
                            </Card>         
                        </Col>

                    </Row>

                </div>
                
            </Content>      
        </>)

}

const mapDispatchToProps = dispatch => ({
    setStartDate: (date) => dispatch(setStartDate(date)),
    setEndDate: (date) => dispatch(setEndDate(date)),

    fetchScrapVariancePerDeptStartAsync: (start, end, isPurchasedScrap) => dispatch(fetchScrapVariancePerDeptStartAsync(start, end, isPurchasedScrap)),
    fetchScrapVariancePerShiftStartAsync: (start, end, area, isPurchasedScrap) => dispatch(fetchScrapVariancePerShiftStartAsync(start, end, area, isPurchasedScrap)),
    fetchDowntimeByOwnerStartAsync: (start, end, area) => dispatch(fetchDowntimeByOwnerStartAsync(start, end, area)),
    fetchDowntimeIconicsStartAsync: (start, end, area, min, max) => dispatch(fetchDowntimeIconicsStartAsync(start, end, area, min, max)),
    fetchOvertimePercentPerDeptStartAsync: (start, end, dept) => dispatch(fetchOvertimePercentPerDeptStartAsync(start, end, dept)),
    fetchOvertimePercentPerShiftStartAsync: (start, end, dept) => dispatch(fetchOvertimePercentPerShiftStartAsync(start, end, dept)),

    setPerformaceSelectedDepartment: (dept) => dispatch(setPerformaceSelectedDepartment(dept)),
})

const mapStateToProps = ({morningMeeting}) => ({
    startDate: morningMeeting.startDate,
    endDate: morningMeeting.endDate,

    performaceSelectedDepartment: morningMeeting.performaceSelectedDepartment,
})

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceLevel2Page);