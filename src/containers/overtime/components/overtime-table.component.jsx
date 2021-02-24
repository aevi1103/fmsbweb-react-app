import React from 'react';
import moment from 'moment';
import numeral from 'numeral'

/* this two components are kinda similar I know, but if I just use a single 
    radio button component it doesnt assign a default value as of the moment I dont 
    know why but I make a separate components for rows that has data it works...
    we can refactor this sometime in the future if we figure out why its doing that :(
*/

import TypesRadioWithDefault from './types-radio-with-default.component'
import TypesRadio from './types-radio.component'

import { Table } from "antd";

 const OvertimeTable = ({ data, loading, type, isTotal, date }) => {

    const dataSource = data.map((item, key) => ({ ...item, key }))

    let columns = [
        {
            title: 'Department',
            dataIndex: 'department',
            render: (text, { department }) => {
                return department?.departmentName;
            }
        },
        {
            title: 'Date Hired',
            dataIndex: 'dateHired',
            render: (text, { dateHired }) => {
                return moment(dateHired).format('M/D/YYYY');
            }
        },
        {
            title: 'Years of Service',
            dataIndex: 'yearsOfService',
            render: (text, { yearsOfService }) => {
                return numeral(yearsOfService).format('0,0.[00]')
            }
        },
        {
            title: 'Clock #',
            dataIndex: 'clockNumber'
        },
        {
            title: 'First Name',
            dataIndex: 'firstName'
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName'
        },
        {
            title: 'Hours',
            dataIndex: 'hours',
            render: (text, { hours }) => {
                return <span className={ hours > 0 ? 'red b' : '' }>{numeral(hours).format('0,0.[00]')}</span> 
            }
        }
    ]

    if (!isTotal) {

        columns.push({
            title: type,
            dataIndex: `${type}_${date}`,
            width: 250,
            render: (text, record) => {

                const { typeName } = record

                const props = {
                    record,
                    type
                }

                if (typeName) {
                    return <TypesRadioWithDefault {...props} />
                }

                return <TypesRadio {...props} />
            }
        })

        columns.push({
            title: 'Modified Date',
            dataIndex: 'overtimeModifiedDate',
            width: 300,
            render: (text, { overtimeModifiedDate }) => {
                return overtimeModifiedDate ? moment(overtimeModifiedDate).format('M/D/YY h:mm:ss A') : null
            }
        })
    }

    return <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        size="middle"
        bordered={true}
        pagination={false}
    />
 }

 export default OvertimeTable;