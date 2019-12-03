import React from 'react';
import PersonalityFilter from './PersonalityFilter';
import PersonalityList from './PersonalityList';
import DisplayOptions from './DisplayOptions';
// import Footer from './Footer'
// import AddTodo from '../containers/AddTodo'
// import VisibleTodoList from '../containers/VisibleTodoList'
import '../style/mbti-flashcards.css';

export default () => (
  <div className='personality-flashcards-app'>
    <DisplayOptions />
    <PersonalityFilter />
    <PersonalityList />
  </div>
)

