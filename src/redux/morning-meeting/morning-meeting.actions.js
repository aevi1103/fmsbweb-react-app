import morningMeetingTypes from './morning-meeting.types';
import api from '../../API';
import axios from 'axios';
import {
    getDowntimeByOwner,
    getDowntimeByLine
} from '../../helpers/downtime-helper';

import {
    TransformScrapVarianceData,
    TransformScrapVariancePerProgramData
} from '../../helpers/scrap-variance-helper';

import {
    TransformDeptKpiData
} from '../../helpers/dept-kpi-helper';

const fetchStart = (actionType) => ({
    type: actionType
});

const fetchSuccess = (actionType, data) => ({
    type: actionType,
    payload: data
});

const fetchFailure = (actionType, errorMsg) => ({
    type: actionType,
    payload: errorMsg
});

//MONTHLY_INCIDENT_RATE

export const fetchSafetyMonthlyIncidentRateStartAsync = () => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_START));

        const url = 'safety/monthlyincidentrate';

        api.get(url)
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_SAFETY_MONTHLY_INCIDENT_RATE_FAILURE,
                error.message));

            if (axios.isCancel(error)) {
                console.error('Request canceled', url, error.message);
            } else {
                console.error('sopmething else', url, error.message);
            }

        });

    };
};

//INCIDENTS_BY_DEPT
export const fetchSafetyIncidentByDeptStartAsync = () => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_SAFETY_INCIDENTS_BY_DEPT_START));

        api.get('safety/incidentbydepartment')
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_SAFETY_INCIDENTS_BY_DEPT_SUCCESS,
                response.data));

        })
        .catch(error => dispatch(fetchFailure(
            morningMeetingTypes.FETCH_SAFETY_INCIDENTS_BY_DEPT_FAILURE,
            error.message)));

    };
};

//INCIDENTS
export const fetchSafetyIncidentStartAsync = (startDate, endDate) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_SAFETY_INCIDENTS_START));

        const url = `safety/incidents`;
        api.get(url, {
            params: {
                start: startDate,
                end: endDate,
                fields: 'dept,injuryStatus,description,incidentDate'
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_SAFETY_INCIDENTS_SUCCESS,
                response.data));

        })
        .catch(error => dispatch(fetchFailure(
            morningMeetingTypes.FETCH_SAFETY_INCIDENTS_FAILURE,
            error.message)));

    };
};

//LOGISTICS_STOCK_OVERVIEW
export const fetchLogisticsStockOverviewStartAsync = (date) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_START));

        const url = `logistics/stockoverview`;
        api.get(url, {
            params: {
                date
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_SUCCESS,
                response.data));

        })
        .catch(error => dispatch(fetchFailure(
            morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_FAILURE,
            error.message)));

    };
};

//LOGISTICS_STOCK_OVERVIEW_SLOC
export const fetchLogisticsStockOverviewSlocStartAsync = (date) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_START));

        const url = `logistics/stockoverviewbysloc`;
        api.get(url, {
            params: {
                date
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_SUCCESS,
                response.data));

        })
        .catch(error => dispatch(fetchFailure(
            morningMeetingTypes.FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_FAILURE,
            error.message)));

    };
};
    
//LOGISTICS_STATUS
export const fetchLogisticsStatusStartAsync = (start, end) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_LOGISTICS_STATUS_START));

        const url = `logistics/status`;
        api.get(url, {
            params: {
                start,
                end
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_LOGISTICS_STATUS_SUCCESS,
                response.data));

        })
        .catch(error => dispatch(fetchFailure(
            morningMeetingTypes.FETCH_LOGISTICS_STATUS_FAILURE,
            error.message)));

    };
};

//PRODUCTION_STATUS
export const fetchProductionStatusStartAsync = (start, end, area, cancelTokenSrc) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_PRODUCTION_STATUS_START));

        const url = `sap/productiondata`;

        api.get(url, { 
            params: {
                start,
                end,
                area
            },
            cancelToken: cancelTokenSrc.token,
            onDownloadProgress: (progressEvt) => {
                // let percentCompleted = Math.floor((progressEvt.loaded * 100) / progressEvt.total);
                // console.log(url, 'percentCompleted', progressEvt, percentCompleted)
            }
         })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_PRODUCTION_STATUS_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            if (axios.isCancel(error)) {
                console.error('Request canceled', url, error.message);
            } else {
                console.error('sopmething else', url, error.message);
                dispatch(fetchFailure(
                    morningMeetingTypes.FETCH_PRODUCTION_STATUS_FAILURE,
                    error.message));
            }
        
        });

    };
};

