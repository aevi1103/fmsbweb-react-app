import React, { useEffect, useState } from 'react';
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment'
import { Link, useParams, useHistory } from "react-router-dom";
import api from '../../core/utilities/api'
import fileDownload from 'js-file-download'

import { 
    DownloadOutlined,
    LoadingOutlined
 } from '@ant-design/icons';

import { 
    Layout,
    Select,
    Tooltip, 
    message,
    Dropdown,
    Spin,
    Menu,
    PageHeader,
    Row,
    Col,
    DatePicker
 } from "antd";

import ProductionDetails from './components/production-details.component'

import { fetchProductionDetailsStartAsync } from '../../core/redux/production-details/production-details.actions';
import { mapDeptToArea, dateFormat, dateRange, disabledDate } from '../../core/utilities/helpers'
import { useQuery } from '../../core/utilities/custom-hook'

const { Option } = Select;
const { Content } = Layout;
const { RangePicker } = DatePicker;
const previousDay = moment().add(-1, 'd');

const WorkCenterDetails = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const query = useQuery();
    const { department } = useParams();

    //* url query string
    const dateStartQry = query.get('start');
    const dateEndQry = query.get('end');
    const shiftQry = query.get('shift');

    //* selector
    const isProductionDetailsLoading = useSelector(({ productionDetails }) => productionDetails.isProductionDetailsLoading);

    //* defaults
    const defaultStartDate = dateStartQry ?? previousDay.format(dateFormat);
    const defaultEndDate = dateEndQry ?? previousDay.format(dateFormat);
    const defaultShift = shiftQry ?? '';
        
    //* states
    const [startFormat, setStartFormat] = useState(defaultStartDate);
    const [endFormat, setSendFormat] = useState(defaultEndDate);
    const [shift, setShift] = useState(defaultShift);
    const [headerTitle, setHeaderTitle] = useState(null);
    const [headerSubTitle, setHeaderSubTitle] = useState(null);

    //* download state
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);

    const fetchData = () => {
        
        //* update URL
        history.push(`/dashboard/morningmeeting/${department}/details?start=${startFormat}&end=${endFormat}&shift=${shift}`);

        //* update title
        setHeaderTitle(`${_.startCase(department)} Work Center Details`);
        setHeaderSubTitle(`${startFormat} - ${endFormat} Shift: ${shift || 'All'}`)

        //* fetch data
        dispatch(fetchProductionDetailsStartAsync(startFormat, endFormat, department, shift));

    }

    useEffect(() => {
        document.title = `Morning Meeting Details`;
    }, [])

    useEffect(() => {
        fetchData();
    }, [department])
        
    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        const startFormat = start ? start.format(dateFormat) : null;
        const endFormat = end ? end.format(dateFormat) : null;
        setStartFormat(startFormat);
        setSendFormat(endFormat);
    }

    const onDownload = async () => {

        try {    

            setDownloadLoading(true);
            const response = await api.get(`/exports/department/details?start=${startFormat}&end=${endFormat}&area=${mapDeptToArea(department)}&shift=${shift}`, {
                responseType: 'blob',
            });

            const fileName = `${department.toUpperCase()}_DETAILS_DATAEXPORT_${startFormat}_to_${endFormat}_shift_${shift}.xlsx`
            fileDownload(response.data, fileName);

            message.success('Data successfully exported!', 10);

        } catch (error) {
            setDownloadError(error);
            setDownloadLoading(false);
        } finally {
            if (!downloadError) {
                setDownloadLoading(false);
            }
        }
    }

    const btnOverlay = (
        <Menu>
            <Menu.Item key="export" icon={<DownloadOutlined />} onClick={onDownload} >
                Export
            </Menu.Item>
            <Menu.Item key={`/dashboard/morningmeeting/${department}/details`} >
                <Link to={`/dashboard/morningmeeting/${department}?start=${startFormat}&end=${endFormat}`} >Department</Link>
            </Menu.Item>
            <Menu.Item key={`/dashboard/swot/settings/${_.capitalize(department)}`} >
                <Link to={`/dashboard/swot/settings/${_.capitalize(department)}?start=${startFormat}&end=${endFormat}&getdata=true`}>SWOT</Link>
            </Menu.Item>
            <Menu.Item key={`/dashboard/morningmeeting/${department}/hourly-production`} >
                <Link to={`/dashboard/morningmeeting/${department}/hourly-production?date=${endFormat}`} >Hourly Production</Link>
            </Menu.Item>
            <Menu.Item key={`/orderstatus/${department}`} >
                <Link to={`/orderstatus/${department}`}>Production Orders</Link>
            </Menu.Item>  
        </Menu>
    )

    const loadingIcon = <LoadingOutlined style={{ fontSize: 15 }} spin />;

    return (
        <React.Fragment>

            <PageHeader
                className="site-page-header"
                title={headerTitle}
                subTitle={headerSubTitle}
            />

            <Content className="ma3 mt0">

                <Row gutter={[12,12]}>

                    <Col span={24}>
                        
                        <RangePicker 
                            className="mr2"
                            onChange={() => {}}
                            format={dateFormat}
                            onCalendarChange={onCalendarChange}
                            defaultValue={[
                                moment(startFormat, dateFormat),
                                moment(endFormat, dateFormat)
                            ]}
                            disabledDate={disabledDate}
                            ranges={dateRange} />
                        
                        <Tooltip placement="top" title="Select Shift">
                            <Select onChange={setShift} className="mr2" style={{width: '70px'}} value={shift}>
                                <Option value="">All</Option>
                                <Option value="3">3rd</Option>
                                <Option value="1">1st</Option>
                                <Option value="2">2nd</Option>
                            </Select>
                        </Tooltip>

                        <Dropdown.Button type="primary" onClick={fetchData} overlay={btnOverlay} disabled={downloadLoading || isProductionDetailsLoading}>
                            {
                                downloadLoading || isProductionDetailsLoading ? <Spin indicator={loadingIcon} /> : 'Go'
                            }
                        </Dropdown.Button>

                    </Col>

                    <Col span={24}>
                        <ProductionDetails/>
                    </Col>

                </Row>

            </Content>  
        </React.Fragment>
    )
};


export default WorkCenterDetails;