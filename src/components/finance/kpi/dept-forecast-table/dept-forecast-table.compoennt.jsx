import React from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import { 
    Table
 } from "antd";
import moment from 'moment';

const DeptForecastTable = ({isFinanceKpiFetching, financeKpiCollection}) => {

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
      
      const data = !financeKpiCollection 
                    ? [] 
                    : financeKpiCollection.monthlyForecast.map(({year, monthNum, dept, 
                                                        totalUnitFcst, oaeFcst}, i) => ({
        key: i,
        yr: year,
        month: moment().month(monthNum).format('MMMM'),
        dept: dept,
        units: numeral(totalUnitFcst).format('0,0'),
        oae: oaeFcst + '%',
      }))

      const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
      }

    return (
        <Table 
                loading={isFinanceKpiFetching}
                columns={columns}
                dataSource={data}
                onChange={onChange}
                pagination={false} />     
    )
}

const mapStateToProps = ({ morningMeeting }) => ({
    isFinanceKpiFetching: morningMeeting.isFinanceKpiFetching,
    financeKpiCollection: morningMeeting.financeKpiCollection,
})

export default connect(mapStateToProps)(DeptForecastTable);