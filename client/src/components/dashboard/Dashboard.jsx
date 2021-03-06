import React, {Component} from 'react';

import {CardColumns} from "react-bootstrap";
import {connect} from "react-redux";

import DashboardCard from "./DashboardCard";

import {getPublicSessionsAction} from "../../store/actions/session/getPublicSessionsAction";

import {PUBLIC_SESSIONS} from "../../store/data/mapping/session";

class Dashboard extends Component {
    componentWillMount() {
        this.props.getSessions();
    }

    render() {
        if (!this.props[PUBLIC_SESSIONS]) {
            return <h2> Loading... </h2>;
        }
        else {
            return (<CardColumns> {
                    this.props[PUBLIC_SESSIONS].map((session) => <DashboardCard session={session}/>)
                }
                </CardColumns>
            );
        }
    };
}

const mapStateToProps = (combineReducers) => {
    return {[PUBLIC_SESSIONS]: combineReducers.sessionStorage[PUBLIC_SESSIONS]}
};

const mapDispatchToProps = (dispatch) => {
    return {getSessions: () => dispatch(getPublicSessionsAction())}
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);