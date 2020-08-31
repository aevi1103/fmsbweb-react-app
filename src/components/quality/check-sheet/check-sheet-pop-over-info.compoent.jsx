import React, { useState, useEffect } from 'react'
import {
    Row,
    Col,
    Button,
    Alert
} from 'antd'
import moment from 'moment'
import numeral from 'numeral'

import ToloranceBar from './tolerance-bar.component'

import {
    getValidationStatusColorName
} from '../../../helpers/check-sheet-helpers'



const CheckSheetPopOverInfo = ({ 
    isPassFail,
    targets,
    state,
    onOpenModal,
    onOpenReCheckModal
}) => {

    const alertMsg = 'Input has been disabled because your in re-check mode, please enter data in re-check form.';
    const getTimeStamp = timeStamp => moment(timeStamp).format('MM/DD/YY hh:mm A');
    const getPassFail = valueBool => valueBool ? 'Pass' : 'Fail';
    const getNumber = number => numeral(number).format('0.0[0]');

    const [rechecks, setRechecks] = useState(state.item?.rechecks ?? []);

    useEffect(() => {

        const items = state.item?.rechecks ?? [];
        const sortedItems = items.sort((a,b) => a.reCheckId - b.reCheckId);
        setRechecks(sortedItems);

    }, [state.item])

    return <Row gutter={[12,12]} style={{width: '300px'}}>

            {
                rechecks.length > 0
                    ? <Alert style={{ width: '100%' }} message={alertMsg} type="info" showIcon />
                    : null
            }

            <ToloranceBar isPassFail={isPassFail} targets={targets} />

            {
                state.item?.comment
                    ?   <Col span={24}>
                            <b className="db">Comment:</b>
                            <p>{state.item?.comment}</p>
                        </Col>
                    : null
            }

            {
                rechecks.length > 0 
                    ?   <Col span={24}>
                            <b className="db mb2">Re-checks:</b>
                            <ol>
                                {
                                    rechecks.map(({ value, valueBool, timeStamp, isInitialValue }, key) => (isPassFail 
                                            ?   <li key={key} className={getValidationStatusColorName(valueBool, targets, isPassFail)}>
                                                    { `${getPassFail(valueBool)} @ ${getTimeStamp(timeStamp)}` } 
                                                    { isInitialValue ? <small className="ml2">(1st Check)</small> : null }
                                                </li>
                                            :   <li key={key} className={getValidationStatusColorName(value, targets, isPassFail)}>
                                                    { `${getNumber(value)} @ ${getTimeStamp(timeStamp)}` }
                                                    { isInitialValue ? <small className="ml2">(1st Check)</small> : null }
                                                </li>
                                    ))
                                }
                            </ol>

                        </Col>
                    : null
            }

            {
                state.item?.timeStamp
                ? <Col span={24}>
                    <b className="db">Last Updated:</b>
                    <span>{moment(state.item?.timeStamp).format('lll')}</span>
                </Col>
                : null
            }

            <Col span={24}>

                {
                    state.val !== null
                        ? <Button onClick={onOpenModal} type="primary" className="mr2">{ state.dot ? 'Edit Comment' : 'Add Comment' }</Button>
                        : null
                }
                
                {
                    state.validateStatus === 'error' || rechecks.length > 0 
                        ?  <Button type="danger" onClick={onOpenReCheckModal}>Add Re-Check</Button>
                        : null
                }

            </Col>

        </Row>
}

export default CheckSheetPopOverInfo;