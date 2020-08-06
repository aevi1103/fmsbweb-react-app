import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import numeral from 'numeral';
import api from '../../../API'
import SapNetTable from '../../../components/production-details/sap-net-table/sap-net-table.component';
import DefectSummaryTable from '../../../components/production-details/defect-summary-table/defect-summary-table.component';
import EosTable from '../../../components/af-eos-table/af-eos-table.component'

import {
    fetchDeptLineStartAsync,
    fetchDeptEosStartAsync,
    clearDeptEosResult,
    fetchDeptEosCollectionStartAsync,
    setDeptEosCollection
} from '../../../redux/af-eos/af-eos.actions'

import { getUrlParameter, updateUrlQryParameter } from '../../../helpers/helpers'

import {
    Layout,
    Form,
    Input,
    Button,
    DatePicker,
    Select,
    Typography,
    Row,
    Col,
    InputNumber,
    Card,
    Statistic,
    Divider,
    Modal,
    Tooltip,
    message,
    Alert,
    Popconfirm
} from "antd";

import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    InfoCircleOutlined,
    LinkOutlined
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Option } = Select;
const { Text } = Typography;
const { TextArea  } = Input;

const formLayout = {
    labelCol: {
        xs: {
        span: 24,
        },
        sm: {
        span: 8,
        }
    },
    wrapperCol: {
        xs: {
        span: 24,
        },
        sm: {
        span:24,
        },
    },
};

const gridLayout = {
    xs: 24,
    sm: 12,
    xl: 6
}

