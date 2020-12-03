import React, { useState } from 'react';
import numeral from 'numeral';
import { 
    Table,
    Button,
    Tooltip,
    Modal
 } from "antd";

import { numberSorter, percentSorter } from '../../../core/utilities/helpers'
import ScrapByCodeChart from '../../../components/scrap-by-code-chart/scrap-by-code-chart.component'

const ScrapByCodeTable = React.memo(({
    scrapData,
    isLoading,
    otherProps
  }) => {

    const [modalTitle, setModalTitle] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [scrapChartData, setScrapChartData] = useState([]);

    const onModalCancel = () => setModalVisible(false);
    const onModalShow = (area, scrapType, scrapData) => {
      setModalTitle(`${scrapType} Scrap Found in ${area} Scrap Pareto`);
      setModalVisible(true);
      setScrapChartData(scrapData);
    }

    const columns = [
        {
          title: 'Area Found',
          dataIndex: 'area',
          sorter: (a, b) => a.area.length - b.area.length,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: 'Scrap Type',
          dataIndex: 'type',
          sorter: (a, b) => a.type.length - b.type.length,
          sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            sorter: (a, b) => numberSorter(a.qty, b.qty),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
              const { type, area, details } = record;
              return <Tooltip title="Click to see details">
                        <Button type="link" onClick={() => onModalShow(area, type, details)}>
                            <span>{text}</span>
                        </Button> 
                    </Tooltip>
          },
        },
        {
          title: 'Scrap Rate',
          dataIndex: 'rate',
          sorter: (a, b) => percentSorter(a.rate, b.rate),
            sortDirections: ['descend', 'ascend'],
        },
      ];
      
      const data = scrapData.map(({area, scrapAreaName, qty, scrapRate, details}, i) => ({
        key: i,
        area: area,
        type: scrapAreaName,
        qty: numeral(qty).format('0,0'),
        rate: numeral(scrapRate).format('0.00%'),
        details: details.map(({ scrapCode, scrapDesc, qty }) => ({ scrapCode, scrapDesc, qty }))
      }))

    return (
        <>
          <Table loading={isLoading}
            columns={columns}
            dataSource={data}
            pagination={false}
            {...otherProps} /> 

            <Modal
                title={modalTitle}
                visible={modalVisible}
                onCancel={onModalCancel}
                width="80%"
                // height="100px"
                footer={[
                    <Button key="back" onClick={onModalCancel}>
                      Close
                    </Button>
                  ]}>

                    <ScrapByCodeChart chartData={scrapChartData} />

            </Modal>
        </>
            
    )
})

 export default ScrapByCodeTable;