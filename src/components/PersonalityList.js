import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import * as actions from '../actions/index';

/**
 * All 16 MBTI personality types and their corresponding cognitive functions
 * in listed in descending-order pertaining to how strong each one is. Format:
 * <pre>{
 *  String: Array<String>, // The MBTI type => Each cognitive function listed in descending-order pertaining to how strong each one is
 *  ... // The remaining MBTI types
 * }</pre>
 * @var {Object<String,Array<String>>}
 */
var types = {
    'INTP': ['Ti', 'Ne', 'Si', 'Fe', 'Te', 'Ni', 'Se', 'Fi'],
    'ISTP': ['Ti', 'Se', 'Ni', 'Fe', 'Te', 'Si', 'Ne', 'Fi'],
    'ESTP': ['Se', 'Ti', 'Fe', 'Ni', 'Si', 'Te', 'Fi', 'Ne'],
    'ESFP': ['Se', 'Fi', 'Te', 'Ni', 'Si', 'Fe', 'Ti', 'Ne'],
    'ISFP': ['Fi', 'Se', 'Ni', 'Te', 'Fe', 'Si', 'Ne', 'Ti'],
    'INFP': ['Fi', 'Ne', 'Si', 'Te', 'Fe', 'Ni', 'Se', 'Ti'],
    'ENFP': ['Ne', 'Fi', 'Te', 'Si', 'Ni', 'Fe', 'Ti', 'Se'],
    'ENTP': ['Ne', 'Ti', 'Fe', 'Si', 'Ni', 'Te', 'Fi', 'Se'],
    'ENTJ': ['Te', 'Ni', 'Se', 'Fi', 'Ti', 'Ne', 'Si', 'Fe'],
    'ESTJ': ['Te', 'Si', 'Ne', 'Fi', 'Ti', 'Se', 'Ni', 'Fe'],
    'ISTJ': ['Si', 'Te', 'Fi', 'Ne', 'Se', 'Ti', 'Fe', 'Ni'],
    'ISFJ': ['Si', 'Fe', 'Ti', 'Ne', 'Se', 'Fi', 'Te', 'Ni'],
    'ESFJ': ['Fe', 'Si', 'Ne', 'Ti', 'Fi', 'Se', 'Ni', 'Te'],
    'ENFJ': ['Fe', 'Ni', 'Se', 'Ti', 'Fi', 'Ne', 'Si', 'Te'],
    'INFJ': ['Ni', 'Fe', 'Ti', 'Se', 'Ne', 'Fi', 'Te', 'Si'],
    'INTJ': ['Ni', 'Te', 'Fi', 'Se', 'Ne', 'Ti', 'Fe', 'Si']
};

/**
 * The MBTI types mapped to their corresponding Socionics type and Socionics formal name. Format:
 * <pre>{
 *  String: [ // The MTBI type
 *      String, // The Socionics type (4-letter acronymn)
 *      String, // The Socionics formal name (for example: LSE)
 *  ],
 *  ... // The remaining MTBI types
 * }</pre>
 * @var {Object<Array<String>>}
 */
var socionicsMap = {
    'INTP': ['INTj', 'LII'],
    'ISTP': ['ISTj', 'LSI'],
    'ESTP': ['ESTp', 'SLE'],
    'ESFP': ['ESFp', 'SEE'],
    'ISFP': ['ISFj', 'ESI'],
    'INFP': ['INFj', 'EII'],
    'ENFP': ['ENFp', 'IEE'],
    'ENTP': ['ENTp', 'ILE'],
    'ENTJ': ['ENTj', 'LIE'],
    'ESTJ': ['ESTj', 'LSE'],
    'ISTJ': ['ISTp', 'SLI'],
    'ISFJ': ['ISFp', 'SEI'],
    'ESFJ': ['ESFj', 'ESE'],
    'ENFJ': ['ENFj', 'EIE'],
    'INFJ': ['INFp', 'IEI'],
    'INTJ': ['INTp', 'ILI']
};

