import React, { useEffect, useReducer } from 'react'
import moment from 'moment';
import api from '../../../API'
import axios from 'axios'

import DateRangePicker from '../../../components/date-range-picker/date-range-picker.component'
import CheckSheetHistoryTable from '../../../components/quality/history/check-sheet-history-table.component'

import { 
    Layout,
    PageHeader,
    Select,
    Button,
    Row,
    Col
 } from "antd";

const { Content } = Layout;
const { Option } = Select;

const dateFormat = 'MM/DD/YYYY';

const initialState = {
    startDate: moment().add(-1, 'd'),
    endDate: moment(),
    errors: [],
    loading: false,
    initialLoading: false,
    history: [],
    controlMethods: [],
    lines: [],
    controlMethod: null,
    line: null
}

const reducer = (state = initialState, action) => {
    
    switch (action.type) {
        case 'SET_START_DATE':        
            return { ...state, startDate: action.payload }
        case 'SET_END_DATE':        
            return { ...state, endDate: action.payload }
        case 'SET_ERROR':        
            return { ...state, error: action.payload }
        case 'SET_LOADING_HISTORY':        
            return { ...state, loading: action.payload }
        case 'SET_LOADING':        
            return { ...state, initialLoading: action.payload }
        case 'SET_CONTROL_METHODS':        
            return { ...state, controlMethods: action.payload }
        case 'SET_LINES':        
            return { ...state, lines: action.payload }
        case 'SET_CONTROL_METHOD':        
            return { ...state, controlMethod: action.payload }
        case 'SET_LINE':        
            return { ...state, line: action.payload }
        case 'SET_HISTORY':        
            return { ...state, history: action.payload }
        default:
            return state;
    }

}

const CheckSheetHistoryPage = () => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const getHistory = async () => {

        const startIso = moment(state.startDate.format(dateFormat), dateFormat).toISOString();
        const endIso = moment(state.endDate.format(dateFormat), dateFormat).toISOString();

        try {
            
            let qry = '/quality/checksheets/checksheet';
            qry += '?$expand=checkSheetEntries,controlMethod,line,organizationPart&'
            qry += `$filter=shiftDate ge ${startIso} and shiftDate le ${endIso} `;

            if (state.controlMethod) {
                qry += `and controlMethodId eq ${state.controlMethod}`
            }

            if (state.line) {
                qry += `and lineId eq ${state.line}`
            }

            dispatch({ type: 'SET_LOADING_HISTORY', payload: true });
            const response = await api.get(qry);
            const data = response.data.map((i, key) => ({ ...i, key }))
            dispatch({ type: 'SET_HISTORY', payload: data })

        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: appendError('history', error) });
        } finally {
            dispatch({ type: 'SET_LOADING_HISTORY', payload: false });
        }

    }

    useEffect(() => {

        dispatch({ type: 'SET_LOADING', payload: true })

        axios.all([
            api.get('/quality/checksheets/controlmethod'),
            api.get('/quality/checksheets/line')
        ])
        .then(axios.spread((...responses) => {

            dispatch({ type: 'SET_CONTROL_METHODS', payload: responses[0].data })
            dispatch({ type: 'SET_LINES', payload: responses[1].data })

        }))
        .catch(errors =>  {
            errors.forEach((error, i) => dispatch({ type: 'SET_ERROR', payload: appendError(`init_${i}`, error) }))     
        })
        .finally(() => dispatch({ type: 'SET_LOADING', payload: false }));

        getHistory();

    }, [])

    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        dispatch({ type: 'SET_START_DATE', payload: start });
        dispatch({ type: 'SET_END_DATE', payload: end })
    };

    const appendError = (key, error) => {
        const errors = state.errors.filter(e => e.key !== key);
        errors.push({ key, error });
        return errors;
    }

    const onButtonClick = () => getHistory();

    const onControleMethodChange = value => dispatch({ type: 'SET_CONTROL_METHOD', payload: value });
    const onLineChange = value => dispatch({ type: 'SET_LINE', payload: value });

    return (
        <>
            <PageHeader
                className="site-page-header"
                title="Check Sheet and Inspection Summary History"
            />

            <Content className="ma3 mt0">
                    
                <Row gutter={[16,16]}>
                    <Col span={24}>

                        <DateRangePicker 
                            dateRangeValue={{startDate: state.startDate, endDate: state.endDate}}
                            onCalendarChange={onCalendarChange}
                            isRenderButton={false}  />

                        <Select loading={state.initialLoading} 
                                className="mr2" 
                                style={{width: '13rem'}} 
                                onChange={onControleMethodChange} 
                                allowClear={true} >
                            {
                                state.controlMethods.map(({ controlMethodId, method }) => (
                                    <Option key={controlMethodId} value={controlMethodId}>{method}</Option>
                                ))
                            }
                        </Select>

                        <Select loading={state.initialLoading} 
                                className="mr2" 
                                style={{width: '4rem'}} 
                                onChange={onLineChange}
                                allowClear={true} >
                            {
                                state.lines.map(({ lineId, value }) => (
                                    <Option key={lineId} value={lineId}>{value}</Option>
                                ))
                            }
                        </Select>

                        <Button type="primary" onClick={onButtonClick}>Go</Button>
                    </Col>

                    <Col span={24}>
                        <CheckSheetHistoryTable data={state.history} loading={state.loading} /> 
                    </Col>


                </Row>

            </Content>
        </>
    )
}

export default CheckSheetHistoryPage;