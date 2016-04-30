import React from 'react';
import { hideSidebar } from 'actions/ui';

export default class MenuToggle extends React.Component {
	handleClickHide() {
		this.props.dispatch( hideSidebar() );
	}
}