var cognitiveFunctionNames = {
    'Ti': 'Accuracy',
    'Ne': 'Exploration',
    'Si': 'Memory',
    'Fe': 'Harmony',
    'Te': 'Effectiveness',
    'Ni': 'Perspectives',
    'Se': 'Sensation',
    'Fi': 'Authenticity'
};

var mbtiToSocionics = {
    'Te': 'Pragmatism',
    'Ti': 'Laws',
    'Ne': 'Ideas',
    'Ni': 'Time',
    'Fe': 'Emotions',
    'Fi': 'Relations',
    'Si': 'Senses',
    'Se': 'Force'
};

/**
 * @var {Object}
 */
var MbtiTypes = {
    /**
     * @return {Object} Structured data concerning all the MBTI types. Format:
     * <pre>{
     *  String: Array<String>, // The MBTI type => Each cognitive function listed in descending-order pertaining to how strong each one is
     *  ... // The remaining MBTI types
     * }</pre>
     */
    getTypesData: function() {
        return Object.assign({}, types);
    },
    
    /**
     * @param {String} type The MBTI type
     * @return {Array<String>} The provided MBTI type's cognitive function listed in descending-order pertaining to how strong each one is
     */
    getTypeData: function(type) {
        return this.getTypesData()[type];
    },

    /**
     * @param {String} cognitiveFunction For example: 'Ne', 'Ni', 'Se', 'Te'
     * @param {String} type1 The first type
     * @param {String} type2 The second type
     * @return {Number} The comparative ranking of cognitive functions between two types (0 when the rankings are equal, less than 0 when type1
     * has a lower ranking than type2, greater than 0 when type1 has a higher ranking than type2)
     */
    compareTypesByCognitiveFunctions: function(sortFilter, type1, type2) {
        return this.getSortedRankByCognitiveFunctions(sortFilter, type1) - this.getSortedRankByCognitiveFunctions(sortFilter, type2);
    },
    
    /**
     * @param {Array<String>} sortFilter The cognitive functions to sort MBTI types by where the first cognitive function
     * described in the array has the highest sorting priority; for example: ['Ni', 'Te'] requests the sort rank of the provided
     * MBTI type where the cognitive function 'Ni' is weighted more than 'Te', but in the event of a tie, the MBTI type with a higher
     * rated rank of 'Te' will receive a higher sorted rank
     * @param {String} type The MBTI type to get the sorted rank for
     * @return {Integer} The sorted rank for the provided MBTI type using the provided cognitive functions to sort by. For example:
     * <pre>
     *  // The following boolean expressions evaluate to true
     *  getSortedRankByCognitiveFunctions(['Ni'], 'INTJ') === getSortedRankByCognitiveFunctions(['Ni'], 'INFJ');
     *  getSortedRankByCognitiveFunctions(['Ni', 'Te'], 'INTJ') > getSortedRankByCognitiveFunctions(['Ni', 'Te'], 'INFJ');
     *  getSortedRankByCognitiveFunctions(['Ni', 'Fe'], 'INTJ') < getSortedRankByCognitiveFunctions(['Ni', 'Fe'], 'INFJ');
     * </pre>
     */
    getSortedRankByCognitiveFunctions: function(sortFilter, type) {
        var typeCognitiveFunctions = this.getTypeData(type),
            result = 0;
        
        for (
            var sortPriorityIndex = 0;
            sortPriorityIndex < sortFilter.length;
            sortPriorityIndex++
        ) {
            // NOTE: The weighting of this sort rank depends upon the consistency of the same number of cognitive functions
            // in both the sort filter and each of the MBTI types (each MBTI type always has the same number of cognitive 
            // functions (8) and comparing sort ranks using different sort filters is meaningless).
            var cognitiveFunctionToSortBy = sortFilter[sortPriorityIndex],
                cognitiveFunctionToSortByWeight = Math.pow(typeCognitiveFunctions.length + 1, sortFilter.length - 1 - sortPriorityIndex);
            
            // Iterate through this type's cognitive functions in order of how strong they are
            for (
                var typeCognitiveFunctionIndex = 0;
                typeCognitiveFunctionIndex < typeCognitiveFunctions.length;
                typeCognitiveFunctionIndex++
            ) {
                // See note above regarding sort rank weighting
                var typeCognitiveFunction = typeCognitiveFunctions[typeCognitiveFunctionIndex],
                    typeCognitiveFunctionWeight = typeCognitiveFunctions.length - typeCognitiveFunctionIndex;
                
                // If the current cognitive function from the sort filter is found
                if (typeCognitiveFunction === cognitiveFunctionToSortBy) {
                    // Apply the appropriate weight to the resulting sort rank
                    result += (cognitiveFunctionToSortByWeight * typeCognitiveFunctionWeight);
                    
                    // Discontinue search for this cognitive function once its been found
                    break;
                }
            }
        }
        
        return result;
    },
    
    /**
     * @param {Array<String>} sortFilter The cognitive functions to sort MBTI types by where the first cognitive function
     * described in the array has the highest sorting priority; for example: ['Ni', 'Te'] sorts MBTI types where the cognitive
     * function 'Ni' is weighted more than 'Te', but in the event of a tie, the MBTI type with a higher rated rank of 'Te' will
     * receive a higher sorted rank
     * @return {Array<String>} List of MBTI types sorted by the provided sort filter
     */
    getSortedTypesByCognitiveFunctions: function(sortFilter) {
        var self = this;
        return Object.keys(this.getTypesData()).sort(function(a, b) {
            return self.getSortedRankByCognitiveFunctions(sortFilter, b) - self.getSortedRankByCognitiveFunctions(sortFilter, a);
        });
    }
};

