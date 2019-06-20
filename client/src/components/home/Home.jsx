import React, {Component} from 'react';

import {Col, Row} from 'react-bootstrap';
import Container from "react-bootstrap/Container";

class Home extends Component {
    render() {
        return (
            <div>
                <Container style={{marginTop: 100}}>
                    <Row>
                        <Col sm={{span: 5}} style={{marginTop: 50}}>
                            <h1>
                                About Us
                            </h1>

                            <p style={{fontSize: 26}}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}


export default Home;