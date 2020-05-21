import { createStore, combineReducers } from 'redux';
import myReducertkn from './reducers/reducer';

const rootReducer = combineReducers({
    myReducertkn
});


const persistedState= localStorage.getItem('myStore')?JSON.parse(localStorage.getItem('myStore')):{};
const store= createStore(rootReducer,persistedState);
store.subscribe(() => 
{
    console.log("Store=>",store.getState());
    localStorage.setItem('myStore',JSON.stringify(store.getState()));
});
export default store;