const EosPage = ({
    fetchDeptLineStartAsync,
    isDeptLinesFetching,
    deptLinesCollection,
    fetchDeptEosStartAsync,
    fetchDeptEosCollectionStartAsync,
    isDeptEosFetching,
    deptEosResult,
    clearDeptEosResult,
    deptEosCollectionResult,
    isDeptEosCollectionFetching,
    setDeptEosCollection
}) => {

    const green = { color: '#3f8600' }
    const red = { color: '#cf1322' }
    const dateFormat = 'MM/DD/YYYY';
    
    const deptQry = getUrlParameter('dept');
    const dateQry = getUrlParameter('date');
    const shiftQry = getUrlParameter('shift');
    
    const defaultDept = getUrlParameter('dept') ? deptQry : "Assembly";
    const defaultShiftDate = dateQry ? moment(dateQry) : moment();
    const defaultShiftDateStr = defaultShiftDate.format(dateFormat);
    const defaultShift = shiftQry ? shiftQry : null;

    useEffect(() => {

        fetchDeptLineStartAsync();
        clearDeptEosResult();
        setDeptEosCollection();

    }, [])

    const [dept, setDept] = useState(defaultDept);
    const [shiftDate, setShiftDate] = useState(defaultShiftDate);
    const [shiftDateStr, setShiftDateStr] = useState(defaultShiftDateStr)
    const [shift, setShift] = useState(defaultShift);
    const [line, setLine] = useState(null);
    const [machine, setMachine] = useState(null);
    const [title, setTitle] = useState('Production Summary');
    const [eosTitle, setEosTitle] = useState('A&F End of Shift Report');

    const [sapModalVisible, setSapModalVisible] = useState(false);
    const [scrapModalTitle, setScrapModalTitle] = useState('');
    const [scrapModalVisible, setScrapModalVisible] = useState(false);
    const [scrapData, setScrapData] = useState([]);

    const [form] = Form.useForm();
    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [sendReportLoading, setSendReportLoading] = useState(false);

    const [lineData, setLineData] = useState([]);
    const [summaryData, setSummaryData] = useState(null);

    const [sendErrorMsg, setSendErrorMsg] = useState(null);

    useEffect(() => {

        if (line && dept && shiftDateStr && shift) {
            fetchDeptEosStartAsync(line, dept, shiftDateStr, shift);
            const s = shift ? `- Shift: ${shift}` : '';
            setTitle(`${machine} Production Summary: ${shiftDateStr} ${s}`)

            //cleanup
            return () => {
                // setTitle('');
                form.resetFields(['scrapComment', 'downtimeComment', 'manning']);
            }
        }

        console.log({line, dept, shiftDateStr, shift})

    }, [shiftDateStr, shift, line, dept, machine, form, fetchDeptEosStartAsync]);

    useEffect(() => {

        if (dept && shiftDateStr && shift) {
            fetchDeptEosCollectionStartAsync(dept, shiftDateStr, shift);
        }

    }, [dept, shiftDateStr, shift, fetchDeptEosCollectionStartAsync])

    useEffect(() => {

        if (deptEosResult && deptEosResult.id) {

            const { scrapComment, downtimeComment, manning } = deptEosResult;
            form.setFieldsValue({
                scrapComment,
                downtimeComment,
                manning
            });

        }

        return () => {
            form.setFieldsValue({
                scrapComment: '',
                downtimeComment: '',
                manning: ''
            })
            // setTitle('');
            form.resetFields(['scrapComment', 'downtimeComment', 'manning']);
        }

    }, [deptEosResult, form])

    useEffect(() => {

        const qry = {
            dept,
            date: shiftDateStr,
            shift: shift ? shift : ''
        }
        const ttl = `${dept} EOS Report : ${shiftDateStr} ${qry.shift}`;
        updateUrlQryParameter(qry, ttl)
        setEosTitle(ttl);

        return () => setEosTitle('')

    }, [dept, shiftDateStr, shift]);

    useEffect(() => {

        setLineData(deptEosCollectionResult ? deptEosCollectionResult.data : []);
        setSummaryData(deptEosCollectionResult ? deptEosCollectionResult.total : null);

    }, [deptEosCollectionResult])

    const reset = () => {
        setShift(null);
        setLine(null);
        setEosTitle('A&F End of Shift Report');
        setTitle('Production Summary');
        clearDeptEosResult();
        form.resetFields();
    }

    const resetAfterFetch = () => {
            //reset
            // setTitle('');
            setLine(null);
            form.resetFields(['machineId', 'scrapComment', 'downtimeComment', 'manning']);
            clearDeptEosResult();

            //success
            message.success('Created successfully!');

            //reload list
            //todo: modify array instead from the return value
            fetchDeptEosCollectionStartAsync(dept, shiftDateStr, shift);
    }

    const onFinish = async values => {

        setSubmitLoading(true);

        const { id} = deptEosResult;

        api.post('kpi/eos', {...values, endOfShiftReportId: id})
        .then(response => {
            resetAfterFetch();
        })
        .catch(error => {
            // console.error({...error})
            const { response: { data } } = error;
            message.error(data);
        })
        .finally(() => setSubmitLoading(false))
    }

    const onPopConfirmSubmit = () => form.submit();

    const onDelete = () => {

        setDeleteLoading(true);

        const { id } = deptEosResult;

        api.delete(`kpi/eos/${id}`)
        .then(response => {
            resetAfterFetch();
        })
        .catch(error => {
            // console.error({...error})
            const { response: { data } } = error;
            message.error(data);
        })
        .finally(() => setDeleteLoading(false))
    }

    const onSendReport = () => {

        setSendReportLoading(true);
        setSendErrorMsg(null);

        api.get(`kpi/eosemail?dept=${dept}&shiftDate=${shiftDateStr}&shift=${shift}`)
        .then(response => message.success('EOS Report Sent!'))
        .catch(error => {
            const { response: { data } } = error;
            setSendErrorMsg(data);
        })
        .finally(() => setSendReportLoading(false));

    }

    const onRefresh = () => {
        fetchDeptEosCollectionStartAsync(dept, shiftDateStr, shift);
    }

    const onDeptChange = (value) => {
        setDept(value);
        setLine(null);
        clearDeptEosResult();
        form.resetFields(['machineId', 'scrapComment', 'downtimeComment', 'manning']);
    }

    const onDatePickerChange = (date) => {
        const shiftDateStr = date.format(dateFormat);
        setShiftDate(date);
        setShiftDateStr(shiftDateStr);
    }

    const onShiftChnage = (value) => setShift(value)
    const onLineChange = (value) => {
        const { machine, line } = deptLinesCollection.find(({id}) => id === value);
        setLine(line);
        setMachine(machine);
    }

    const getValueStyle = (value, target, type) => {

        if (type === 'scrap') {
            if (value < target) return green;
            return red;
        }

        if (type === 'oae') {
            if (value >= target) return green;
            return red;
        }

        return null;
    }

    const getPrefixArrow = (value, target, type) => {

        if (type === 'scrap') {
            if (value < target) return <ArrowDownOutlined />;
            return <ArrowUpOutlined />;
        }

        if (type === 'oae') {
            if (value >= target) return <ArrowUpOutlined />;
            return <ArrowDownOutlined />;
        }

        return null;
    }

    const onReset = () => reset();
    const onSapNetClick = () => setSapModalVisible(!sapModalVisible);
    const onSapNetModalCancel = () => setSapModalVisible(false);
    const onScrapModalCancel = () => setScrapModalVisible(false);
    const onScrapModalClick = (dataList, title) => {

        const visible = !scrapModalVisible;
        setScrapModalVisible(visible);
        if (visible) {
            setScrapData(dataList);
            setScrapModalTitle(title)
        }
    }

    const getScrapInfo = (title, collection, scrapTarget) => (
        <Fragment>
            <Tooltip title={`Scrap Target: ${numeral(scrapTarget).format('0.00%')}`}>
                <Text>{title}</Text>
            </Tooltip>
            <Tooltip title="Click to view scrap defects">
                <a className="ml2" onClick={() => onScrapModalClick(collection, `${title.replace('%','')} Details`)}>
                    <InfoCircleOutlined />
                </a>
            </Tooltip>
        </Fragment>
    )

    const getSapInfo = (oaeTarget) => (
        <Fragment>
            <Tooltip title={`OAE Target: ${numeral(oaeTarget).format('0%')}`}>
                <Text>SAP OAE</Text>
            </Tooltip>
            <Tooltip title="View production details">
                <a className="ml2" onClick={onSapNetClick}>
                    <InfoCircleOutlined />
                </a>
            </Tooltip>
        </Fragment>
    )

    const getHxHInfo = (oaeTarget, url) => (
        <Fragment>
            <Tooltip title={`OAE Target: ${numeral(oaeTarget).format('0%')}`}>
                <Text>HxH OAE</Text>
            </Tooltip>
            {
                url.length > 0
                    ? (<Tooltip title="Open HxH page to view production, scrap and downtime">
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                <LinkOutlined className="ml2"/>
                            </a>
                        </Tooltip>)
                    : null
            }
        </Fragment>
    )

    const disabledDate = current => current && current > moment().endOf('day');

    return (
        <>
            <Header className="pa0 custom-header" >
                <h2 className="ml3">{eosTitle}</h2>
            </Header>

            <Content className="ma3 mt0">

                <Row gutter={[12,12]}>

                    <Col xs={24} xl={8}>

                        <Card title="EOS Report">

                            <Form {...formLayout} onFinish={onFinish} form={form}>

                                <Alert message="Please make sure to select the correct shift date and shift." type="info" showIcon className="mb3" />

                                {
                                    deptEosResult
                                    ? !deptEosResult.hxHUrl 
                                        ? <Alert 
                                            message="Warning" 
                                            description={`No HxH page found ${machine ? ` for line ${machine}, ${shiftDateStr} - ${shift} Shift` : ''}`} 
                                            type="warning" 
                                            className="mb3"
                                            showIcon />
                                        : null
                                    : null
                                }

                                {
                                    sendErrorMsg 
                                    ? 
                                        <Alert
                                            message="Error"
                                            description={sendErrorMsg}
                                            type="error"
                                            closable
                                            showIcon
                                            className="mb3"
                                        />
                                    : null
                                }

                                <Form.Item
                                    label="Department"
                                    name="dept"
                                    initialValue={defaultDept}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select your department',
                                        },
                                    ]}
                                    hasFeedback>
                                    <Select onChange={onDeptChange}>
                                        <Option value="Anodize">Anodize</Option>
                                        <Option value="Skirt Coat">Skirt Coat</Option>
                                        <Option value="Assembly">Assembly</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Shift Date"
                                    name="shiftDate"
                                    initialValue={shiftDate}
                                    rules={[
                                        {
                                        required: true,
                                        message: 'Please select your date',
                                        },
                                    ]}
                                    hasFeedback>

                                    <DatePicker
                                        onChange={onDatePickerChange}
                                        disabledDate={disabledDate}
                                        format={dateFormat}
                                        style={{
                                            width: '100%',
                                        }} />

                                </Form.Item>

                                <Form.Item
                                    label="Shift"
                                    name="shift"
                                    initialValue={shift}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select your shift',
                                        },
                                    ]}
                                    hasFeedback>
                                    <Select onChange={onShiftChnage}>
                                        <Option value="1">1</Option>
                                        <Option value="2">2</Option>
                                        <Option value="3">3</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Line"
                                    name="machineId"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select your line',
                                        },
                                    ]}
                                    hasFeedback>
                                    <Select loading={isDeptLinesFetching} onChange={onLineChange}>
                                        {
                                            deptLinesCollection.filter(({deptName}) => deptName === dept)
                                            .map(({ machine, id }) => <Option key={id} value={id}>{machine}</Option>)
                                        }
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Scrap Reason"
                                    name="scrapComment"
                                    hasFeedback
                                    rules={[
                                        {
                                            validator: (_, value) => {

                                                if (deptEosResult) {

                                                    const rate =  deptEosResult.totalAfScrapRate;
                                                    const targetRate = deptEosResult.afScrapRateTarget;
                                                    const errorMsg = `Please input your reason, A&F Scrap (${numeral(rate).format('0.00%')}) is greater than target (${numeral(targetRate).format('0.00%')})`

                                                    if (rate >= targetRate) {
                                                        if (value) return Promise.resolve();
                                                        return Promise.reject(errorMsg);
                                                    }

                                                    return Promise.resolve()
                                                }

                                                return Promise.resolve();
                                            }
                                        },
                                    ]}>
                                    <TextArea rows="4" allowClear/>
                                </Form.Item>

                                <Form.Item
                                    label="Downtime Reason"
                                    name="downtimeComment"
                                    hasFeedback
                                    rules={[
                                        {
                                            validator: (_, value) => {

                                                if (deptEosResult) {

                                                    const rate =  deptEosResult.hxHOae;
                                                    const targetRate = deptEosResult.oaeTarget;
                                                    const errorMsg = `Please input your reason, HxH OAE (${numeral(rate).format('0%')}) is less than target (${numeral(targetRate).format('0%')})`

                                                    if (rate < targetRate) {
                                                        if (value) return Promise.resolve();
                                                        return Promise.reject(errorMsg);
                                                    }

                                                    return Promise.resolve()
                                                }

                                                return Promise.resolve();
                                            }
                                        },
                                    ]}>
                                    <TextArea rows="4" allowClear value="test" />
                                </Form.Item>

                                <Form.Item
                                    name="manning"
                                    label="Manning"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your manning',
                                        },
                                    ]}
                                    hasFeedback>
                                    <InputNumber min="0" max="10"  style={{
                                        width: '100%',
                                    }} />
                                </Form.Item>

                                <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>

                                    {
                                        deptEosResult && deptEosResult.id
                                        ? <Fragment>
                                                <Button type="primary" htmlType="submit" disabled={isDeptEosFetching} loading={submitLoading}>Update</Button>
                                                <Button type="danger" className="ml2" onClick={onDelete} disabled={isDeptEosFetching} loading={deleteLoading}>Delete</Button>
                                            </Fragment>
                                        : deptEosResult && deptEosResult.hxHUrl 
                                            ? <Button type="primary" htmlType="submit" disabled={isDeptEosFetching} loading={submitLoading}>Create</Button>
                                            : <Popconfirm title="No HxH page found, do you like to continue submitting this report?" onConfirm={onPopConfirmSubmit} okText="Yes" cancelText="No" placement="top" >
                                                    <Button type="primary" htmlType="submit" disabled={isDeptEosFetching} loading={submitLoading}>Create</Button>
                                                </Popconfirm>
                                    }

                                    <Button htmlType="button" type="primary" onClick={onReset} className="ml2" disabled={isDeptEosFetching} >
                                        Reset
                                    </Button>

                                    <Popconfirm title="Are you sure you want to send A&F EOS report?" onConfirm={onSendReport} okText="Yes" cancelText="No" placement="topRight" >
                                        <Button className="ml2" htmlType="button" type="primary" loading={sendReportLoading} disabled={isDeptEosCollectionFetching} >
                                            Send Report
                                        </Button>
                                    </Popconfirm>

                                </Form.Item>

                            </Form>

                        </Card>

                    </Col>

                    <Col xs={24} xl={16}>

                        <Card title={title} loading={isDeptEosFetching}>

                            {
                                deptEosResult ?

                                (<Row gutter={[12,32]}>

                                    <Col {...gridLayout}>
                                        <Statistic
                                            title={getHxHInfo(deptEosResult.oaeTarget, deptEosResult.hxHUrl)}
                                            value={Math.round(deptEosResult.hxHOae * 100, 0)}
                                            precision={0}
                                            suffix={`% (${numeral(deptEosResult.hxHNet).format('0,0')})`}
                                            valueStyle={getValueStyle(deptEosResult.hxHOae, deptEosResult.oaeTarget, 'oae')}
                                            prefix={getPrefixArrow(deptEosResult.hxHOae, deptEosResult.oaeTarget, 'oae')} />
                                    </Col>

                                    <Col {...gridLayout}>
                                        <Statistic
                                            title={getSapInfo(deptEosResult.oaeTarget)}
                                            value={Math.round(deptEosResult.sapOae * 100, 0)}
                                            precision={0}
                                            suffix={`% (${numeral(deptEosResult.sapNet).format('0,0')})`}
                                            valueStyle={getValueStyle(deptEosResult.sapOae, deptEosResult.oaeTarget, 'oae')}
                                            prefix={getPrefixArrow(deptEosResult.sapOae, deptEosResult.oaeTarget, 'oae')}  />

                                    </Col>

                                    <Col {...gridLayout}>
                                        <Statistic title={getScrapInfo('SB Scrap %', deptEosResult.sbScrapDefects, deptEosResult.overallScrapRateTarget)}
                                            value={deptEosResult.totalSbScrapRate * 100}
                                            precision={2}
                                            suffix={`% (${numeral(deptEosResult.totalSbScrap).format('0,0')})`}
                                            valueStyle={getValueStyle(deptEosResult.totalSbScrapRate, deptEosResult.overallScrapRateTarget, 'scrap')}
                                            prefix={getPrefixArrow(deptEosResult.totalSbScrapRate, deptEosResult.overallScrapRateTarget, 'scrap')}  />

                                    </Col>

                                    <Col {...gridLayout}>
                                        <Statistic title={getScrapInfo('Purchased Scrap %', deptEosResult.purchasedScrapDefects, deptEosResult.overallScrapRateTarget)}
                                            value={deptEosResult.totalPurchaseScrapRate * 100}
                                            precision={2}
                                            suffix={`% (${numeral(deptEosResult.totalPurchaseScrap).format('0,0')})`}
                                            valueStyle={getValueStyle(deptEosResult.totalPurchaseScrap, deptEosResult.overallScrapRateTarget, 'scrap')}
                                            prefix={getPrefixArrow(deptEosResult.totalPurchaseScrap, deptEosResult.overallScrapRateTarget, 'scrap')}  />
                                    </Col>

                                    <Col {...gridLayout}>
                                        <Statistic title={getScrapInfo('A&F Scrap %', deptEosResult.afScrapDefects, deptEosResult.afScrapRateTarget)}
                                            value={deptEosResult.totalAfScrapRate * 100}
                                            precision={2}
                                            suffix={`% (${numeral(deptEosResult.totalAfScrap).format('0,0')})`}
                                            valueStyle={getValueStyle(deptEosResult.totalAfScrapRate, deptEosResult.afScrapRateTarget, 'scrap')}
                                            prefix={getPrefixArrow(deptEosResult.totalAfScrapRate, deptEosResult.afScrapRateTarget, 'scrap')} />
                                    </Col>

                                    <Col {...gridLayout}>
                                        <Statistic title={getScrapInfo('Overall Scrap %', deptEosResult.totalScrapDefects, deptEosResult.overallScrapRateTarget)}
                                            value={deptEosResult.totalScrapRate * 100}
                                            precision={2}
                                            suffix={`% (${numeral(deptEosResult.totalScrap).format('0,0')})`}
                                            valueStyle={getValueStyle(deptEosResult.totalScrapRate, deptEosResult.overallScrapRateTarget, 'scrap')}
                                            prefix={getPrefixArrow(deptEosResult.totalScrapRate, deptEosResult.overallScrapRateTarget, 'scrap')}  />
                                    </Col>

                                    <Divider>Scrap Details</Divider>

                                    {
                                        deptEosResult.sbScrapDetails.length > 0
                                        ?  deptEosResult.sbScrapDetails.map(({scrapArea, qty, scrapTargetRate, scrapRate, details}) => (
                                                <Col {...gridLayout} key={scrapArea}>
                                                    <Statistic
                                                        title={getScrapInfo(`${scrapArea} Scrap %`, details, scrapTargetRate)}
                                                        value={scrapRate * 100}
                                                        precision={2}
                                                        valueStyle={getValueStyle(scrapRate, scrapTargetRate, 'scrap')}
                                                        prefix={getPrefixArrow(scrapRate, scrapTargetRate, 'scrap')}
                                                        suffix={`% (${numeral(qty).format('0,0')})`}  />
                                                </Col>
                                            ))
                                        : <Text>No data available.</Text>
                                    }

                                </Row>)

                                : <Text>No data available, please select line to load data.</Text>
                            }

                        </Card>

                    </Col>

                    <Col xs={24} xl={24}>

                        <Card title="Machine Summary"
                                extra={<Button htmlType="button" type="primary" loading={sendReportLoading} className="mr2"
                                            onClick={onRefresh}
                                            disabled={isDeptEosCollectionFetching} >
                                            Refresh
                                        </Button>}
                            >
                            <EosTable data={lineData}  loading={isDeptEosCollectionFetching} summaryData={summaryData}/>
                        </Card>

                    </Col>

                </Row>

                <Modal
                    title="SAP Production Details"
                    visible={sapModalVisible}
                    onCancel={onSapNetModalCancel}
                    width="50%"
                    footer={[
                        <Button key="back" onClick={onSapNetModalCancel}>
                        Close
                        </Button>
                    ]}>
                    <SapNetTable sapNetData={deptEosResult ? deptEosResult.productionDetails : []}/>
                </Modal>

                <Modal
                    title={scrapModalTitle}
                    visible={scrapModalVisible}
                    onCancel={onScrapModalCancel}
                    width="50%"
                    footer={[
                        <Button key="back" onClick={onScrapModalClick}>
                        Close
                        </Button>
                    ]}>
                        <DefectSummaryTable scrapData={scrapData} />
                </Modal>

            </Content>
        </>
    )
}

const mapStateToProps = ({ afEos }) => ({
    isDeptLinesFetching: afEos.isDeptLinesFetching,
    deptLinesCollection: afEos.deptLinesCollection,
    isDeptEosFetching: afEos.isDeptEosFetching,
    deptEosResult: afEos.deptEosResult,
    deptEosCollectionResult: afEos.deptEosCollectionResult,
    isDeptEosCollectionFetching: afEos.isDeptEosCollectionFetching
});

const mapDispatchToProps = dispatch => ({
    fetchDeptLineStartAsync: () => dispatch(fetchDeptLineStartAsync()),
    fetchDeptEosStartAsync: (line, dept, shiftDate, shift) => dispatch(fetchDeptEosStartAsync(line, dept, shiftDate, shift)),
    fetchDeptEosCollectionStartAsync: (dept, shiftDate, shift) => dispatch(fetchDeptEosCollectionStartAsync(dept, shiftDate, shift)),
    clearDeptEosResult: () => dispatch(clearDeptEosResult()),
    setDeptEosCollection: () => dispatch(setDeptEosCollection(null))
})

export default connect(mapStateToProps, mapDispatchToProps)(EosPage);