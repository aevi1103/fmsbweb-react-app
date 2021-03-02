import React, { useState } from 'react';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import { useSelector, useDispatch } from 'react-redux';
import { longDateFormat } from '../../../core/utilities/helpers'
import http from '../../../core/utilities/api'
import { dispatchIncidentsQry } from '../services/api'
import EditForm from './edit-form.component'
import { 
    Table,
    Menu,
    Dropdown,
    Typography,
    Modal,
    message,
    Input,
    Form,
    Button
 } from "antd";

import {
    DeleteOutlined,
    EditOutlined,
    PaperClipOutlined,
    SearchOutlined
} from '@ant-design/icons';

const { Link } = Typography;

const menu = (record, setIsModalVisible, form, setIsClosed, setMitigatedTimestamp, setIsRecordable) => {

    const { confirm } = Modal;
    const { 
        id,
        accidentDate,
        mitigatedTimeStamp,
        isClosed,
        injuryStatId
    } = record;

    const onEditClick = () => {
        
        form.resetFields();
        form.setFieldsValue({
            ...record,
            accidentDate: moment(accidentDate),
            mitigatedTimeStamp: mitigatedTimeStamp ? moment(mitigatedTimeStamp) : null
        })

        setIsModalVisible(true)
        setIsClosed(isClosed)
        setMitigatedTimestamp(mitigatedTimeStamp ? moment(mitigatedTimeStamp) : null)
        setIsRecordable(injuryStatId.toLowerCase().includes('recordable'))
    }

    const showConfirmDelete = () => {
        confirm({
            title: 'Do you Want to delete these item?',
            onOk() {
             
                return new Promise((resolve, reject) => {
                    http.delete(`safety/${id}`).then(data => {
                        resolve(data)
                        //* delete row
                    }).catch(err => reject(err))
                })
                .catch(() => message.error('Something went wrong while deleting the record.'))

            }
          });
    }

    return (
        <Menu>
            <Menu.Item onClick={onEditClick}>
                <EditOutlined />
                <span>Edit</span>
            </Menu.Item>
            <Menu.Item onClick={showConfirmDelete}>
                <DeleteOutlined />
                <span>Delete</span>
            </Menu.Item>
            <Menu.Item disabled>
                <PaperClipOutlined />
                <span>Attachments</span>
            </Menu.Item>
        </Menu>
    )
}

