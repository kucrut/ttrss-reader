import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { toggleSidebar } from 'actions/ui';
import IconLink from 'components/IconLink';
import styles from 'css/containers/header';


class MenuToggle extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );
		this.handleClick = this.handleClick.bind( this );
	}

	handleClick() {
		this.props.dispatch( toggleSidebar() );
	}

	render() {
		return (
			<IconLink
				type="menu"
				text="Menu"
				title="Show menu"
				hideText={ true }
				handler={ this.handleClick }
				extraClass={ styles.menuToggle }
			/>
		);
	}
}

export default connect()( MenuToggle );
