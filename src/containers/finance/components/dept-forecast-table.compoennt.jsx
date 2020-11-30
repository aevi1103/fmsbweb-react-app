import React from 'react';
import { useSelector } from 'react-redux';
import numeral from 'numeral';
import { 
    Table
 } from "antd";
import moment from 'moment';

import Error from '../../../components/error-empty-container/error-empty-container.component'

const DeptForecastTable = () => {

    const financeKpiErrorMsg = useSelector(({ morningMeeting }) => morningMeeting?.financeKpiErrorMsg) ?? null;
    const isFinanceKpiFetching = useSelector(({ morningMeeting }) => morningMeeting?.isFinanceKpiFetching) ?? false;
    const monthlyForecast = useSelector(({ morningMeeting  }) => morningMeeting?.financeKpiCollection?.monthlyForecast ) ?? [];

    const columns = [
        {
            title: 'year',
            dataIndex: 'yr'
        },
        {
          title: 'Month',
          dataIndex: 'month'
        },
        {
          title: 'Department',
          dataIndex: 'dept'
        },
        {
            title: 'Total Units Forecast',
            dataIndex: 'units'
        },
        {
          title: 'OAE Forecast',
          dataIndex: 'oae'
        }
      ];
      
      const data = monthlyForecast.map(({ year, monthNum, dept, totalUnitFcst, oaeFcst }, i) => ({
        key: i,
        yr: year,
        month: moment().month(monthNum).format('MMMM'),
        dept: dept,
        units: numeral(totalUnitFcst).format('0,0'),
        oae: oaeFcst + '%',
      }))

    return financeKpiErrorMsg 
        ?  <Error errorMsg={financeKpiErrorMsg} /> 
        :  <Table 
                loading={isFinanceKpiFetching}
                columns={columns}
                dataSource={data}
                pagination={false} />     
    
}


export default DeptForecastTable;