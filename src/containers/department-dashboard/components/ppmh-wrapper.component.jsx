import React from 'react'
import moment from 'moment'
import axios from 'axios'
import { useDispatch } from 'react-redux'

import {
    setPpmhChartType,
    fetchPpmhStartAsync,
    fetchWeeklyLaborHrsStartAsync
} from '../../../core/redux/department-dashboard/department-dashboard.actions'

import WeeklyPpmhChart from './weekly-ppmh-chart.component';
import PpmhPerShiftChart from './ppmh-per-shift-chart.component';

import { dateFormat } from '../../../core/utilities/helpers'

import { 
    Col,
    Card,
    Tooltip,
    Select
} from 'antd'

const { Option } = Select;

const PpmhWrapper = React.memo(({
    responsiveProps,
    cardHeightStyle,
    loading,
    area,
    startDate,
    endDate,
    ppmhChartType
}) => {

    const dispatch = useDispatch();
    const onPpmhChartTypeChange = (value) => {

        dispatch(setPpmhChartType(value))
        const tokenSrc = axios.CancelToken.source();
        
        if (value === 'ppmhByShift') {
            dispatch(fetchPpmhStartAsync(startDate, endDate, area, tokenSrc))
        } else {        
            const laborHoursStart = moment(startDate, dateFormat).add(-9, 'w').startOf('week').format(dateFormat);
            dispatch(fetchWeeklyLaborHrsStartAsync(laborHoursStart, endDate, area, tokenSrc)); 
        }
    };

    return (
        <Col {...responsiveProps}>

            <Card 
                title={ppmhChartType === 'ppmhByShift' ? `PPMH by Shift (${startDate} - ${endDate})` : 'Weekly PPMH (Kronos)'}
                size="small"
                style={cardHeightStyle}
                className="b--black-10"
                loading={loading}
                extra={
                    <Tooltip title="Select PPMH Chart type">
                        <Select defaultValue={ppmhChartType} style={{ width: 135 }} bordered={false} size="small" onChange={onPpmhChartTypeChange}>
                            <Option value="ppmhByShift">PPMH by Shift</Option>
                            <Option value="weeklyPpmh">Weekly PPMH</Option>
                        </Select>
                    </Tooltip>                      
                }
            >
                {
                    ppmhChartType === 'ppmhByShift' 
                        ? <PpmhPerShiftChart/>
                        : <WeeklyPpmhChart/>
                }
            </Card>

        </Col>
    )
})

export default PpmhWrapper;