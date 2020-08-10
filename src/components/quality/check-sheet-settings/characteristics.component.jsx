import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import numeral from 'numeral'
import api from '../../../API'

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
    setLine
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
    setLine,

    controlMethod,
    part,
    line
}) => {

    const [errors, setErrors] = useState([])

    const [controlMethodLoading, setControlMethodLoading] = useState(false)
    const [controlMethods, setControlMethods] = useState([]);

    const [partLoading, setPartLoading] = useState(false)
    const [parts, setParts] = useState([]);

    const [lineLoading, setLineLoading] = useState(false)
    const [lines, setLines] = useState([]);

    const [machineLoading, setMachineLoading] = useState(false)
    const [machines, setMachines] = useState([]);

    const [displayAsLoading, setDisplayAsLoading] = useState(false)
    const [displayAs, setDisplayAs] = useState([]);

    const [passFail, setPassFail] = useState(null)
    const [formVisible, setFormVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [form] = Form.useForm();

    const addError = (error) => setErrors(errors.push(error))

    useEffect(() => {
        
        //control method
        setControlMethodLoading(true);
        api.get('quality/checksheets/controlmethod')
        .then(response => setControlMethods(response.data))
        .catch(err => addError(err.message))
        .finally(() => setControlMethodLoading(false))

        //part number
        setPartLoading(true);
        api.get('quality/checksheets/organizationpart')
        .then(response => setParts(response.data))
        .catch(err => addError(err.message))
        .finally(() => setPartLoading(false))

        //line
        setLineLoading(true);
        api.get('quality/checksheets/line')
        .then(response => setLines(response.data))
        .catch(err => addError(err.message))
        .finally(() => setLineLoading(false))

        //display as
        setDisplayAsLoading(true);
        api.get('quality/checksheets/displayas')
        .then(response => setDisplayAs(response.data))
        .catch(err => addError(err.message))
        .finally(() => setDisplayAsLoading(false))

    }, [])

    const onSearch = () => {
        const expand = `$expand=controlMethod,displayAs,organizationPart,machine($expand=line)`
        const filter = `&$filter=controlMethodId eq ${controlMethod} and organizationPartId eq ${part} and machine/lineId eq ${line}`
        fetchCharacteristicStartAsync(expand + filter);
    }

    const onEditRow = (record) => {

        console.log(record)

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
            dataIndex: 'controlMethod',
            render: (text, record, index) => {
                return record.controlMethod.method;
            },
            key: 'controlMethod',
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
            title: 'Line',
            dataIndex: 'line',
            render: (text, record, index) => {
                return record.machine.line.value;
            },
            key: 'line',
        },
        {
            title: 'Machine',
            dataIndex: 'machine',
            render: (text, record, index) => {
                return record.machine.value;
            },
            sorter: (a, b) => a.machine.value.length - b.machine.value.length,
            key: 'machine',
            filters:  [...new Set(characteristicsCollection.map(({ machine }) => machine.value))].map(i => ({text: i, value: i})),
            onFilter: (value, record) => record.machine.value.indexOf(value) === 0,
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
                    case 'PositiveNegative':      
                        return `-${val}`;
                    case 'PassFail':      
                        return `Pass / Fail`;
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
                        return `Pass / Fail`;
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
                    case 'PositiveNegative':      
                        return `+${val}`;
                    case 'PassFail':      
                        return `Pass / Fail`;
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

    const onFormClose = () => {
        setFormVisible(false);
        setPassFail(false);
        form.resetFields();
    }

    const onFormShow = () => setFormVisible(true);

    const onLinesChange = (value) => {

        form.resetFields(['machine']);

        setMachineLoading(true);
        api.get(`quality/checksheets/machine?$filter=lineId eq ${value}`)
        .then(response => setMachines(response.data))
        .catch(err => addError(err.message))
        .finally(() => setMachineLoading(false))

    }

    const onChangeDisplayAs = (value, option) => {
        if (option.children === 'PassFail') {
            setPassFail(true)
        } else {
            setPassFail(false)
        }
    }

    const onFinish = async (values) => {

        setSubmitLoading(true)
        api.post('quality/checksheets/characteristic', {...values, passFail: passFail ? true : null})
        .then(response => {
            message.success('New Charateristic Successfully Added!', 10);
            form.resetFields();
            onSearch();
        })
        .catch(err => {
            message.error(err.message)
        })
        .finally(() => {
            setSubmitLoading(false)
            setPassFail(false)
        })
        
    }

    const onSubmit = () => form.submit();

    const onControlPlanChange = value => setControlMethod(value)
    const onPartChange = value => setPart(value)
    const onLineChange = value => setLine(value)

    return (
        <React.Fragment>
            <Button type="primary" className="mb2" onClick={onFormShow}><PlusOutlined/> New Characteristic</Button>

            <Tooltip title="Select Control Method">
                <Select loading={controlMethodLoading} 
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
                <Select loading={partLoading} 
                    className="ml2" 
                    style={{width: '9rem'}} 
                    defaultValue={part}
                    onChange={onPartChange}>
                    {
                        parts.map(({organizationPartId, part}) => (
                            <Option key={organizationPartId} value={organizationPartId}>{part}</Option>
                        ))
                    }
                </Select>
            </Tooltip>

            <Tooltip title="Select Line">
                <Select loading={lineLoading} 
                    className="ml2" 
                    style={{width: '4rem'}} 
                    defaultValue={line}
                    onChange={onLineChange}>
                    {
                        lines.map(({lineId, value}) => (
                            <Option key={lineId} value={lineId}>{value}</Option>
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
                title="Create a new characteristics"
                width={720}
                onClose={onFormClose}
                visible={formVisible}
                bodyStyle={{ paddingBottom: 80 }}
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
                        <Select loading={controlMethodLoading} >
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
                        <Select loading={partLoading}>
                            {
                                parts.map(({organizationPartId, part}) => (
                                    <Option key={organizationPartId} value={organizationPartId}>{part}</Option>
                                ))
                            }
                        </Select>
                      </Form.Item>
                    </Col>

                  </Row>

                  <Row gutter={16}>

                    <Col span={12}>
                      <Form.Item
                        
                        name="lineId"
                        label="Line"
                        rules={[{ required: true, message: 'Please select line' }]}>
                        <Select loading={lineLoading} onChange={onLinesChange}>
                            {
                                lines.map(({lineId, value}) => (
                                    <Option key={lineId} value={lineId}>{value}</Option>
                                ))
                            }
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="machineId"
                        label="Machine"
                        rules={[{ required: true, message: 'Please select machine' }]}>
                        <Select loading={machineLoading}>
                            {
                                machines.map(({machineId, value}) => (
                                    <Option key={machineId} value={machineId}>{value}</Option>
                                ))
                            }
                        </Select>
                      </Form.Item>
                    </Col>

                  </Row>

                  <Row gutter={16}>

                    <Col span={12}>
                      <Form.Item
                        name="referenceNo"
                        label="Reference Number"
                        rules={[{ required: true, message: 'Please enter reference no' }]}>
                        <Input/>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
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
                        <InputNumber style={{
                            width: '100%',
                        }}/>
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="displayAsId"
                            label="Display As"
                            rules={[{ required: true, message: 'Please enter display as' }]}>
                            <Select onChange={onChangeDisplayAs} loading={displayAsLoading}>
                                {
                                    displayAs.map(({displayAsId, display}) => (
                                        <Option key={displayAsId} value={displayAsId}>{display}</Option>
                                    ))
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
                            <InputNumber disabled={passFail} style={{
                                width: '100%',
                            }}/>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="max"
                            label="Max">
                            <InputNumber disabled={passFail} style={{
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
    setLine: value => dispatch(setLine(value))
})

const mapStateToProps = ({ qualityCheckSheet }) => ({
    isCharacteristicsLoading: qualityCheckSheet.isCharacteristicsLoading,
    characteristicsCollection: qualityCheckSheet.characteristicsCollection,
    characteristicsErrorMsg: qualityCheckSheet.characteristicsErrorMsg,
    controlMethod: qualityCheckSheet.controlMethod,
    part: qualityCheckSheet.part,
    line: qualityCheckSheet.line,
})

export default connect(mapStateToProps, mapDispatchToProps)(Characteristics)