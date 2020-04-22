import React, { useState, useEffect, Fragment, useReducer } from 'react';
import axios from 'axios';
import _ from 'lodash';
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
      return state;
  }
};

const useDataApi = (initialData, initialSearch) => {
  const [search, setSearch] = useState(initialSearch);

  const [state, dispatch] = useReducer(
    dataFetchReducer,
    fromJS({
      isLoading: false,
      isError: false,
      data: initialData,
    }),
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {
        const result = await axios(
          `https://hn.algolia.com/api/v1/search?query=${search}`,
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE' });
      }
    };
    fetchData();
  }, [search]);
  return [state.toJS(), setSearch];
};

function EffectHooks() {
  const [query, setQuery] = useState('redux');
  const [{ data, isLoading, isError }, setSearch] = useDataApi(
    { hits: [] },
    query,
  );

  return (
    <Fragment>
      <form
        onSubmit={event => {
          setSearch(query);
          event.preventDefault();
        }}
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {_.map(data.hits, item => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
}
export default EffectHooks;
