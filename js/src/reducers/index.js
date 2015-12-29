import { combineReducers } from 'redux'
import session             from './session'
import categories          from './categories'
import feeds               from './feeds'
import articles            from './articles'
import settings            from './settings'
import logs                from './log'
import ui                  from './ui'

module.exports = combineReducers({
	session,
	categories,
	feeds,
	articles,
	settings,
	logs,
	ui
})
