let nextTodoId = 0
export const addTodo = text => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text
})

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})

export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id
})

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

export const sortByCognitiveFunction = cognitiveFunction => ({
    type: 'SORT_BY_COGNITIVE_FUNCTION',
    cognitiveFunction,
});

export const filterByPersonalitySystem = system => ({
    type: 'FILTER_BY_PERSONALITY_SYSTEM',
    system,
});