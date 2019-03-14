import { createStore } from 'redux';
import adminReducer from './reducer.js';

const store = createStore(adminReducer);

export default store;