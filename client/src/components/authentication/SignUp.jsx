import React, {Component} from 'react';

import {Button, Form, Modal} from "react-bootstrap";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

import {signUp} from "../../store/actions/authentication/signUp";

import {DASHBOARD_URL} from "../../store/data/mapping/url";
import {EMAIL, PASSWORD, USERNAME} from "../../store/data/mapping/user";
import {CLEAR_SIGN_UP_ERROR, REGISTRATION_ERROR} from "../../store/data/mapping/authentication";
import {CLOSE_FORM, SIGN_UP_FORM} from "../../store/data/mapping/form";
import {EmailRegex, PasswordRegex, UsernameRegex} from "../../store/data/mapping/regex";

class SignUp extends Component {
    state = {
        [USERNAME]: "",
        [EMAIL]: "",
        [PASSWORD]: "",
    };

    changeState = (e) => {
        this.setState({[e.target.id]: e.target.value});
    };

    signUp = (e) => {
        if (e.currentTarget.checkValidity()) {
            e.preventDefault();
            if (this.state[USERNAME] && this.state[EMAIL] && this.state[PASSWORD]) {
                this.props.signUp(this.state, () => {
                    this.props.closeSignUp();
                    this.props.history.push(DASHBOARD_URL);
                });
            }
        }
    };

    hide = () => {
        this.props.closeSignUp();
        this.props.clearErrorMessage();
    };

    render() {
        if (this.props.authenticated) {
            this.props.history.push(DASHBOARD_URL);
        } else return (
            <Modal
                {...this.props}
                style={{color: "black"}}
                centered show={this.props.display}
                onHide={this.hide}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Sign Up
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form id={"sign_up_form"} onSubmit={this.signUp} validated={true}>
                        <Form.Group controlId={USERNAME}>
                            <Form.Label column={false}>
                                Username
                            </Form.Label>

                            <small>
                                {this.state[[USERNAME + "Error"]]}
                            </small>

                            <Form.Control
                                cols="16"
                                maxlength="16"
                                pattern={UsernameRegex}
                                required
                                type="text"
                                placeholder="Username"
                                onChange={this.changeState}/>
                        </Form.Group>

                        <Form.Group controlId={EMAIL}>
                            <Form.Label column={false}>
                                Email address
                            </Form.Label>

                            <small>
                                {this.state[[EMAIL + "Error"]]}
                            </small>

                            <Form.Control
                                pattern={EmailRegex}
                                required
                                type="email"
                                placeholder="Enter email"
                                onChange={this.changeState}
                            />
                        </Form.Group>

                        <Form.Group controlId={PASSWORD}>
                            <Form.Label column={false}>
                                Password
                            </Form.Label>

                            <small>
                                {this.state[[PASSWORD + "Error"]]}
                            </small>

                            <Form.Control
                                cols="32"
                                maxlength="32"
                                pattern={PasswordRegex}
                                required
                                type="password"
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
                    <Button form={"sign_up_form"} type={"submit"} variant="success">
                        Sign up for Colab
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapStateToProps = (combinedReducer) => {
    return {
        authenticated: combinedReducer.auth.authenticated,
        display: combinedReducer.forms[SIGN_UP_FORM],
        error: combinedReducer.auth[REGISTRATION_ERROR]
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        signUp: (signUpData, callback) => dispatch(signUp(signUpData, callback)),
        clearErrorMessage: () => dispatch({type: CLEAR_SIGN_UP_ERROR}),
        closeSignUp: () => dispatch({type: SIGN_UP_FORM, payload: CLOSE_FORM})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignUp));