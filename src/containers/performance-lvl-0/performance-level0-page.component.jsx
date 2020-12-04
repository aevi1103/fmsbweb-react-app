import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Link, useHistory } from "react-router-dom";
import { useTitle } from 'react-use'

//* helpers
import { dateFormat, disabledDate, mapAreaToDept, departmentList, dateRange, monthRange } from '../../core/utilities/helpers'
import { useQuery } from '../../core/utilities/custom-hook'
import { download } from './service/download'

//* copmponents
import ScrapVarianceChart from './components/scrap-variance-chart.component';
import PlantPpmhChart from './components/plant-ppmh-chart.component';
import DeptKpiChart from './components/dept-kpi-chart.component';
import ScrapVarianceChartPerProgram from './components/scrap-variance-per-program-chart.component';
import PpmhVariancePerDeptChart from './components/ppmh-variance-per-dept-chart.component';

import DowntimeChart from '../downtime/components/downtime-chart.component';
import SelectScrapType from '../../components/select-scrap-type/seclect-scrap-type.components';

//* actions
import { 
    fetchScrapVarianceStartAsync,
    fetchScrapVariancePerProgramStartAsync,    
    fetchPpmhPerDeptStartAsync,
    fetchDeptKpiStartAsync,
    fetchPlantPpmhStartAsync,
    setDepartment,
} from '../../core/redux/performance-lvl-0/performance-lvl-0.actions';

import { fetchDowntimeStartAsync } from '../../core/redux/downtime/downtime.actions'

import { 
    DownloadOutlined,
    LoadingOutlined
} from '@ant-design/icons';

import { 
    Layout,
    Row,
    Col,
    Card,
    DatePicker,
    Dropdown,
    Spin,
    Menu,
    PageHeader,
    Select
 } from "antd";

const { Content } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;

const cardHeightStyle = { height: "500px" }
const responsiveProps = {
    xs: 24,
    xl: 8
}

const cardProps = {
    size: "small",
    className: "ba b--black-10",
    bodyStyle: { height: '89%' }
}

const yesterday = moment().add(-1, 'days').format(dateFormat);
const monthStartDefault = moment().quarter(1).startOf('quarter').format(dateFormat);
const scrapTypeDefault = 'SB';

