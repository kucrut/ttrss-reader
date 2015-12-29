import { REQUESTED_SETTINGS_FORM, UPDATED_SETTINGS, UPDATED_SORT_ORDER } from '../actions/settings'

const initialState = {
	isEditing:   false,
	limit:       parseInt( localStorage.getItem( 'ttrssSettingLimit' ), 10 ) || 23,
	unreadOnly:  parseInt( (localStorage.getItem( 'ttrssSettingUnreadOnly' ) || 0), 10 ),
	dateReverse: parseInt( (localStorage.getItem( 'ttrssSettingDateReverse' ) || 0), 10 )
}

export default function settings( state = initialState, action ) {
	switch ( action.type ) {
		case REQUESTED_SETTINGS_FORM:
			return Object.assign( {}, state, {
				isEditing: action.isEditing
			})

		case UPDATED_SETTINGS:
			return Object.assign( {}, state, {
				isEditing:  false,
				limit:      action.settings.limit,
				unreadOnly: action.settings.unreadOnly
			})

		case UPDATED_SORT_ORDER:
			return Object.assign( {}, state, {
				dateReverse: action.dateReverse
			})

		default:
			return state
	}
}
