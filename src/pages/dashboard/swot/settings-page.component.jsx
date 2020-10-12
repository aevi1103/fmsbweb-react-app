import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import moment from 'moment'
import {useHistory } from 'react-router-dom';
import api from '../../../API'

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

const SwotSettingsPage = ({
    isSwotFetching,
    swotErrorMsg,
    fetchSwotStartAsync,
    setDept,
    dept
}) => {
    
    const history = useHistory();
    const [form] = Form.useForm();
    const [lines, setLines] = useState([]);
    const [linesLoading, setLinesLoading] = useState(false);

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

        const initialValues = {
            showMonthlyCharts: true,
            lastMonths: 3,
            lastWeeks: 3,
            lastDays: 7,
            showLastSevenDays: true,
            take: 10,
            dateRange: [moment().add(-1, 'day'), moment().add(-1, 'day')],
            dept
        }

        form.setFieldsValue(initialValues);

        if (dept) {
            getLines(dept)
        }

    }, [])

    const onDeptChange = value => {
        form.resetFields(['lines']);
        setDept(value);
        getLines(value)
    }

    const onFinish = values => {
        const { dept } = values;
        const fnSuccss = () => history.push(`/dashboard/swot/${dept}`);
        fetchSwotStartAsync(values, fnSuccss);
    }

    return (
        <>
            <PageHeader
                className="site-page-header"
                title="SWOT (WIP)"
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
                        <Select onChange={onDeptChange}>
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
                        <Select loading={linesLoading} mode="multiple" placeholder="Please select lines">
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
                        <Checkbox>Show monthly / weekly charts</Checkbox>
                    </Form.Item>

                    <Form.Item
                        label="Number of previous months"
                        name="lastMonths"
                    >
                        <InputNumber className="w-100" min={1} type="number" />
                    </Form.Item>

                    <Form.Item
                        {...tailLayout}
                        valuePropName="checked"
                        name="showLastSevenDays"
                    >
                        <Checkbox>Show last x days charts</Checkbox>
                    </Form.Item>

                    <Form.Item
                        label="Number of previous weeks"
                        name="lastWeeks"
                    >
                        <InputNumber className="w-100" min={1} type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Number of previous days"
                        name="lastDays"
                    >
                        <InputNumber className="w-100" min={1} type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Top"
                        name="take"
                        help="Top items to show in scrap or downtime pareto, if blank it will get all items"
                    >
                        <InputNumber className="w-100" min={1} type="number" />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" className="mr2" loading={isSwotFetching}>
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
