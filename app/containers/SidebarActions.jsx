import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { getCategories } from 'actions/categories';
import { openSettingsForm } from 'actions/settings';
import { openSubscriptionForm } from 'actions/subscription';
import { requestLogout } from 'actions/session';
import Icon from 'components/Icon';
import IconLink from 'components/IconLink';
import styles from 'css/containers/sidebar-actions';


class SidebarActions extends React.Component {
	static propTypes = {
		isRefreshing: PropTypes.bool.isRequired,
		dispatch:     PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );

		this.handleClickLogout = this.handleClickLogout.bind( this );
		this.handleClickRefresh = this.handleClickRefresh.bind( this );
		this.handleClickSettings = this.handleClickSettings.bind( this );
		this.handleClickSubscribe = this.handleClickSubscribe.bind( this );
	}

	handleClickRefresh() {
		this.props.dispatch( getCategories() );
	}

	handleClickLogout() {
		this.props.dispatch( requestLogout() );
	}

	handleClickSettings() {
		this.props.dispatch( openSettingsForm() );
	}

	handleClickSubscribe() {
		this.props.dispatch( openSubscriptionForm() );
	}

	render() {
		const { isRefreshing } = this.props;
		const refreshAttrs = {
			type: isRefreshing ? 'spinner' : 'arrows-cw',
			spin: isRefreshing
		};

		return (
			<div className={ styles.sidebarActions }>
				<a onClick={ this.handleClickRefresh } className={ styles.refresh }>
					<Icon { ...refreshAttrs } /> Refresh
				</a>
				<IconLink
					type="eye"
					handler={ this.handleClickSubscribe }
					text="Subscribe"
					title="Subscribe to Feed"
					hideText={ true }
				/>
				<IconLink
					type="cog"
					handler={ this.handleClickSettings }
					text="Settings"
					title="Edit Settings"
					hideText={ true }
				/>
				<IconLink
					type="logout"
					handler={ this.handleClickLogout }
					text="Logout"
					title="Logout"
					hideText={ true }
				/>
			</div>
		);
	}
}

function mapStateToProps( state ) {
	return {
		isRefreshing: state.categories.isFetching
	};
}

export default connect( mapStateToProps )( SidebarActions );
