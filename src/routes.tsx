import React from 'react';
import {Redirect, Route, Router, Switch} from 'react-router-dom';
import history from './history';
import {useSelector} from "react-redux";
import _ from 'lodash';
import Login from "./Views/Login/Login";
import ForgotPassword from "./Views/PasswordReset/ForgotPassword";
import SignUp from "./Views/SignUp/SignUp";
import Dashboard from "./Views/Dashboard/Dashboard";
import {selectAuth} from "./redux/features/authSlice";

const IndexLayout: React.FC = () => {
    return <Switch>
        <Route path={'/login'} component={Login}/>
        <Route path={'/forgot-password'} component={ForgotPassword}/>
        <Route path={'/signup'} component={SignUp}/>
        <Route path='/' render={() => {
            console.log('Rendering');
            return <Redirect to={'/login'}/>
        }}/>
    </Switch>;
}

const MainLayout: React.FC = () => {
    return <Switch>
        <Route path={"/dashboard"} component={Dashboard}/>
        <Route path='/' render={() => {
            return <Redirect to={'/dashboard'}/>
        }}/>
    </Switch>
};

const Routes: React.FC = () => {
    const auth = useSelector(selectAuth);
    return <Router history={history}>
        {!_.isNil(auth.user) ? <MainLayout/> : <IndexLayout/>}
    </Router>

};

export default Routes;
