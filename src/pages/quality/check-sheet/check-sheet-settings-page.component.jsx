import React from 'react'
import { 
    Layout,
    Tabs
 } from "antd";

import LineComponent from '../../../components/quality/check-sheet-settings/line.component'
import MachineComponent from '../../../components/quality/check-sheet-settings/machine.component'
import SubMachineComponent from '../../../components/quality/check-sheet-settings/sub-machine.component'
import PartComponent from '../../../components/quality/check-sheet-settings/part.component'
import CharacteristicsComponent from '../../../components/quality/check-sheet-settings/characteristics.component'

const { Header, Content } = Layout;
const { TabPane } = Tabs;

const CheckSheetSettingsPage = () => {

    return (
        <React.Fragment>
            <Header className="pa0 custom-header" >
                <h2 className="ml3">Quality Check Sheet Settings</h2>
            </Header>

            <Content className="ma3 mt0">

                <Tabs defaultActiveKey="1" >
                    <TabPane tab="Line" key="1">
                        <LineComponent/>
                    </TabPane>
                    <TabPane tab="Machine" key="2">
                        <MachineComponent/>
                    </TabPane>
                    <TabPane tab="Sub-Machine" key="3">
                        <SubMachineComponent/>
                    </TabPane>
                    <TabPane tab="Part" key="4">
                        <PartComponent/>
                    </TabPane>
                    <TabPane tab="Characteristics" key="5">
                        <CharacteristicsComponent/>
                    </TabPane>
                </Tabs>

            </Content>
        </React.Fragment>
    )
}

export default CheckSheetSettingsPage;