import morningMeetingTypes from './morning-meeting.types';
import api from '../../utilities/api';

import {
    getDowntimeByOwner
} from '../../utilities/downtime-helper';

import {
    TransformScrapVarianceData,
    TransformScrapVariancePerProgramData
} from '../../utilities/scrap-variance-helper';

import {
    TransformDeptKpiData
} from '../../utilities/dept-kpi-helper';

import {
    fetchStart,
    fetchSuccess,
    fetchFailure
} from '../../utilities/helpers'

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

//scrap variance
export const fetchScrapVarianceStartAsync = (start, end, area, isPurchasedScrap = 'SB') => {

    return dispatch => {

        dispatch(fetchStart(morningMeetingTypes.FETCH_SCRAP_VARIANCE_START));

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

//Plant PPMH
export const fetchPlantPpmhStartAsync = (start, end) => {

    return dispatch => {

        dispatch(fetchStart(
            morningMeetingTypes.FETCH_PLANT_PPMH_START));

        const url = 'ppmh/plant';
        api.get(url, {
            params: {
                start,
                end
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                morningMeetingTypes.FETCH_PLANT_PPMH_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                morningMeetingTypes.FETCH_PLANT_PPMH_FAILURE,
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

export const setPerformaceSelectedDepartment = dept => ({
    type: morningMeetingTypes.SET_DEPARTMENT_SELECT,
    payload: dept
});

export const setPpmhChartType = chartType => ({
    type: morningMeetingTypes.SET_PPMH_CHART_TYPE,
    payload: chartType
});

export const fetchHourlyProdStartAsync = (dept, shiftDate) => {

    return dispatch => {
        dispatch(fetchStart(morningMeetingTypes.FETCH_HOURLY_PROD_START));
        dept = dept.toLowerCase() === 'finishing' ? 'skirt coat' : dept;
        const url = `kpi/hourlyproduction/${dept}?shiftDate=${shiftDate}`;    
        api.get(url, {
            params: {
                dept,
                shiftDate
            }
        })
        .then(response => {
            dispatch(fetchSuccess(morningMeetingTypes.FETCH_HOURLY_PROD_SUCCESS, response.data));
        })
        .catch(error => {        
            dispatch(fetchFailure(morningMeetingTypes.FETCH_HOURLY_PROD_FAILURE, error.message)); 
        });
    };
};
