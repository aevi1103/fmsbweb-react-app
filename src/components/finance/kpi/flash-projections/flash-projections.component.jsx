import React from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import { 
    Table,
    Typography 
 } from "antd";
import moment from 'moment';

const { Text } = Typography;

const FlashProjectionsTable = ({isFinanceKpiFetching, financeKpiCollection}) => {

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
      
      const data = !financeKpiCollection 
                    ? [] 
                    : financeKpiCollection.monthlyFlashProjections.map(({year, monthNum,
                        sales1000, ebitda1000, capitalFcst, pistonScrapFcstCost,mroFcstCost }, i) => ({
        key: i,
        yr: year,
        month: moment().month(monthNum).format('MMMM'),
        sales: numeral(sales1000).format('$0,0.00'),
        ebitda: numeral(ebitda1000).format('$0,0.00'),
        capital: numeral(capitalFcst).format('$0,0.00'),
        scrap: numeral(pistonScrapFcstCost).format('$0,0.00'),
        mro: numeral(mroFcstCost).format('$0,0.00'),
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

export default connect(mapStateToProps)(FlashProjectionsTable);