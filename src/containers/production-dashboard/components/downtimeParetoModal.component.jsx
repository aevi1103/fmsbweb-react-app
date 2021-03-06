import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
    setDowntimeModalVisible
} from '../../../core/redux/production-status/production-status.action'

import DowntimeByMachineChart from './downtime-by-machine-chart.component';
import DowntimeByReasonChart from './downtime-by-reason-chart.component';

import {
    Modal,
    Row,
    Col
} from 'antd'

const HxHParetoModal = () => {

    const dispatch = useDispatch();
    const visible = useSelector(({ productionStatus: { downtimeModalVisible } }) => downtimeModalVisible);
    const line = useSelector(({ productionStatus: { line } }) => line);
    const downtimeByMachine = useSelector(({ productionStatus: { downtimeByMachine } }) => downtimeByMachine);
    const downtimeByReason = useSelector(({ productionStatus: { downtimeByReason } }) => downtimeByReason);

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
                    <DowntimeByMachineChart data={downtimeByMachine} height={350} isModal={true} modalCaption={machineCaption} />
                </Col>
                <Col span={24}>
                    <DowntimeByReasonChart data={downtimeByReason} height={350} isModal={true} modalCaption={reasonCaption} />
                </Col>
            </Row>
            
        </Modal>
    )
}

export default HxHParetoModal;