
import numeral from 'numeral';

export const numberSorter = (a, b) => (numeral(a).format('0') - numeral(b).format('0'));