import qualityCheckSheetTypes from './quality-check-sheet.types'

const INITIAL_STATE = {

    isLineLoading: false,
    lineCollection: [],
    lineErrorMsg: undefined,

    isMachineLoading: false,
    machineCollection: [],
    machineErrorMsg: undefined,

    isSubMachineLoading: false,
    subMachineCollection: [],
    subMachineErrorMsg: undefined,

    isPartLoading: false,
    partCollection: [],
    partErrorMsg: undefined,

    isCharacteristicsLoading: false,
    characteristicsCollection: [],
    characteristicsErrorMsg: undefined,

    controlMethod: null,
    part: null,
    machine: null,

    checkSheetPart: null,
    checkSheetSubMachine: null,
    checkSheetMachineName: 'Okuma SP',

    reChecksCollection: [],
    checkSheetValues: []

}

const qualityCheckSheetsReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        //line
        case qualityCheckSheetTypes.FETCH_LINE_START:
            
            return {
                ...state,
                isLineLoading: true,
                lineCollection: [],
                lineErrorMsg: null
            }

        case qualityCheckSheetTypes.FETCH_LINE_SUCCESS:
            
            return {
                ...state,
                isLineLoading: false,
                lineCollection: action.payload
            }

        case qualityCheckSheetTypes.FETCH_LINE_FAILURE:
            
            return {
                ...state,
                isLineLoading: false,
                lineErrorMsg: action.payload
            }
    
        //machine
        case qualityCheckSheetTypes.FETCH_MACHINE_START:
        
            return {
                ...state,
                isMachineLoading: true,
                machineCollection: [],
                machineErrorMsg: null
            }

        case qualityCheckSheetTypes.FETCH_MACHINE_SUCCESS:
            
            return {
                ...state,
                isMachineLoading: false,
                machineCollection: action.payload
            }

        case qualityCheckSheetTypes.FETCH_MACHINE_FAILURE:
            
            return {
                ...state,
                isMachineLoading: false,
                machineErrorMsg: action.payload
            }

        //machine
        case qualityCheckSheetTypes.FETCH_SUB_MACHINE_START:

            return {
                ...state,
                isSubMachineLoading: true,
                subMachineCollection: [],
                subMachineErrorMsg: null
            }

        case qualityCheckSheetTypes.FETCH_SUB_MACHINE_SUCCESS:
            
            return {
                ...state,
                isSubMachineLoading: false,
                subMachineCollection: action.payload
            }

        case qualityCheckSheetTypes.FETCH_SUB_MACHINE_FAILURE:
            
            return {
                ...state,
                isSubMachineLoading: false,
                subMachineErrorMsg: action.payload
            }

        //part
        case qualityCheckSheetTypes.FETCH_PART_START:

            return {
                ...state,
                isPartLoading: true,
                partCollection: [],
                partErrorMsg: null
            }

        case qualityCheckSheetTypes.FETCH_PART_SUCCESS:
            
            return {
                ...state,
                isPartLoading: false,
                partCollection: action.payload,
            }

        case qualityCheckSheetTypes.FETCH_PART_FAILURE:
            
            return {
                ...state,
                isPartLoading: false,
                partErrorMsg: action.payload
            }

        //characteristic
        case qualityCheckSheetTypes.FETCH_CHARACTERISTICS_START:

            return {
                ...state,
                isCharacteristicsLoading: true,
                characteristicsCollection: [],
                characteristicsErrorMsg: null
            }

        case qualityCheckSheetTypes.FETCH_CHARACTERISTICS_SUCCESS:
            
            return {
                ...state,
                isCharacteristicsLoading: false,
                characteristicsCollection: action.payload
            }

        case qualityCheckSheetTypes.FETCH_CHARACTERISTICS_FAILURE:
            
            return {
                ...state,
                isCharacteristicsLoading: false,
                characteristicsErrorMsg: action.payload
            }

        case qualityCheckSheetTypes.SET_CONTROL_METHOD:
            
            return {
                ...state,
                controlMethod: action.payload
            }

        case qualityCheckSheetTypes.SET_PART:
            
            return {
                ...state,
                part: action.payload
            }

        case qualityCheckSheetTypes.SET_MACHINE:
            
            return {
                ...state,
                machine: action.payload
            }

        case qualityCheckSheetTypes.SET_CHECK_SHEET_PART:
        
            return {
                ...state,
                checkSheetPart: action.payload
            }

        case qualityCheckSheetTypes.SET_CHECK_SHEET_SUB_MACHINE:
        
            return {
                ...state,
                checkSheetSubMachine: action.payload
            }

        case qualityCheckSheetTypes.SET_CHECK_SHEET_MACHINE_NAME:
        
            return {
                ...state,
                checkSheetMachineName: action.payload
            }

        case qualityCheckSheetTypes.SET_RE_CHECKS:
        
            return {
                ...state,
                reChecksCollection: action.payload
            }

        case qualityCheckSheetTypes.SET_CHECK_SHEET_VALUES:
    
            return {
                ...state,
                checkSheetValues: action.payload
            }

        default:
            return state;
    }

}

export default qualityCheckSheetsReducer;