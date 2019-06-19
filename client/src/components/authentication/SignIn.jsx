import React, {Component} from 'react';

import {Button, Form, Modal} from "react-bootstrap";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

import {signIn} from "../../store/actions/authentication/signIn"

import {PASSWORD, USERNAME} from "../../store/data/mapping/user";
import {DASHBOARD_URL} from "../../store/data/mapping/url";
import {AUTHENTICATION_ERROR, CLEAR_SIGN_IN_ERROR} from "../../store/data/mapping/authentication";
import {CLOSE_FORM, SIGN_IN_FORM} from "../../store/data/mapping/form";

class SignIn extends Component {
    state = {
        [USERNAME]: "",
        [PASSWORD]: "",
    };

    changeState = (e) => {
        this.props.clearErrorMessage();
        this.setState({[e.target.id]: e.target.value});
    };

    close = () => {
        this.props.closeSignIn();
        this.props.clearErrorMessage();
    };

    logIn = (e) => {
        if (e.currentTarget.checkValidity()) {
            e.preventDefault();
            this.props.signIn(this.state, () => {
                this.props.closeSignIn();
                this.props.history.push(DASHBOARD_URL);
            });
        }
    };

    render() {
        if (this.props.authenticated) {
            this.props.history.push(DASHBOARD_URL);
        } else return (
            <Modal
                {...this.props}
                style={{color: "black"}}
                centered
                show={this.props.display}
                onHide={this.close}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Sign In
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form id={"sign_in_form"} onSubmit={this.logIn} validated={true}>
                        <Form.Group controlId={USERNAME}>
                            <Form.Label column={false}>
                                Username
                            </Form.Label>

                            <small>
                                {this.state[USERNAME + "Error"]}
                            </small>

                            <Form.Control
                                required
                                type="text"
                                placeholder="Username"
                                onChange={this.changeState}
                            />
                        </Form.Group>

                        <Form.Group controlId={PASSWORD}>
                            <Form.Label column={false}>
                                Password
                            </Form.Label>

                            <small>
                                {this.state[PASSWORD + "Error"]}
                            </small>

                            <Form.Control
                                required
                                ype="password"
                                placeholder="Password"
                                onChange={this.changeState}
                            />
                        </Form.Group>

                        <small>
                            {this.props.error}
                        </small>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button form="sign_in_form" type={"submit"} variant="success">
                        Sign In
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapStateToProps = (combinedReducer) => {
    return {
        authenticated: combinedReducer.auth.authenticated,
        display: combinedReducer.forms[SIGN_IN_FORM],
        error: combinedReducer.auth[AUTHENTICATION_ERROR]
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (signInData, callback) => dispatch(signIn(signInData, callback)),
        clearErrorMessage: () => dispatch({type: CLEAR_SIGN_IN_ERROR}),
        closeSignIn: () => dispatch({type: SIGN_IN_FORM, payload: CLOSE_FORM})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignIn));