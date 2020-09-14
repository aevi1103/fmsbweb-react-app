import React, { useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../../API'
import axios from 'axios';
import moment from 'moment'
import {
    Layout,
    Select,
    Form,
    Alert,
    PageHeader,
    Spin,
    Button,
    Space,
    Row,
    Col,
    message
} from 'antd'

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Option } = Select;

const iniitalState = {
    
    loading: false,
    eos: null,
    operators: [],
    operatorJobs: [],
    errorMsg: null,
    submitLoading: false,
    headerTitle: 'Machining Manning'

}

const reducer = (state = iniitalState, action) => {

    switch (action.type) {
        case 'SET_LOADING':     
            return { ...state, loading: action.payload }
        case 'SET_EOS':       
            return { ...state, eos: action.payload }
        case 'SET_OPERATORS':   
            return { ...state, operators: action.payload }
        case 'SET_OPERATOR_JOBS':  
            return { ...state, operatorJobs: action.payload }
        case 'SET_ERROR_MSG':  
            return { ...state, errorMsg: action.payload }
        case 'SET_HEADER_TITLE':     
            return { ...state, headerTitle: action.payload }
        case 'SET_SUBMIT_LOADING':    
            return { ...state, submitLoading: action.payload }  
        default:
            break;
    }

} 

const ManningPage = () => {

    const { eosId } = useParams();
    const [form] = Form.useForm();
    const [state, dispatch] = useReducer(reducer, iniitalState);

    useEffect(() => {

        dispatch({type: 'SET_LOADING', payload: true});

        axios.all([
            api.get(`/machining/eos/${eosId}?$expand=eolManning`),
            api.get(`/machining/operatorjob`),
            api.get(`/machining/operator`),
        ])
        .then(axios.spread((...responses) => {

            const eos = responses[0].data;
            const jobs = responses[1].data;
            const ops = responses[2].data;

            dispatch({type: 'SET_EOS', payload: eos})
            dispatch({type: 'SET_OPERATOR_JOBS', payload: jobs})
            dispatch({type: 'SET_OPERATORS', payload: ops})

            const { shiftDate, shiftname, line } = eos;
            const title = `Line ${line} Manning: ${moment(shiftDate).format('MM/DD/YYYY')} - Shift ${shiftname}`;

            document.title = title
            dispatch({type: 'SET_HEADER_TITLE', payload: title});

            //set form fields
            const { eolManning } = eos;
            const values = eolManning.flatMap(({ operatorJobId, operatorId }, i) => ({
                operatorJobId,
                operatorId
            }));

            const res = {
                operators: values
            }

            form.setFieldsValue(res);
            // form.setFieldsValue(values);

        }))
        .catch(err => dispatch({type: 'SET_ERROR_MSG', payload: err.message}))
        .finally(() => dispatch({type: 'SET_LOADING', payload: false}))

    }, [])

    const onFinish = values => {

        console.log(values)

        const { operators } = values;
        const body = operators.map(({ operatorId, operatorJobId }) => ({
            operatorId,
            operatorJobId,
            EolvsEosId: eosId
        }));

        dispatch({type: 'SET_SUBMIT_LOADING', payload: true})
        api.post('/machining/manning/collection', body)
            .then(response => {

                message.success('Manning successfully saved!');
                // form.resetFields();
                window.close();
            })
            .catch(err => dispatch({type: 'SET_ERROR_MSG', payload: err.message}))
            .finally(() => dispatch({type: 'SET_SUBMIT_LOADING', payload: false}))

    };

    const onRenderChildren = (fields, { add, remove }) => {

        return (

            <div>

                {fields.map(field => (

                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">

                    <Form.Item
                        {...field}
                        name={[field.name, 'operatorJobId']}
                        fieldKey={[field.fieldKey, 'OperatorJobId']}
                        rules={[{ required: true, message: 'Missing Job' }]}
                    >
                        <Select style={{ width: '15rem' }} placeholder="Select Job" >
                            {
                                state.operatorJobs.map(({ operatorJobId, job }) => 
                                    <Option key={operatorJobId} value={operatorJobId}>{job}</Option>)
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        {...field}
                        name={[field.name, 'operatorId']}
                        fieldKey={[field.fieldKey, 'OperatorId']}
                        rules={[{ required: true, message: 'Missing Operator' }]}
                    >
                        <Select style={{ width: '15rem' }} placeholder="Select Operator">
                            {
                                state.operators.map(({ operatorId, firstName, lastName }) => 
                                    <Option key={operatorId} value={operatorId}>{`${firstName} ${lastName}`}</Option>)
                            }
                        </Select>
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(field.name)} />

                    </Space>
                ))}

                <Form.Item>
                    <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        >
                        <PlusOutlined /> Add Operator
                    </Button>
                </Form.Item>

            </div>

        );

    }

    return (
        <React.Fragment>

            <PageHeader title={state.loading ? <span><Spin/> Loading...</span> : state.headerTitle}  />
            
                <Content className="ma3 mt0">
                
                {
                    state.loading 
                    ?   null
                    :   <Row gutter={[12,12]}>

                            <Col span={24}>
                                {
                                    state.errorMsg ? <Alert message={state.errorMsg} type="error" showIcon /> : null
                                }
                            </Col>

                            <Col xs={24} xl={8}>

                                <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" form={form}>
                                    <Form.List name="operators" children={onRenderChildren}></Form.List>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={state.submitLoading}>
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Form>
                            
                            </Col>

                        </Row>

                }

            </Content>
        </React.Fragment>
    )
}

export default ManningPage;