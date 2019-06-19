import React, {Component} from 'react';

import {Button, Nav, ProgressBar} from 'react-bootstrap';
import {connect} from "react-redux";
import {MDBIcon} from "mdbreact";

import axios from "axios";

import SessionLayout from "./SessionLayout";
import SessionPanel from "./SessionPanel";

import {joinSession} from "../../store/actions/session/joinSession";

import {SESSION_SOCKET} from "../../store/data/mapping/socket";
import {GET_PROFILE_PIC} from "../../store/data/mapping/api";
import {SESSION_CONNECTED_USERS} from "../../store/data/mapping/session";
import {USERNAME} from "../../store/data/mapping/user";

import Authenticate from "../authentication/Authenticate";

class Session extends Component {
    state = {
        id: this.props.match.params.sessionId,
        taskShow: false,
        loaded: false,
        editor: "",
        correct: 0,
        wrong: 0,
        grade: 0
    };

    handler = (e) => {
        console.log(e);
        this.setState({editor: e});
    };

    componentDidMount() {
        this.props.joinSession(this.state.id, () => {
            this.setState({loaded: true});
            const {socket} = this.props;
            socket.on("current-users", (users) => {

                // REVIEW: var is used instead of let of const
                var arr = [];
                users.forEach((item, index) => {
                        index = index + 1;

                        arr[arr.length] = {
                            id: 1,
                            name: item,
                            eimg: GET_PROFILE_PIC + item,
                            ejob: "student",
                            hasChild: true
                        };

                        arr[arr.length] = {id: 11, pid: index, name: 'Perm1'};
                        arr[arr.length] = {id: 12, pid: index, name: 'Perm2'};
                        arr[arr.length] = {id: 13, pid: index, name: 'Perm3'};
                        arr[arr.length] = {id: 14, pid: index, name: 'Perm4'};

                        // REVIEW: Commented code was removed from here
                    }
                );

                this.props.updateSessionUsers(arr);
            });
        });
    }

    componentWillUnmount() {
    }

    run = () => {
        console.log("run function");
        this.props.socket.emit("save-file", this.state.editor, (data) => {
                if (data) {
                    axios.post("/lsp/run-task", {
                        sessionId: this.state.id,
                        username: localStorage.getItem(USERNAME),
                        taskId: 1
                    }, {headers: {'Authorization': "bearer " + localStorage.getItem('user')}})
                        .then((res) => {
                                let grade = res.data.correct / (res.data.correct + res.data.wrong) * 100;
                                this.setState({correct: res.data.correct, wrong: res.data.wrong, grade: grade})
                            }
                        )
                        .catch(() => console.log("grade error"))
                }
            }
        );
    };

    // REVIEW: Unused field percent
    percent = () => {
        if (this.state.correct + this.state.wrong === 0)
            return 0;
        return this.state.correct / (this.state.correct + this.state.wrong) * 100;
    };

    render() {
        if (!this.state.loaded) {
            return <h2>Loading...</h2>
        } else return (
            <div>
                <Nav className="justify-content-end" activeKey="/home">
                    <Nav.Item>
                        <ProgressBar
                            now={this.state.grade}
                            label={this.state.grade + "%"}
                            variant={"success"}
                            style={{width: 100, fontSize: 12}}
                        />
                    </Nav.Item>

                    <Nav.Item>
                        <span className="custom-dropdown small">
                            <select>
                                <option>tomorrow</option>
                                <option>github</option>
                            </select>
                        </span>
                    </Nav.Item>

                    <Nav.Item>
                        <span className="custom-dropdown small">
                            <select>
                                <option>tomorrow</option>
                                <option>github</option>
                            </select>
                        </span>
                    </Nav.Item>

                    <Nav.Item>
                       <span className="custom-dropdown small">
                            <select>
                                <option>tomorrow</option>
                                <option>github</option>
                            </select>
                        </span>
                    </Nav.Item>

                    <Nav.Item>
                        <Button size={"sm"} variant={"outline-success"}><MDBIcon icon="tasks"/>{" Tasks"}</Button>
                    </Nav.Item>

                    <Nav.Item>
                        <Button onClick={this.run} size={"sm"} variant={"outline-success"}><MDBIcon
                            icon="play"/>{" Run"}</Button>
                    </Nav.Item>
                </Nav>

                <div className={"wrapper"} style={{color: 'white'}}>
                    <SessionPanel/>
                    <SessionLayout handler={this.handler} taskButtonValue={"Task"} rooms={["Master", "Mourad"]}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (combinedReducer) => {
    return {socket: combinedReducer.sockets[SESSION_SOCKET]}
};

const mapDispatchToProps = (dispatch) => {
    return {
        joinSession: (id, callback) => dispatch(joinSession(id, callback)),
        updateSessionUsers: (users) => dispatch({type: SESSION_CONNECTED_USERS, payload: users})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate(Session));