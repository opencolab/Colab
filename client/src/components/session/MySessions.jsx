import React, {Component} from 'react';

import {Accordion, Button, Card, Col, Row} from "react-bootstrap";
import {connect} from "react-redux";
import {MDBIcon} from "mdbreact";

import Authenticate from "../authentication/Authenticate";

import {
    MY_SESSIONS,
    SESSION_DESCRIPTION,
    SESSION_HIDDEN,
    SESSION_ID,
    SESSION_NAME
} from "../../store/data/mapping/session";

import {getMySessionsAction} from "../../store/actions/session/getMySessionsAction";

class MySessions extends Component {
    state = {loaded: false};

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
        if (!this.state.loaded) {
            return <h2> Loading... </h2>
        }
        else if (!this.props[MY_SESSIONS]) {
            return <h2> No Sessions </h2>
        }
        else return (
            <Accordion defaultActiveKey="0" style={{color: "black"}}>
                {
                    this.props[MySessions].map((session) =>
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey={session[SESSION_ID]}>
                                <Row>
                                    <Col md={{span: 2}}>
                                        {session[SESSION_NAME]}
                                    </Col>

                                    <Col md={{span: 2, offset: 8}}>
                                        <MDBIcon far icon="plus-square"/>
                                        {"  More Information"}
                                    </Col>
                                </Row>
                            </Accordion.Toggle>

                            <Accordion.Collapse eventKey={session[SESSION_ID]} style={{paddingRight: "1%"}}>
                                <Row style={{marginTop: "1%", marginBottom: "1%"}}>
                                    <Col md={{span: 5}} style={{paddingLeft: "30px"}}>
                                        {session[SESSION_DESCRIPTION]}
                                    </Col>

                                    <Col md={{span: 1, offset: 1}}>
                                        {session[SESSION_HIDDEN]}
                                    </Col>

                                    <Col md={{span: 1, offset: 2}}>
                                        <Button
                                            onClick={this.join}
                                            style={{background: "none", color: "black", border: "none"}}
                                        >
                                            <MDBIcon icon="sign-in-alt"/>{" Join "}
                                        </Button>
                                    </Col>
                                </Row>
                            </Accordion.Collapse>
                        </Card>
                    )
                }
            </Accordion>
        );
    }
}

const mapStateTpProps = (combinedReducer) => {
    return {
        [MY_SESSIONS]: combinedReducer.sessionStorage[MY_SESSIONS]
    };
};
const mapDispatchTpProps = (dispatch) => {
    return {
        getMySessions: (callback) => dispatch(getMySessionsAction(callback))
    };

};

export default connect(mapStateTpProps, mapDispatchTpProps)(Authenticate(MySessions));