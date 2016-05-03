import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { getCategories } from 'actions/categories';
import { openSettingsForm } from 'actions/settings';
import { openSubscriptionForm } from 'actions/subscription';
import { requestLogout } from 'actions/session';

import stlFa from 'css/common/fa';
import stlActions from 'css/components/sidebar-actions';
const styles = Object.assign({}, stlFa, stlActions );
const cx = classNames.bind( styles );

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
		const clsRefresh = cx({
			'fa-arrows-cw':            ! isRefreshing,
			'fa-spinner animate-spin': isRefreshing
		});

		return (
			<div className={ styles.sidebarActions }>
				<a onClick={ this.handleClickRefresh } className={ styles.refresh }>
					<i className={ clsRefresh } />Refresh
				</a>
				<a
					onClick={ this.handleClickSubscribe }
					className={ styles[ 'fa-eye' ] }
					title="Subscribe to feed"
				/>
				<a
					onClick={ this.handleClickSettings }
					className={ styles[ 'fa-cog' ] }
					title="Settings"
				/>
				<a
					onClick={ this.handleClickLogout }
					className={ styles[ 'fa-logout' ] }
					title="Logout"
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
