import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import numeral from 'numeral'
import api from '../../../API'
import axios from 'axios';
import _ from 'lodash'

import {
    Table,
    Button,
    Drawer,
    InputNumber,
    Form, 
    Col,
    Row,
    Input,
    Select,
    message,
    Tooltip,
    Popconfirm
} from 'antd'

import {
    fetchCharacteristicStartAsync,
    setControlMethod,
    setPart,
    setMachine
 } from '../../../redux/quality-check-sheet/quality-check-sheet.actions'

import { 
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined
 } from '@ant-design/icons';

const { Option } = Select;

const Characteristics = ({
    isCharacteristicsLoading,
    characteristicsCollection,
    characteristicsErrorMsg,
    fetchCharacteristicStartAsync,

    setControlMethod,
    setPart,
    setMachine,

    controlMethod,
    part,
    machine
}) => {

    const [error, setError] = useState(null) //check if error handler works

    const [fetchLoading, setFetchLoading] = useState(false);
    const [controlMethods, setControlMethods] = useState([]);   
    const [displayAs, setDisplayAs] = useState([]);

    const [partsLoading, setPartsLoading] = useState(false);
    const [parts, setParts] = useState([]);

    const [formPartsLoading, setFormPartsLoading] = useState(false);
    const [formParts, setFormParts] = useState([]);

    const [machineLoading, setMachineLoading] = useState(false)
    const [machines, setMachines] = useState([]);

    const [passFail, setPassFail] = useState(null);
    const [reference, setReference] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [isDraweVisible, setIsDrawerVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [rowData, setRowData] = useState(null);
    const [formTitle, setFormTitle] = useState('');
    const [form] = Form.useForm();

    const getParts = controlId => {
        setControlMethod(controlId)
        setPartsLoading(true);
        // setPart(null)
        api.get(`/quality/checksheets/organizationpart?$filter=controlMethodId eq ${controlId}`)
            .then(response => setParts(response.data))
            .catch(err => setError(err.message))
            .finally(() => setPartsLoading(false))
    }

    useEffect(() => {

        setFetchLoading(true);

        axios.all([
            api.get('quality/checksheets/controlmethod'),
            api.get('quality/checksheets/displayas'),
            api.get(`quality/checksheets/machine?$apply=groupby((value))`)
        ])
        .then(axios.spread((...responses) => {

            setControlMethods(responses[0].data) 
            setDisplayAs(responses[1].data)
            setMachines(responses[2].data)

        }))
        .catch(errors => setError(errors.message))
        .finally(() => setFetchLoading(false))

        if (controlMethod) {
            getParts(controlMethod)
        }

    }, [])

    useEffect(() => {

        const getMachine = (lineId) => {

            form.resetFields(['machineName']);
            setMachineLoading(true);
    
            api.get(`quality/checksheets/machine?$apply=groupby((value))`)
            .then(response => setMachines(response.data))
            .catch(err => setError(err.message))
            .finally(() => setMachineLoading(false))

        }

        const getParts = (controlId) => {
            setFormPartsLoading(true);
            api.get(`/quality/checksheets/organizationpart?$filter=controlMethodId eq ${controlId}`)
                .then(response => setFormParts(response.data))
                .catch(err => setError(err.message))
                .finally(() => setFormPartsLoading(false))
        }

        if (isDraweVisible && isEdit) {
            const { machineName, passFail, organizationPart: { controlMethodId } } = rowData;
            getMachine(machineName);
            getParts(controlMethodId);
            setPassFail(!!passFail);
            form.setFieldsValue({...rowData, controlMethodId })
        }

    }, [isDraweVisible, isEdit, rowData, form, error])

    const onSearch = () => {
        const expand = `$expand=displayAs,organizationPart($expand=controlMethod)`
        const filter = `&$filter=organizationPartId eq ${part} and machineName eq '${machine}' and organizationPart/controlMethodId eq ${controlMethod}`
        fetchCharacteristicStartAsync(expand + filter);
    }

    const onEditRow = (record) => {
        setFormTitle('Edit Characteristic')
        setRowData(record);
        setIsEdit(true)
        setFormVisible(true);
    }

    const onDeleteRow = record => {
        api.delete(`quality/checksheets/characteristic/${record.characteristicId}`)
        .then(response => {
            message.success('New Charateristic Successfully Deleted!', 10);
            onSearch();
        })
        .catch(err => message.error(err.message))
    }

    const onFormClose = () => {
        setFormVisible(false);
        setPassFail(false);
        setReference(false);
        setIsEdit(false);
        form.resetFields();
    }

    const onFinish = async (values) => {

        let req = null;
        let msg = '';
        let body = {};

        setSubmitLoading(true)

        if (!isEdit) {

            body = {
                ...values,
                passFail: passFail ? true : null
            }

            req = api.post('quality/checksheets/characteristic', body)
            msg = 'New Charateristic Successfully Added!';

        } else {

            body = {
                ...values,
                passFail: passFail ? true : null,
                characteristicId: rowData.characteristicId
            }

            req = api.put('quality/checksheets/characteristic', body)
            msg = 'New Charateristic Successfully Updated!';

        }

        req.then(() => {

            message.success(msg, 10);
            form.resetFields();
            onSearch();

            if (isEdit) onFormClose();

        })
        .catch(err => {
            message.error(err.message)
        })
        .finally(() => {
            setSubmitLoading(false)
            setPassFail(false)
        })

    }

    const onFormShow = () => {
        setFormTitle('Create New Characteristic')
        setFormVisible(true);
    }

    const onChangeDisplayAs = (value, option) => {

        if (option.children === 'PassFail') {
            setPassFail(true)
            form.resetFields(['min', 'nom', 'max'])
            return;
        } 

        if (option.children === 'Reference') {
            setPassFail(false);
            setReference(true);
            form.resetFields(['nom', 'max'])
            return;
        }

        setPassFail(false);
        setReference(false);

        if (rowData) {
            const { min, nom, max } = rowData;
            form.setFieldsValue({min, nom, max })
        }

    }

    const onFormControlPlanChange = value => {
        setFormPartsLoading(true);
        form.resetFields(['organizationPartId'])
        api.get(`/quality/checksheets/organizationpart?$filter=controlMethodId eq ${value}`)
            .then(response => setFormParts(response.data))
            .catch(err => setError(err.message))
            .finally(() => setFormPartsLoading(false))
    }

    const onControlPlanChange = value => {
        setPart(null);
        getParts(value);
    }

    const afterVisibleChange = (visible) => setIsDrawerVisible(visible);
    const onSubmit = () => form.submit();
    const onPartChange = value => setPart(value)
    const onMachineChange = value => setMachine(value)

    const columns = [
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record, index) => {
                return <React.Fragment>
                    <Tooltip title="Edit">
                        <Button size="small" type="link" >
                            <EditOutlined onClick={() => onEditRow(record, 'edit')} />
                        </Button>
                    </Tooltip>
                    <Popconfirm  placement="top" title="Do you want to delete this record?" onConfirm={() => onDeleteRow(record)} okText="Yes" cancelText="No">
                        <Button size="small" danger type="link">
                            <DeleteOutlined/>
                        </Button>
                    </Popconfirm>
                </React.Fragment>
            },
            key: 'action',
        },
        {
            title: 'Control Method',
            dataIndex: 'method',
            render: (text, record, index) => {
                return record.organizationPart.controlMethod.method;
            },
            key: 'method',
        },
        {
            title: 'Part',
            dataIndex: 'organizationPart',
            render: (text, record, index) => {
                return record.organizationPart.part;
            },
            key: 'organizationPart',
        },
        {
            title: 'Machine',
            dataIndex: 'machineName',
            render: (text, record, index) => {
                return record.machineName;
            },
            key: 'machineName',
            sorter: (a, b) => a.machineName.length - b.machineName.length,
            filters:  [...new Set(characteristicsCollection.map(({ machineName }) => machineName))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.machineName.indexOf(value) === 0,
        },
        {
            title: 'Ref No',
            dataIndex: 'referenceNo',
            sorter: (a, b) => a.referenceNo.length - b.referenceNo.length,
            key: 'referenceNo',
            filters:  [...new Set(characteristicsCollection.map(({ referenceNo }) => referenceNo))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.referenceNo.indexOf(value) === 0,
        },
        {
            title: 'Characteristic',
            dataIndex: 'value',
            sorter: (a, b) => a.value.length - b.value.length,
            key: 'value',
            filters:  [...new Set(characteristicsCollection.map(({ value }) => value))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.value.indexOf(value) === 0,
        },
        {
            title: 'Gauge',
            dataIndex: 'gauge',
            sorter: (a, b) => a.gauge.length - b.gauge.length,
            key: 'gauge',
            filters:  [...new Set(characteristicsCollection.map(({ gauge }) => gauge))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.gauge.indexOf(value) === 0,
        },
        {
            title: 'Frequency',
            dataIndex: 'frequency',
            sorter: (a, b) => a.frequency - b.frequency,
            key: 'frequency',
            filters:  [...new Set(characteristicsCollection.map(({ frequency }) => frequency))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.frequency.indexOf(value) === 0,
            render: (text, record, index) => {
                return `Every ${record.frequency} hour${record.frequency > 1 ? 's' : ''}`
            },
        },
        {
            title: 'Min',
            dataIndex: 'min',
            key: 'min',
            sorter: (a, b) => a.min - b.min,
            filters:  [...new Set(characteristicsCollection.map(({ min }) => min))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.min.indexOf(value) === 0,
            render: (text, record, index) => {

                const displayAs = record.displayAs.display;
                const val = record.min;

                switch (displayAs) {
                    case 'Percent':      
                        return numeral(val).format('0.00%');
                    case 'Degrees':      
                        return val ? <span>{val}&deg;</span> : null;
                    case 'NegativePositive':      
                        return `-${val}`;
                    case 'PassFail':      
                        return `Pass / Fail`;
                    case 'Reference':      
                        return val;
                    default:
                        return val
                }

            },
        },
        {
            title: 'Nom',
            dataIndex: 'nom',
            key: 'nom',
            sorter: (a, b) => a.nom - b.nom,
            filters:  [...new Set(characteristicsCollection.map(({ nom }) => nom))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.nom.indexOf(value) === 0,
            render: (text, record, index) => {

                const displayAs = record.displayAs.display;
                const val = record.nom;

                switch (displayAs) {
                    case 'Percent':      
                        return numeral(val).format('0.00%');
                    case 'Degrees':      
                    return val ? <span>{val}&deg;</span> : null;
                    case 'PassFail':   
                        return `-`;
                    case 'Reference':    
                        return `Ref`;
                    default:
                        return val
                }
                
            },
        },
        {
            title: 'Max',
            dataIndex: 'max',
            sorter: (a, b) => a.max - b.max,
            filters:  [...new Set(characteristicsCollection.map(({ max }) => max))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.max.indexOf(value) === 0,
            key: 'max',
            render: (text, record, index) => {

                const displayAs = record.displayAs.display;
                const val = record.max;

                switch (displayAs) {
                    case 'Percent':      
                        return numeral(val).format('0.00%');
                    case 'Degrees':      
                        return val ? <span>{val}&deg;</span> : null;
                    case 'NegativePositive':      
                        return `+${val}`;
                    case 'PassFail':    
                    case 'Reference':   
                        return `-`;
                    case 'Positive':      
                        return `+${val}`;
                    default:
                        return val
                }
                
            },
        },
        {
            title: 'Display As',
            dataIndex: 'displayAs',
            sorter: (a, b) => a.displayAs.length - b.displayAs.length,  
            render: (text, record, index) => {
                return record.displayAs.display;
            },
            filters:  [...new Set(characteristicsCollection.map(({ displayAs }) => displayAs.display))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.displayAs.display.indexOf(value) === 0,
            key: 'displayAs',
        },
        {
            title: 'Helper Text',
            dataIndex: 'helperText',
            sorter: (a, b) => a.helperText.length - b.helperText.length,
            key: 'helperText',
        },
        {
            title: 'Time Stamp',
            dataIndex: 'timeStamp',
            sorter: (a, b) => new Date(a.timeStamp) - new Date(b.timeStamp),
            filters:  [...new Set(characteristicsCollection.map(({ timeStamp }) => timeStamp))].map(i => ({text: moment(i).format('llll'), value: i})),
            onFilter: (value, record) => record.timeStamp.indexOf(value) === 0,
            render: (text, record, index) => {
                return moment(record.timeStamp).format('llll');
            },
            key: 'timeStamp',
        },
    ]

    const data = characteristicsCollection.map((data, i) => ({key: i, ...data}));

    return (
        <React.Fragment>
            <Button type="primary" className="mb2" onClick={onFormShow}><PlusOutlined/> New Characteristic</Button>

            <Tooltip title="Select Control Method">
                <Select loading={fetchLoading} 
                    className="ml2" style={{width: '13rem'}} 
                    onChange={onControlPlanChange} 
                    defaultValue={controlMethod}>
                    {
                        controlMethods.map(({controlMethodId, method}) => (
                            <Option key={controlMethodId} value={controlMethodId}>{method}</Option>
                        ))
                    }
                </Select>
            </Tooltip>
            
            <Tooltip title="Select Part Number">
                <Select loading={partsLoading} 
                    className="ml2" 
                    style={{width: '9rem'}} 
                    defaultValue={part}
                    value={part}
                    onChange={onPartChange}>
                    {
                        parts.map(({organizationPartId, part}) => (
                            <Option key={organizationPartId} value={organizationPartId}>{part}</Option>
                        ))
                    }
                </Select>
            </Tooltip>

            <Tooltip title="Select Machine">
                <Select loading={fetchLoading} 
                    className="ml2" 
                    style={{width: '9rem'}} 
                    defaultValue={machine}
                    onChange={onMachineChange}>
                    {
                        machines.map(({ value }) => (
                            <Option key={value} value={value}>{value}</Option>
                        ))
                    }
                </Select>
            </Tooltip>

            <Button type="primary" className="ml2" loading={isCharacteristicsLoading} onClick={onSearch}><SearchOutlined/> Search</Button>

            <Table 
                loading={isCharacteristicsLoading}
                columns={columns}
                dataSource={data}
                size="middle"
                bordered={true}
                pagination={false} />
            
            <Drawer
                title={formTitle}
                width={900}
                onClose={onFormClose}
                visible={formVisible}
                bodyStyle={{ paddingBottom: 80 }}
                afterVisibleChange={afterVisibleChange}
                footer={
                <div
                    style={{
                    textAlign: 'right',
                    }}>

                    <Button onClick={onFormClose} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>

                    <Button onClick={onSubmit} type="primary" loading={submitLoading}>
                        Submit
                    </Button>
                </div>
                }
              >
                <Form layout="vertical" form={form} onFinish={onFinish}>
                
                  <Row gutter={16}>

                    <Col span={12}>
                      <Form.Item
                        name="controlMethodId"
                        label="Control Method"
                        rules={[{ required: true, message: 'Please select control method' }]}>
                        <Select loading={fetchLoading} onChange={onFormControlPlanChange}>
                            {
                                controlMethods.map(({controlMethodId, method}) => (
                                    <Option key={controlMethodId} value={controlMethodId}>{method}</Option>
                                ))
                            }
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="organizationPartId"
                        label="Part No"
                        rules={[{ required: true, message: 'Please select part number' }]}>
                        <Select loading={formPartsLoading}>
                            {
                                formParts.map(({organizationPartId, part}) => (
                                    <Option key={organizationPartId} value={organizationPartId}>{part}</Option>
                                ))
                            }
                        </Select>
                      </Form.Item>
                    </Col>

                  </Row>

                  <Row gutter={16}>

                    <Col span={8}>
                      <Form.Item
                        name="machineName"
                        label="Machine"
                        rules={[{ required: true, message: 'Please select machine' }]}>
                        <Select loading={machineLoading}>
                            {
                                machines.map(({ value }) => (
                                    <Option key={value} value={value}>{value}</Option>
                                ))
                            }
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        name="referenceNo"
                        label="Reference Number"
                        rules={[{ required: true, message: 'Please enter reference no' }]}>
                        <Input/>
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        name="value"
                        label="Characteristics"
                        rules={[{ required: true, message: 'Please enter characteristics' }]}>
                        <Input/>
                      </Form.Item>
                    </Col>

                  </Row>

                  <Row gutter={16}>

                    <Col span={8}>
                      <Form.Item
                        name="gauge"
                        label="Gauge"
                        rules={[{ required: true, message: 'Please enter gauge' }]}>
                        <Input/>
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        name="frequency"
                        label="Frequency"
                        rules={[{ required: true, message: 'Please enter frequency' }]}>
                            <Select onChange={onChangeDisplayAs} loading={fetchLoading}>
                                {
                                    _.range(8).map(i => <Option key={i+1} value={i+1}>{`Every ${i+1} hour${i+1 > 1 ? 's' : ''}`}</Option>)
                                }   
                            </Select>
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="displayAsId"
                            label="Display As"
                            rules={[{ required: true, message: 'Please enter display as' }]}>
                            <Select onChange={onChangeDisplayAs} loading={fetchLoading}>
                                {
                                    displayAs.map(({displayAsId, display}) => <Option key={displayAsId} value={displayAsId}>{display}</Option>)
                                }   
                            </Select>
                        </Form.Item>
                    </Col>

                  </Row>

                  <Row gutter={16}>

                    <Col span={8}>
                        <Form.Item
                            name="min"
                            label="Min">
                            <InputNumber disabled={passFail} style={{
                                width: '100%',
                            }}/>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="nom"
                            label="Nom">
                            <InputNumber disabled={passFail || reference} style={{
                                width: '100%',
                            }}/>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="max"
                            label="Max">
                            <InputNumber disabled={passFail || reference} style={{
                                width: '100%',
                            }}/>
                        </Form.Item>
                    </Col>

                  </Row>

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="helperText"
                        label="Helper Text">
                        <Input.TextArea rows={4}  />
                      </Form.Item>
                    </Col>
                  </Row>

                </Form>
              </Drawer>

        </React.Fragment>) 
}


const mapDispatchToProps = dispatch => ({
    fetchCharacteristicStartAsync: (odataQry) => dispatch(fetchCharacteristicStartAsync(odataQry)),
    setControlMethod: value => dispatch(setControlMethod(value)),
    setPart: value => dispatch(setPart(value)),
    setMachine: value => dispatch(setMachine(value))
})

const mapStateToProps = ({ qualityCheckSheet }) => ({
    isCharacteristicsLoading: qualityCheckSheet.isCharacteristicsLoading,
    characteristicsCollection: qualityCheckSheet.characteristicsCollection,
    characteristicsErrorMsg: qualityCheckSheet.characteristicsErrorMsg,
    controlMethod: qualityCheckSheet.controlMethod,
    part: qualityCheckSheet.part,
    machine: qualityCheckSheet.machine,
})

export default connect(mapStateToProps, mapDispatchToProps)(Characteristics)