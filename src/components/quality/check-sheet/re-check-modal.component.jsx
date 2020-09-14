import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { PlusOutlined } from '@ant-design/icons';
import ToloranceBar from './tolerance-bar.component'
import ReCheckInput from './re-check-input.component'
import api from '../../../API'
import shortid from 'shortid'


import {
    setReChecksCollection
} from '../../../redux/quality-check-sheet/quality-check-sheet.actions.js'

import {
    Modal,
    Button,
    Row,
    Col,
    Spin,
    Alert
} from 'antd'


const ReCheckModal = ({
    visible,
    onCloseModal,
    checkSheetEntryId,
    characteristic,
    isPassFail = false,
    targets,

    setReChecksCollection,
    reChecksCollection,
    isCheckSheetReadOnly
}) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (visible) {

            setLoading(true);
            api.get(`/quality/checksheets/rechecks?$filter=checkSheetEntryId eq ${checkSheetEntryId}`)
            .then(response => {        
                const result = response.data.map(i => ({ ...i, key: shortid.generate() }))
                setReChecksCollection(result);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))

        } 

        return () => setReChecksCollection([]);

    }, [checkSheetEntryId, visible, setReChecksCollection])

    const add = () => {

        const newArr = reChecksCollection;
        newArr.push({
            reCheckId: 0,
            checkSheetEntryId,
            value: null,
            valueBool: null,
            comment: null
        });

        const res = newArr.map(i => ({...i, key: shortid.generate() }));
        setReChecksCollection(res)

    }

    return <Modal
        // width="40%"
        title={`Re-Checks: ${characteristic}`}
        visible={visible}
        onCancel={onCloseModal}
        footer={[
            <Button key="back" onClick={onCloseModal}>
                Close
            </Button>
        ]}
    >

        <Row gutter={[12,12]}>
        
            {
                error 
                ?   <Col span={24}>
                        <Alert message={error} type="error" showIcon />
                    </Col>
                : null
            }

            <Col span={24}>
                <ToloranceBar isPassFail={isPassFail} targets={targets} style={{ padding: 0, marginBottom: '1rem' }}  />
            </Col>

            {
                loading 

                ?   <Col span={24}>
                        <span><Spin /> Loading...</span>
                    </Col>
                
                : reChecksCollection.map(item => <ReCheckInput 
                    key={item.key} 
                    item={item} 
                    isPassFail={isPassFail}
                    targets={targets}
                    checkSheetEntryId={checkSheetEntryId} />)
            }

            <Col span={24}>
                <Button
                    disabled={isCheckSheetReadOnly}
                    type="dashed"
                    onClick={add}
                    block
                >
                    <PlusOutlined /> Add field
                </Button>
            </Col>

        </Row>

    </Modal> 
}

const mapDispatchToProps = dispatch => ({
    setReChecksCollection: items => dispatch(setReChecksCollection(items))
});

const mapStateToProps = ({ qualityCheckSheet }) => ({
    reChecksCollection: qualityCheckSheet.reChecksCollection,
    isCheckSheetReadOnly: qualityCheckSheet.isCheckSheetReadOnly
})

export default connect(mapStateToProps, mapDispatchToProps)(ReCheckModal);