import React, { useState, useEffect } from 'react'
import numeral from 'numeral'
import { connect } from 'react-redux'

import CheckSheetInput from './check-sheet-input.component'
import InspectionSummaryReCheckInput from './inspection-summary-recheck.component'
import { useWindowSize } from 'react-use'

import {
    Table,
    Alert
} from 'antd';

const CheckSheetDataEntry = ({
    checkSheetSubMachine,
    checkSheetPart,
    checkSheetValues,

    checkSheet,
    csCharacteristicsCollection,
    isCsCharacteristicsLoading,
    csCharacteristicsErrorMsg,
    isCheckSheetReadOnly
}) => {

    const [isDisabled, setIsDisabled] = useState(false);
    const {width, height} = useWindowSize();
    const [scroll, setScroll] = useState()

    useEffect(() => {
        
        setScroll({
            x: '100%',
            y: height * .8
        })

    }, [height, width])

    useEffect(() => {       
        setIsDisabled(!(!!checkSheetSubMachine && !!checkSheetPart))
    }, [checkSheetSubMachine, checkSheetPart])

    const controlMethodId = checkSheet?.controlMethodId ?? null;
    const characteristics = csCharacteristicsCollection ?? [];
    const data = characteristics.length > 0 ?  characteristics : [];

    const frequencies = [];
    const shiftHours = 8;

    const getValue = (values, record, index) => values.find(({ characteristicId, frequency }) => characteristicId === record.characteristicId && frequency === index);
    
    for (let i = 1; i <= shiftHours; i++) {


        const title = controlMethodId === 1 
                        ? `Hour ${i}`
                        : i === 1 
                            ? '1st Check' 
                            : `Recheck ${i-1}`

        frequencies.push({
            title: title,
            dataIndex: `hour_${i}`,
            width: '6.5rem',
            key: `hour_${i}`, 
            render: (text, record, index) => {

                const { frequency, displayAs: { display } } = record;
                if (display === 'Reference') return; 

                const isPassFail = display === 'PassFail' ? true : false;

                const mod = i % frequency;
                if (frequency === 1 || mod === 1) {

                    const value = getValue(checkSheetValues, record, i);

                    return <CheckSheetInput 
                                isDisabled={isDisabled || isCheckSheetReadOnly} 
                                record={record} 
                                frequency={i} 
                                isPassFail={isPassFail}
                                item={value}/> 

                }

                //* render only in Inspection summary page
                if (controlMethodId === 2) {

                    //! always get hour 1 item only if the control method is inspection summary
                    const value = getValue(checkSheetValues, record, 1);

                    return <InspectionSummaryReCheckInput 
                                isPassFail={isPassFail}
                                frequency={i} 
                                item={value}
                                record={record} 
                                isDisabled={isDisabled || isCheckSheetReadOnly} 
                                />
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
            width: '11rem'
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
                    case 'Micron':      
                        return <span>{val} &micro;m</span>;
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
                    case 'Micron':      
                        return <span>{val} &micro;m</span>;
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
                    case 'Micron':      
                        return <span>{val} &micro;m</span>;
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

    return csCharacteristicsErrorMsg 
            ?   <Alert message={csCharacteristicsErrorMsg} type="error" showIcon /> 
            :   <Table 
                    loading={isCsCharacteristicsLoading}
                    columns={columns}
                    dataSource={data}
                    size="middle"
                    bordered={true}
                    pagination={false}
                    scroll={scroll} />
        
}

const mapStateToProps = ({qualityCheckSheet}) => ({
    isCheckSheetReadOnly: qualityCheckSheet.isCheckSheetReadOnly,

    checkSheetSubMachine: qualityCheckSheet.checkSheetSubMachine,
    checkSheetPart: qualityCheckSheet.checkSheetPart,
    checkSheetValues: qualityCheckSheet.checkSheetValues,

    checkSheet: qualityCheckSheet.checkSheet,
    csCharacteristicsCollection: qualityCheckSheet.csCharacteristicsCollection,
    isCsCharacteristicsLoading: qualityCheckSheet.isCsCharacteristicsLoading,
    csCharacteristicsErrorMsg: qualityCheckSheet.csCharacteristicsErrorMsg
})

export default connect(mapStateToProps)(CheckSheetDataEntry);