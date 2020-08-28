import React from 'react'
import {
    Row,
    Col,
    Button
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
}) => (<Row gutter={[12,12]} style={{width: '300px'}}>

            <ToloranceBar isPassFail={isPassFail} targets={targets} />

            {
                state?.item?.comment
                    ?   <Col span={24}>
                            <b className="db">Comment:</b>
                            <p>{state.item?.comment}</p>
                        </Col>
                    : null
            }

            {
                (state.item?.rechecks.length ?? []) > 0 
                    ?   <Col span={24}>
                            <b className="db mb2">Re-checks:</b>
                            <ul>
                                {
                                    state.item.rechecks.map(({ value, valueBool, timeStamp }, key) => (isPassFail 
                                            ? <li key={key} className={getValidationStatusColorName(valueBool, targets, isPassFail)}>{`${valueBool ? 'Pass' : 'Fail'} @ ${moment(timeStamp).format('lll')}` }</li>
                                            : <li key={key} className={getValidationStatusColorName(value, targets, isPassFail)}>{`${numeral(value).format('0.0[0]')} @ ${moment(timeStamp).format('lll')}` }</li>
                                    ))
                                }
                            </ul>

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
                    state.validateStatus === 'error' 
                        ?  <Button type="danger" onClick={onOpenReCheckModal}>Add Re-Check</Button>
                        : null
                }

            </Col>

        </Row>)

export default CheckSheetPopOverInfo;