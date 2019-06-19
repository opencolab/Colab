import React, {Component} from 'react';

import {Tabs, Tab, Button, ButtonToolbar, OverlayTrigger, Tooltip, Form, Col} from 'react-bootstrap';
import {MDBIcon} from "mdbreact";

import {ContextMenuComponent, TreeViewComponent} from "@syncfusion/ej2-react-navigations";
import {CheckBoxComponent} from '@syncfusion/ej2-react-buttons';
import {enableRipple} from '@syncfusion/ej2-base';

import {SESSION_HIDDEN} from "../../store/dataMapping/session";

enableRipple(true);

class SessionPanel extends Component {
    MenuItemModel = [
        {
            text: 'Cut',
            iconCss: 'cut'
        },
        {
            text: 'Copy',
            iconCss: 'copy'
        },
        {
            text: 'Paste',
            iconCss: 'paste',
        },
        {
            separator: true
        },
        {
            text: 'Add Folder',
            iconCss: 'folder-plus'
        },
        {
            text: 'Add File',
            iconCss: 'folder-minus'
        }];

    constructor() {
        super(...arguments);
        this.files = [
            {
                id: '01', name: 'Local Disk (C:)', expanded: true,
                subChild: [
                    {
                        id: '01-01', name: 'Program Files',
                        subChild: [
                            {id: '01-01-01', name: '7-Zip'},
                            {id: '01-01-02', name: 'Git'},
                            {id: '01-01-03', name: 'IIS Express'},
                        ]
                    },
                    {
                        id: '01-02', name: 'Users', expanded: true,
                        subChild: [
                            {id: '01-02-01', name: 'Smith'},
                            {id: '01-02-02', name: 'Public'},
                            {id: '01-02-03', name: 'Admin'},
                        ]
                    },
                    {
                        id: '01-03', name: 'Windows',
                        subChild: [
                            {id: '01-03-01', name: 'Boot'},
                            {id: '01-03-02', name: 'FileManager'},
                            {id: '01-03-03', name: 'System32'},
                        ]
                    },
                ]
            },
            {
                id: '02', name: 'Local Disk (D:)',
                subChild: [
                    {
                        id: '02-01', name: 'Personals',
                        subChild: [
                            {id: '02-01-01', name: 'My photo.png'},
                            {id: '02-01-02', name: 'Rental document.docx'},
                            {id: '02-01-03', name: 'Pay slip.pdf'},
                        ]
                    },
                    {
                        id: '02-02', name: 'Projects',
                        subChild: [
                            {id: '02-02-01', name: 'ASP Application'},
                            {id: '02-02-02', name: 'TypeScript Application'},
                            {id: '02-02-03', name: 'React Application'},
                        ]
                    },
                    {
                        id: '02-03', name: 'Office',
                        subChild: [
                            {id: '02-03-01', name: 'Work details.docx'},
                            {id: '02-03-02', name: 'Weekly report.docx'},
                            {id: '02-03-03', name: 'Wish list.csv'},
                        ]
                    },
                ]
            },
            {
                id: '03', name: 'Local Disk (E:)', icon: 'folder',
                subChild: [
                    {
                        id: '03-01', name: 'Pictures',
                        subChild: [
                            {id: '03-01-01', name: 'Wind.jpg'},
                            {id: '03-01-02', name: 'Stone.jpg'},
                            {id: '03-01-03', name: 'Home.jpg'},
                        ]
                    },
                    {
                        id: '03-02', name: 'Documents',
                        subChild: [
                            {id: '03-02-01', name: 'Environment Pollution.docx'},
                            {id: '03-02-02', name: 'Global Warming.ppt'},
                            {id: '03-02-03', name: 'Social Network.pdf'},
                        ]
                    },
                    {
                        id: '03-03', name: 'Study Materials',
                        subChild: [
                            {id: '03-03-01', name: 'UI-Guide.pdf'},
                            {id: '03-03-02', name: 'Tutorials.zip'},
                            {id: '03-03-03', name: 'TypeScript.7z'},
                        ]
                    },
                ]
            }
        ];
        this.filesFields = {dataSource: this.files, id: 'id', text: 'name', child: 'subChild'};
        this.icons = [
            {id: "edit", icon: "edit"},
            {id: "copy", icon: "copy"},
            {id: "paste", icon: "paste"},
            {id: "cut", icon: "cut"},
            {id: "Add Folder", icon: "folder-plus"},
            {id: "Delete Folder", icon: "folder-minus"}
        ];
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
            return (
                <div>
                    <img
                        className="eimage"
                        src={'https://ej2.syncfusion.com/demos/src/grid/images/' + data.eimg + '.png'}
                        alt={data.eimg}
                    />
                    <div className="ename"> {data.name} </div>
                    <div className="ejob"> {data.ejob} </div>
                </div>);
        } else {
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
        return (
            <Col xs={3}>
                <div className={"sessionPanel"}>
                    <Tabs style={{width: "100%"}} id="controlled-tab-example">
                        <Tab eventKey="files" title="Files">
                            <ButtonToolbar>
                                {
                                    this.icons.map(placement => (
                                            <OverlayTrigger key={placement.id} placement={placement.id}
                                                            overlay={
                                                                <Tooltip
                                                                    id={`tooltip-${placement.id}`}> {placement.id}
                                                                </Tooltip>
                                                            }
                                            >
                                                <Button variant={"link"}>
                                                    <MDBIcon id={placement.id}
                                                             icon={placement.icon}
                                                             className={"icons"}
                                                    />
                                                </Button>
                                            </OverlayTrigger>
                                        )
                                    )
                                }
                            </ButtonToolbar>

                            <TreeViewComponent
                                id={'target'}
                                fields={this.filesFields}
                                allowEditing={true}
                                allowMultiSelection={true}
                                allowDragAndDrop={true}
                                style={{color: "white"}}
                            />

                            <ContextMenuComponent target="#target" items={this.MenuItemModel}/>
                        </Tab>

                        <Tab eventKey="users" title="Users">
                            <TreeViewComponent
                                fields={this.usersFields}
                                nodeTemplate={this.nodeTemplate}
                                cssClass={'custom'}
                            />
                        </Tab>
                    </Tabs>
                </div>
            </Col>
        );
    }
}

export default SessionPanel;