//DAILY SCRAP RATE
export const fetchDailyScrapRateStartAsync = (start, end, area, cancelTokenSrc) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_DAILY_SCRAP_RATE_START));

        const url = `sap/dailyscraprate`;
        api.get(url, { 
            cancelToken: cancelTokenSrc.token,
            params: {
                start,
                end,
                area
            }
         })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_DAILY_SCRAP_RATE_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            if (axios.isCancel(error)) {
                console.error('Request canceled', url, error.message);
            } else {
                console.error('sopmething else', url, error.message);
                dispatch(fetchFailure(
                    morningMeetingTypes.FETCH_DAILY_SCRAP_RATE_FAILURE,
                    error.message));
            }
        
        });

    };
};

//DAILY KPI
export const fetchDailyKpiStartAsync = (start, end, area, cancelTokenSrc) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_DAILY_KPI_START));

        const url = `sap/dailykpi`;
        api.get(url, { 
            cancelToken: cancelTokenSrc.token,
            params: {
                start,
                end,
                area
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_DAILY_KPI_SUCCESS,
                response.data));

        })
        .catch(error => {
        
            if (axios.isCancel(error)) {
                console.error('Request canceled', url, error.message);
            } else {
                console.error('sopmething else', url, error.message);
                dispatch(fetchFailure(
                    morningMeetingTypes.FETCH_DAILY_KPI_FAILURE,
                    error.message));
            }
        });

    };
};

//WEEKLY LABOR HRS
export const fetchWeeklyLaborHrsStartAsync = (start, end, area, cancelTokenSrc) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_WEEKLY_LABOR_HRS_START));

        const url = `fmsb/weeklylaborhours`;
        api.get(url, { 
            cancelToken: cancelTokenSrc.token,
            params: {
                start,
                end,
                area
            }
         })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_WEEKLY_LABOR_HRS_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            if (axios.isCancel(error)) {
                console.error('Request canceled', url, error.message);
            } else {
                console.error('sopmething else', url, error.message);
                dispatch(fetchFailure(
                    morningMeetingTypes.FETCH_WEEKLY_LABOR_HRS_FAILURE,
                    error.message));
            }
        
        });

    };
};

//PPMH per shift
export const fetchPpmhPerShiftStartAsync = (start, end, area, cancelTokenSrc) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_PPMH_PER_SHIFT_START));

        const url = `ppmh/shift`;
        api.get(url, { 
            cancelToken: cancelTokenSrc.token,
            params: {
                start,
                end,
                area
            }
         })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_PPMH_PER_SHIFT_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            if (axios.isCancel(error)) {
                console.error('Request canceled', url, error.message);
            } else {
                console.error('sopmething else', url, error.message);
                dispatch(fetchFailure(
                    morningMeetingTypes.FETCH_PPMH_PER_SHIFT_FAILURE,
                    error.message));
            }
        
        });

    };
};

//prod scrap
export const fetchProdScrapStartAsync = (start, end, area, cancelTokenSrc) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_PROD_SCRAP_START));

        const url = `sap/prodscrap`;
        api.get(url, { 
            cancelToken: cancelTokenSrc.token,
            params: {
                start,
                end,
                area
            }
         })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_PROD_SCRAP_SUCCESS,
                response.data));

        })
        .catch(error => {

            if (axios.isCancel(error)) {
                console.error('Request canceled', url, error.message);
            } else {
                console.error('sopmething else', url, error.message);
                dispatch(fetchFailure(
                    morningMeetingTypes.FETCH_PROD_SCRAP_FAILURE,
                    error.message));
            }
        
        });

    };
};

//finance
export const fetchFiananceKpiStartAsync = (date) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_FINANCE_KPI_START));

        const url = 'finance/kpi';
        api.get(url, {
            params: {
                date
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_FINANCE_KPI_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_FINANCE_KPI_FAILURE,
                error.message));
        
        });

    };
};

