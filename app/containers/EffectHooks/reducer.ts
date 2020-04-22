import { fromJS } from 'immutable';

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return state.set('isLoading', true).set('isError', false);
    case 'FETCH_SUCCESS':
      return state
        .set('data', fromJS(action.payload))
        .set('isLoading', false)
        .set('isError', false);
    case 'FETCH_FAILURE':
      return state.set('isLoading', false).set('isError', true);
    default:
      throw new Error();
  }
};

export default dataFetchReducer;