export default connect(state => ({
    config: state.config,
    displayOptions: state.displayOptions,
}), dispatch => ({
    actions: bindActionCreators(actions, dispatch),
}))(class MyComponent extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        config: PropTypes.object.isRequired,
    }
    
    constructor(props) {
        super(props);
        
        this.state = {
            sortedMbtiTypes: MbtiTypes.getSortedTypesByCognitiveFunctions([props.config.sortByCognitiveFunction]),
        };
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.config) !== JSON.stringify(this.props.config)) {
            this.setState({
                sortedMbtiTypes: MbtiTypes.getSortedTypesByCognitiveFunctions([nextProps.config.sortByCognitiveFunction]).filter(type => this.isToggled(type, nextProps.config.filter, nextProps.config.filterByPersonalitySystem)),
            });
        }
    }

    /**
     * @param {String} type The MBTI type
     * @param {String} typeFilter The type filter that toggles which MBTI types to show; for example "IJ" or "INFJ,EST"
     * @param {String} filterByPersonalitySystem The personality system to filter by; for example "mbti", "socionics", "socionics-formal"
     * @return {Boolean} Whether the provided MBTI type is toggled to be shown within the user interface via the application's type filter
     */
    isToggled(type, typeFilter, filterByPersonalitySystem) {
        if (typeFilter.indexOf(',') !== -1) {
            // If the type filter is a union of multiple type filters, iterate through each type filter
            var typeFilters = typeFilter.split(',');
            for (var i = 0; i < typeFilters.length; i++) {
                // If the provided type matches against any of the provided type filters, the provided type is toggled to be shown
                if (this.isToggled(type, typeFilters[i], filterByPersonalitySystem)) {
                    return true;
                }
            }

            // If none of the provided type filters match the provided type, the type is not toggled to be shown
            return false;
        }
        else {
            if (filterByPersonalitySystem == 'socionics-formal') {
                var socionicsFormalName = socionicsMap[type][1];
                // console.log('socionicsName ==', socionicsName);
                if (socionicsFormalName.indexOf(typeFilter) !== 0) {
                    return false;
                }
            }
            else {
                var typeToMatch = filterByPersonalitySystem == 'socionics'
                    ? socionicsMap[type][0]
                    : type;
                    
                // If a letter within the provided type filter does not match the provided type, the type is not toggled to be shown
                for (var i = 0; i < typeFilter.length; i++) {
                    var typeFilterLetter = typeFilter[i];
                    if (typeToMatch.indexOf(typeFilterLetter) === -1) {
                        return false;
                    }
                }
            }
            
            // Otherwise, the type is toggled to be shown
            return true;
        }
    }
    
    /**
     * @param {String} type The MBTI type
     * @return {String} The HTML of a container describing the provided MBTI type
     */
    getTypeContainerHtml(type) {
        var cognitiveFunctions = MbtiTypes.getTypeData(type),
            socionicsName = socionicsMap[type][0],
            socionicsFormalName = socionicsMap[type][1],
            {
                actions,
                displayOptions,
                config,
            } = this.props;
        return (
            <div
                key={type}
                className={'typeContainer typeContainer_' + type}
            >
                <div className="typeLabel">
                    <span className="type-label-mbti">{type}</span>
                    <span className="type-label-socionics">{socionicsName}</span>
                    <span className="type-label-socionics-formal">{socionicsFormalName}</span>
                </div>
                {displayOptions.features.includes('eeg')
                    ? (<div className="typeEeg"><img src={'img/eeg/' + type + '.png'} /></div>)
                    : ''
                }
                {displayOptions.features.includes('cognitiveFunctions') ? cognitiveFunctions.map((cognitiveFunction, cognitiveFunctionIndex) => {
                    var socionicsFunction = mbtiToSocionics[cognitiveFunction],
                        cognitiveFunctionName = cognitiveFunctionNames[cognitiveFunction];
                    
                    return (
                        <div
                            className={classnames('cognitiveFunction tier' + (cognitiveFunctionIndex + 1), {
                                'sortPriority1': config.sortByCognitiveFunction == cognitiveFunction
                            })}
                            key={cognitiveFunction}
                            onClick={() => actions.sortByCognitiveFunction(cognitiveFunction)}
                        >
                            <div className={'socionics-icon icon-' + cognitiveFunction} title={socionicsFunction}></div>
                            <div className='mbti-function' title={cognitiveFunctionName}>{cognitiveFunction}</div>
                            {/*<div className="socionics-function">{socionicsFunction}</div>*/}
                        </div>
                    );
                }) : ''}
                {displayOptions.features.includes('temperament') ? this.getTemperamentHtml(type) : ''}
            </div>
        );
    }
    
    getTemperamentHtml(mbtiType) {
        var temperament = ['SP', 'SJ', 'NF', 'NT'].filter(temperament => mbtiType.includes(temperament[0]) && mbtiType.includes(temperament[1]))[0];
        
        var temperamentsData = {
            'language': {
                'display': 'Language',
                'headers': ['Language Style', 'Referential', 'Syntactical', 'Rhetorical'],
                'SP': ['Harmonic', 'Indicative', 'Descriptive', 'Heterodox'],
                'SJ': ['Associative', 'Imperative', 'Comparative', 'Orthodox'],
                'NF': ['Inductive', 'Interpretive', 'Metaphoric', 'Hyperbolic'],
                'NT': ['Deductive', 'Categorical', 'Subjunctive', 'Technical']
            },
            'intellect': { // TODO: Incorporate the "Directive/Informative" and "Expressive/Reserved" traits! (page 195 of Please Understand Me II)
                'SP': ['Tactical'],
                'SJ': ['Logistical'],
                'NF': ['Diplomatic'],
                'NT': ['Strategic']
            },
            'interest': {
                'display': 'Interest',
                'headers': ['Education', 'Preoccupation', 'Vocation'],
                'SP': ['Artcraft', 'Technique', 'Equipment'],
                'SJ': ['Commerce', 'Morality', 'Materiel'],
                'NF': ['Humanities', 'Morale', 'Personnel'],
                'NT': ['Sciences', 'Technology', 'Systems']
            },
            'orientation': {
                'display': 'Orientation',
                'headers': ['Present', 'Future', 'Past', 'Place', 'Time'],
                'SP': ['Hedonism', 'Optimism', 'Cynicism', 'Here', 'Now'],
                'SJ': ['Stoicism', 'Pessimism', 'Fatalism', 'Gateways', 'Yesterday'],
                'NF': ['Altruism', 'Credulism', 'Mysticism', 'Pathways', 'Tomorrow'],
                'NT': ['Pragmatism', 'Skepticism', 'Relativism', 'Intersections', 'Intervals']
            },
            'self-image': {
                'display': 'Self-Image',
                'headers': ['Self-Esteem', 'Self-Respect', 'Self-Confidence'],
                'SP': ['Artistic', 'Audacious', 'Adaptable'],
                'SJ': ['Dependable', 'Beneficient', 'Respectable'],
                'NF': ['Empathic', 'Benevolent', 'Authentic'],
                'NT': ['Ingenious', 'Autonomous', 'Resolute']
            },
            'value': {
                'display': 'Value',
                'headers': ['Being', 'Trusting', 'Yearning', 'Seeking', 'Prizing', 'Aspiring'],
                'SP': ['Excited', 'Impulse', 'Impact', 'Stimulation', 'Generosity', 'Virtuoso'],
                'SJ': ['Concerned', 'Authority', 'Belonging', 'Security', 'Gratitude', 'Executive'],
                'NF': ['Enthusiastic', 'Intuition', 'Romance', 'Identity', 'Recognition', 'Sage'],
                'NT': ['Calm', 'Reason', 'Achievement', 'Knowledge', 'Deference', 'Wizard']
            },
            'social-role': {
                'display': 'Social Role',
                'headers': ['Mating', 'Parenting', 'Leading'],
                'SP': ['Playmate', 'Liberator', 'Negotiator'],
                'SJ': ['Helpmate', 'Socializer', 'Stabilizer'],
                'NF': ['Soulmate', 'Harmonizer', 'Catalyst'],
                'NT': ['Mindmate', 'Individuator', 'Visionary']
            }
        };
        
        var temperamentLabels = {
            'SP': 'Artisan',
            'SJ': 'Guardian',
            'NF': 'Idealist',
            'NT': 'Rational'
        };
        
        function getSectionHtml(section) {
            var sectionData = temperamentsData[section],
                sectionHeaders = sectionData['headers'],
                temperamentData = sectionData[temperament];
            
            // console.log('sectionHeaders = ', sectionHeaders, '; temperamentData = ', temperamentData);
            
            return (
                <div key={section} className="temperament-section">
                    <div className="temperament-section-label">{sectionData['display']}</div>
                    <div className={'temperament-section-values temperament-section-values--' + section}>
                        {temperamentData.map((value, index) => (
                            <span key={index} className="section-temperament-value" title={sectionHeaders[index]}>{value}</span>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className={'temperament temperament-' + temperament}>
                <div className={'temperament-label temperament-label-' + temperament}>{temperamentLabels[temperament]}</div>
                <div className="temperament-sections">
                    {['language', 'interest', 'orientation', 'self-image', 'value', 'social-role'].map(section => getSectionHtml(section))}
                </div>
            </div>
        );
    }
    
    render() {
        return (
            <div className={'mbti-app-types-container personality-list searching-' + this.props.config.filterByPersonalitySystem}>
                {this.state.sortedMbtiTypes.map(mbtiType => this.getTypeContainerHtml(mbtiType))}
            </div>
        )
    }
})