const IncidentHistoryTable = ({ department, range }) => {

    const dispatch = useDispatch();

    const incidents = useSelector(({ safetyHistory }) => safetyHistory.incidents);
    const incidentsLoading = useSelector(({ safetyHistory }) => safetyHistory.isLoading);

    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isClosed, setIsClosed] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [mitigatedTimeStamp, setMitigatedTimestamp] = useState(null)
    const [isRecordable, setIsRecordable] = useState(false)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    let searchInput = null;

    const handleOk = () => form.submit();

    const onFinish = async values => {

        try {
            
            setSubmitLoading(true)

            const { accidentDate, mitigatedTimeStamp } = values;

            await http.post(`safety`, {
                ...values,
                modifieddate: moment().format(longDateFormat),
                accidentDate: moment(accidentDate).format(longDateFormat), 
                mitigatedTimeStamp:!mitigatedTimeStamp ? null : moment(mitigatedTimeStamp).format(longDateFormat)
            })

            dispatchIncidentsQry({ department, range }, dispatch)
            setIsModalVisible(false)
            message.success('Record successfully edited.');
            
        } catch (error) {
            message.error('Something went wrong please try again.')
        } finally {
            setSubmitLoading(false)
        }

    }

    const onCheckBoxChange = e => setIsClosed(e.target.checked)
    const handleCancel = () => setIsModalVisible(false)
    const onInjuryStateChange = value => setIsRecordable(value.toLowerCase().includes('recordable'))

    const onMitigatedChecked = e => {

        const isChecked = e.target.checked;

        if (isChecked) {
            setMitigatedTimestamp(moment())
            form.setFieldsValue({ mitigatedTimeStamp: moment() })
        } else {
            setMitigatedTimestamp(null)
            form.setFieldsValue({ mitigatedTimeStamp: null })
        }

    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
     };
  
     const handleReset = clearFilters => {
         clearFilters();
         setSearchText('');
     };

    const getColumnSearchProps = dataIndex => ({

       filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
         <div style={{ padding: 8 }}>
           <Input
             ref={node => {
               searchInput = node;
             }}
             placeholder={`Search`}
             value={selectedKeys[0]}
             onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
             onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
             style={{ width: 188, marginBottom: 8, display: 'block' }}
           />
           <Button
             type="primary"
             onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
             icon={<SearchOutlined />}
             size="small"
             style={{ width: 90, marginRight: 8 }}
           >
             Search
           </Button>
           <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
             Reset
           </Button>
         </div>
       ),

       filterIcon: filtered => (
         <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
       ),

       onFilter: (value, record) =>

         record[dataIndex]
           ?.toString()
           ?.toLowerCase()
           ?.includes(value?.toLowerCase()),

       onFilterDropdownVisibleChange: visible => {
         if (visible) {
           setTimeout(() => searchInput.select());
         }
       },

       render: text => {

        return searchedColumn === dataIndex ? (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text?.toString()}
            />) : text

       },
    });

    const columns = [
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => {
                return (<Dropdown overlay={() => menu(record, setIsModalVisible, form, setIsClosed, setMitigatedTimestamp, setIsRecordable)}>
                    <Link>Action</Link>
                </Dropdown>)
            }
        },
        {
            title: 'Status',
            dataIndex: 'isClosedText',
            sorter: (a, b) => a.isClosed - b.isClosed,
            sortDirections: ['descend', 'ascend'],
            render: (text, { isClosedText }) => {
                return isClosedText
            },
            ...getColumnSearchProps('isClosedText'),
        },
        {
            title: 'FM Tips #',
            dataIndex: 'fmTipsNumber',
            sorter: (a, b) => a.fmTipsNumber - b.fmTipsNumber,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('fmTipsNumber'),
        },
        {
            title: 'Mitigated',
            dataIndex: 'mitigatedText',
            sorter: (a, b) => a.mitigated - b.mitigated,
            sortDirections: ['descend', 'ascend'], 
            render: (text, { mitigatedText }) => {
                return mitigatedText
            },
            ...getColumnSearchProps('mitigatedText'),
        },
        {
            title: 'Mitigated Timestamp',
            dataIndex: 'mitigatedTimeStampText',
            sorter: (a, b) => new Date(a.mitigatedTimeStamp) - new Date(b.mitigatedTimeStamp),
            sortDirections: ['descend', 'ascend'],
            render: (text, { mitigatedTimeStampText }) => {
                return mitigatedTimeStampText
            },
            ...getColumnSearchProps('mitigatedTimeStampText'),
        },
        {
            title: 'Department',
            dataIndex: 'dept',
            sorter: (a, b) => a.dept.length - b.dept.length,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('dept'),
        },
        {
            title: 'First Name',
            dataIndex: 'fname',
            sorter: (a, b) => a.fname.length - b.fname.length,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('fname'),
        },
        {
            title: 'Last Name',
            dataIndex: 'lname',
            sorter: (a, b) => a.lname.length - b.lname.length,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('lname'),
        },
        {
            title: 'Shift',
            dataIndex: 'shift',
            sorter: (a, b) => a.shift - b.shift,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('shift'),
        },
        {
            title: 'Incident Date',
            dataIndex: 'accidentDateText',
            sorter: (a, b) => new Date(a.accidentDate) - new Date(b.accidentDate),
            sortDirections: ['descend', 'ascend'],
            render: (text, { accidentDateText }) => {
                return accidentDateText
            },
            ...getColumnSearchProps('accidentDateText'),
        },
        {
            title: 'Injury',
            dataIndex: 'injuryName',
            sorter: (a, b) => a.injuryName.length - b.injuryName.length,
            sortDirections: ['descend', 'ascend'],
            render: (text, { injuryName }) => {
                return injuryName
            },
            ...getColumnSearchProps('injuryName'),
        },
        {
            title: 'Body Part',
            dataIndex: 'bodyPartName',
            sorter: (a, b) => a.bodyPartName.length - b.bodyPartName.length,
            sortDirections: ['descend', 'ascend'],
            render: (text, { bodyPartName }) => {
                return bodyPartName
            },
            ...getColumnSearchProps('bodyPartName'),
        },
        {
            title: 'Supervisor',
            dataIndex: 'supervisor',
            sorter: (a, b) => a.supervisor.length - b.supervisor.length,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('supervisor'),
        },
        {
            title: 'Injury Status',
            dataIndex: 'injuryStatId',
            sorter: (a, b) => a.injuryStatId.length - b.injuryStatId.length,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('injuryStatId'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: 500,
            sorter: (a, b) => a.description.length - b.description.length,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('description'),
        },
        {
            title: 'Interim Action Taken',
            dataIndex: 'interimActionTaken',
            sorter: (a, b) => a.interimActionTaken.length - b.interimActionTaken.length,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('interimActionTaken'),
        },
        {
            title: 'Final Corrective Action',
            dataIndex: 'finalCorrectiveAction',
            sorter: (a, b) => a.finalCorrectiveAction.length - b.finalCorrectiveAction.length,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('finalCorrectiveAction'),
        },
        {
            title: 'Reason Supporting ORIR Status',
            dataIndex: 'reasonSupportingOrirstat',
            sorter: (a, b) => a.reasonSupportingOrirstat?.length - b.reasonSupportingOrirstat?.length,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('reasonSupportingOrirstat'),
        },
        {
            title: 'Time Stamp',
            dataIndex: 'modifieddateText',
            sorter: (a, b) => new Date(a.modifieddate) - new Date(b.modifieddate),
            sortDirections: ['descend', 'ascend'],
            render: (text, { modifieddateText }) => {
                return modifieddateText
            },
            ...getColumnSearchProps('modifieddateText'),
        }
    ];
      
    const dataSource = incidents.map((item, i) => ({ 
        key: i,
        ...item,
        injuryName: item.injury.injuryName,
        bodyPartName: item.bodyPart.bodyPart1,
        isClosedText: item.isClosed ? 'Close' : 'Open',
        mitigatedText: item.mitigated ? 'Yes' : 'No',
        mitigatedTimeStampText: item.mitigatedTimeStamp ? moment(item.mitigatedTimeStamp).format(longDateFormat) : 'N/A',
        accidentDateText: moment(item.accidentDate).format(longDateFormat),
        modifieddateText: moment(item.modifieddate).format(longDateFormat),
    }))

    return (
        <>
            <Table 
                size="small"
                loading={incidentsLoading}
                columns={columns}
                dataSource={dataSource} />  

            <Modal
                title="Edit" 
                visible={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
                okText="Submit"
                okButtonProps={{
                    loading: submitLoading
                }} 
                width={700}>
                
                <EditForm
                    form={form}
                    isClosed={isClosed}
                    isRecordable={isRecordable}
                    mitigatedTimeStamp={mitigatedTimeStamp}
                    onFinish={onFinish}
                    onInjuryStateChange={onInjuryStateChange}
                    onCheckBoxChange={onCheckBoxChange}
                    onMitigatedChecked={onMitigatedChecked}
                />

            </Modal>
        </>
           
    )
}

export default IncidentHistoryTable;