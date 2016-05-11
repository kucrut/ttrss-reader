export const OPENED_SETTINGS_FORM = 'OPENED_SETTINGS_FORM';
export const UPDATED_SETTINGS = 'UPDATED_SETTINGS';
export const UPDATED_SORT_ORDER = 'UPDATED_SORT_ORDER';
export const CLOSED_SETTINGS_FORM = 'CLOSED_SETTINGS_FORM';


export function openSettingsForm() {
	return ( dispatch ) => {
		dispatch({ type: OPENED_SETTINGS_FORM });
	};
}

export function closeSettingsForm() {
	return ( dispatch ) => {
		dispatch({ type: CLOSED_SETTINGS_FORM });
	};
}

export function saveSettings( settings ) {
	localStorage.setItem( 'ttrssSettingLimit', settings.limit );
	localStorage.setItem( 'ttrssSettingInterval', settings.interval );
	localStorage.setItem( 'ttrssSettingUnreadOnly', settings.unreadOnly );
	localStorage.setItem( 'ttrssSettingNoPagination', settings.noPagination );

	return ( dispatch ) => {
		dispatch({
			type: UPDATED_SETTINGS,
			settings
		});
	};
}

export function updateSortOrder( dateReverse ) {
	localStorage.setItem( 'ttrssSettingDateReverse', dateReverse );

	return ( dispatch ) => {
		dispatch({
			type: UPDATED_SORT_ORDER,
			dateReverse
		});
	};
}
