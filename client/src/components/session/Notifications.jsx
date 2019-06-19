import React, {Component} from 'react';

import {Col, Nav, Row, Tab} from "react-bootstrap";
import {connect} from "react-redux";

import Authenticate from "../authentication/Authenticate";

import {MY_SESSIONS} from "../../store/data/mapping/session";

import {getMySessions} from "../../store/actions/session/getMySessions";

import MySessions from "./MySessions";

class Notifications extends Component {
    state = { loaded: false };

    join = () => {
    };

    componentDidMount() {
        this.props.getMySessions(() => {
            this.setState({loaded: true});
        });
    }

    componentWillUnmount() {
        this.setState({loaded: false})
    }

    render() {
        return (
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="first">
                                    Tab 1
                                </Nav.Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Nav.Link eventKey="second">
                                    Tab 2
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>

                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <MySessions/>
                            </Tab.Pane>

                            <Tab.Pane eventKey="second">
                                <h2>
                                    second
                                </h2>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}

const mapStateTpProps = (combinedReducer) => {
    return {[MY_SESSIONS]: combinedReducer.sessionStorage[MY_SESSIONS]};
};

const mapDispatchTpProps = (dispatch) => {
    return {getMySessions: (callback) => dispatch(getMySessions(callback))};

};

export default connect(mapStateTpProps, mapDispatchTpProps)(Authenticate(Notifications));