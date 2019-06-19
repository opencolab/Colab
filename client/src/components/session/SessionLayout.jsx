import React, {Component} from 'react';
import {Col} from "react-bootstrap";

import Form from "react-bootstrap/Form";
import Draggable from 'react-draggable';

import '../../css/index.css';

class SessionLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: this.props.rooms,
            resizing: false,
            CodeSectionHeight: 70,
            OutputSectionHeight: 29.01
        };
    }

    // REVIEW: Commented code was removed from here

    joinRoom = (event) => {
        this.state.socket.emit("joinRoom", event);
    };

    send = (event) => {
        this.state.socket.emit("sharedCode", event.target.id, event.target.value);
    };

    getDimensions = (el) => {
        let rect = el.getBoundingClientRect();
        return {height: rect.height, y: rect.top};
    };

    resize = (e) => {
        e.stopPropagation();
        e.preventDefault();

        let div = this.getDimensions(document.querySelector(".wrapper"));

        let newHeight = Math.max(Math.min((e.clientY - div.y) / div.height * 100, 96), 4);

        this.setState({
            CodeSectionHeight: newHeight,
            OutputSectionHeight: 99.01 - newHeight - 0.01
        });
    };

    render() {

        // REVIEW: The usage of rooms in here is ?
        const {rooms} = this.state;
        return (
            <Col style={{position: "fixed", width: 600}}>
                <div className={"wrapper"}>
                    <div style={{height: this.state.CodeSectionHeight + "%"}}>
                        <Form.Control
                            as={"textarea"}
                            style={{resize: "none", height: "100%", borderRadius: 5}}
                            placeholder={"Write your Code ..."}
                        />
                    </div>

                    <Draggable
                        axis="y"
                        onDrag={(e) => this.resize(e)}
                        scale={0}
                        bounds={{bottom: 10}}
                    >
                        <div className={"handle"}/>
                    </Draggable>

                    <div className={"content"} style={{height: this.state.OutputSectionHeight + "%"}}>
                        <Form.Control
                            as={"textarea"}
                            style={{resize: "none", height: "100%", borderRadius: 5}}
                            placeholder={"Output Section ..."}

                            // REVIEW: Commented code was removed from here
                        />
                    </div>
                </div>
            </Col>

            // REVIEW: Commented code was removed from here
        );
    }
}

export default SessionLayout;