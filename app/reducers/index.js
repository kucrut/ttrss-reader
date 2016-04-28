import { combineReducers }           from 'redux'
import session                       from './session'
import { categories, allCategories } from './categories'
import feeds                         from './feeds'
import articles                      from './articles'
import settings                      from './settings'
import logs                          from './log'
import ui                            from './ui'
import subscription                  from './subscription'

module.exports = combineReducers({
	session,
	categories,
	allCategories,
	feeds,
	articles,
	settings,
	logs,
	ui,
	subscription
})
