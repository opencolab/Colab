import React, {Component} from "react";

import {Form} from "react-bootstrap";
import {connect} from "react-redux";

import ProfileImage from "./ProfileImage";
import ProfileInfo from "./ProfileInfo";

import {getProfile} from "../../store/actions/profile/getProfile";
import {updateProfile} from "../../store/actions/profile/updateProfile";

import Authenticate from "../authentication/Authenticate";

class UserProfile extends Component {
    state = {validated: false, loaded: false};

    componentWillMount() {
        this.props.getProfile(() => {
                this.setState({loaded:true})
            }
        );
    }

    componentWillUnmount() {
        this.setState({loaded: false})
    }

    saveChanges = (e) => {
        e.preventDefault();
        if (e.currentTarget.checkValidity()) {
            this.props.updateProfile(this.props.user, this.props.history);
        }
        this.setState({validated: true});
    };

    render() {
        if (!this.props.user) {
            return <h2>Loading...</h2>;
        }
        else {
            return (
                <Form
                    id={"profile_form"}
                    className={"profile"}
                    onSubmit={this.saveChanges}
                    noValidate
                    validated={this.state.validated}>
                    <ProfileImage/>
                    <ProfileInfo/>
                </Form>
            )
        }
    }
}

const mapStateToProps = (combinedReducers) => {
    return {user: combinedReducers.profile.profile}
};

const mapDispatchToProps = (dispatch) => {
    return {
        getProfile: (callback) => dispatch(getProfile(callback)),
        updateProfile: (profile, history) => dispatch(updateProfile(profile, history))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate(UserProfile));