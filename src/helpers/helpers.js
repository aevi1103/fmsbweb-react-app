
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

export const getUrlParameter = (qry) => new URLSearchParams(new URL(window.location.href).search).get(qry);

export const updateUrlQryParameter = (params, title = document.title) => {

    //base url
    const url = new URL(window.location.href);

    //generate qry strings
    const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');

    //new url
    const newUrl = `${url.origin + url.pathname}?${queryString}`;

    //update url state
    window.history.replaceState('updateUrl', title, newUrl);

    //update document title
    document.title = title;
}

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

export const depts = ['Foundry', 'Machining', 'Anodize', 'Skirt Coat', 'Assembly'];
export const shifts = ['3', '1', '2', 'All'];
export const dateFormat = 'MM/DD/YYYY';
export const disabledDate = current => current && current > moment().endOf('day');
export const dateRange = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last Week': [moment().subtract(6, 'days').startOf('week'), moment().subtract(6, 'days').endOf('week')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Last 30 days': [moment().subtract(30, 'days').startOf('month'), moment()],
    'MTD': [moment().startOf('month'), moment().add(-1, 'days')],
    'YTD': [moment().startOf('year'), moment().add(-1, 'days')]
}

export const getTopItems = (data, top = 5) => [...data].splice(0,top);

export const scrollToObject = el => window.scrollTo(0, el?.offsetTop);