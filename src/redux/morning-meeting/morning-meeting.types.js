const MorningMeetingTypes = {
    FETCH_SAFETY_MONTHLY_INCIDENT_RATE_START: 'FETCH_SAFETY_MONTHLY_INCIDENT_RATE_START',
    FETCH_SAFETY_MONTHLY_INCIDENT_RATE_SUCCESS: 'FETCH_SAFETY_MONTHLY_INCIDENT_RATE_SUCCESS',
    FETCH_SAFETY_MONTHLY_INCIDENT_RATE_FAILURE: 'FETCH_SAFETY_MONTHLY_INCIDENT_RATE_FAILURE',

    FETCH_SAFETY_INCIDENTS_BY_DEPT_START: 'FETCH_SAFETY_INCIDENTS_BY_DEPT_START',
    FETCH_SAFETY_INCIDENTS_BY_DEPT_SUCCESS: 'FETCH_SAFETY_INCIDENTS_BY_DEPT_SUCCESS',
    FETCH_SAFETY_INCIDENTS_BY_DEPT_FAILURE: 'FETCH_SAFETY_INCIDENTS_BY_DEPT_FAILURE',

    FETCH_SAFETY_INCIDENTS_START: 'FETCH_SAFETY_INCIDENTS_START',
    FETCH_SAFETY_INCIDENTS_SUCCESS: 'FETCH_SAFETY_INCIDENTS_SUCCESS',
    FETCH_SAFETY_INCIDENTS_FAILURE: 'FETCH_SAFETY_INCIDENTS_FAILURE',

    FETCH_LOGISTICS_STOCK_OVERVIEW_START: 'FETCH_LOGISTICS_STOCK_OVERVIEW_START',
    FETCH_LOGISTICS_STOCK_OVERVIEW_SUCCESS: 'FETCH_LOGISTICS_STOCK_OVERVIEW_SUCCESS',
    FETCH_LOGISTICS_STOCK_OVERVIEW_FAILURE: 'FETCH_LOGISTICS_STOCK_OVERVIEW_FAILURE',

    FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_START: 'FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_START',
    FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_SUCCESS: 'FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_SUCCESS',
    FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_FAILURE: 'FETCH_LOGISTICS_STOCK_OVERVIEW_SLOC_FAILURE',

    FETCH_LOGISTICS_STATUS_START: 'FETCH_LOGISTICS_STATUS_START',
    FETCH_LOGISTICS_STATUS_SUCCESS: 'FETCH_LOGISTICS_STATUS_SUCCESS',
    FETCH_LOGISTICS_STATUS_FAILURE: 'FETCH_LOGISTICS_STATUS_FAILURE',

    FETCH_PRODUCTION_STATUS_START: 'FETCH_PRODUCTION_STATUS_START',
    FETCH_PRODUCTION_STATUS_SUCCESS: 'FETCH_PRODUCTION_STATUS_SUCCESS',
    FETCH_PRODUCTION_STATUS_FAILURE: 'FETCH_PRODUCTION_STATUS_FAILURE',

    FETCH_DAILY_SCRAP_RATE_START: 'FETCH_DAILY_SCRAP_RATE_START',
    FETCH_DAILY_SCRAP_RATE_SUCCESS: 'FETCH_DAILY_SCRAP_RATE_SUCCESS',
    FETCH_DAILY_SCRAP_RATE_FAILURE: 'FETCH_DAILY_SCRAP_RATE_FAILURE',

    FETCH_DAILY_KPI_START: 'FETCH_DAILY_KPI_START',
    FETCH_DAILY_KPI_SUCCESS: 'FETCH_DAILY_KPI_SUCCESS',
    FETCH_DAILY_KPI_FAILURE: 'FETCH_DAILY_KPI_FAILURE',

    FETCH_WEEKLY_LABOR_HRS_START: 'FETCH_WEEKLY_LABOR_HRS_START',
    FETCH_WEEKLY_LABOR_HRS_SUCCESS: 'FETCH_WEEKLY_LABOR_HRS_SUCCESS',
    FETCH_WEEKLY_LABOR_HRS_FAILURE: 'FETCH_WEEKLY_LABOR_HRS_FAILURE',

    FETCH_PPMH_PER_SHIFT_START: 'FETCH_PPMH_PER_SHIFT_START',
    FETCH_PPMH_PER_SHIFT_SUCCESS: 'FETCH_PPMH_PER_SHIFT_SUCCESS',
    FETCH_PPMH_PER_SHIFT_FAILURE: 'FETCH_PPMH_PER_SHIFT_FAILURE',

    FETCH_PROD_SCRAP_START: 'FETCH_PROD_SCRAP_START',
    FETCH_PROD_SCRAP_SUCCESS: 'FETCH_PROD_SCRAP_SUCCESS',
    FETCH_PROD_SCRAP_FAILURE: 'FETCH_PROD_SCRAP_FAILURE',

    FETCH_FINANCE_KPI_START: 'FETCH_FINANCE_KPI_START',
    FETCH_FINANCE_KPI_SUCCESS: 'FETCH_FINANCE_KPI_SUCCESS',
    FETCH_FINANCE_KPI_FAILURE: 'FETCH_FINANCE_KPI_FAILURE',

    FETCH_QUALITY_START: 'FETCH_QUALITY_START',
    FETCH_QUALITY_SUCCESS: 'FETCH_QUALITY_SUCCESS',
    FETCH_QUALITY_FAILURE: 'FETCH_QUALITY_FAILURE',

    FETCH_DOWNTIME_START: 'FETCH_DOWNTIME_START',
    FETCH_DOWNTIME_SUCCESS: 'FETCH_DOWNTIME_SUCCESS',
    FETCH_DOWNTIME_FAILURE: 'FETCH_DOWNTIME_FAILURE',

    FETCH_DOWNTIME_BY_OWNER_START: 'FETCH_DOWNTIME_BY_OWNER_START',
    FETCH_DOWNTIME_BY_OWNER_SUCCESS: 'FETCH_DOWNTIME_BY_OWNER_SUCCESS',
    FETCH_DOWNTIME_BY_OWNER_FAILURE: 'FETCH_DOWNTIME_BY_OWNER_FAILURE',

    FETCH_DOWNTIME_ICONICS_START: 'FETCH_DOWNTIME_ICONICS_START',
    FETCH_DOWNTIME_ICONICS_SUCCESS: 'FETCH_DOWNTIME_ICONICS_SUCCESS',
    FETCH_DOWNTIME_ICONICS_FAILURE: 'FETCH_DOWNTIME_ICONICS_FAILURE',

    FETCH_SCRAP_VARIANCE_START: 'FETCH_SCRAP_VARIANCE_START',
    FETCH_SCRAP_VARIANCE_SUCCESS: 'FETCH_SCRAP_VARIANCE_SUCCESS',
    FETCH_SCRAP_VARIANCE_FAILURE: 'FETCH_SCRAP_VARIANCE_FAILURE',

    FETCH_SCRAP_VARIANCE_PER_PROGRAM_START: 'FETCH_SCRAP_VARIANCE_PER_PROGRAM_START',
    FETCH_SCRAP_VARIANCE_PER_PROGRAM_SUCCESS: 'FETCH_SCRAP_VARIANCE_PER_PROGRAM_SUCCESS',
    FETCH_SCRAP_VARIANCE_PER_PROGRAM_FAILURE: 'FETCH_SCRAP_VARIANCE_PER_PROGRAM_FAILURE',

    FETCH_DEPT_KPI_START: 'FETCH_DEPT_KPI_START',
    FETCH_DEPT_KPI_SUCCESS: 'FETCH_DEPT_KPI_SUCCESS',
    FETCH_DEPT_KPI_FAILURE: 'FETCH_DEPT_KPI_FAILURE',

    FETCH_SCRAP_VARIANCE_BY_DEPT_START: 'FETCH_SCRAP_VARIANCE_BY_DEPT_START',
    FETCH_SCRAP_VARIANCE_BY_DEPT_SUCCESS: 'FETCH_SCRAP_VARIANCE_BY_DEPT_SUCCESS',
    FETCH_SCRAP_VARIANCE_BY_DEPT_FAILURE: 'FETCH_SCRAP_VARIANCE_BY_DEPT_FAILURE',

    FETCH_SCRAP_VARIANCE_BY_SHIFT_START: 'FETCH_SCRAP_VARIANCE_BY_SHIFT_START',
    FETCH_SCRAP_VARIANCE_BY_SHIFT_SUCCESS: 'FETCH_SCRAP_VARIANCE_BY_SHIFT_SUCCESS',
    FETCH_SCRAP_VARIANCE_BY_SHIFT_FAILURE: 'FETCH_SCRAP_VARIANCE_BY_SHIFT_FAILURE',

    FETCH_PPMH_PER_DEPT_START: 'FETCH_PPMH_PER_DEPT_START',
    FETCH_PPMH_PER_DEPT_SUCCESS: 'FETCH_PPMH_PER_DEPT_SUCCESS',
    FETCH_PPMH_PER_DEPT_FAILURE: 'FETCH_PPMH_PER_DEPT_FAILURE',

    FETCH_PLANT_PPMH_START: 'FETCH_PLANT_PPMH_START',
    FETCH_PLANT_PPMH_SUCCESS: 'FETCH_PLANT_PPMH_SUCCESS',
    FETCH_PLANT_PPMH_FAILURE: 'FETCH_PLANT_PPMH_FAILURE',

    FETCH_OVERTIME_PERCENT_PER_DEPT_START: 'FETCH_OVERTIME_PERCENT_PER_DEPT_START',
    FETCH_OVERTIME_PERCENT_PER_DEPT_SUCCESS: 'FETCH_OVERTIME_PERCENT_PER_DEPT_SUCCESS',
    FETCH_OVERTIME_PERCENT_PER_DEPT_FAILURE: 'FETCH_OVERTIME_PERCENT_PER_DEPT_FAILURE',

    FETCH_OVERTIME_PERCENT_PER_SHIFT_START: 'FETCH_OVERTIME_PERCENT_PER_SHIFT_START',
    FETCH_OVERTIME_PERCENT_PER_SHIFT_SUCCESS: 'FETCH_OVERTIME_PERCENT_PER_SHIFT_SUCCESS',
    FETCH_OVERTIME_PERCENT_PER_SHIFT_FAILURE: 'FETCH_OVERTIME_PERCENT_PER_SHIFT_FAILURE',

    SET_PRODUCTION_START_DATE: 'SET_PRODUCTION_START_DATE',
    SET_PRODUCTION_END_DATE: 'SET_PRODUCTION_END_DATE',

    SET_DOWNTIME_BY_OWNER: 'SET_DOWNTIME_BY_OWNER',
    SET_DOWNTIME_BY_LINE: 'SET_DOWNTIME_BY_LINE',

    SET_DEPARTMENT_SELECT: 'SET_DEPARTMENT_SELECT',
    SET_PPMH_CHART_TYPE: 'SET_PPMH_CHART_TYPE',
}

export default MorningMeetingTypes;