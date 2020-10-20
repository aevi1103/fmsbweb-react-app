
import numeral from 'numeral';

export const numberSorter = (a, b) => (numeral(a).format('0') - numeral(b).format('0'));

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
