import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { 
    Layout,
    Tabs
 } from "antd";

import {
    fetchLineStartAsync,
    fetchMachineStartAsync,
    fetchSubMachineStartAsync,
    fetchPartStartAsync
 } from '../../../redux/quality-check-sheet/quality-check-sheet.actions'

import LineComponent from '../../../components/quality/check-sheet-settings/line.component'
import MachineComponent from '../../../components/quality/check-sheet-settings/machine.component'
import SubMachineComponent from '../../../components/quality/check-sheet-settings/sub-machine.component'
import PartComponent from '../../../components/quality/check-sheet-settings/part.component'

const { Header, Content } = Layout;
const { TabPane } = Tabs;

const CheckSheetSettingsPage = ({
    fetchLineStartAsync,
    fetchMachineStartAsync,
    fetchSubMachineStartAsync,
    fetchPartStartAsync
}) => {

    useEffect(() => {
        document.title = 'Quality Check Sheet Settings';

        fetchLineStartAsync();
        fetchMachineStartAsync('$select=line,value,timestamp&$expand=line($select=value)');
        fetchSubMachineStartAsync('$select=value,machine,timestamp&$expand=machine($expand=line($select=value))');
        fetchPartStartAsync();

    }, [])

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
                        Content of Tab Pane 5
                    </TabPane>
                </Tabs>

            </Content>
        </React.Fragment>
    )
}

const mapDispatchToProps = dispatch => ({
    fetchLineStartAsync: (odataQry) => dispatch(fetchLineStartAsync(odataQry)),
    fetchMachineStartAsync: (odataQry) => dispatch(fetchMachineStartAsync(odataQry)),
    fetchSubMachineStartAsync: (odataQry) => dispatch(fetchSubMachineStartAsync(odataQry)),
    fetchPartStartAsync: (odataQry) => dispatch(fetchPartStartAsync(odataQry))
})

export default connect(null, mapDispatchToProps)(CheckSheetSettingsPage);