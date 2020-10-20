import React, { useEffect, useState } from 'react';
import _ from 'lodash'
import { connect } from 'react-redux';
import moment from 'moment'
import { useLocation, Link, useHistory, useParams } from "react-router-dom";
import api from '../../../../API'
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
    Alert,
    Dropdown,
    Spin,
    Menu,
    PageHeader
 } from "antd";

 import DateRangePicker from '../../../../components/date-range-picker/date-range-picker.component'
 import ProductionDetails from '../../../../components/production-details/production-details.component'

 import {
    fetchProductionDetailsStartAsync,
    setDetailsStartDate,
    setDetailsEndDate
 } from '../../../../redux/production-details/production-details.actions';

 import { 
    updateUrlQryParameter,
    mapDeptToArea
} from '../../../../helpers/helpers'

import { 
    useQuery
} from '../../../../helpers/custom-hook'

const { Option } = Select;
const { Content } = Layout;
const dateFormat = 'MM/DD/YYYY';
const previousDay = moment().add(-1, 'd');

const ProductionDetailsPage = ({
        fetchProductionDetailsStartAsync,
        isProductionDetailsLoading,
        productionDetailsErrorMsg
    }) => {

    const query = useQuery();
    const location = useLocation();
    const history = useHistory();
    const { department } = useParams();

    const dateStartQry = query.get('start');
    const dateEndQry = query.get('end');
    const shiftQry = query.get('shift');

    const defaultStartDate = dateStartQry ?? previousDay.format(dateFormat);
    const defaultEndDate = dateEndQry ?? previousDay.format(dateFormat);
    const defaultShift = shiftQry ?? '';
        
    const [startFormat, setStartFormat] = useState(defaultStartDate);
    const [endFormat, setSendFormat] = useState(defaultEndDate);
    const [shift, setShift] = useState(defaultShift);
    const [headerTitle, setHeaderTitle] = useState(`${_.capitalize(department)} Details: ${defaultStartDate} - ${defaultEndDate} Shift: ${defaultShift || 'All'}`);

    const [downloadLoading, setDownloadLoading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);

    const updateUrl = (start, end, shift = 'All') => {
        const qry = { start, end, shift }
        const title =  `${department.toUpperCase()} Details: ${start} - ${end} Shift: ${shift}`;
        updateUrlQryParameter(qry, title);
        setHeaderTitle(`${_.capitalize(department)} Details: ${startFormat} - ${endFormat} Shift: ${shift || 'All'}`);
    }

    useEffect(() => {
        document.title = `Morning Meeting Details`;
        fetchProductionDetailsStartAsync(startFormat, endFormat, department, shift);
        updateUrl(startFormat, endFormat, shift);  
    }, [department])
        
    const onClick = () => {
        setDetailsStartDate(startFormat);
        setDetailsEndDate(endFormat);  
        fetchProductionDetailsStartAsync(startFormat, endFormat, department, shift);
        updateUrl(startFormat, endFormat, shift);
    }

    const onCalendarChange = (dates) => {
        const [start, end] = dates;
        const startFormat = start ? start.format(dateFormat) : null;
        const endFormat = end ? end.format(dateFormat) : null;
        setStartFormat(startFormat);
        setSendFormat(endFormat);
    }

    const onShiftChange = (value) => setShift(value);

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
                <Link to={`/dashboard/morningmeeting/${department}?start=${startFormat}&end=${endFormat}`} >Department Details</Link>
            </Menu.Item>
            <Menu.Item key={`/dashboard/swot/settings/${_.capitalize(department)}`} >
                <Link to={`/dashboard/swot/settings/${_.capitalize(department)}?start=${startFormat}&end=${endFormat}&getdata=true`}>SWOT</Link>
            </Menu.Item>
            <Menu.Item key={`/dashboard/morningmeeting/${department}/hourly-production`} >
                <Link to={`/dashboard/morningmeeting/${department}/hourly-production?date=${endFormat}`} >Hourly Production</Link>
            </Menu.Item>
            <Menu.Item key={`/orderstatus/${department}`} >
                <Link to={`/orderstatus/${department}`}>Active Orders</Link>
            </Menu.Item>  
        </Menu>
    )

    const loadingIcon = <LoadingOutlined style={{ fontSize: 15 }} spin />;

    return (
        <React.Fragment>

            <PageHeader
                className="site-page-header"
                title={headerTitle}
            />

            <Content className="ma3 mt0">

                {
                    productionDetailsErrorMsg ? <Alert className="mb2" showIcon type="error" message={productionDetailsErrorMsg} /> : null
                }

                {
                    downloadError ? <Alert className="mb2" showIcon type="error" message={downloadError} /> : null
                }

                <DateRangePicker 
                    onCalendarChange={onCalendarChange}
                    dateRangeValue={{startDate: moment(startFormat), endDate: moment(endFormat)}}
                    isRenderButton={false} />
                
                <Tooltip placement="top" title="Select Shift">
                    <Select onChange={onShiftChange} className="mr2" style={{width: '70px'}} value={shift}>
                        <Option value="">All</Option>
                        <Option value="3">3rd</Option>
                        <Option value="1">1st</Option>
                        <Option value="2">2nd</Option>
                    </Select>
                </Tooltip>

                <Dropdown.Button type="primary" onClick={onClick} overlay={btnOverlay} disabled={downloadLoading || isProductionDetailsLoading}>
                    {
                        downloadLoading || isProductionDetailsLoading ? <Spin indicator={loadingIcon} /> : 'Go'
                    }
                </Dropdown.Button>

                <div className="mt3">
                    <ProductionDetails/>
                </div>

            </Content>  
        </React.Fragment>
    )
};

const mapStateToProps = ( { productionDetails, morningMeeting } ) => ({
    isProductionDetailsLoading: productionDetails.isProductionDetailsLoading,
    productionDetailsErrorMsg: productionDetails.productionDetailsErrorMsg,
})

const mapDispatchToProps = dispatch => ({
    fetchProductionDetailsStartAsync: (start, end, dept, shift) => dispatch(fetchProductionDetailsStartAsync(start, end, dept, shift))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductionDetailsPage);