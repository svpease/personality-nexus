import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import * as configActions from '../actions/config';
import listensToClickOutside from 'react-onclickoutside';
import onClickOutside from "react-onclickoutside";

export default connect(state => ({
    config: state.config,
}), dispatch => ({
    configActions: bindActionCreators(configActions, dispatch),
}))(class MyComponent extends Component {
    static propTypes = {
        configActions: PropTypes.object.isRequired,
        config: PropTypes.object.isRequired,
    }
    
    constructor(props) {
        super(props);
        
        this.filterInput = React.createRef();
        
        
        this.state = {
            isOpen: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.config.filter !== this.props.config.filter) {
            this.filterInput.current.value = nextProps.config.filter;
        }
        if (nextProps.config.filterByPersonalitySystem !== this.props.config.filterByPersonalitySystem) {
            this.synchronizeFilter(nextProps.config.filterByPersonalitySystem);
        }
    }

    /**
     * listensToClickOutside decorator function for clicking outside of this component
     * @param  {object} event Click event outside of component
     */
    handleClickOutside() {
        this.closeDropdown();
    }
    
    synchronizeFilter(filterByPersonalitySystem) {
        let filter = this.screenTypeFilter(this.filterInput.current.value, filterByPersonalitySystem);
        this.props.configActions.filterPersonalities(filter);
        this.filterInput.current.value = filter;
    }
    
    getPersonalitySystems() {
        return [
            ['mbti', 'Myers Briggs'],
            ['socionics', 'Socionics'],
            ['socionics-formal', 'Socionics (Formal)'],
        ];
    }
    
    getPersonalitySystemLabel(system) {
        let systemMap = {};
        this.getPersonalitySystems().forEach(([systemId, systemLabel]) => {
            systemMap[systemId] = systemLabel;
        });
        return systemMap[system];
    }
    
    /**
     * @param {String} typeFilterInput The type filter input attempting to become the updated type filter
     * @param {String} filterByPersonalitySystem The personality system being used for the provided filter
     * @return {String} The valid representation of the provided type filter input, screening out any invalid characters
     */
    screenTypeFilter(typeFilterInput, filterByPersonalitySystem) {
        /**
         * @param {String} typeFilter The type filter that toggles which MBTI types to show; for example "IJ", "ES", or "INTJ"
         */
        function processTypeFilter(typeFilter) {
            var newTypeFilter = '';
            
            if (filterByPersonalitySystem == 'socionics-formal') {
                newTypeFilter = typeFilter.toUpperCase().replace(/[^ISEL]/g, '');
            }
            else {
                // Keep track of all letters used in the current type filter's input value
                var letters = ['I', 'E', 'S', 'N', 'F', 'T', 'P', 'J'];
                var lettersUsed = {};
                for (var j = 0; j < letters.length; j++) {
                    var letter = letters[j];
                    lettersUsed[letter] = 0;
                }
                for (var i = 0; i < typeFilter.length; i++) {
                    var typeLetter = typeFilter[i].toUpperCase();
                    if (typeof lettersUsed[typeLetter] != 'undefined') {
                        lettersUsed[typeLetter] += 1;
                    }
                }
                
                // Iterate through each of the MBTI letters and its counter (opposite letter -- such as "N" is opposite to "S", "E" is opposite to "I", etc.)
                for (var i = 0; i < letters.length; i++) {
                    var letter = letters[i],
                        counterLetter = (i % 2 == 0 && typeof letters[i + 1] != 'undefined') ? letters[i + 1] : '';
                    
                    // If this letter has been used and its counter (opposite) letter is not present and this letter has not been added to the new type filter yet
                    if (lettersUsed[letter] && !lettersUsed[counterLetter] && newTypeFilter.indexOf(letter) === -1) {
                        // Add this letter to the resulting new type filter
                        newTypeFilter += letter;
                    }
                }
            }
            
            if (filterByPersonalitySystem == 'socionics') {
                newTypeFilter = newTypeFilter.replace(/J/g, 'j').replace(/P/g, 'p');
            }
            
            return newTypeFilter;
        }
        
        // Iterate through all type filters in the comma-delimited string
        var typeFilters = typeFilterInput.split(','),
            newTypeFilters = [];
        for (var i = 0; i < typeFilters.length; i++) {
            newTypeFilters.push(processTypeFilter(typeFilters[i]));
        }
        
        // Return the new input value of the type filter(s)
        return newTypeFilters.join(',');
    }
    
    toggleDropdown(toggle) {
        this.setState({
            isOpen: toggle,
        });
    }
    
    openDropdown() {
        this.toggleDropdown(true);
    }
    
    closeDropdown() {
        this.toggleDropdown(false);
    }
    
    selectPersonalitySystem(system) {
        this.props.configActions.filterByPersonalitySystem(system);
        this.closeDropdown();
        this.filterInput.current.focus();
    }
  
    render() {
        const {
            config,
        } = this.props,
            personalitySystem = config.filterByPersonalitySystem,
            personalitySystemLabel = this.getPersonalitySystemLabel(personalitySystem);
        
        return (
            <div className='mbti-app-toolbar'>
                <form className="expanding-search-form">
                    <div className={'search-dropdown' + (this.state.isOpen ? ' open' : '')}>
                        <button className="button dropdown-toggle" type="button" onClick={this.openDropdown.bind(this)}>
                            <span className="toggle-active">{personalitySystemLabel}</span>
                            <span className="ion-arrow-down-b"></span>
                        </button>
                        <ul className="dropdown-menu">
                            {this.getPersonalitySystems().map(([systemId, systemLabel]) => (
                                <li key={systemId} className={systemId == personalitySystem ? 'menu-active' : ''}>
                                    <a href="#" onClick={() => this.selectPersonalitySystem(systemId)}>{systemLabel}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <input className="search-input" id="global-search" type="text" ref={this.filterInput} onKeyUp={() => this.synchronizeFilter(personalitySystem)} />
                </form>
            </div>
        )
    }
});