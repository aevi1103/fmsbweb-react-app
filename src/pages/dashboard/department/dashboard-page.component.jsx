import React, { useEffect, useState, useCallback } from 'react'
import _ from 'lodash'
import moment from 'moment'
import { useHistory, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import api from '../../../API'

import {
    setDepartment,
    setShift,
    setDateRange,
    setProductionStatus
} from '../../../redux/production-status/production-status.action'

import {
    setSiderCollapse
} from '../../../redux/home/home.actions'

import ProductionStatusContainer from '../../../components/production-status/production-status-container.component'

import {
    depts,
    dateFormat,
    disabledDate,
    dateRange,
    shifts
} from '../../../helpers/helpers'

import { 
    Layout,
    PageHeader,
    Form,
    Select,
    Button,
    DatePicker,
    message,
    Checkbox,
    Alert,
    Tooltip
 } from "antd";

const { Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;

const DepartmentDashboardPage = () => {

    //redux state
    const dispatch = useDispatch()
    const prodStatus = useSelector(({ productionStatus }) => productionStatus);
    const { productionStatus, dept } = prodStatus;

    const [form] = Form.useForm();
    const history = useHistory();
    let { department } = useParams();
    department = department ?? dept;

    const [headerTitle, setHeaderTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentShift, setCurrentShift] = useState(null);
    const [checked, setChecked] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(moment());
    const [intervalValue, setIntervalValue] = useState(null);

    //* 5 minutes
    const ms = 300000; //300000

    const getInitialData = useCallback(() => {

        api.get(`/dateshift/${department}`)
        .then(response => {

            setCurrentShift(response.data);

            const { shiftDate, shift } = response.data;
            dispatch(setDateRange([shiftDate, shiftDate]));
            dispatch(setShift(shift));

            form.setFieldsValue({
                dateRange: [moment(shiftDate), moment(shiftDate)],
                shift: shift,
                dept: _.startCase(department),
                autoUpdate: true
            });

            form.submit();
            dispatch(setSiderCollapse(true));
        })

    }, [department, dispatch, form])

    //* update doc title
    useEffect(() => {
        document.title = `${_.startCase(department)} Production Dashboard`
    }, [department])

    //* load data for current shift
    useEffect(() => {

        //* load initial data
        getInitialData();

        //* run every 5 minutes
        const interval = setInterval(getInitialData, ms); //300000
        setIntervalValue(interval);
        
        return () => clearInterval(interval);

    }, [department, getInitialData])

    //* update header title
    useEffect(() => {

        const { dept, shift, dateRange } = prodStatus;
        const [start, end] = dateRange;

        const dr = start === end 
                    ? moment(start).format(dateFormat)
                    : `${moment(start).format(dateFormat)} - ${moment(end).format(dateFormat)}`;

        setHeaderTitle(`${dept} Dashboard: ${dr} - Shift ${shift === '' ? 'All' : shift}`);

    }, [prodStatus])

    //* submit
    const onFinish = async values => {

        const { dateRange, dept, shift } = values;
        const [start, end] = dateRange;
        const startStr = moment(start).format(dateFormat);
        const endStr = moment(end).format(dateFormat);

        try {

            message.loading({ content: 'Loading...', key: dept });

            setLoading(true);
            let url = `/swot/hxh?StartDate=${startStr}&EndDate=${endStr}&Dept=${dept}`;
            if (shift) {
                url = url + `&Shift=${shift}`
            }

            const response = await api.get(url);

            message.success({ content: `${dept} production data successfully loaded`, key: dept, duration: 2 });

            dispatch(setProductionStatus(response.data));
            dispatch(setDepartment(_.startCase(dept)));
            dispatch(setShift(shift));
            dispatch(setDateRange([startStr, endStr]));

            setLastUpdate(moment());

        } catch (error) {
            setError(error)
        } finally {
            setLoading(false);
        }

    }

    const onChecked = e => {

        clearInterval(intervalValue);
        const isChecked = e.target.checked;
        setChecked(isChecked);

        let interval = null;

        if (isChecked) {
            interval = setInterval(getInitialData, ms);
            setIntervalValue(interval);
            message.success("Auto-Update Enabled");
        } else {
            clearInterval(intervalValue);
            message.info("Auto-Update Disabled");
        }

    }

    const onDeptChange = dept => {
        dispatch(setDepartment(_.startCase(dept)));
        history.push(`/dashboard/status/${dept.toLowerCase()}`);
    }

    return (
        <>
            <PageHeader
                className="site-page-header"
                title={headerTitle}
                subTitle={<div>
                    <span>Last Update: {moment(lastUpdate).format('lll')}</span>
                    <Tooltip title="Updates every 5 minutes, checking this will always update to current shift.">
                        <Checkbox className="ml2" checked={checked} onClick={onChecked} loading={loading} >Enable Auto-Update</Checkbox>
                    </Tooltip>    
                </div>}
                onBack={() => history.goBack()}
                extra={
                    <Form key="prodForm"
                        name="form"
                        layout="inline"
                        onFinish={onFinish}
                        form={form}
                    >
            
                        <Form.Item  
                            label="Date Range"
                            name="dateRange"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <RangePicker 
                                className="w-100" 
                                format={dateFormat} 
                                disabledDate={disabledDate}
                                ranges={dateRange} />
                        </Form.Item>
            
                        <Form.Item
                            name="dept"
                            label="Department"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Select style={{ width: '7rem' }} onChange={onDeptChange}>
                                {
                                    depts.map(dept => (<Option key={dept}>{dept}</Option>))
                                }
                            </Select>
                        </Form.Item>
            
                        <Form.Item
                            name="shift"
                            label="Shift"
                        >
                            <Select style={{ width: '4rem' }}>
                                {
                                    shifts.map(shift => (<Option key={shift === "All" ? "" : shift}>{shift}</Option>))
                                }
                            </Select>
                        </Form.Item>
            
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Go
                            </Button>
                        </Form.Item>
            
                    </Form>
                  }
            />

            <Content className="ma3 mt0">
                
                {
                    error ? <Alert message={error} type="error" showIcon /> : null
                }

                {
                    productionStatus 
                        ? <ProductionStatusContainer productionStatus={productionStatus} /> 
                        : <span>No Data</span>
                }

            </Content>

        </>
    )
}

export default DepartmentDashboardPage;