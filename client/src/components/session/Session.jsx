import React, {Component} from 'react';

import {Row} from 'react-bootstrap';

import SessionLayout from "./SessionLayout";
import SessionPanel from "./SessionPanel";

import TaskForm from "../TaskForm";

import python from "../session/python.jpg";

class Session extends Component {
    state = {taskShow: false};

    items = [
        {
            img: python, username: "Tab 1",
            permissions: [
                {name: "permission1", value: true},
                {name: "permission2", value: false},
                {name: "permission3", value: true},
                {name: "permission4", value: true}
            ]
        },
        {
            img: python, username: "Tab 1",
            permissions: [
                {name: "permission1", value: true},
                {name: "permission2", value: false},
                {name: "permission3", value: true},
                {name: "permission4", value: true}
            ]
        },
        {
            img: python, username: "Tab 1",
            permissions: [
                {name: "permission1", value: true},
                {name: "permission2", value: false},
                {name: "permission3", value: true},
                {name: "permission4", value: true}
            ]
        },
        {
            img: python, username: "Tab 1",
            permissions: [
                {name: "permission1", value: true},
                {name: "permission2", value: false},
                {name: "permission3", value: true},
                {name: "permission4", value: true}
            ]
        },
        {
            img: python, username: "Tab 1",
            permissions: [
                {name: "permission1", value: true},
                {name: "permission2", value: false},
                {name: "permission3", value: true},
                {name: "permission4", value: true}
            ]
        },
        {
            img: python, username: "Tab 2",
            permissions: [
                {name: "permission1", value: true},
                {name: "permission2", value: false},
                {name: "permission3", value: false},
                {name: "permission4", value: true}
            ]
        },
        {
            img: python, username: "Tab 3",
            permissions: [
                {name: "permission1", value: false},
                {name: "permission2", value: false},
                {name: "permission3", value: false},
                {name: "permission4", value: false}
            ]
        },
        {
            img: python, username: "Tab 4",
            permissions: [
                {name: "permission1", value: true},
                {name: "permission2", value: false},
                {name: "permission3", value: true},
                {name: "permission4", value: true}
            ]
        },
        {
            img: python, username: "Tab 5",
            permissions: [
                {name: "permission1", value: true},
                {name: "permission2", value: true},
                {name: "permission3", value: true},
                {name: "permission4", value: true}
            ]
        },
    ];

    closeTask = () => this.setState({taskShow: false});
    openTask = () => this.setState({taskShow: true});

    render() {
        return (
            <div style={{color: 'white'}}>
                <TaskForm
                    show={this.state.taskShow}
                    onHide={this.closeTask}
                />

                <div className={"wrapper"}>
                    <SessionPanel items={this.items}/>

                    <SessionLayout
                        openTask={this.openTask}
                        taskButtonValue={"Task"}
                        rooms={["Master", "Mourad"]}
                    />
                </div>
            </div>
        );
    }
}

export default Session;