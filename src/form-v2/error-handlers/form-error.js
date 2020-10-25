import React, { Component } from 'react';
import { message } from 'antd';

const errStyle = { color: 'red' };

export class FormErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error);
    this.setState({ error });
    message.error(errorInfo, 5, this.onClose);
  }

  onClose = () => {
    this.setState({ hasError: false, error: null });
  };

  logError = () => {
    const { hasError, error } = this.state;
    if (hasError && error) {
      return (
        <>
          <div style={errStyle}>These errors occured in your form: </div>
          <pre style={errStyle}>{JSON.stringify(error, null, 2)}</pre>
        </>
      );
    }
    return null;
  };

  render() {
    this.logError();
    return this.props.children;
  }
}
