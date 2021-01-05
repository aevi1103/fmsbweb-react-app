import React from 'react'
import numeral from 'numeral'

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

const OeeCards = ({ state }) => {

    const plcDowntime = state.oee?.status?.plcDowntime ?? 0;

    const cycleTimeSeconds = numeral(state.oee?.status?.cycleTimeSeconds ?? 0).format('0.00');
    const cycleTimeMinutes = numeral(state.oee?.status?.cycleTimeMinutes ?? 0).format('0.00');
    const allTime = getTimeStatus(state.oee?.status?.allTime);
    const plannedDowntime = getTimeStatus(state.oee?.status?.plannedDowntime);
    const plannedProductionTime = getTimeStatus(state.oee?.status?.plannedProductionTime);
    const runtTime = getTimeStatus(state.oee?.status?.runtTime);

    return (

        <Row gutter={[6,6]}>

            <Col span={24}>
                <Row gutter={[32,0]}>
                    <Col><b>Cycle Time :</b> { cycleTimeSeconds } sec. / { cycleTimeMinutes } min. </Col>
                    <Col><b>All Time:</b> { allTime }</Col>
                    <Col><b>Planned Downtime:</b> { plannedDowntime }</Col>
                    <Col><b>Planned Production Time:</b> { plannedProductionTime }</Col>
                    <Col><b>Unplanned Downtime:</b> { getTimeStatus(plcDowntime) }</Col>
                    <Col><b>Runtime:</b> { runtTime }</Col>
                </Row>
            </Col>

            <Col span={6}>

                <Wrapper value={state.oee?.status?.oee ?? 0}>
                    <SubTitle>OEE</SubTitle>
                    <Centered> 
                        <Kpi>
                            { numeral(state.oee?.status?.oee ?? 0).format('0%') } 
                        </Kpi>
                    </Centered>
                    <SmallSubTitle>Availabity × Performance × Quality = OEE</SmallSubTitle>
                </Wrapper>
                        
            </Col>

            <Col span={6}>

                <Wrapper value={state.oee?.status?.availability ?? 0}>
                    <SubTitle>Availability</SubTitle>
                    <Centered> 
                        <Kpi>
                            { numeral(state.oee?.status?.availability ?? 0).format('0%') } 
                        </Kpi>
                    </Centered>
                    <SmallSubTitle>Runtime / Planned Production Time = Availability</SmallSubTitle>
                </Wrapper>
                    
            </Col>

            <Col span={6}>

                <Wrapper value={state.oee?.status?.performance ?? 0}>
                    <SubTitle>Performance</SubTitle>
                    <Centered> 
                        <Kpi>
                            { numeral(state.oee?.status?.performance ?? 0).format('0%') } 
                        </Kpi>
                    </Centered>
                    <SmallSubTitle>Total Parts / Capacity = Performance</SmallSubTitle>
                </Wrapper>
                

            </Col>

            <Col span={6}>

                <Wrapper value={state.oee?.status?.quality ?? 0}>
                    <SubTitle>Quality</SubTitle>
                    <Centered> 
                        <Kpi>
                            { numeral(state.oee?.status?.quality ?? 0).format('0%') } 
                        </Kpi>
                    </Centered>
                    <SmallSubTitle>Total Good Parts / Total Parts = Quality</SmallSubTitle>
                </Wrapper>

            </Col>

            <Col span={6}>

                <Wrapper>
                    <SubTitle dark>Total Good Parts</SubTitle>
                    <Centered> 
                        <Kpi success>
                            { numeral(state.oee?.status?.net ?? 0).format('0,0') } 
                        </Kpi>
                    </Centered>

                    <HourlyProdChart state={state} />
                </Wrapper>

            </Col>

            <Col span={6}>

                <Wrapper>
                    <SubTitle dark>Unplanned Downtime (Minutes)</SubTitle>
                    <Centered> 
                        <Kpi warning>
                            { numeral(state.oee?.status?.plcDowntime ?? 0).format('0,0') }
                        </Kpi>
                    </Centered>
                    <DowntimeChart state={state} />
                </Wrapper>

            </Col>

            <Col span={6}>

                <Row gutter={[6,6]}>

                    <Col span={24}>
                        <Wrapper>
                            <SubTitle dark>Capacity (Parts)</SubTitle>
                            <Centered> 
                                <Kpi dark>
                                    { numeral(state.oee?.status?.capacity ?? 0).format('0,0') }
                                </Kpi>
                            </Centered>
                        </Wrapper>
                    </Col>

                    <Col span={24}>
                        <Wrapper>
                            <SubTitle dark>Total Parts</SubTitle>
                            <Centered> 
                                <Kpi dark>
                                    { numeral(state.oee?.status?.gross ?? 0).format('0,0') }
                                </Kpi>
                            </Centered>
                        </Wrapper>
                    </Col>

                </Row>

            </Col>

            <Col span={6}>

                <Wrapper>
                    <SubTitle dark>Total Bad Parts</SubTitle>
                    <Centered> 
                        <Kpi danger>
                            { numeral(state.oee?.status?.scrapTotal ?? 0).format('0,0') }
                        </Kpi>
                    </Centered>

                    <ScrapChart state={state} />
                </Wrapper>

            </Col>

        </Row>

    )
}

export default OeeCards;