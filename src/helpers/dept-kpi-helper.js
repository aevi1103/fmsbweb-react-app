import numeral from 'numeral';

export const TransformDeptKpiData = (data, area) => {

    if (!data || data.length === 0) return null;
    if (area === 'Plant') return [];

    const {
        sapOae,
        oaeColor,
        oaeTarget,
        downtimeRate,
        unkownRate,
        scrapDetails,
        totalProduction,
        sapGross
    } = data;

    const scrapDetailsItems = scrapDetails.map(({ scrapAreaName, scrapRate, scrapQty, colorCode }) => ({
        label: scrapAreaName,
        color: colorCode,
        value: (scrapRate * 100).toFixed(2),
        toolText: `<b>SAP Gross</b> ${numeral(sapGross).format('0,0')} <br>
                    <b>Scrap Qty</b> ${numeral(scrapQty).format('0,0')} <br>
                    <b>Scrap %</b> ${numeral(scrapRate).format('0.00%')} <br>`
    }))

    return [
        {
            label: 'OAE %',
            value: (sapOae * 100).toFixed(2),
            color: oaeColor,
            toolText: `<b>OAE Target</b> ${numeral(oaeTarget).format('0.00%')} <br>
                        <b>SAP Net</b> ${numeral(totalProduction).format('0,0')} <br>                
                        <b>OAE %</b> ${numeral(sapOae).format('0.00%')}`
        },
        {
            label: 'Downtime %',
            color: '#5969bf',
            value: (downtimeRate * 100).toFixed(2),
        },
        {
            label: 'Unknown %',
            color: '#8598a0',
            value: (unkownRate * 100).toFixed(2)
        },
        ...scrapDetailsItems,

    ]

}