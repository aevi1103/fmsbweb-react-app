import React, { Component } from 'react';
import { Result, Button } from 'antd';

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
        if (this.state.hasError){
            return <Result
                        status="500"
                        title="500"
                        subTitle="Sorry, something went wrong."
                        extra={<Button type="primary">
                            <a href="/" >Back to Home</a>
                        </Button>}
                    />
        }
        return this.props.children;
    }
    
}

export default AppErrorBoundary;