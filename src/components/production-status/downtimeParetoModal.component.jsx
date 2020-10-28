import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
    setDowntimeModalVisible
} from '../../redux/production-status/production-status.action'

import DowntimeByMachineChart from './charts/downtime-by-machine-chart.component';
import DowntimeByReasonChart from './charts/downtime-by-reason-chart.component';

import {
    Modal,
    Row,
    Col
} from 'antd'

const HxHParetoModal = () => {

    const dispatch = useDispatch();
    const visible = useSelector(({ productionStatus: { downtimeModalVisible } }) => downtimeModalVisible);
    const line = useSelector(({ productionStatus: { line } }) => line);
    const lines = useSelector(({ productionStatus: { productionStatus } }) => productionStatus.lines);

    const [machineData, setMachineData] = useState([]);
    const [reasonData, setReasonData] = useState([])

    useEffect(() => {

        const { downtimeDetails } = lines?.find(({ machineName }) => machineName === line) || {};
        const { detailsByMachine, detailsByReason } = downtimeDetails || {};

        setMachineData(detailsByMachine ?? []);
        setReasonData(detailsByReason ?? []);
        
      }, [line, lines])

    const onCancel = () => dispatch(setDowntimeModalVisible(false));

    const machineCaption = `${line} Downtime Pareto by Machine`;
    const reasonCaption = `${line} Downtime Pareto by Reason`

    return (
        <Modal
          title={`${line}: Downtime Pareto`}
          visible={visible}
          onCancel={onCancel}
          width="60vw"
          footer={null}
        >

            <Row gutter={[10,10]}>
                <Col span={24}>
                    <DowntimeByMachineChart data={machineData} height={350} isModal={true} modalCaption={machineCaption} />
                </Col>
                <Col span={24}>
                    <DowntimeByReasonChart data={reasonData} height={350} isModal={true} modalCaption={reasonCaption} />
                </Col>
            </Row>
            
        </Modal>
    )
}

export default HxHParetoModal;