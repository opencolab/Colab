import React, {Component} from "react";

import {Button, Card, Form, InputGroup} from "react-bootstrap";
import {connect} from "react-redux";

import {
    CONFIRM_PASSWORD,
    EMAIL,
    FIRST_NAME,
    LAST_NAME,
    NEW_PASSWORD,
    OLD_PASSWORD
} from "../../store/data/mapping/user";
import {EmailRegex, NamesRegex, PasswordRegex} from "../../store/data/mapping/regex";

class ProfileInfo extends Component {
    state = {passDisable: true, passRequired: false, confirmPattern: ""};

    inputChangeHandler = (e) => {
        this.props.handleProfileChange(e.target.id, e.target.value);
        if (e.target.id === OLD_PASSWORD) {
            if (e.target.value.length > 0) {
                this.setState({passDisable: false, passRequired: true});
            } else {
                this.setState({passDisable: true, passRequired: false});
            }
        } else if (e.target.id === NEW_PASSWORD) {
            this.setState({confirmPattern: e.target.value})
        }
    };

    render() {
        return (
            <Card className={"informationCard"}>
                <Card.Header>
                    User Information
                </Card.Header>

                <Card.Body>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                {"First Name"}
                            </InputGroup.Text>
                        </InputGroup.Prepend>

                        <Form.Control
                            pattern={NamesRegex}
                            form={"profile_form"}
                            id={FIRST_NAME}
                            type={"text"}
                            value={this.props.user[FIRST_NAME]}
                            onChange={this.inputChangeHandler}
                        />
                    </InputGroup>

                    <br/>

                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                {"Last Name"}
                            </InputGroup.Text>
                        </InputGroup.Prepend>

                        <Form.Control
                            pattern={NamesRegex}
                            form={"profile_form"}
                            id={LAST_NAME}
                            type={"text"}
                            value={this.props.user[LAST_NAME]}
                            onChange={this.inputChangeHandler}
                        />
                    </InputGroup>

                    <br/>

                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                {"Old Password"}
                            </InputGroup.Text>
                        </InputGroup.Prepend>

                        <Form.Control
                            pattern={PasswordRegex}
                            form={"profile_form"}
                            id={OLD_PASSWORD}
                            type={"password"}
                            value={this.props.user[OLD_PASSWORD]}
                            onChange={this.inputChangeHandler}
                        />
                    </InputGroup>

                    <br/>

                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                {"New Password"}
                            </InputGroup.Text>
                        </InputGroup.Prepend>

                        <Form.Control
                            pattern={PasswordRegex}
                            required={this.state.passRequired}
                            disabled={this.state.passDisable}
                            form={"profile_form"}
                            id={NEW_PASSWORD}
                            type={"password"}
                            value={this.props.user[NEW_PASSWORD]}
                            onChange={this.inputChangeHandler}
                        />
                    </InputGroup>

                    <br/>

                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                {"Confirm Password"}
                            </InputGroup.Text>
                        </InputGroup.Prepend>

                        <Form.Control
                            pattern={this.state.confirmPattern}
                            required={this.state.passRequired}
                            disabled={this.state.passDisable}
                            form={"profile_form"}
                            id={CONFIRM_PASSWORD}
                            type={"password"}
                            value={this.props.user[CONFIRM_PASSWORD]}
                            onChange={this.inputChangeHandler}
                        />
                    </InputGroup>

                    <br/>

                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                {"Email"}
                            </InputGroup.Text>
                        </InputGroup.Prepend>

                        <Form.Control
                            pattern={EmailRegex}
                            required
                            form={"profile_form"}
                            id={EMAIL}
                            type={"email"}
                            value={this.props.user[EMAIL]}
                            onChange={this.inputChangeHandler}
                        />
                    </InputGroup>

                    <br/>
                </Card.Body>

                <Card.Footer style={{display: "flex", justifyContent: "flex-end"}}>
                    <Button form={"profile_form"} variant={"primary"} type={"submit"}>
                        Save changes
                    </Button>
                </Card.Footer>
            </Card>
        );
    }
}

const mapStateToProps = (combinedReducers) => {
    return {user: combinedReducers.profileReducer.profileReducer}
};

const mapDispatchToProps = (dispatch) => {
    return {handleProfileChange: (data, value) => dispatch({type: data, value: value})}
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfo);