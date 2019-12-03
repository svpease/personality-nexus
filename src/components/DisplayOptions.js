import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import * as configActions from '../actions/config';
import * as displayOptionsActions from '../actions/displayOptions';

import '../style/pretty-checkbox.min.css';

export default connect(state => ({
    config: state.config,
    displayOptions: state.displayOptions,
}), dispatch => ({
    configActions: bindActionCreators(configActions, dispatch),
    displayOptionsActions: bindActionCreators(displayOptionsActions, dispatch),
}))(class MyComponent extends Component {
    static propTypes = {
        configActions: PropTypes.object.isRequired,
        config: PropTypes.object.isRequired,
    }
    
    constructor(props) {
        super(props);
        
        this.options = [
            ['EEG', React.createRef(), 'eeg'],
            ['Cognitive Functions', React.createRef(), 'cognitiveFunctions'],
            ['Temperament', React.createRef(), 'temperament'],
        ];
    }
    
    onChange() {
        let features = [];
        this.options.forEach(([featureLabel, featureRef, featureId]) => {
            if (featureRef.current.checked) {
                features.push(featureId);
            }
        });
        this.props.displayOptionsActions.showFeatures(features);
    }
    
    render() {
        const {
            displayOptions,
        } = this.props;
        
        return (
            <div className='features'>
                {this.options.map(([featureLabel, featureRef, featureId]) => (
                    <div key={featureLabel} className="pretty p-default">
                        <input type="checkbox" ref={featureRef} onClick={this.onChange.bind(this)} defaultChecked={displayOptions.features.includes(featureId) ? 'checked' : ''} />
                        <div className="state">
                            <label>{featureLabel}</label>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
});