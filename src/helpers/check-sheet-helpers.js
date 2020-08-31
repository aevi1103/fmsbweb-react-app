import api from '../API'

export const getTargets = record => {
    const { min, max } = record;
    const nom = (max + min) / 2;
    const lowerBound = ((min + nom) / 2);
    const upperBound = ((max + nom) / 2);

    return {
        min,
        lowerBound,
        nom,
        upperBound,
        max
    }
}

export const getValidationStatus = (value, targets, isPassFail) => {

    if (isPassFail) {

        if (value === false) return "error"
        if (value) return "success"
        if (value === undefined || value === null) return null

    } else {

        if (!value) return null;

        const { min, max, lowerBound, upperBound } = targets
        const result = parseFloat(value);

        if (result < min) return "error";
        if (result >= min && result <= lowerBound) return "warning"
        if (result > lowerBound && result < upperBound) return "success"
        if (result >= upperBound && result <= max) return "warning"
        if (result > max) return "error"

    }

}

export const getValidationStatusColorName = (value, targets, isPassFail) => {

    const stat = getValidationStatus(value, targets, isPassFail);

    switch (stat) {
        case 'error':
            return 'red'
        case 'success':
            return 'green'
        case 'warning':
            return 'yellow'
        default:
            return null
    }

}

export const getCheckSheetEntry = async (checkSheetValues, entryId, onSuccess = () => {}, onFailure = () => {}) => {

    try {
            
        const response = await api.get(`/quality/checksheets/checksheetentry?$filter=checkSheetEntryId eq ${entryId}&$expand=rechecks`);  
        const data = response.data[0];
        const newArr = checkSheetValues.filter(i => i.checkSheetEntryId !== entryId);
        newArr.push(data);
        onSuccess(newArr);

    } catch (error) {

        console.error(error);
        onFailure(error);
        
    }

}