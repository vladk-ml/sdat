import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info });
    // Optionally log to an error reporting service
    // console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: "#232837",
          color: "#ffb4b4",
          padding: 32,
          borderRadius: 12,
          margin: 32,
          fontFamily: "monospace"
        }}>
          <h2>Something went wrong.</h2>
          <pre>{this.state.error && this.state.error.toString()}</pre>
          {this.state.info && <pre>{this.state.info.componentStack}</pre>}
        </div>
      );
    }
    return this.props.children;
  }
}
