import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
import moment from 'moment';
import _ from 'lodash'
import { useTitle } from 'react-use'

import { 
    DownloadOutlined,
 } from '@ant-design/icons';

 //* actions
import { 
    fetchScrapVariancePerDeptStartAsync,
    fetchScrapVariancePerShiftStartAsync,
    fetchOvertimeQuarterStartAsync,
    fetchOvertimeShiftStartAsync
} from '../../core/redux/performance-lvl-2/performance-lvl-2.actions';

import { setDepartment } from '../../core/redux/performance-lvl-0/performance-lvl-0.actions'

import {
    fetchDowntimeByOwnerStartAsync,
    fetchDowntimeIconicsStartAsync,
} from '../../core/redux/downtime/downtime.actions'

//* components
import ScrapVariancePerDeptChart from './component/scrap-variance-per-dept.component';
import ScrapVariancePerShiftChart from './component/scrap-variance-per-shift.component';

import QuarterlyOvertimeChart from './component/quarterly-overtime-chart.component';
import OvertimePercentPerSiftChart from '../performance-lvl-0/components/overtime-by-shift-chart.component';

import DowntimeByOwnerChart from './component/downtime-by-owner-chart.component';
import DowntimeIconics from '../performance-lvl-0/components/downtime-iconics-chart.component';

import SelectScrapType from '../../components/select-scrap-type/seclect-scrap-type.components';

//* helpers
import { dateFormat, disabledDate, mapAreaToDept, isNumeric, departmentList, dateRange, monthRange } from '../../core/utilities/helpers'
import { useQuery } from '../../core/utilities/custom-hook'
import { download } from './service/download'

import { 
    Layout,
    Row,
    Col,
    Card,
    Button,
    Tooltip,
    DatePicker,
    Input,
    PageHeader,
    Select
 } from "antd";

const { Content } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;

const cardHeightStyle = {  height: "500px" }
const yesterday = moment().add(-1, 'days').format(dateFormat);
const scrapTypeDefault = 'SB';
const monthStartDefault = moment().quarter(1).startOf('quarter').format(dateFormat);
const responsiveProps = {
    xs: 24,
    xl: 8
}

const cardProps = {
    size: "small",
    className: "ba b--black-10",
    bodyStyle: { height: '89%' }
}

