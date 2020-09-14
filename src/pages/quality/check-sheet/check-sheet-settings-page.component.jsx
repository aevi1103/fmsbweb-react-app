import React, { useEffect, useState } from 'react'
import { 
    Layout,
    Tabs,
    PageHeader
 } from "antd";
 import { useLocation, useHistory  } from 'react-router-dom'

import LineComponent from '../../../components/quality/check-sheet-settings/line.component'
import MachineComponent from '../../../components/quality/check-sheet-settings/machine.component'
import SubMachineComponent from '../../../components/quality/check-sheet-settings/sub-machine.component'
import PartComponent from '../../../components/quality/check-sheet-settings/part.component'
import CharacteristicsComponent from '../../../components/quality/check-sheet-settings/characteristics.component'

const { Header, Content } = Layout;
const { TabPane } = Tabs;

const CheckSheetSettingsPage = () => {

    const { hash } = useLocation();
    const history = useHistory();
    const [tabName, setTabName] = useState(hash || '#Line');
    const [title, setTitle] = useState('')

    useEffect(() => {
        history.push(tabName)
    }, [])

    useEffect(() => {
        const ttl = `Quality Check Sheet Settings: ${tabName.replace('#','')}`;
        document.title = ttl;
        setTitle(ttl)
    }, [tabName])

    const onTabClick = key => {
        history.push(key)
        setTabName(key)
    }

    return (
        <React.Fragment>

            <PageHeader
                className="site-page-header"
                title={title}
            />

            <Content className="ma3 mt0">

                <Tabs defaultActiveKey={hash} onTabClick={onTabClick}>
                    <TabPane tab="Line" key="#Line">
                        <LineComponent/>
                    </TabPane>
                    <TabPane tab="Machine" key="#Machine">
                        <MachineComponent/>
                    </TabPane>
                    <TabPane tab="Sub-Machine" key="#Sub-Machine">
                        <SubMachineComponent/>
                    </TabPane>
                    <TabPane tab="Part" key="#Part">
                        <PartComponent/>
                    </TabPane>
                    <TabPane tab="Characteristics" key="#Characteristics">
                        <CharacteristicsComponent/>
                    </TabPane>
                </Tabs>

            </Content>
        </React.Fragment>
    )
}

export default CheckSheetSettingsPage;