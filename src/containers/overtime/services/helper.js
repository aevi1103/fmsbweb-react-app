import { AddOrUpdate, deleteRecord } from './api'
import { store } from '../../../core/redux/store'
import { setOvertimeCollection } from '../services/overtime.slice'

export const getOptions = type => {

    return [
        { label: 'Reset', value: 'Reset' },
        { label: 'Asked', value: 'Asked' },
        { label: type, value: type }
    ]
}

const updateState = (responseData, record, type) => {

    const { dispatch } = store;
    const { overtime } = store.getState();
    const { overtimeCollection } = overtime;

    const { overtimeId, hours, modifiedDate } = responseData;

    //* mutate record object
    record.overtimeId = type === 'Reset' ? 0 : overtimeId;
    record.hours = type === 'Reset' ? 0 : hours;
    record.overtimeModifiedDate = type === 'Reset' ? null : modifiedDate;

    const copyOfCollection = [...overtimeCollection];

    const indexOfClockNumber = copyOfCollection.findIndex(item => item.clockNumber === record.clockNumber);
    copyOfCollection.splice(indexOfClockNumber, 1, record);

    dispatch(setOvertimeCollection(copyOfCollection))
}

const postDataOnChange = async (type, record) => {

    const {
        overtimeId,
        parameterDate,
        clockNumber
    } = record;

    if (type === 'Reset' && overtimeId > 0) {
        const response = await deleteRecord(overtimeId);
        console.log('reset', response.data)
        updateState(response.data, record, type)
        return;
    }

    const response = await AddOrUpdate({
        overtimeId,
        date: parameterDate,
        typeName: type,
        clockNumber,
        hours: type === 'Asked' ? 0 : 8,
        modifiedDate: new Date()
    })

    console.log('add/update', response.data)

    updateState(response.data, record, type)

}

export const onTypeChange = (event, setValue, record) => {

    console.log(record)

    const { target } = event;
    const value = target.value;

    if (value === 'Reset') {
        setValue(null)
        postDataOnChange(value, record)
        return;
    }

    setValue(value)
    postDataOnChange(value, record)

}