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
