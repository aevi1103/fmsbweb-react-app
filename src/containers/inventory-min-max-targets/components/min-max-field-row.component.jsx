import React, { useState, useEffect } from 'react'
import api from '../../../core/utilities/api'
import { CloseOutlined, SaveOutlined, LoadingOutlined } from '@ant-design/icons';
import { 
    Form,
    Space, 
    Select,
    InputNumber,
    Tooltip,
    Input,
    Popconfirm,
    message
 } from "antd";

 const { Option } = Select

const MinMaxFieldRow = React.memo(({
    field,
    remove,
    programs,
    locations,
    form
}) => {

    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [min, setMin] = useState(null);
    const [name, setName] = useState(null)

    useEffect(() => {
        setName(field.name);
    }, [])

    useEffect(() => {

        if (name) {
            const { targets } = form.getFieldsValue() || {};
            const { min } = targets[name] || {};
            setMin(min);
        }

    }, [name, form])

    const onDelete = async () => {

        //* get form values
        const { targets } = form.getFieldsValue() || {};

        //* get item from field key
        const { id } = targets[name] || {};

        //* if id doesn't exist delete row only
        if (!id) {   
            setDeleteLoading(false);
            message.success('Successfully Deleted!');
            remove(name);
            return;
        }

        //* delete item in the db and then delete row
        try {
            
            setDeleteLoading(true);
            await api.delete(`logistics/program/targets/${id}`);
            message.success('Successfully Deleted!');
            setDeleteLoading(false);

            //*remove item in list
            remove(name);
            
        } catch (error) {
            message.error(`${error?.response?.data ?? error.message}`)
            setDeleteLoading(false);
        }

    }

    const onSave = async () => {

        //* get form values
        const { targets } = form.getFieldsValue() || {};

        //* get item from field key
        const item = targets[name];

        //* save to db
        try {
            
            setSubmitLoading(true);
            const response = await api.post(`logistics/program/targets`, {
                ...item,
                id: item.id ?? 0,
                stamp: new Date()
            })

            const newTargets = [...targets];
            newTargets[name] = response.data;
            form.setFieldsValue({
                targets: newTargets
            });

            message.success('Successfully Added!')

        } catch (error) {
            message.error(`${error?.response?.data ?? error.message}`)
        } finally {
            setSubmitLoading(false);
        }

    }

    const onMinChange = value => setMin(value);

    return (
        <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">

            <Tooltip title="Program">
                
                <Form.Item
                    {...field}
                    name={[field.name, 'program']}
                    fieldKey={[field.fieldKey, 'program']}
                    rules={[{ required: true, message: 'Please select program' }]}
                >
                    <Select placeholder="Program" style={{ width: '10rem'}} showSearch>
                        {
                            programs.map(program => <Option key={program}>{program}</Option>)
                        }
                    </Select>
                </Form.Item>

            </Tooltip>
            
            <Tooltip title="SLOC">

                <Form.Item
                    {...field}
                    name={[field.name, 'sloc']}
                    fieldKey={[field.fieldKey, 'sloc']}
                    rules={[{ required: true, message: 'Please select SLOC' }]}
                >
                    <Select placeholder="SLOC" style={{ width: '10rem'}} showSearch>
                        {
                            locations.map(loc => <Option key={loc}>{loc}</Option>)
                        }
                    </Select>
                </Form.Item>

            </Tooltip>

            <Tooltip title="Min">

                <Form.Item
                    {...field}
                    name={[field.name, 'min']}
                    fieldKey={[field.fieldKey, 'min']}
                    rules={[{ required: true, message: 'Please enter min' }]}
                >
                    <InputNumber min={0} placeholder="Min" onChange={onMinChange} />
                </Form.Item>

            </Tooltip>

            <Tooltip title="Max">

                <Form.Item
                    {...field}
                    name={[field.name, 'max']}
                    fieldKey={[field.fieldKey, 'max']}
                    rules={[{ required: true, message: 'Please enter max' }]}
                >
                    <InputNumber min={min+1} placeholder="Max" />
                </Form.Item>

            </Tooltip>

            <Form.Item
                {...field}
                name={[field.name, 'id']}
                fieldKey={[field.fieldKey, 'id']}
            >
                <Input type="hidden" />
            </Form.Item>
            

            <Tooltip title="Delete">
                <Popconfirm 
                    title="Do you want to delete this record？" 
                    okText="Yes" 
                    cancelText="No" 
                    okButtonProps={{ loading: deleteLoading }}
                    onConfirm={onDelete}>

                    { deleteLoading ? <LoadingOutlined /> : <CloseOutlined className="red" /> }

                </Popconfirm>
            </Tooltip>
            
            <Tooltip title="Save">
                <Popconfirm 
                    title="Do you want to save this record？" 
                    okText="Yes" 
                    cancelText="No" 
                    okButtonProps={{ loading: submitLoading }}
                    onConfirm={onSave}>

                    { submitLoading ? <LoadingOutlined /> : <SaveOutlined className="green" /> }

                </Popconfirm>
            </Tooltip>
                
        </Space>

    )

})

export default MinMaxFieldRow;