import React, { useEffect, useState } from 'react'
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

import ProductionStatusContainer from '../../../components/production-status/production-status-container.component'

import {
    useQuery
} from '../../../helpers/custom-hook'

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
    message
 } from "antd";

const { Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;

const DepartmentDashboardPage = () => {

    //redux state
    const dispatch = useDispatch()
    const prodStatus = useSelector(({ productionStatus }) => productionStatus);
    const { dept, shift, productionStatus } = prodStatus;

    const [form] = Form.useForm();
    const history = useHistory();
    const qry = useQuery();

    const { department } = useParams();
    const qryShift = qry.get('shift') ?? shift;
    const qryStart = qry.get('start') ?? prodStatus?.dateRange[0];
    const qryEnd = qry.get('end') ?? prodStatus?.dateRange[1];

    const [headerTitle, setHeaderTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)

    //* update initial value
    useEffect(() => {

        form.setFieldsValue({
            dateRange: [moment(qryStart), moment(qryEnd)],
            shift: qryShift,
            dept: _.startCase(department ?? dept),
        });

        //* data on load
        form.submit();

    }, [qryStart, qryEnd, qryShift, department, dept, form])

    //* update URL
    useEffect(() => {
        const d = _.startCase(department ?? dept)
        history.push(`/dashboard/status/${d}?shift=${qryShift}&start=${moment(qryStart).format(dateFormat)}&end=${moment(qryEnd).format(dateFormat)}`);
        dispatch(setDepartment(d));
    }, [department, qryStart, qryEnd, qryShift, form, history, dept, dispatch])

    //* update header title
    useEffect(() => {

        const dr = qryStart === qryEnd 
                    ? moment(qryStart).format(dateFormat)
                    : `${moment(qryStart).format(dateFormat)} - ${moment(qryEnd).format(dateFormat)}`;

        setHeaderTitle(`${dept} Dashboard: ${dr} - Shift ${qryShift === '' ? 'All' : qryShift}`);

    }, [qryStart, qryEnd, qryShift, dept])

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
            dispatch(setDateRange([startStr, endStr]))
     
            history.push(`/dashboard/status/${dept}?shift=${shift}&start=${moment(start).format(dateFormat)}&end=${moment(end).format(dateFormat)}`);
            
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false);
        }

    }

    return (
        <>
            <PageHeader
                className="site-page-header"
                title={headerTitle}
                onBack={() => history.goBack() }
                extra={
                    <Form
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
                            <Select style={{ width: '7rem' }}>
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
                    productionStatus ? <ProductionStatusContainer /> : <span>No Data</span>
                }
                

            </Content>

        </>
    )
}

export default DepartmentDashboardPage;