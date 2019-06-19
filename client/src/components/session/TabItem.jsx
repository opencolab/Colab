import React, {Component} from "react";

import {Col, Dropdown, Image, Nav, Row} from "react-bootstrap";

class TabItem extends Component {
    permissionChangeHandler = (e) => {
        console.log(e.target.id + " ," + e.target.value + " ," + e.target.checked);
    };

    render() {
        return (
            <Nav.Item className={"navItem"}>
                <Row className={"navItemRow"}>
                    <Col md={{span: 2}}>
                        <Image src={this.props.img} className={"tabImage"}/>
                    </Col>

                    <Col md={{span: 6}}>
                        <Nav.Link eventKey="first">
                            {this.props.username}
                        </Nav.Link>
                    </Col>

                    <Col md={{span: 2, offset: 1}}>
                        <Dropdown drop={"down"}>

                            <Dropdown.Toggle
                                variant={"link"}
                                className={"shadow-none"}
                            >
                            </Dropdown.Toggle>

                            <Dropdown.Menu className={"dd"}>
                                <Dropdown.Header>
                                    {this.props.username}
                                    Permissions
                                </Dropdown.Header>

                                {
                                    this.props.permissions.map(
                                        (permission) =>
                                            <Dropdown.Item as="button">
                                                < input
                                                    type={"checkbox"}
                                                    checked={permission.value}
                                                    id={this.props.username}
                                                    onChange={this.permissionChangeHandler}
                                                    value={permission.name}
                                                />
                                                {permission.name}
                                            </Dropdown.Item>
                                    )
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </Nav.Item>
        )
    }
}

// REVIEW: Unused default export
export default TabItem;