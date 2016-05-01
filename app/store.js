import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from 'reducers';


function promiseMiddleware() {
	return next => action => {
		const { promise, type, ...rest } = action;

		if ( ! promise ) return next( action );

		const SUCCESS = `${type}_SUCCESS`;
		const REQUEST = `${type}_REQUEST`;
		const FAILURE = `${type}_FAILURE`;

		next({ ...rest, type: REQUEST });

		return promise
			.then( req => {
				next({ ...rest, req, type: SUCCESS });
				return true;
			})
			.catch( error => {
				next({ ...rest, error, type: FAILURE });
				return false;
			});
	};
}

const createStoreWithMiddleware = applyMiddleware( thunk, promiseMiddleware )( createStore );
const store = createStoreWithMiddleware( reducers );

export default store;
