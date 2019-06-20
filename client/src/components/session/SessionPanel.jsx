import React, {Component} from 'react';

import {Card, Col} from 'react-bootstrap';
import {connect} from "react-redux";

import {enableRipple} from '@syncfusion/ej2-base';
import {TreeViewComponent} from "@syncfusion/ej2-react-navigations";
import {CheckBoxComponent} from '@syncfusion/ej2-react-buttons';

import {SESSION_SOCKET} from "../../store/data/mapping/socket";

enableRipple(true);

class SessionPanel extends Component {
    constructor(props) {
        super(props);

        this.users = [
            {id: 1, name: 'Steven Buchanan', eimg: '8', ejob: "student", hasChild: true},
            {id: 11, pid: 1, name: 'Perm1'},
            {id: 12, pid: 1, name: 'Perm2'},
            {id: 13, pid: 1, name: 'Perm3'},
            {id: 14, pid: 1, name: 'Perm4'},
            {id: 2, name: 'Laura Callahan', eimg: '9', ejob: "master", hasChild: true},
            {id: 21, pid: 2, name: 'Perm1'},
            {id: 22, pid: 2, name: 'Perm2'},
            {id: 23, pid: 2, name: 'Perm3'},
            {id: 24, pid: 2, name: 'Perm4'},
            {id: 3, name: 'Andrew Fuller', eimg: '6', ejob: "master", hasChild: true},
            {id: 31, pid: 3, name: 'Perm1'},
            {id: 32, pid: 3, name: 'Perm2'},
            {id: 33, pid: 3, name: 'Perm3'},
            {id: 34, pid: 3, name: 'Perm4'},
            {id: 4, name: 'Nancy Davolio', eimg: '7', ejob: "student", hasChild: true},
            {id: 41, pid: 4, name: 'Perm1'},
            {id: 42, pid: 4, name: 'Perm2'},
            {id: 43, pid: 4, name: 'Perm3'},
            {id: 44, pid: 4, name: 'Perm4'},

        ];

        this.usersFields = {
            dataSource: this.users,
            id: 'id',
            parentID: 'pid',
            text: 'name',
            hasChildren: 'hasChild'
        };
    }

    permissionChangeHandler = (e) => {
        console.log(e.target.name + " ," + e.target.value + " ," + e.target.checked);
        e.target.checked = !e.target.checked;
    };

    nodeTemplate = (data) => {
        if (data.hasChild) {
            console.log(data);
            return (
                <div style={{width: 252}}>
                    <img className="eimage" src={data.eimg} alt={data.eimg}/>

                    <div className="ename">
                        {data.name}
                    </div>

                    <div className="ejob">
                        {data.ejob}
                    </div>
                </div>);
        }
        else {
            return (
                <div style={{paddingTop: 10}}>
                    <CheckBoxComponent
                        name={data.pid}
                        value={data.name}
                        onClick={this.permissionChangeHandler}
                        className="ename"
                        label={data.name}
                    />
                </div>);
        }
    };

    render() {
        console.log(this.props);
        if (this.props.usersFields.dataSource.length === 0) {
            console.log(this.props);
            return  <h2>
                        Loading
                    </h2>
        }
        else {
            return (
                <Col xs={3}>
                    <div className={"panelSection"}>
                        <Card.Header as={"h4"}>
                            Users
                        </Card.Header>

                        <TreeViewComponent
                            fields={this.props.usersFields}
                            nodeTemplate={this.nodeTemplate}
                            cssClass={'custom'}
                        />
                    </div>
                </Col>
            );
        }
    }
}

const mapStateToProps = (combinedReducer) => {
    return {
        usersFields: combinedReducer.connectedSession.usersFields,
        socket: combinedReducer.sockets[SESSION_SOCKET]
    }
};

// REVIEW: Empty
const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps)(SessionPanel);