//quality
export const fetchQualityStartAsync = (date) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_QUALITY_START));

        const url = 'quality/status';
        api.get(url, {
            params: {
                start: date,
                end: date
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_QUALITY_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_QUALITY_FAILURE,
                error.message));
        
        });

    };
};

//scrap variance
export const fetchScrapVarianceStartAsync = (start, end, area, isPurchasedScrap = 'SB') => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_SCRAP_VARIANCE_START));

        const url = 'sap/scrapvariance';
        api.get(url, {
            params: {
                start,
                end,
                area,
                isPurchasedScrap: isPurchasedScrap === 'SB' ? false : true,
                isPlantTotal: area === 'Plant' ? true : false
            }
        })
        .then(response => {

            const transformedData = TransformScrapVarianceData(response.data, area);
            dispatch(fetchSuccess(morningMeetingTypes.FETCH_SCRAP_VARIANCE_SUCCESS, transformedData));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_SCRAP_VARIANCE_FAILURE,
                error.message));
        
        });

    };
};

//scrap variance per program
export const fetchScrapVariancePerProgramStartAsync = (start, end, area, isPurchasedScrap = 'SB') => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_SCRAP_VARIANCE_PER_PROGRAM_START));

        const url = 'sap/scrapvarianceperprogram';
        api.get(url, {
            params: {
                start,
                end,
                area,
                isPurchasedScrap: isPurchasedScrap === 'SB' ? false : true,
                isPlantTotal: area === 'Plant' ? true : false
            }
        })
        .then(response => {

            const data = TransformScrapVariancePerProgramData(response.data, area);

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_SCRAP_VARIANCE_PER_PROGRAM_SUCCESS,
                data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_SCRAP_VARIANCE_PER_PROGRAM_FAILURE,
                error.message));
        
        });

    };
};

//scrap variance per program
export const fetchScrapVariancePerDeptStartAsync = (start, end, isPurchasedScrap = 'SB') => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_DEPT_START));

        const url = 'sap/scrapvarianceperdept';
        api.get(url, {
            params: {
                start,
                end,
                isPurchasedScrap: isPurchasedScrap === 'SB' ? false : true
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_DEPT_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_DEPT_FAILURE,
                error.message));
        
        });

    };
};

//scrap variance per shift
export const fetchScrapVariancePerShiftStartAsync = (start, end, area, isPurchasedScrap = 'SB') => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_SHIFT_START));

        const url = 'sap/scrapvariancepershift';
        api.get(url, {
            params: {
                start,
                end,
                area,
                isPurchasedScrap: isPurchasedScrap === 'SB' ? false : true
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_SHIFT_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_SCRAP_VARIANCE_BY_SHIFT_FAILURE,
                error.message));
        
        });

    };
};

//PPMH variance per dept
export const fetchPpmhPerDeptStartAsync = (start, end, area) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_PPMH_PER_DEPT_START));

        const url = 'ppmh/ppmhperdept';
        api.get(url, {
            params: {
                start,
                end,
                area
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_PPMH_PER_DEPT_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_PPMH_PER_DEPT_FAILURE,
                error.message));
        });

    };
};


//dept kpi
export const fetchDeptKpiStartAsync = (start, end, area) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_DEPT_KPI_START));

        const url = 'sap/deptkpi';
        api.get(url, {
            params: {
                start,
                end,
                area
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_DEPT_KPI_SUCCESS, TransformDeptKpiData(response.data, area)));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_DEPT_KPI_FAILURE,
                error.message));
        
        });

    };
};

//downtime
export const fetchDowntimeStartAsync = (start, end) => {

    return dispatch => {

        dispatch(fetchStart(morningMeetingTypes.FETCH_DOWNTIME_START));
        dispatch(resetDowntimeByOwner());
        dispatch(resetDowntimeByLine());

        const url = 'fmsb/downtime';
            
        api.get(url, {
            params: {
                start,
                end,
                // Dept: dept,
                // Line: line,
                // Shift: shift
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_DOWNTIME_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_DOWNTIME_FAILURE,
                error.message));
        
        });

    };
};

//downtime by owner
export const fetchDowntimeByOwnerStartAsync = (start, end, area) => {

    var dept = area;
    switch (dept) {
        case 'Foundry Cell' :
            dept = 'Foundry';
            break;
        case 'Machine Line':
            dept = 'Machining';
            break;
        default:
            dept = area;
    }

    return dispatch => {

        dispatch(fetchStart(morningMeetingTypes.FETCH_DOWNTIME_BY_OWNER_START));

        const url = 'fmsb/downtimebyowner';
            
        api.get(url, {
            params: {
                start,
                end,
                dept
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_DOWNTIME_BY_OWNER_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_DOWNTIME_BY_OWNER_FAILURE,
                error.message));
        
        });

    };
};

//downtime by Iconics
export const fetchDowntimeIconicsStartAsync = (start, end, area, minDowntimeEvent = 10, maxDowntimeEvent = null) => {

    var dept = area;
    switch (dept) {
        case 'Foundry Cell' :
            dept = 'Foundry';
            break;
        case 'Machine Line':
            dept = 'Machining';
            break;
        default:
            dept = area;
    }

    return dispatch => {

        dispatch(fetchStart(morningMeetingTypes.FETCH_DOWNTIME_ICONICS_START));

        const url = 'iconics/downtimeiconics';
            
        api.get(url, {
            params: {
                start,
                end,
                dept,
                minDowntimeEvent: !minDowntimeEvent ? 0 : minDowntimeEvent,
                maxDowntimeEvent: !maxDowntimeEvent ? null : maxDowntimeEvent
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_DOWNTIME_ICONICS_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_DOWNTIME_ICONICS_FAILURE,
                error.message));
        
        });

    };
};

//overtime per dept
export const fetchOvertimePercentPerDeptStartAsync = (start, end, dept) => {

    return dispatch => {

        dispatch(fetchStart(morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_DEPT_START));

        const url = 'fmsb/overtimeperdept';
            
        api.get(url, {
            params: {
                start,
                end,
                dept
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_DEPT_SUCCESS,
                response.data.quarterSummary));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_DEPT_FAILURE,
                error.message));
        
        });

    };
};

//overtime per shift
export const fetchOvertimePercentPerShiftStartAsync = (start, end, dept) => {

    return dispatch => {

        dispatch(fetchStart(morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_SHIFT_START));

        const url = 'fmsb/overtimeperdept';
            
        api.get(url, {
            params: {
                start,
                end,
                dept
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_SHIFT_SUCCESS,
                response.data.shiftSummary));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_OVERTIME_PERCENT_PER_SHIFT_FAILURE,
                error.message));
        
        });

    };
};

export const setStartDate = date => ({
    type: morningMeetingTypes.SET_PRODUCTION_START_DATE,
    payload: date
});

export const setEndDate = date => ({
    type: morningMeetingTypes.SET_PRODUCTION_END_DATE,
    payload: date
});

export const setDowntimeByOwner = (downtimeCollection, dept, shift) => ({
    type: morningMeetingTypes.SET_DOWNTIME_BY_OWNER,
    payload: getDowntimeByOwner(downtimeCollection, dept, shift)
});

export const resetDowntimeByOwner = () => ({
    type: morningMeetingTypes.SET_DOWNTIME_BY_OWNER,
    payload: {
        dept: '',
        shift: '',
        ownerTitle: 'Select Shift...',
        ownerDetails: []
    }
});

export const setDowntimeByLine = (ownerDetails, dept, shift, owner) => ({
    type: morningMeetingTypes.SET_DOWNTIME_BY_LINE,
    payload: getDowntimeByLine(ownerDetails, dept, shift, owner)
});

export const resetDowntimeByLine = () => ({
    type: morningMeetingTypes.SET_DOWNTIME_BY_LINE,
    payload: {
        dept: '',
        shift: '',
        owner: '',
        lineTitle: `Select Owner...`,
        lineDetails: []
    }
});

export const setPerformaceSelectedDepartment = dept => ({
    type: morningMeetingTypes.SET_DEPARTMENT_SELECT,
    payload: dept
});

export const setPpmhChartType = chartType => ({
    type: morningMeetingTypes.SET_PPMH_CHART_TYPE,
    payload: chartType
});