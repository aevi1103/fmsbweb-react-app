import React from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import { 
    Table
 } from "antd";

const KpiTable = ({isFinanceKpiFetching, financeKpiCollection}) => {

    const columns = [
        {
          title: 'Type',
          dataIndex: 'type'
        },
        {
          title: 'MTD Cost $',
          dataIndex: 'mtdCost'
        },
        {
            title: 'Daily Avg Cost $',
            dataIndex: 'dailyCost'
        },
        {
          title: 'Units Produced',
          dataIndex: 'units'
        },
        {
          title: `Actual Absorption (0'000) USD`,
          dataIndex: 'actual'
        },
        {
          title: `Target Absorption (0'000) USD`,
          dataIndex: 'target'
        },
        {
          title: `% Reached Absorption (0'000) USD`,
          dataIndex: 'reached'
        },
        {
          title: `Comments Absorption (0'000) USD`,
          dataIndex: 'com'
        },
      ];
      
      const renderTarget = (type, value) => {
        if (type === 'South Bend Scrap $' || type === 'Stores / MRO / Tooling $'){
          return numeral(value).format('$0,0.00');
        }
        return numeral(value).format('0,0.00'); 
      }

      const data = !financeKpiCollection 
                    ? [] 
                    : financeKpiCollection.dailyKpi.map(({type, mtdCost, dailyAvgCost,
                                                    unitsProduced, actualCostAbsorption,
                                                    targetCostAbsorption, reachPercentAbsorption,
                                                    comment}, i) => ({
        key: i,
        type: type,
        mtdCost: numeral(mtdCost).format('$0,0.00'),
        dailyCost: numeral(dailyAvgCost).format('$0,0.00'),
        units: numeral(unitsProduced).format('0,0'),
        actual: numeral(actualCostAbsorption).format('$0,0.00'),
        target: renderTarget(type, targetCostAbsorption),
        reached: reachPercentAbsorption + '%',
        com: comment
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

export default connect(mapStateToProps)(KpiTable);