import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
    setHxHModalVisible
} from '../../../core/redux/production-status/production-status.action'

import HourlyProductionChart from './hourly-prod-chart.component'

import {
    Modal
} from 'antd'

const HxHParetoModal = () => {

    const dispatch = useDispatch();
    const visible = useSelector(({ productionStatus: { hxhModalVisible } }) => hxhModalVisible);
    const line = useSelector(({ productionStatus: { line } }) => line);
    const hxhCollection = useSelector(({ productionStatus: { hxhCollection } }) => hxhCollection);
    const target = useSelector(({ productionStatus: { target } }) => target);

    const onCancel = () => dispatch(setHxHModalVisible(false));

    return (
        <Modal
          title={`${line}: Hourly Production`}
          visible={visible}
          onCancel={onCancel}
          footer={null}
          width="90vw"
        >
          <HourlyProductionChart 
            data={hxhCollection} 
            target={target} 
            caption={`${line} Hourly Production`}
            height={500}
            isModal={true} />

        </Modal>
    )
}

export default HxHParetoModal;