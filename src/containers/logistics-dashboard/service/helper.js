import { red, green, yellow, blue } from '../../../core/utilities/colors'

export const getColorCode = (doh, safetyStock) => {

    if(safetyStock === 0 ) return null;

    if (doh <= 2) return red; //red
    if (doh > 2 && doh <= 3) return yellow; //yellow
    if (doh > 3 && doh <= 5) return green; //green
    if (doh > 5) return blue; //blue
 }

 export const getColorRowClass = (doh, safetyStock) => {

    if(safetyStock === 0 ) return '';

    if (doh <= 2) return 'red-row'; //red
    if (doh > 2 && doh <= 3) return 'yellow-row'; //yellow
    if (doh > 3 && doh <= 5) return 'green-row'; //green
    if (doh > 5) return 'blue-row'; //blue
 }