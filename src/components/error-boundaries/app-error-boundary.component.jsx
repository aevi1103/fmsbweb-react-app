import React, { Component } from 'react';
import { Result, Button, Layout } from 'antd';
const { Content } = Layout;

class AppErrorBoundary extends Component {

    constructor(props) {
        super(props);
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }
    
    componentDidCatch(error, errorInfo) {
        //log error to a service
        console.error(error, errorInfo);
    }

    render(){
        if (this.state.hasError) {
            return  <Content>
                        <Result
                            style={{ top: '50%', transform: 'translateY(50%)' }}
                            status="500"
                            title="500"
                            subTitle="Sorry, something went wrong."
                            extra={<Button type="primary">
                                <a href="/" >Back to Home</a>
                            </Button>}
                        />
                    </Content>

        }
        return this.props.children;
    }
    
}

export default AppErrorBoundary;