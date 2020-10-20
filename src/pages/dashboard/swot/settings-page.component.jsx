import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import moment from 'moment'
import { useHistory, useParams } from 'react-router-dom';
import api from '../../../API'
import {
    useQuery
} from '../../../helpers/custom-hook'

import {
    fetchSwotStartAsync,
    setDept
} from '../../../redux/swot/swot.actions'

import { 
    Layout,
    PageHeader,
    Select,
    Form,
    Button,
    Alert,
    message,
    InputNumber,
    DatePicker,
    Checkbox 
 } from "antd";

const { Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;

const layout = {
    labelCol: {
        md: {
            span: 12
        },
        lg: {
            span: 6
        },
        xl: {
            span: 4
        }
    },
    wrapperCol: {
        md: {
            span: 12
        },
        lg: {
            span: 6
        },
        xl: {
            span: 4
        }

    }
};

const tailLayout = {
    wrapperCol: {
        md: { offset: 12, span: 12 },
        lg: { offset: 6, span: 6 },
        xl: { offset: 4, span: 4 },
    },
};

const dateFormat = 'MM/DD/YYYY';
const depts = ['Foundry', 'Machining', 'Anodize', 'Skirt Coat', 'Assembly'];
const disabledDate = current => current && current > moment().endOf('day');
const previousDay = moment().add(-1, 'day');

const initialValues = {
    showMonthlyCharts: true,
    lastMonths: 3,
    lastWeeks: 3,
    lastDays: 7,
    showLastSevenDays: true,
    take: 10,
    dateRange: [previousDay, previousDay],
    dept: null
}

const SwotSettingsPage = ({
    isSwotFetching,
    swotErrorMsg,
    fetchSwotStartAsync,
    setDept,
    dept
}) => {
    
    const query = useQuery();
    const history = useHistory();
    const { department } = useParams();

    const [form] = Form.useForm();
    const [lines, setLines] = useState([]);
    const [linesLoading, setLinesLoading] = useState(false);
    const [monthlyVisible, setMonthlyVisible] = useState(false);
    const [lastVisible, setLastVisible] = useState(false);
    const [lastDays, setLastDays] = useState(null);
    const [disabled, setDisabled] = useState(false);

    const qryStart = query.get('start');
    const qryEnd = query.get('end');
    const qryGetData = JSON.parse(query.get('getdata'));

    const getLines = async dept => {
        try {

            setLinesLoading(true);
            const response = await api.get(`/swot/lines/${dept}`);
            const data = await response.data;
            setLines(data);

            message.success(`${dept} lines successfully loaded`)
            
        } catch (error) {
            console.error(error);
        } finally {
            setLinesLoading(false);
        }
    }

    useEffect(() => {
        document.title = `SWOT Settings: ${department}`
    }, [department])

    useEffect(() => {

        if (!qryGetData) {
            form.setFieldsValue({ ...initialValues, dept });
            return;
        }

        if  (qryStart && qryEnd && department && qryGetData) {

            setDisabled(true);
            form.setFieldsValue({ 
                ...initialValues,
                dept: department,
                dateRange: [moment(qryStart, dateFormat), moment(qryEnd, dateFormat)]
            });

            form.submit();
        } 

    }, [])

    useEffect(() => {

        if (department && !qryGetData) {        
            setDept(department);  
            form.setFieldsValue({ ...initialValues, dept: department }); 
            getLines(department);
        }

    }, [department, form, qryGetData, setDept]) 

    useEffect(() => {
        setLastDays(initialValues.lastDays);
    }, [])

    const onDeptChange = value => {
        form.resetFields(['lines']);
        setDept(value);  
        history.replace(`/dashboard/swot/settings/${value}`)
    }

    const onFinish = values => {
        const { dept} = values;
        const fnSuccss = () => history.replace(`/dashboard/swot/${dept}`);
        fetchSwotStartAsync(values, fnSuccss);
    }

    const onMonthlyWeeklyChange = e => setMonthlyVisible(!e.target.checked);
    const onLastChange = e => setLastVisible(!e.target.checked);
    const onLastInputChange = value => setLastDays(value)

    return (
        <>
            <PageHeader
                className="site-page-header"
                title="SWOT Settings"
            />

            <Content className="ma3 mt0">

                <Form {...layout} form={form} onFinish={onFinish} >
                    
                    {
                        swotErrorMsg 
                            ? <Alert message={swotErrorMsg} type="error" showIcon className="mb3" /> 
                            : <span></span>
                    }

                    <Form.Item
                        label="Date Range"
                        name="dateRange"
                        rules={[{ required: true, message: 'Please input your date range' }]}
                    >
                        <RangePicker 
                            className="w-100" 
                            format={dateFormat} 
                            disabledDate={disabledDate}
                            disabled={disabled}
                            ranges={{
                                'Today': [moment(), moment()],
                                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                                'Last Week': [moment().subtract(6, 'days').startOf('week'), moment().subtract(6, 'days').endOf('week')],
                                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                                'Last 30 days': [moment().subtract(30, 'days').startOf('month'), moment()],
                                'MTD': [moment().startOf('month'), moment().add(-1, 'days')],
                                'YTD': [moment().startOf('year'), moment().add(-1, 'days')]
                              }} />
                    </Form.Item>

                    <Form.Item
                        label="Department"
                        name="dept"
                        rules={[{ required: true, message: 'Please select your department' }]}
                    >
                        <Select onChange={onDeptChange} disabled={disabled}>
                            {
                                depts.map(dept => (<Option key={dept}>{dept}</Option>))
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Lines"
                        name="lines"
                        help="If blank, it will get all lines"
                    >
                        <Select loading={linesLoading} mode="multiple" placeholder="Please select lines" disabled={disabled}>
                            {
                                lines.map(({line}) => (<Option key={line}>{line}</Option>))
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        {...tailLayout}
                        name="showMonthlyCharts"
                        valuePropName="checked"
                    >
                        <Checkbox onChange={onMonthlyWeeklyChange} disabled={disabled}>Show monthly / weekly charts</Checkbox>
                    </Form.Item>

                    <Form.Item
                        label="Months"
                        name="lastMonths"
                        hidden={monthlyVisible}
                        help="Number of previous months"
                    >
                        <InputNumber className="w-100" min={1} type="number" disabled={disabled}/>
                    </Form.Item>

                    <Form.Item
                        label="Weeks"
                        name="lastWeeks"
                        hidden={monthlyVisible}
                        help="Number of previous weeks"
                    >
                        <InputNumber className="w-100" min={1} type="number" disabled={disabled}/>
                    </Form.Item>

                    <Form.Item
                        {...tailLayout}
                        valuePropName="checked"
                        name="showLastSevenDays"
                    >
                        <Checkbox onChange={onLastChange} disabled={disabled}>Show last {lastDays} days charts</Checkbox>
                    </Form.Item>

                    <Form.Item
                        label="Days"
                        name="lastDays"
                        hidden={lastVisible}
                        help="Number of previous days"
                    >
                        <InputNumber className="w-100" min={1} type="number" onChange={onLastInputChange} disabled={disabled}/>
                    </Form.Item>

                    <Form.Item
                        label="Top"
                        name="take"
                        help="Top number of defects"
                    >
                        <InputNumber className="w-100" min={1} type="number" disabled={disabled}/>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" className="mr2" loading={isSwotFetching} disabled={linesLoading}>
                            Submit
                        </Button>
                    </Form.Item>

                </Form>

            </Content>
        </>
    )
}

const mapStateToProps = ({ swot }) => ({
    isSwotFetching: swot.isSwotFetching,
    swotErrorMsg: swot.swotErrorMsg,
    dept: swot.dept
})

const mapDispatchToProps = dispatch => ({
    fetchSwotStartAsync: (values, fnSuccess) => dispatch(fetchSwotStartAsync(values, fnSuccess)),
    setDept : dept => dispatch(setDept(dept))
})

export default connect(mapStateToProps, mapDispatchToProps)(SwotSettingsPage);
