import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    this.props.setError(error)
  }

  render() {
    if (this.state.error) {
      return null
    }
    return this.props.children
  }
}
