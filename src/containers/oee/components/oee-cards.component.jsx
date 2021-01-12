import React from 'react'
import numeral from 'numeral'
import { useSelector } from 'react-redux'
import HourlyProdChart from './hourly-prod-chart.component'
import DowntimeChart from './downtime-chart.component'
import ScrapChart from './scrap-chart.component'

import { 
    Row,
    Col
 } from "antd";

import {
    Wrapper,
    Centered,
    Kpi,
    SubTitle,
    SmallSubTitle
} from '../oee.style'

const getTimeStatus = value => {
    return (
        <span>
            { numeral(value ?? 0).format('0,0') } min. / { numeral((value ?? 0) / 60).format('0,0.00') } hrs.
        </span>
    )
}

const decimalFormat = '0.00'

const OeeCards = () => {

    const oeeState = useSelector(({ oeeReducer }) => oeeReducer?.oee?.status) 
    const { 
        cycleTimeSeconds,
        plcDowntime,
        allTime,
        plannedDowntime,
        plannedProductionTime,
        runtTime,
        availability,
        performance,
        quality,
        oee,
        net,
        capacity,
        gross,
        scrapTotal
    } = oeeState || {};

    const cycleTime = cycleTimeSeconds
    const ppm = 60 / cycleTime;
    const ppmFormat = numeral(ppm).format(decimalFormat);

    return (

        <Row gutter={[6,6]}>

            <Col span={24}>
                <Row gutter={[32,0]}>
                    <Col><b>Ideal Cycle Time :</b> { numeral(cycleTime).format(decimalFormat) } seconds / { ppmFormat } parts per minute</Col>
                    <Col><b>All Time:</b> { allTime }</Col>
                    <Col><b>Planned Downtime:</b> { plannedDowntime }</Col>
                    <Col><b>Planned Production Time:</b> { plannedProductionTime }</Col>
                    <Col><b>Unplanned Downtime:</b> { getTimeStatus(plcDowntime) }</Col>
                    <Col><b>Runtime:</b> { runtTime }</Col>
                </Row>
            </Col>

            <Col md={6} sm={12} xs={24} >

                <Wrapper value={oee ?? 0}>
                    <SubTitle>OEE</SubTitle>
                    <Centered> 
                        <Kpi>
                            { numeral(oee ?? 0).format('0%') } 
                        </Kpi>
                    </Centered>
                    <SmallSubTitle>Availabity × Performance × Quality = OEE</SmallSubTitle>
                </Wrapper>
                        
            </Col>

            <Col md={6} sm={12} xs={24}>

                <Wrapper value={availability}>
                    <SubTitle>Availability</SubTitle>
                    <Centered> 
                        <Kpi>
                            { numeral((availability ?? 0) < 0 ? 0 : availability).format('0%') } 
                        </Kpi>
                    </Centered>
                    <SmallSubTitle>Runtime / Planned Production Time = Availability</SmallSubTitle>
                </Wrapper>
                    
            </Col>

            <Col md={6} sm={12} xs={24}>

                <Wrapper value={performance}>
                    <SubTitle>Performance</SubTitle>
                    <Centered> 
                        <Kpi>
                            { numeral((performance ?? 0) < 0 ? 0 : performance).format('0%') } 
                        </Kpi>
                    </Centered>
                    <SmallSubTitle>Total Parts / Capacity = Performance</SmallSubTitle>
                </Wrapper>
                

            </Col>

            <Col md={6} sm={12} xs={24}>

                <Wrapper value={quality}>
                    <SubTitle>Quality</SubTitle>
                    <Centered> 
                        <Kpi>
                            { numeral((quality ?? 0) < 0 ? 0 : quality).format('0%') } 
                        </Kpi>
                    </Centered>
                    <SmallSubTitle>Total Good Parts / Total Parts = Quality</SmallSubTitle>
                </Wrapper>

            </Col>

            <Col md={6} sm={12} xs={24}>

                <Wrapper>
                    <SubTitle dark>Total Good Parts</SubTitle>
                    <Centered> 
                        <Kpi success>
                            { numeral(net ?? 0).format('0,0') } 
                        </Kpi>
                    </Centered>

                    <HourlyProdChart />
                </Wrapper>

            </Col>

            <Col md={6} sm={12} xs={24}>

                <Wrapper>
                    <SubTitle dark>Unplanned Downtime (Minutes)</SubTitle>
                    <Centered> 
                        <Kpi warning>
                            { numeral(plcDowntime ?? 0).format('0,0') }
                        </Kpi>
                    </Centered>
                    <DowntimeChart />
                </Wrapper>

            </Col>

            <Col md={6} sm={12} xs={24}>

                <Row gutter={[6,6]}>

                    <Col span={24}>
                        <Wrapper>
                            <SubTitle dark>Capacity</SubTitle>
                            <Centered> 
                                <Kpi dark>
                                    { numeral(capacity ?? 0).format('0,0') }
                                </Kpi>
                            </Centered>
                            <SmallSubTitle dark>Parts per minute × Runtime = Capacity</SmallSubTitle>
                        </Wrapper>
                    </Col>

                    <Col span={24}>
                        <Wrapper>
                            <SubTitle dark>Total Parts</SubTitle>
                            <Centered> 
                                <Kpi dark>
                                    { numeral(gross ?? 0).format('0,0') }
                                </Kpi>
                            </Centered>
                        </Wrapper>
                    </Col>

                </Row>

            </Col>

            <Col md={6} sm={12} xs={24}>

                <Wrapper>
                    <SubTitle dark>Total Bad Parts</SubTitle>
                    <Centered> 
                        <Kpi danger>
                            { numeral(scrapTotal ?? 0).format('0,0') }
                        </Kpi>
                    </Centered>

                    <ScrapChart />
                </Wrapper>

            </Col>

        </Row>

    )
}

export default OeeCards;