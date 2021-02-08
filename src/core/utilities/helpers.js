
import numeral from 'numeral';
import moment from 'moment'

export const numberSorter = (a, b) => {
    const aInt = parseFloat(numeral(a).format('0'));
    const bInt = parseFloat(numeral(b).format('0'))
    return aInt - bInt;
}

export const percentSorter = (a, b) => (parseFloat(a) - parseFloat(b));

export const fetchStart = (actionType) => ({
    type: actionType
})

export const fetchSuccess = (actionType, data) => ({
    type: actionType,
    payload: data
})

export const fetchFailure = (actionType, errorMsg) => ({
    type: actionType,
    payload: errorMsg
})

export const setColorCode = (value, target, type) => {

    try {
        const green = '#3f8600';
        const red = '#cf1322';
    
        if (type === 'scrap') {
            if (parseFloat(value) < parseFloat(target)) return green //green
            return red
        }
    
        if (type === 'oae') {
            if (parseFloat(value) >= parseFloat(target)) return green //green
            return red
        }
    
        return '';
    } catch (error) {
        return '';
    }

}

export const departmentList = [
    {
        area: 'Foundry Cell',
        dept: 'Foundry'
    },
    {
        area: 'Machine Line',
        dept: 'Machining'
    },
    {
        area: 'Skirt Coat',
        dept: 'Finishing'
    },
    {
        area: 'Assembly',
        dept: 'Assembly'
    },
    {
        area: 'Plant',
        dept: 'Plant'
    }
]

export const mapDeptToArea = dept => {

    switch (dept.toLowerCase()) {
        case 'foundry':
            return 'foundry cell'
        case 'machining':
            return 'machine line'
        case 'finishing':
            return 'skirt coat'
        default:
            return dept;
    }

}

export const mapAreaToDept = area => {

    switch (area.toLowerCase()) {
        case 'foundry cell':
            return 'foundry'
        case 'machine line':
            return 'machining'
        case 'finishing':
            return 'skirt coat'
        default:
            return area;
    }

}

export const oDataQryString = (odataQry) => {
    if (!!!odataQry) return '';
    return odataQry.startsWith('?') ? odataQry : `?${odataQry}`;
}

export const disabledDate = current => current && current > moment().endOf('day');

export const dateRange = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last Week': [moment().subtract(6, 'days').startOf('week'), moment().subtract(6, 'days').endOf('week')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Last 30 days': [moment().subtract(30, 'days'), moment()],
    'MTD': [moment().startOf('month'), moment()],
    'YTD': [moment().startOf('year'), moment()],
    '1st Quarter': [moment().quarter(1).startOf('quarter'), moment().quarter(1).endOf('quarter')],
    '2nd Quarter': [moment().quarter(2).startOf('quarter'), moment().quarter(2).endOf('quarter')],
    '3rd Quarter': [moment().quarter(3).startOf('quarter'), moment().quarter(3).endOf('quarter')],
    '4th Quarter': [moment().quarter(4).startOf('quarter'), moment().quarter(4).endOf('quarter')],
}

export const monthRange = {
    '1st Quarter': [moment().quarter(1).startOf('quarter'), moment().quarter(1).endOf('quarter')],
    '2nd Quarter': [moment().quarter(2).startOf('quarter'), moment().quarter(2).endOf('quarter')],
    '3rd Quarter': [moment().quarter(3).startOf('quarter'), moment().quarter(3).endOf('quarter')],
    '4th Quarter': [moment().quarter(4).startOf('quarter'), moment().quarter(4).endOf('quarter')],
    'Last 3 Months': [moment().subtract(2, 'month').startOf('month'), moment().endOf('day')],
    'Last 6 Months': [moment().subtract(5, 'month').startOf('month'), moment().endOf('day')],
    'Last 12 Months': [moment().subtract(11, 'month').startOf('month'), moment().endOf('day')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'MTD': [moment().startOf('month'), moment()],
    'YTD': [moment().startOf('year'), moment()]
}

export const depts = ['Foundry', 'Machining', 'Anodize', 'Skirt Coat', 'Assembly'];
export const shifts = ['3', '1', '2', 'All'];
export const dateFormat = 'MM/DD/YYYY';
export const longDateFormat = 'MM/DD/YYYY hh:mm:ss A';
export const getTopItems = (data, top = 5) => [...data].splice(0,top);
export const scrollToObject = el => window.scrollTo(0, el?.offsetTop);

export const isNumeric = (value) => {
    const reg = /^-?[0-9]*(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') return true;
    return false;
};