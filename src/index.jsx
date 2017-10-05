import React from 'react'
import ReactDom from 'react-dom'
import AppRoutes from './components/AppRoutes.jsx';

window.onload = () => {
    ReactDOM.render(<AppRoutes/>, document.getElementByID('main'))
}
