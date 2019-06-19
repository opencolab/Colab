import React, {Component} from 'react';

import {BrowserRouter, Route, Switch} from "react-router-dom";

import Home from "./components/home/Home";
import Dashboard from "./components/dashboard/Dashboard";
import Session from "./components/session/Session";
import Header from "./components/header/Header";
import UserProfile from "./components/profile/UserProfile";
import Authenticate from "./components/authentication/Authenticate";
import Error from "./components/error/Error";

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
                        <Route path="/profile" component={Authenticate(UserProfile)}/>
                        <Route path="/session" component={Authenticate(Session)}/>
                        {/* REVIEW: Commented code was removed from here */}
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
