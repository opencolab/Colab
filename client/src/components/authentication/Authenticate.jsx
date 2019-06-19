import React, {Component} from 'react';

import {connect} from 'react-redux';

export default function (ComposedComponent) {
    class Authenticate extends Component {
        componentWillMount() {
            if (!this.props.authenticated) {
                this.props.history.push('/error');
            }
        }

        componentWillUpdate(nextProps, nextState, nextContext) {
            if (!nextProps.authenticated) {
                this.props.history.push('/error');
            }
        }

        render() {
            return <ComposedComponent {...this.props} />;
        }
    }

    function mapStateToProps(state) {
        return {authenticated: state.auth.authenticated};
    }

    return connect(mapStateToProps)(Authenticate);
}