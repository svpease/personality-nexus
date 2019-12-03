
export const sortByCognitiveFunction = cognitiveFunction => ({
    type: 'SORT_BY_COGNITIVE_FUNCTION',
    cognitiveFunction,
});

export const filterByPersonalitySystem = system => ({
    type: 'FILTER_BY_PERSONALITY_SYSTEM',
    system,
});

export const filterPersonalities = filter => ({
    type: 'FILTER_PERSONALITIES',
    filter,
});