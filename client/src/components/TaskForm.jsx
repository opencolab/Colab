import React, {Component} from 'react';
import {Button, Card, Form, Modal} from "react-bootstrap";

class TaskForm extends Component {
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
                        <Card style={{color: "#606060"}}>
                            <Card.Body>
                                This is your damn task
                            </Card.Body>
                        </Card>

                        <Form.Label>
                            Select Language
                        </Form.Label>

                        <Form.Control as="select">
                            <option>
                                GNU G++ 14
                            </option>

                            <option>
                                GNU G++ 11
                            </option>

                            <option>
                                Microsoft Visual C++ 2010
                            </option>

                            <option>
                                Java 1.8.0
                            </option>
                        </Form.Control>

                        <Form.Label>
                            Your solution
                        </Form.Label>

                        <Form.Control style={{resize: "none"}} as={"textarea"} rows={5}/>
                    </Form>
                </Modal.Body>

                <Modal.Footer style={{backgroundColor: "#232937"}}>
                    <Button variant={"outline-info"}>
                        Submit
                    </Button>

                    <Button variant={"outline-info"} onClick={this.props.onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default TaskForm;