import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
    setScrapModalVisible
} from '../../redux/production-status/production-status.action'

import ScrapChart from './charts/scrap-chart.component';

import {
    Modal
} from 'antd'

const ScrapParetoModal = () => {

    const dispatch = useDispatch();
    const visible = useSelector(({ productionStatus: { scrapModalVisible } }) => scrapModalVisible);

    const line = useSelector(({ productionStatus: { line } }) => line);
    const scrapCollection = useSelector(({ productionStatus: { scrapCollection } }) => scrapCollection);

    const caption = `${line} Scrap Pareto by Defect`
    const onCancel = () => dispatch(setScrapModalVisible(false));

    return (
        <Modal
          title={`${line}: Scrap Pareto`}
          visible={visible}
          onCancel={onCancel}
          width="60vw"
          footer={null}
        >
          <ScrapChart data={scrapCollection} caption={caption} height={500} isModal={true} />
        </Modal>
    )
}

export default ScrapParetoModal;