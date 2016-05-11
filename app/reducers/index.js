import { combineReducers } from 'redux';
import session from 'reducers/session';
import { categories, allCategories } from 'reducers/categories';
import feeds from 'reducers/feeds';
import articles from 'reducers/articles';
import settings from 'reducers/settings';
import logs from 'reducers/log';
import ui from 'reducers/ui';
import subscription from 'reducers/subscription';


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
});
