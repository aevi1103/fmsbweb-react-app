import React, { useState, useEffect } from 'react'
import numeral from 'numeral'
import { connect } from 'react-redux'
import api from '../../../API'

import PassFailSelect from './pass-fail-select.component'
import CustomInputNumber from './custom-input-number.component'

import {
    Table,
    Input,
    Badge
} from 'antd';

const { TextArea } = Input;

const CheckSheetDataEntry = ({
    data = [],
    values = [],
    checkSheetSubMachine,
    checkSheetPart
}) => {

    const [isDisabled, setIsDisabled] = useState(false);


    useEffect(() => {       
        setIsDisabled(!(!!checkSheetSubMachine && !!checkSheetPart))
    }, [checkSheetSubMachine, checkSheetPart])

    const getCurrentValue = (record, i, type) => {
        const result = values.find(({ characteristicId, frequency }) => characteristicId === record.characteristicId && frequency === i);
        if (!result) return null;

        switch (type) {
            case 'number':
                return result.value;
            case 'bool':
                return result.valueBool;
            case 'comment':
                return result.comment;
            case 'timeStamp':
                return result.timeStamp;
            default:
                return null;
        }
    }

    const frequencies = [];
    const shiftHours = 8;
    

    for (let i = 1; i <= shiftHours; i++) {


        frequencies.push({
            title: `Hour ${i}`,
            dataIndex: `hour_${i}`,
            width: '6.5rem',
            key: `hour_${i}`,
            render: (text, record, index) => {

                const { frequency, displayAs: { display } } = record;

                if (display === 'Reference') return; 

                const mod = i % (frequency);

                if (frequency === 1) {

                    if (display === 'PassFail')  
                        return (<PassFailSelect 
                            isDisabled={isDisabled}
                            record={record} 
                            frequency={i} 
                            defaultTimeStamp={getCurrentValue(record, i, 'timeStamp')}
                            defaultComment={getCurrentValue(record, i, 'comment')}
                            defaultValue={getCurrentValue(record, i, 'bool')} />)

                    return <CustomInputNumber 
                                isDisabled={isDisabled} 
                                record={record} 
                                frequency={i} 
                                defaultTimeStamp={getCurrentValue(record, i, 'timeStamp')}
                                defaultComment={getCurrentValue(record, i, 'comment')}
                                defaultValue={getCurrentValue(record, i, 'number')} /> 
                }

                if (mod === 1) {

                    if (display === 'PassFail')  
                        return (<PassFailSelect 
                            isDisabled={isDisabled}
                            record={record} 
                            frequency={i} 
                            defaultTimeStamp={getCurrentValue(record, i, 'timeStamp')}
                            defaultComment={getCurrentValue(record, i, 'comment')}
                            defaultValue={getCurrentValue(record, i, 'bool')} />)

                    return <CustomInputNumber 
                                isDisabled={isDisabled} 
                                record={record} 
                                frequency={i} 
                                defaultTimeStamp={getCurrentValue(record, i, 'timeStamp')}
                                defaultComment={getCurrentValue(record, i, 'comment')}
                                defaultValue={getCurrentValue(record, i, 'number')} /> 
                }

                return;
                
            }
        })

    }

    const columns = [
        {
            title: 'Ref No',
            dataIndex: 'referenceNo',
            sorter: (a, b) => a.referenceNo.length - b.referenceNo.length,
            key: 'referenceNo',
            filters:  [...new Set(data.map(({ referenceNo }) => referenceNo))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.referenceNo.indexOf(value) === 0,
            fixed: 'left',
            width: '5rem'
        },
        {
            title: 'Characteristic',
            dataIndex: 'value',
            sorter: (a, b) => a.value.length - b.value.length,
            key: 'value',
            filters:  [...new Set(data.map(({ value }) => value))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.value.indexOf(value) === 0,
            fixed: 'left',
            width: '10rem'
        },
        {
            title: 'Gauge',
            dataIndex: 'gauge',
            sorter: (a, b) => a.gauge.length - b.gauge.length,
            key: 'gauge',
            filters:  [...new Set(data.map(({ gauge }) => gauge))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.gauge.indexOf(value) === 0,
            width: '10rem'
        },
        {
            title: 'Frequency',
            dataIndex: 'frequency',
            sorter: (a, b) => a.frequency - b.frequency,
            key: 'frequency',
            filters:  [...new Set(data.map(({ frequency }) => frequency))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.frequency.indexOf(value) === 0,
            width: '8rem',
            render: (text, record, index) => {
                return `Every ${record.frequency} hour${record.frequency > 1 ? 's' : ''}`
            },
        },
        {
            title: 'Min',
            dataIndex: 'min',
            key: 'min',
            sorter: (a, b) => a.min - b.min,
            filters:  [...new Set(data.map(({ min }) => min))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.min.indexOf(value) === 0,
            render: (text, record, index) => {

                const displayAs = record.displayAs.display;
                const val = record.min;

                switch (displayAs) {
                    case 'Percent':      
                        return numeral(val).format('0.00%');
                    case 'Degrees':      
                        return val ? <span>{val}&deg;</span> : null;
                    case 'NegativePositive':      
                        return `-${val}`;
                    case 'PassFail':      
                        return `Pass / Fail`;
                    case 'Reference':      
                        return val;
                    default:
                        return val
                }

            },
            width: '5rem'
        },
        {
            title: 'Nom',
            dataIndex: 'nom',
            key: 'nom',
            sorter: (a, b) => a.nom - b.nom,
            filters:  [...new Set(data.map(({ nom }) => nom))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.nom.indexOf(value) === 0,
            render: (text, record, index) => {

                const displayAs = record.displayAs.display;
                const val = record.nom;

                switch (displayAs) {
                    case 'Percent':      
                        return numeral(val).format('0.00%');
                    case 'Degrees':      
                    return val ? <span>{val}&deg;</span> : null;
                    case 'PassFail':   
                        return `-`;
                    case 'Reference':    
                        return `Ref`;
                    default:
                        return val
                }
                
            },
            width: '5rem'
        },
        {
            title: 'Max',
            dataIndex: 'max',
            sorter: (a, b) => a.max - b.max,
            filters:  [...new Set(data.map(({ max }) => max))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.max.indexOf(value) === 0,
            key: 'max',
            render: (text, record, index) => {

                const displayAs = record.displayAs.display;
                const val = record.max;

                switch (displayAs) {
                    case 'Percent':      
                        return numeral(val).format('0.00%');
                    case 'Degrees':      
                        return val ? <span>{val}&deg;</span> : null;
                    case 'NegativePositive':      
                        return `+${val}`;
                    case 'PassFail':    
                    case 'Reference':   
                        return `-`;
                    case 'Positive':      
                        return `+${val}`;
                    default:
                        return val
                }
                
            },
            width: '5rem'
        },
        {
            title: 'Display As',
            dataIndex: 'displayAs',
            sorter: (a, b) => a.displayAs.length - b.displayAs.length,  
            render: (text, record, index) => {
                return record.displayAs.display;
            },
            filters:  [...new Set(data.map(({ displayAs }) => displayAs.display))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.displayAs.display.indexOf(value) === 0,
            key: 'displayAs',
            width: '8rem'
        },
        {
            title: 'Helper Text',
            dataIndex: 'helperText',
            sorter: (a, b) => a.helperText.length - b.helperText.length,
            key: 'helperText',
            width: '10rem'
        },
        ...frequencies
    ]

    return <React.Fragment>
                <Table 
                    columns={columns}
                    dataSource={data}
                    size="middle"
                    bordered={true}
                    pagination={false}
                    scroll={{ x: 1500, y: 1500 }} />


            </React.Fragment>
        
}

const mapStateToProps = ({qualityCheckSheet}) => ({
    checkSheetSubMachine: qualityCheckSheet.checkSheetSubMachine,
    checkSheetPart: qualityCheckSheet.checkSheetPart,
})

export default connect(mapStateToProps)(CheckSheetDataEntry);