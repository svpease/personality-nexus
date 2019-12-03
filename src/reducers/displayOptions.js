const originalState = {
    features: ['eeg', 'cognitiveFunctions', 'temperament'],
};

export default (state = originalState, action) => {
  switch (action.type) {
    case 'SHOW_FEATURES':
      return Object.assign({}, state, {
          features: action.features,
      });
    default:
      return state
  }
};