const PerformanceLevel0Page = () => {

    const query = useQuery();
    const dispatch = useDispatch();
    const history = useHistory();

    useTitle('Performance: L0 - L1');

    //* selectors
    const department = useSelector(({ performance0 }) => performance0.department) ?? 'Foundry Cell'

    //* url query params
    const startQry = query.get('start') ?? yesterday;
    const endQry = query.get('end') ?? yesterday;

    //* date range state
    const [startDate, setStartDate] = useState(startQry);
    const [endDate, setEndDate] = useState(endQry)
    const [monthStart, setMonthStart] = useState(monthStartDefault);
    const [monthEnd, setMonthEnd] = useState(yesterday);

    //* other state
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [title, setTitle] = useState(department);
    const [scrapType, setScrapType] = useState(scrapTypeDefault);
    const [programScrapType, setProgramScrapType] = useState(scrapTypeDefault);
    const [dateRangeType, setDateRangeType] = useState(null)

    const fetch = () => {

        //* fetch by month range
        dispatch(fetchScrapVarianceStartAsync(monthStart, monthEnd, department, scrapType))
        dispatch(fetchPpmhPerDeptStartAsync(monthStart, monthEnd, department))
        dispatch(fetchPlantPpmhStartAsync(monthStart, monthEnd))

        //* fetch by date range
        dispatch(fetchScrapVariancePerProgramStartAsync(startDate, endDate, department, scrapType))
        dispatch(fetchDeptKpiStartAsync(startDate, endDate, department))
        dispatch(fetchDowntimeStartAsync(startDate, startDate))

        const dept = _.startCase(mapAreaToDept(department));
        setTitle(dept === 'Skirt Coat' ? 'Finishing' : dept);

        history.push(`/dashboard/morningmeeting/level0?start=${startDate}&end=${endDate}&dept=${department}`)
    }

    //* mount
    useEffect(() => {
        fetch();
    }, [])

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
    }

    const onDateRangeChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start?.format(dateFormat) ?? null);
        setEndDate(end?.format(dateFormat) ?? null);  
    }

    const onDepartmentChange = (value) => dispatch(setDepartment(value));

    const onScrapTypeChange = (type) => {
        setScrapType(type);
        dispatch(fetchScrapVarianceStartAsync(monthStart, monthEnd, department, type))
    }

    const onProgramScrapTypeChange = (type) => {
        setProgramScrapType(type);
        dispatch(fetchScrapVariancePerProgramStartAsync(startDate, endDate, department, type));
    }

    const onClick = () => fetch();

    //* Download Data
    const onDownload = async () => download(
            setDownloadLoading,
            programScrapType,
            department,
            startDate,
            endDate,
            monthStart,
            monthEnd)

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

    const btnOverlay = (
        <Menu>
            <Menu.Item key="export" icon={<DownloadOutlined />} onClick={onDownload} >
                Export
            </Menu.Item>   
            <Menu.Item key="targets">
                <a href="http://10.129.224.149/FMSB/SWOT/Targets.aspx" target="_blank" rel="noreferrer">Targets</a>
            </Menu.Item>
        </Menu>
    )

    return (
        <>
            <PageHeader
                className="site-page-header"
                title={`Performace Level 0 - 1: ${title} Scrap `}
            />
    
            <Content className="ma3 mt0">

                <Row gutter={[12,12]}>

                    <Col span={24}>

                        <div 
                            className="dib"
                            onMouseEnter={onMonthRangeMouseEnter}
                            onMouseLeave={onDateleave}>

                            <span className="mr2" >Month Range:</span>

                            <RangePicker 
                                picker="month" 
                                onChange={onMonthRangeChange} 
                                className="mr2" 
                                ranges={monthRange}
                                disabledDate={disabledDate}
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
                                onCalendarChange={onDateRangeChange}
                                className="mr2" 
                                format={dateFormat}
                                disabledDate={disabledDate}
                                style={dateBorderStyle}
                                ranges={dateRange}
                                defaultValue={[
                                    moment(startDate, dateFormat),
                                    moment(endDate, dateFormat)
                                ]} />

                        </div>
                        
                        <span className="mr2">Scrap:</span>
                        <Select 
                            defaultValue={department}
                            style={{ width: 120 }}
                            onChange={onDepartmentChange}
                            className="mr2">   
                                {  departmentList.map(({ area, dept }) => <Option key={area} value={area}>{dept}</Option>) }  
                        </Select>
                                        
                        <Dropdown.Button 
                            type="primary" 
                            onClick={onClick} 
                            overlay={btnOverlay} 
                            disabled={downloadLoading}>
                                { 
                                    downloadLoading 
                                        ? <Spin indicator={<LoadingOutlined style={{ fontSize: 15 }} spin />} /> 
                                        : 'Go' 
                                }
                        </Dropdown.Button>

                    </Col>

                </Row>

                <Row gutter={[12,12]}>  

                    <Col {...responsiveProps}>
                        <Card 
                            {...cardProps}
                            title={`Lvl 0: ${title} Scrap Variance (${monthStart} - ${monthEnd})`}
                            style={{...cardHeightStyle, ...monthBorderStyle}}
                            extra={<SelectScrapType 
                            onChange={onScrapTypeChange}
                            />}
                        >
                            <ScrapVarianceChart  />

                        </Card>         
                    </Col>

                    <Col {...responsiveProps}>
                        <Card 
                            {...cardProps}
                            title={`Lvl 0: PPMH Plant Wide Variance (${monthStart} - ${monthEnd})`}
                            style={{...cardHeightStyle, ...monthBorderStyle}}
                        >
                            <PlantPpmhChart/>
                        </Card>         
                    </Col>

                    <Col {...responsiveProps}>
                        <Card 
                            {...cardProps}
                            title={`Lvl 0: ${title} OAE, Downtime, Scrap (${startDate} - ${endDate})`}
                            style={{...cardHeightStyle, ...dateBorderStyle }}
                        >
                            <DeptKpiChart/>
                        </Card>         
                    </Col>

                </Row>

                <Row gutter={[12,12]}>  

                    <Col {...responsiveProps}>
                        <Card 
                            {...cardProps}
                            title={`Lvl 1: ${title} Scrap Variance per Program (${startDate} - ${endDate})`}
                            style={{...cardHeightStyle, ...dateBorderStyle }}
                            extra={<SelectScrapType onChange={onProgramScrapTypeChange} />}
                        >
                            <ScrapVarianceChartPerProgram/>
                        </Card>         
                    </Col>

                    <Col {...responsiveProps}>
                        <Card 
                            {...cardProps}
                            title={`Lvl 1: ${title} Department PPMH Variance (${monthStart} - ${monthEnd})`}
                            style={{...cardHeightStyle, ...monthBorderStyle}}
                        >
                            <PpmhVariancePerDeptChart/>
                        </Card>         
                    </Col>

                    <Col {...responsiveProps}>
                        <Card 
                            {...cardProps}
                            title={`Lvl 0: Downtime per Department (${startDate} - ${endDate})`}
                            style={{...cardHeightStyle, ...dateBorderStyle }}
                            extra={
                                <Link to="/dashboard/morningmeeting/downtime">Drilldown</Link>
                            }
                        >
                            <DowntimeChart isDrillDown={false}/>
                        </Card>         
                    </Col>

                </Row>
                
            </Content>      
        </>)

}

export default PerformanceLevel0Page;