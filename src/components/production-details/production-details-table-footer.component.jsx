import React from 'react'
import numeral from 'numeral'
import {
    Table,
    Typography
} from 'antd'

const { Text } = Typography;

const ProductionDetailsTableFooter = ({data, type}) => {

    if (data == null) return null;

    const scrapRate = (scrap, gross) => `${numeral(gross === 0 ? 0 : scrap / gross).format('0.00%')} (${numeral(scrap).format('0,0')})`;
    const getScrap = (scrapAreaname, scrapData) => scrapData
                                        .flatMap(({ sbScrapAreaDetails }) => sbScrapAreaDetails)
                                        .filter(({ scrapAreaName }) => scrapAreaName === scrapAreaname)
                                        .reduce((prev, { qty }) => prev + qty, 0)
    const { 
        target,
        hxhGross,
        sapGross,
        totalSbScrap,
        totalPurchaseScrap,
        detailsByLine,
        oaeTarget,
        sapNet,
        sapOae,
        hxHNet,
        hxHOae,
        totalWarmers

     } = data || {};

    const fs = getScrap('Foundry', detailsByLine);
    const ms = getScrap('Machining', detailsByLine);
    const anod = getScrap('Anodize', detailsByLine);
    const sc = getScrap('Skirt Coat', detailsByLine);
    const assy = getScrap('Assembly', detailsByLine);

    return (
        <Table.Summary.Row style={{ backgroundColor: '#fafafa'}} >
            <Table.Summary.Cell colSpan="2">
                <Text strong>Total</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell>
                <Text strong>{numeral(target).format('0,0')}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell>
                <Text strong>{numeral(hxhGross).format('0,0')}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell>
                <Text strong>{numeral(sapGross).format('0,0')}</Text>
            </Table.Summary.Cell>

            <Table.Summary.Cell>
                <Text strong>{scrapRate(totalSbScrap, sapGross)}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell>
                <Text strong>{scrapRate(totalPurchaseScrap, sapGross)}</Text>
            </Table.Summary.Cell>

            <Table.Summary.Cell>
                <Text strong>{numeral(totalWarmers).format('0,0')}</Text>
            </Table.Summary.Cell>

            <Table.Summary.Cell>
                <Text strong>{scrapRate(fs, sapGross)}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell>
                <Text strong>{scrapRate(ms, sapGross)}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell>
                <Text strong>{scrapRate(anod, sapGross)}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell>
                <Text strong>{scrapRate(sc, sapGross)}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell>
                <Text strong>{scrapRate(assy, sapGross)}</Text>
            </Table.Summary.Cell>

            {
                type === 'line' 
                ?   <Table.Summary.Cell>
                        <Text strong>{numeral(oaeTarget).format('0%')}</Text>
                    </Table.Summary.Cell>
                : null
            }

            <Table.Summary.Cell>
                <Text strong>{numeral(sapNet).format('0,0')}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell>
                <Text strong>{numeral(sapOae).format('0%')}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell>
                <Text strong>{numeral(hxHNet).format('0,0')}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell>
                <Text strong>{numeral(hxHOae).format('0%')}</Text>
            </Table.Summary.Cell>
        </Table.Summary.Row>
    )

}

export default ProductionDetailsTableFooter;