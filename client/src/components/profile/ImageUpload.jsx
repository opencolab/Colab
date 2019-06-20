import React, {Component} from 'react';

import {Button, FormControl, Image, Modal} from "react-bootstrap";
import {connect} from "react-redux";

import {IMAGE} from "../../store/data/mapping/user";

class ImageUpload extends Component {
    state = {img: {URL: this.props.img.URL, file: null}, button: true};

    imageHandle = (e) => {
        this.setState({
                img: {URL: URL.createObjectURL(e.target.files[0]), file: e.target.files[0]},
                button: false
            }
        );
    };

    changeImage = () => {
        this.props.handleProfileChange(IMAGE, this.state.img);
        this.props.onHide();
    };

    render() {
        return (
            <Modal {...this.props} size="sm" style={{color: "black"}} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Upload Image
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className={"errorDiv"}>
                    <Image className={"previewImage"} roundedCircle src={this.state.img.URL}/>

                    <FormControl
                        variant={"dark"}
                        className={"mt-4"}
                        id={IMAGE}
                        type={"file"}
                        onChange={this.imageHandle}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="info" disabled={this.state.button} onClick={this.changeImage}>
                        Done
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapStateToProps = (combinedReducers) => {
    return {img: combinedReducers.profileReducer.profileReducer[IMAGE]}
};

const mapDispatchToProps = (dispatch) => {
    return {handleProfileChange: (data, value) => dispatch({type: data, value: value})}
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageUpload);