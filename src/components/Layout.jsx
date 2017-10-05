import React from 'react'

export default class Layout expends React.Component {
    render() {
        return (
            <div className="app-container">
                <header>
                    <h1>Iced Mocha</h1>
                </header>
                <div className="app-content">{this.props.children}</div>
            </div>
        )
    }
}
