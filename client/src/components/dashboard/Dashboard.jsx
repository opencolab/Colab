import React, {Component} from 'react';

import {CardColumns} from "react-bootstrap";
import {connect} from "react-redux";

import DashboardCard from "./DashboardCard";

import {getPublicSessions} from "../../store/actions/session/getPublicSessions";

import {PUBLIC_SESSIONS} from "../../store/data/mapping/session";


class Dashboard extends Component {
    componentWillMount() {
        this.props.getSessions();
    }

    render() {
        return !this.props[PUBLIC_SESSIONS]
            ?
            <div>
                Loading...
            </div>
            :
            <CardColumns>
                {this.props[PUBLIC_SESSIONS].map((session) => <DashboardCard session={session}/>)}
            </CardColumns>
    };
}


const mapStateToProps = (combineReducers) => {
    return {[PUBLIC_SESSIONS]: combineReducers.sessionStorage[PUBLIC_SESSIONS]}
};

const mapDispatchToProps = (dispatch) => {
    return {getSessions: () => dispatch(getPublicSessions())}
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);