export const getDowntimeByOwner = (downtimeCollection, dept, shift) => {

    const { chartData } = downtimeCollection;
    const { data } = chartData.find(({ seriesname }) => seriesname === shift);
    const { ownerDetails } = data.find(d => d.dept === dept);
    return {
        dept,
        shift,
        ownerTitle: `${dept} - Shift ${shift} - Dowtime By Owner`,
        ownerDetails
    };

}

export const getDowntimeByLine = (ownerDetails, dept, shift, owner) => {

    const { lineDetails } = ownerDetails.find(({ type }) => type === owner);
    return {
        dept,
        shift,
        owner,
        lineTitle: `${dept} - Shift ${shift} - ${owner} - Dowtime By Line`,
        lineDetails
    };

}