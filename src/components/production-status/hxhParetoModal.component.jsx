import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
    setHxHModalVisible
} from '../../redux/production-status/production-status.action'

import HourlyProductionChart from './charts/hourly-prod-chart.component'

import {
    Modal
} from 'antd'

const HxHParetoModal = () => {

    const dispatch = useDispatch();
    const visible = useSelector(({ productionStatus: { hxhModalVisible } }) => hxhModalVisible);
    const line = useSelector(({ productionStatus: { line } }) => line);
    const lines = useSelector(({ productionStatus: { productionStatus } }) => productionStatus.lines);

    const [data, setData] = useState([]);
    const [target, settarget] = useState({});

    useEffect(() => {

        const { hourlyDetails, swotTarget } = lines?.find(({ machineName }) => machineName === line) || {};
        setData(hourlyDetails ?? []);
        settarget(swotTarget ?? {});
        
      }, [line, lines])

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
            data={data} 
            target={target} 
            caption={`${line} Hourly Production`}
            height={500}
            isModal={true} />

        </Modal>
    )
}

export default HxHParetoModal;