import React from 'react'
import { Route } from 'react-router'
import Layout from './components/Layout.jsx'
import LoginPage from './components/login/LoginPage.jsx'
import PrivacyPage from './components/privacy/PrivacyPage.jsx'

const routes = (
    <Route path="/" component={Layout}>
        <Route path="/login" component={LoginPage} />
        <Route path="/privacy" component={PrivacyPage} />
        // <Route path="*" component={NotFoundPage} />
    </Route>
);

export default routes
