import api from '../../utilities/api';
import types from './performance-lvl-0.types'

import {
    fetchStart,
    fetchSuccess,
    fetchFailure
} from '../../utilities/helpers'

import {
    TransformScrapVarianceData,
    TransformScrapVariancePerProgramData
} from '../../utilities/scrap-variance-helper';

//scrap variance
export const fetchScrapVarianceStartAsync = (start, end, area, isPurchasedScrap = 'SB') => {

    return dispatch => {

        dispatch(fetchStart(types.FETCH_SCRAP_VARIANCE_START));

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
            dispatch(fetchSuccess(types.FETCH_SCRAP_VARIANCE_SUCCESS, transformedData));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                types.FETCH_SCRAP_VARIANCE_FAILURE,
                error.message));
        
        });

    };
};

//PPMH variance per dept
export const fetchPpmhPerDeptStartAsync = (start, end, area) => {

    return dispatch => {

        dispatch(fetchStart(
            types.FETCH_PPMH_PER_DEPT_START));

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
                types.FETCH_PPMH_PER_DEPT_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                types.FETCH_PPMH_PER_DEPT_FAILURE,
                error.message));
        });

    };
};

//Plant PPMH
export const fetchPlantPpmhStartAsync = (start, end) => {

    return dispatch => {

        dispatch(fetchStart(
            types.FETCH_PLANT_PPMH_START));

        const url = 'ppmh/plant';
        api.get(url, {
            params: {
                start,
                end
            }
        })
        .then(response => {

            dispatch(fetchSuccess(
                types.FETCH_PLANT_PPMH_SUCCESS,
                response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                types.FETCH_PLANT_PPMH_FAILURE,
                error.message));
        });

    };
};

//scrap variance per program
export const fetchScrapVariancePerProgramStartAsync = (start, end, area, isPurchasedScrap = 'SB') => {

    return dispatch => {

        dispatch(fetchStart(
            types.FETCH_SCRAP_VARIANCE_PER_PROGRAM_START));

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
                types.FETCH_SCRAP_VARIANCE_PER_PROGRAM_SUCCESS,
                data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                types.FETCH_SCRAP_VARIANCE_PER_PROGRAM_FAILURE,
                error.message));
        
        });

    };
};

//dept kpi
export const fetchDeptKpiStartAsync = (start, end, area) => {

    return dispatch => {

        dispatch(fetchStart(
            types.FETCH_DEPT_KPI_START));

        const url = 'sap/deptkpi';
        api.get(url, {
            params: {
                start,
                end,
                area
            }
        })
        .then(response => {

            dispatch(fetchSuccess( types.FETCH_DEPT_KPI_SUCCESS, response.data));

        })
        .catch(error => {
            
            dispatch(fetchFailure(
                types.FETCH_DEPT_KPI_FAILURE,
                error.message));
        
        });

    };
};

//
export const setDepartment = dept => ({
    type: types.SET_DEPARTMENT,
    payload: dept
});