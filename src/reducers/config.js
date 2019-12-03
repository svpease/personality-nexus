const originalState = {
    sortByCognitiveFunction: null,
    
    /**
     * Recognized enums: 'mbti', 'socionics', 'socionics-formal'
     */
    filterByPersonalitySystem: 'mbti',
    
    /**
     * The filter for only specific personality types (or '' for no filter)
     */
    filter: '',
};

export default (state = originalState, action) => {
  switch (action.type) {
    case 'SORT_BY_COGNITIVE_FUNCTION':
      console.log('action.cognitiveFunction !== state.cognitiveFunction ==', action.cognitiveFunction !== state.cognitiveFunction);
      console.log('state ==', state);
      console.log('action ==', action);
        
      return Object.assign({}, state, {
          sortByCognitiveFunction: action.cognitiveFunction !== state.sortByCognitiveFunction
              ? action.cognitiveFunction
              : null,
      });
    case 'FILTER_BY_PERSONALITY_SYSTEM':
        return Object.assign({}, state, {
            filterByPersonalitySystem: action.system,
        });
    case 'FILTER_PERSONALITIES':
        return Object.assign({}, state, {
            filter: action.filter,
        });
    default:
      return state
  }
};
