import 'babel-core/polyfill'
import React                            from 'react'
import { render }                       from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware                  from 'redux-thunk'
import { Provider }                     from 'react-redux'
import reducers                         from './reducers'
import App                              from './containers/App'

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)( createStore )

const store = createStoreWithMiddleware( reducers )

render(
	<Provider store={ store }>
		<App />
	</Provider>,
	document.getElementById( 'app' )
);
