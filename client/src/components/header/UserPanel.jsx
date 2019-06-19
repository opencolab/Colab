import React, {Component} from 'react';

import {Dropdown, Image} from "react-bootstrap";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {MDBIcon} from "mdbreact";

import SessionCreationForm from "../session/SessionCreationForm";

import {signOut} from "../../store/actions/authentication/signOut";

import {USERNAME} from "../../store/data/mapping/user";
import {USER_PROFILE_URL} from "../../store/data/mapping/url";
import {GET_PROFILE_PIC} from "../../store/data/mapping/api";
import {OPEN_FORM, SESSION_CREATION_FORM} from "../../store/data/mapping/form";

class UserPanel extends Component {
    logOut = () => {
        this.props.signOut(this.props.history);
    };

    profile = () => {
        this.props.history.push(USER_PROFILE_URL);
    };

    render() {
        return (
            <Dropdown size="sm" className={"mr-5"}>
                <Image
                    style={{border: "1px solid", padding: "3px", objectFit: "cover"}}
                    roundedCircle
                    src={GET_PROFILE_PIC + localStorage.getItem(USERNAME)}
                    width={32}
                    height={32}
                />

                <Dropdown.Toggle style={{color: "white"}} variant={"link"} className={"shadow-none"}>
                    <p style={{display: "inline"}}>
                        {localStorage.getItem(USERNAME)}
                    </p>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item as="button" onClick={this.props.openSessionCreator}>
                        <MDBIcon icon="plus"/>
                        {" New Session"}
                    </Dropdown.Item>

                    <SessionCreationForm/>

                    <Dropdown.Divider/>

                    <Dropdown.Header>
                        Account Settings
                    </Dropdown.Header>

                    <Dropdown.Item as="button" onClick={this.profile}>
                        <MDBIcon icon="user-alt"/>
                        {" Profile"}
                    </Dropdown.Item>

                    <Dropdown.Item as="button" onClick={this.logOut}>
                        <MDBIcon icon="sign-out-alt"/>
                        {" Sign Out"}
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: (history) => dispatch(signOut(history)),
        openSessionCreator: () => dispatch({type: SESSION_CREATION_FORM, payload: OPEN_FORM})
    }
};

export default connect(null, mapDispatchToProps)(withRouter(UserPanel));