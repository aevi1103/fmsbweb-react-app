import React from 'react';
import numeral from 'numeral';
import moment from 'moment';
import { 
    Table,
    Typography 
 } from "antd";

const { Text } = Typography;

const FlashProjectionsTable = React.memo(({ data, loading }) => {

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
          title: `Sales ($1000)`,
          dataIndex: 'sales'
        },
        {
            title: `EBITDA ($1000)`,
            dataIndex: 'ebitda',
            render: (text, record, index) => {

                const val = text.replace('$','');

                if (parseFloat(val) < 0) {
                    return <Text type="danger">{numeral(val).format('$0,0.00')}</Text>
                } else {
                    return <Text className={{color: "#19a974"}} >{numeral(val).format('$0,0.00')}</Text>
                }

            }
        },
        {
            title: `Capital Forecast`,
            dataIndex: 'capital'
        },
        {
            title: `Piston Scrap $ Forecast`,
            dataIndex: 'scrap'
        },
        {
            title: `Stores / MRO / Tooling $ Forecast`,
            dataIndex: 'mro'
        }
      ];
      
      const dataSource = data.map(({year, monthNum, sales1000, ebitda1000, capitalFcst, pistonScrapFcstCost,mroFcstCost }, i) => ({
        key: i,
        yr: year,
        month: moment().month(monthNum).format('MMMM'),
        sales: numeral(sales1000).format('$0,0.00'),
        ebitda: numeral(ebitda1000).format('$0,0.00'),
        capital: numeral(capitalFcst).format('$0,0.00'),
        scrap: numeral(pistonScrapFcstCost).format('$0,0.00'),
        mro: numeral(mroFcstCost).format('$0,0.00'),
      }))

    return <Table 
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false} />   
})

export default FlashProjectionsTable;