const PerformanceLevel2Page = () => {

    useTitle('Performance: L2 - L3')

    const dispatch = useDispatch();
    const history = useHistory();
    const query = useQuery();

    //* selectors
    const department = useSelector(({ performance0 }) => performance0.department)

    //* url query params
    const startQry = query.get('start') ?? yesterday;
    const endQry = query.get('end') ?? yesterday;

    //* date states
    const [startDate, setStartDate] = useState(startQry);
    const [endDate, setEndDate] = useState(endQry);
    const [monthStart, setMonthStart] = useState(monthStartDefault);
    const [monthEnd, setMonthEnd] = useState(yesterday);

    //* other states
    const [scrapType, setScrapType] = useState(scrapTypeDefault);
    const [title, setTitle] = useState(department);
    const [minDowntime, setMinDowntime] = useState(10);
    const [maxDowntime, setMaxDowntime] = useState(null);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [dateRangeType, setDateRangeType] = useState(null)

    const fetchData = () => {

        //* fetch daily
        dispatch(fetchScrapVariancePerDeptStartAsync(startDate, endDate, scrapType))
        dispatch(fetchScrapVariancePerShiftStartAsync(startDate, endDate, department, scrapType))
        dispatch(fetchDowntimeByOwnerStartAsync(startDate, endDate, department))
        dispatch(fetchOvertimeShiftStartAsync(startDate, endDate, department))
        dispatch(fetchDowntimeIconicsStartAsync(startDate, endDate, department, minDowntime, maxDowntime))

        //* fetch monthly
        dispatch(fetchOvertimeQuarterStartAsync(monthStart, monthEnd, department))
        
        //* update title and url
        const dept = _.startCase(mapAreaToDept(department));
        setTitle(dept === 'Skirt Coat' ? 'Finishing' : dept);

        history.push(`/dashboard/morningmeeting/level2?start=${startDate}&end=${endDate}&dept=${department}`)

    };

    //* mount
    useEffect(() => {
        fetchData();
    }, []);

    //* events handlers

    const onMonthRangeChange = (date, dateString) => {

        let [start, end] = date;
        const [, endStr] = dateString;
        const currentMonthYear = moment().format('YYYY-MM');

        if (endStr === currentMonthYear) {
            end = moment().add(-1, 'days');
        } else {
            end = end.endOf('month');
        }

        setMonthStart(start?.format(dateFormat) ?? null);
        setMonthEnd(end?.format(dateFormat) ?? null);  
    };

    const onDateRangeChange = (date) => {
        const [start, end] = date;
        setStartDate(start?.format(dateFormat) ?? null);
        setEndDate(end?.format(dateFormat) ?? null);  
    };

    const onClick = () => fetchData();

    const onDepartmentChange = (value) => dispatch(setDepartment(value));

    const onScrapTypeChange = (value) => {
        setScrapType(value);
        dispatch(fetchScrapVariancePerDeptStartAsync(startDate, endDate, value))
    };

    const onScrapTypeShiftChange = (value) => dispatch(fetchScrapVariancePerShiftStartAsync(startDate, endDate, department, value))

    //* downtime events
    const onMinDowntimeChange = (e) => {
        const { value } = e.target;
        if (isNumeric(value)) 
            setMinDowntime(value);
    };

    const onMaxDowntimeChange = (e) => {
        const { value } = e.target;
        if (isNumeric(value)) 
            setMaxDowntime(value);
    };

    const onDowntimeClick = () => fetchDowntimeIconicsStartAsync(startDate, endDate, department, minDowntime, maxDowntime);;

    //* download data
    const onDownload = () => download(
        setDownloadLoading,
        scrapType,
        startDate,
        endDate,
        monthStart,
        monthEnd,
        department
    )

    //* highlight card when date range is hover
    const onMonthRangeMouseEnter = () => setDateRangeType('month')
    const onDateRangeEnter = () => setDateRangeType('date')
    const onDateleave = () => setDateRangeType(null)

    const borderColor = '#335c67';
    const boxShadow = '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
    const monthBorderStyle = { 
        borderColor: dateRangeType === 'month' ? borderColor : null,
        boxShadow: dateRangeType === 'month' ? boxShadow : null,
    }
    const dateBorderStyle = { 
        borderColor: dateRangeType === 'date' ? borderColor : null,
        boxShadow: dateRangeType === 'date' ? boxShadow : null,
    }

    return (
        <>
            <PageHeader
                className="site-page-header"
                title={`${title} Department Performace Level 2 - 3`}
            />
    
            <Content className="ma3 mt0">
            
                <Row gutter={[12,12]}>

                    <Col span={24}>

                        <div
                            className="dib"
                            onMouseEnter={onMonthRangeMouseEnter}
                            onMouseLeave={onDateleave}>

                            <span className="mr2">Month Range:</span>
                            <RangePicker 
                                picker="month" 
                                onChange={onMonthRangeChange} 
                                className="mr2" 
                                disabledDate={disabledDate}
                                ranges={monthRange}
                                style={monthBorderStyle}
                                defaultValue={[
                                    moment(monthStart, dateFormat),
                                    moment(monthEnd, dateFormat)
                                ]} />

                        </div>
                        
                        <div
                            className="dib"
                            onMouseEnter={onDateRangeEnter}
                            onMouseLeave={onDateleave}>

                            <span className="mr2">Date Range:</span>
                            <RangePicker 
                                onChange={onDateRangeChange} 
                                className="mr2" 
                                format={dateFormat}
                                disabledDate={disabledDate}
                                ranges={dateRange}
                                style={dateBorderStyle}
                                defaultValue={[
                                    moment(startDate, dateFormat),
                                    moment(endDate, dateFormat)
                                ]} />

                        </div>
                        
                        
                        <span className="mr2">Department:</span>
                        <Select 
                            defaultValue={department}
                            style={{ width: 120 }}
                            onChange={onDepartmentChange}
                            className="mr2">   
                                {
                                    departmentList.map(({ area, dept }) => <Option key={area} value={area}>{dept}</Option>)
                                }  
                        </Select>
                                        
                        <Button type="primary" onClick={onClick}>Go</Button>

                        <Button type="primary" onClick={onDownload} loading={downloadLoading} className="ml2">
                            <DownloadOutlined />
                            Export
                        </Button>
                    
                    </Col>

                </Row>

                <Row gutter={[12,12]}>  

                    <Col {...responsiveProps}>
                        
                        <Card 
                            {...cardProps}
                            title={`Lvl 2: Scrap Variance per Dept (${startDate} - ${endDate})`}
                            style={{...cardHeightStyle, ...dateBorderStyle }}
                            extra={<SelectScrapType onChange={onScrapTypeChange} />}
                        >
                            <ScrapVariancePerDeptChart/>
                        </Card>         
                    </Col>

                    <Col {...responsiveProps}>
                        <Card 
                            {...cardProps}
                            title={`Lvl 2: ${title} Dept Overtime  percentage (${monthStart} - ${monthEnd})`}
                            style={{...cardHeightStyle, ...monthBorderStyle}}
                        >
                            <QuarterlyOvertimeChart/>
                        </Card>         
                    </Col>

                    <Col {...responsiveProps}>
                        <Card 
                            {...cardProps}
                            title={`Lvl 2: ${title} Dept Downtime by Owner (${startDate} - ${endDate})`}
                            style={{...cardHeightStyle, ...dateBorderStyle }}
                        >
                            <DowntimeByOwnerChart/>
                        </Card>         
                    </Col>

                </Row>

                <Row gutter={[12,12]}>  

                        <Col {...responsiveProps}>
                            <Card 
                                {...cardProps}
                                title={`Lvl 3: ${title} Dept Scrap Variance per Shift (${startDate} - ${endDate})`}
                                style={{...cardHeightStyle, ...dateBorderStyle }}
                                extra={<SelectScrapType onChange={onScrapTypeShiftChange} />}
                            >
                                <ScrapVariancePerShiftChart/>
                            </Card>         
                        </Col>

                        <Col {...responsiveProps}>
                            <Card 
                                {...cardProps}
                                title={`Lvl 3: ${title} Overtime Variance per Shift (${startDate} - ${endDate})`}
                                style={{...cardHeightStyle, ...dateBorderStyle }}
                            >
                                <OvertimePercentPerSiftChart/>
                            </Card>         
                        </Col>

                        <Col {...responsiveProps}>

                            <Card 
                                {...cardProps}
                                title={`Lvl 3: ${title} Downtime pareto - PLC (${startDate} - ${endDate})`}
                                style={{...cardHeightStyle, ...dateBorderStyle }}
                                extra={
                                    <Tooltip title="Set Min and Max Downtime Event">
                                        <Input.Group compact size="small">
                                            <Input style={{ width: 100, textAlign: 'center' }} 
                                                    placeholder="Minimum"
                                                    value={minDowntime} 
                                                    onChange={onMinDowntimeChange} />
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
                                                onChange={onMaxDowntimeChange}
                                                value={maxDowntime}
                                                style={{
                                                width: 100,
                                                textAlign: 'center',
                                                }}
                                                placeholder="Maximum"
                                            />
                                            <Button type="primary" size="small" onClick={onDowntimeClick}>Go</Button>
                                        </Input.Group>
                                        
                                    </Tooltip>
                                    
                                }
                            >
                                <DowntimeIconics/>
                            </Card>
                                
                        </Col>

                    </Row>

            </Content>      
        </>)

}

export default PerformanceLevel2Page;