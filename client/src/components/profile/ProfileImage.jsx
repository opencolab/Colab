import React, {Component} from "react";
import {Button, Card, Image} from "react-bootstrap";
import {connect} from "react-redux";

import ImageUpload from "./ImageUpload";

import {IMAGE, USERNAME} from "../../store/data/mapping/user";

class ProfileImage extends Component {
    state = {uploadForm: false,};

    openUploadForm = () => {
        this.setState({uploadForm: true});
    };

    closeUploadForm = () => {
        this.setState({uploadForm: false});
    };

    render() {
        return (
            <Card className={"pictureCard"}>
                <Card.Header>
                    User Picture
                </Card.Header>

                <Card.Body className={"Body"}>
                    <Button variant={"link"} onClick={this.openUploadForm}>
                        <Image className={"myImage"} roundedCircle src={this.props.img.URL}/>
                    </Button>

                    <Card.Subtitle className="mt-2">
                        {localStorage.getItem(USERNAME)}
                    </Card.Subtitle>
                </Card.Body>

                <ImageUpload
                    show={this.state.uploadForm}
                    onHide={this.closeUploadForm}
                />
            </Card>
        );
    }
}

const mapStateToProps = (combinedReducers) => {
    return {img: combinedReducers.profileReducer.profileReducer[IMAGE]}
};

export default connect(mapStateToProps)(ProfileImage);