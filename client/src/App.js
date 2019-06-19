import React, {Component} from 'react';

import {BrowserRouter, Route, Switch} from "react-router-dom";

import Header from "./components/header/Header";

import Home from "./components/home/Home";
import Error from "./components/error/Error";

import Dashboard from "./components/dashboard/Dashboard";
import UserProfile from "./components/profile/UserProfile";
import MySessions from "./components/session/MySessions";
import Notifications from "./components/session/Notifications";
import Session from "./components/session/Session";


class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Header/>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/error" component={Error}/>
                        <Route path="/dashboard" component={Dashboard}/>
                        <Route path="/profile" component={UserProfile}/>
                        <Route path="/mysessions" component={MySessions}/>
                        <Route path="/notifications" component={Notifications}/>
                        <Route path="/session" component={Session}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
