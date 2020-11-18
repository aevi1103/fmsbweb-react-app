export const getColorCode = (doh, safetyStock) => {

    if(safetyStock === 0 ) return null;

    if (doh <= 2) return '#e33545'; //red
    if (doh > 2 && doh <= 3) return '#ffc107'; //yellow
    if (doh > 3 && doh <= 5) return '#28a745'; //green
    if (doh > 5) return '#2196F3'; //blue
 }

 export const getColorRowClass = (doh, safetyStock) => {

    if(safetyStock === 0 ) return '';

    if (doh <= 2) return 'red-row'; //red
    if (doh > 2 && doh <= 3) return 'yellow-row'; //yellow
    if (doh > 3 && doh <= 5) return 'green-row'; //green
    if (doh > 5) return 'blue-row'; //blue
 }