import React, {Component} from 'react';
// REVIEW: Unused import specifier Card
import {Button, Form, Modal} from "react-bootstrap";

class TaskCreationForm extends Component {
    render() {
        return (
            <Modal size="lg" {...this.props} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton style={{backgroundColor: "#43b581"}}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Task
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{backgroundColor: "#232937"}}>
                    <Form>
                        <Form.Label>
                            Task
                        </Form.Label>

                        <Form.Control style={{resize: "none"}} as={"textarea"} rows={8}/>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{backgroundColor: "#232937"}}>
                    <Button variant={"outline-info"}>
                        Add
                    </Button>

                    <Button variant={"outline-info"} onClick={this.props.onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

// REVIEW: Unused default exports
export default TaskCreationForm;