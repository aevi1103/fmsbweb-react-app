import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import moment from 'moment'
import api from '../../../API'

import { 
    Layout,
    Spin,
    PageHeader,
    Tag
 } from "antd";

const { Header, Content } = Layout;

const CheckSheetDataEntryPage = () => {
    
    const history = useHistory();
    const { controlId, controlName, lineId, checkSheetId } = useParams();

    const [checkSheet, setCheckSheet] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [parts, setParts] = useState('')

    useEffect(() => {

        setLoading(true);
        api.get(`/quality/checksheets/checksheet?$expand=controlMethod,line,organizationPart($expand=characteristics($expand=displayAs))&$filter=checkSheetId eq ${checkSheetId}`)
            .then(response => {
                console.log(response.data[0])
                setCheckSheet(response.data[0])
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))

    }, [])

    useEffect(() => {

        if (checkSheet) {

            const { 
                line,
                shiftDate,
                shift,
                controlMethod: { method },
                organizationPart: { part }
            } = checkSheet;
            
            setTitle(`Line ${line.value} ${method}`)
            setSubTitle(`Shift Date: ${moment(shiftDate).format('MM/DD/YYYY')} | Shift: ${shift}`)
            setParts(part)
        }

    }, [checkSheet])

    return (
        <React.Fragment>

            <PageHeader
                className="site-page-header"
                title={loading ? <span><Spin/> Loading...</span> : title}
                subTitle={subTitle}
                onBack={() => history.push(`/quality/checksheets/controlmethod/${controlName}/${controlId}/line/${lineId}`)}
                tags={<Tag color="blue">{parts}</Tag>}
            />

            <Content className="ma3 mt0">
                
                checksheet data entry

            </Content>
        </React.Fragment>
    )
}

export default CheckSheetDataEntryPage