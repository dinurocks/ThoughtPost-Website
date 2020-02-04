import { createStore, combineReducers } from 'redux';
import myReducertkn from './reducers/reducer';

const rootReducer = combineReducers({
    myReducertkn
});

// export default createStore(rootReducer);
const persistedState= localStorage.getItem('myStore')?JSON.parse(localStorage.getItem('myStore')):{};
const store= createStore(rootReducer,persistedState);
store.subscribe(() => 
{
    localStorage.setItem('myStore',JSON.stringify(store.getState()));
});
export default store;