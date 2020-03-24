import _ from 'lodash';

export const TransformScrapVarianceData = (data, area) => {

    if (!data) return null;

    const category = data[0].details.map(({ quarter, target }) => ({ quarter, target }));
    const linkedData = [];
    data.forEach(({ details }) => linkedData.push(...details));

    if (area === 'Plant') {

         /*
        Total Scrap Calculation:
        1. group data by quarter
        2. loop for each keys and get data arr
        3. map scrap rates subtract 1 - scrap rate
        4. reduce multiply each items
        5. subtarct total to 1
        */

        try {
            
            const getTotalScrap = (items, key, ) => 1 - items[key].map(({scrapRate}) => (1 - scrapRate)).reduce((acc, current) => acc * current);

            const weekList = [];
            linkedData.forEach(({monthDetails}) => monthDetails.forEach(({ weekDetails }) => weekList.push(...weekDetails)));
            const groupByWeek = _.groupBy(weekList, 'weekNumber');
            const weekDetails = Object.keys(groupByWeek).map(key => {

                const totalScrap = getTotalScrap(groupByWeek, key);
                return {
                    weekNumber: key,
                    key: `Plant_${key}`,
                    area: 'Plant',
                    scrapRate: totalScrap
                }

            })

            // console.log('week list', {groupByWeek, weekDetails});

            //monthly plant scrap
            const monthList = [];
            linkedData.forEach(({monthDetails}) => monthList.push(...monthDetails));
            const groupByMonth = _.groupBy(monthList, 'monthName');
            const monthDetails = Object.keys(groupByMonth).map(key => {

                const totalScrap = getTotalScrap(groupByMonth, key);
                return {
                    monthName: key,
                    key: `Plant_${key}`,
                    area: 'Plant',
                    scrapRate: totalScrap,
                    weekDetails: weekDetails.filter(({weekNumber}) => weekNumber.includes(key))
                }

            })

            //quarterly plant scrap
            const groupByQuarter = _.groupBy(linkedData, 'quarter');
            const quarterlyDetails = Object.keys(groupByQuarter).map(key => {

                const totalScrap = getTotalScrap(groupByQuarter, key);

                return {
                    quarter: key,
                    key: `Plant_${key}`,
                    area: 'Plant',
                    scrapRate: totalScrap,
                    monthDetails: monthDetails.filter(({ monthName }) => monthName.includes(key))
                }

            })

            data.push({
                scrapType: 'Plant',
                details: quarterlyDetails,
            })

            linkedData.push(...quarterlyDetails);

        } catch (error) {
            console.error(error.message)
        }
    }

   

    return {
        category,
        linkedData,
        data,
        area
    };

}