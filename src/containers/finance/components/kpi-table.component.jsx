import React from 'react';
import { useSelector } from 'react-redux';
import numeral from 'numeral';
import { 
    Table
 } from "antd";

 import Error from '../../../components/error-empty-container/error-empty-container.component'

const KpiTable = () => {

    const financeKpiErrorMsg = useSelector(({ morningMeeting }) => morningMeeting?.financeKpiErrorMsg) ?? null;
    const isFinanceKpiFetching = useSelector(({ morningMeeting }) => morningMeeting?.isFinanceKpiFetching) ?? false;
    const dailyKpi = useSelector(({ morningMeeting  }) => morningMeeting?.financeKpiCollection?.dailyKpi ) ?? [];

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

      const data = dailyKpi.map(({type, mtdCost, dailyAvgCost, unitsProduced, actualCostAbsorption, targetCostAbsorption, reachPercentAbsorption, comment}, i) => ({
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

    return financeKpiErrorMsg 
        ?  <Error errorMsg={financeKpiErrorMsg} /> 
        :  <Table 
              loading={isFinanceKpiFetching}
              columns={columns}
              dataSource={data}
              pagination={false} /> 
}

export default KpiTable;