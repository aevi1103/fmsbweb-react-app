import types from './performance-lvl-0.types'

const INITIAL_STATE = {
    isScrapVarianceFetching: false,
    scrapVariance: null,
    scrapVarianceErrorMsg: undefined,

    isPpmhPerDeptVarianceFetching: false,
    ppmhPerDeptVarianceCollection: null,
    ppmhPerDeptVarianceErrorMsg: undefined,

    isPlantPpmhFetching: false,
    plantPpmhCollection: null,
    plantPpmhErrorMsg: undefined,

    isScrapVariancePerProgramFetching: false,
    scrapVariancePerProgramCollection: null,
    scrapVariancePerProgramErrorMsg: undefined,

    isDeptKpiFetching: false,
    deptKpi: null,
    deptKpiErrorMessage: undefined,

    department: 'Foundry Cell',
}

const reducer = (state = INITIAL_STATE, action) => { 

    switch (action.type) {

        //* scrap variance
        case types.FETCH_SCRAP_VARIANCE_START:

            return {
                ...state,
                isScrapVarianceFetching: true
            };

        case types.FETCH_SCRAP_VARIANCE_SUCCESS:

            return {
                ...state,
                isScrapVarianceFetching: false,
                scrapVariance: action.payload
            };

        case types.FETCH_SCRAP_VARIANCE_FAILURE:

            return {
                ...state,
                isScrapVarianceFetching: false,
                scrapVarianceErrorMsg: action.payload
            };

        //* ppmh variance per dept
        case types.FETCH_PPMH_PER_DEPT_START:

            return {
                ...state,
                isPpmhPerDeptVarianceFetching: true
            };

        case types.FETCH_PPMH_PER_DEPT_SUCCESS:

            return {
                ...state,
                isPpmhPerDeptVarianceFetching: false,
                ppmhPerDeptVarianceCollection: action.payload
            };

        case types.FETCH_PPMH_PER_DEPT_FAILURE:

            return {
                ...state,
                isPpmhPerDeptVarianceFetching: false,
                ppmhPerDeptVarianceErrorMsg: action.payload
            };

        //* plant ppm
        case types.FETCH_PLANT_PPMH_START:

            return {
                ...state,
                isPlantPpmhFetching: true
            };

        case types.FETCH_PLANT_PPMH_SUCCESS:

            return {
                ...state,
                isPlantPpmhFetching: false,
                plantPpmhCollection: action.payload
            };

        case types.FETCH_PLANT_PPMH_FAILURE:

            return {
                ...state,
                isPlantPpmhFetching: false,
                plantPpmhErrorMsg: action.payload
            };

        //* scrap variance per program
        case types.FETCH_SCRAP_VARIANCE_PER_PROGRAM_START:

            return {
                ...state,
                isScrapVariancePerProgramFetching: true
            };

        case types.FETCH_SCRAP_VARIANCE_PER_PROGRAM_SUCCESS:

            return {
                ...state,
                isScrapVariancePerProgramFetching: false,
                scrapVariancePerProgramCollection: action.payload
            };

        case types.FETCH_SCRAP_VARIANCE_PER_PROGRAM_FAILURE:

            return {
                ...state,
                isScrapVariancePerProgramFetching: false,
                scrapVariancePerProgramErrorMsg: action.payload
            };

        //* dept kpi
        case types.FETCH_DEPT_KPI_START:

            return {
                ...state,
                isDeptKpiFetching: true
            };

        case types.FETCH_DEPT_KPI_SUCCESS:

            return {
                ...state,
                isDeptKpiFetching: false,
                deptKpi: action.payload
            };

        case types.FETCH_DEPT_KPI_FAILURE:

            return {
                ...state,
                isDeptKpiFetching: false,
                deptKpiErrorMessage: action.payload
            };
    
        default:
            return state

        //* selected department for performace page
        case types.SET_DEPARTMENT:

            return {
                ...state,
                department: action.payload
            };
    }

}

export default reducer;