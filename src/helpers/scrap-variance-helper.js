import _ from 'lodash';

const getPlantScrapRate = (items, key, ) => 1 - items[key].map(({scrapRate}) => (1 - scrapRate)).reduce((acc, current) => acc * current);
const getPlantScrapQty = (items, key, ) => items[key].map(({qty}) => qty).reduce((acc, current) => acc + current);

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
            
            const weekList = [];
            linkedData.forEach(({monthDetails}) => monthDetails.forEach(({ weekDetails }) => weekList.push(...weekDetails)));
            const groupByWeek = _.groupBy(weekList, 'weekNumber');
            const weekDetails = Object.keys(groupByWeek).map(key => {

                const totalScrap = getPlantScrapRate(groupByWeek, key);
                return {
                    weekNumber: key,
                    key: `Plant_${key}`,
                    area: 'Plant',
                    scrapRate: totalScrap
                }

            })

            //monthly plant scrap
            const monthList = [];
            linkedData.forEach(({monthDetails}) => monthList.push(...monthDetails));
            const groupByMonth = _.groupBy(monthList, 'monthName');
            const monthDetails = Object.keys(groupByMonth).map(key => {

                const totalScrap = getPlantScrapRate(groupByMonth, key);
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

                const totalScrap = getPlantScrapRate(groupByQuarter, key);

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

export const TransformScrapVariancePerProgramData = (data, area) => {

    if (area !== 'Plant') {

        return data[0].details;

    } else {

        const areaList = [];
        data.forEach(({ details }) => details.forEach(({ areaDetails }) => areaList.push(...areaDetails))); //build array of area in each scrap type
        const groupByArea = _.groupBy(areaList, 'program'); //group the areaList by program

        //program details
        const programList = [];
        data.forEach(({ details }) => programList.push(...details)); //build array of details in each srap type
        const groupByProgram = _.groupBy(programList, 'program'); //group program list by program
        const programPareto = Object.keys(groupByProgram).map(program => { //loop in each items

            //area details
            const groupByProgByArea = _.groupBy(groupByArea[program], 'area'); //get items from 'groupByArea' by program
            const areaDetails = Object.keys(groupByProgByArea).map(area => { //loop in each items

                //line details
                const lineList = [];
                const areaItems = groupByProgByArea[area];
                areaItems.forEach(({ lineDetails }) => lineDetails.forEach(line => lineList.push(line)));
                const groupByAreaByLine = _.groupBy(lineList, 'line');

                const lineDetails = Object.keys(groupByAreaByLine).map(line => {

                    return {
                        key: `Plant_${program}_${area}_${line}`,
                        program: program,
                        area: area,
                        line: line,
                        qty: getPlantScrapQty(groupByAreaByLine, line),
                        scrapRate: getPlantScrapRate(groupByAreaByLine, line)
                    }

                })

                // console.log('groupByProgByAreaByLine',{program,area, areaItems, lineList, groupByAreaByLine, lineDetails})

                return {
                    key: `Plant_${program}_${area}`,
                    program: program,
                    area: area,
                    qty: getPlantScrapQty(groupByProgByArea, area),
                    scrapRate: getPlantScrapRate(groupByProgByArea, area),
                    lineDetails: _.orderBy(lineDetails, 'scrapRate', 'desc')
                }

            })

            // console.log('areaDetails',{program, groupByProgByArea, areaDetails})

            return {
                key: `Plant_${program}`,
                scrapAreaName: 'Plant',
                program: program,
                qty: getPlantScrapQty(groupByProgram, program),
                scrapRate: getPlantScrapRate(groupByProgram, program),
                areaDetails: _.orderBy(areaDetails, 'scrapRate', 'desc')
            }

        })

        // console.log({programList, groupByProgram})

        return _.orderBy(programPareto, 'scrapRate', 'desc');
    }

}