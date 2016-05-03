import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { getCategories } from 'actions/categories';
import { openSettingsForm } from 'actions/settings';
import { openSubscriptionForm } from 'actions/subscription';
import { requestLogout } from 'actions/session';
import CategoryList from 'containers/CategoryList';

import stlFa from 'css/common/fa';
import stlSidebar from 'css/containers/sidebar';
const styles = Object.assign({}, stlFa, stlSidebar );
const cx = classNames.bind( styles );

class Sidebar extends React.Component {
	static propTypes = {
		isVisible:    PropTypes.bool.isRequired,
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
		const { isVisible, isRefreshing } = this.props;

		let sidebarClass = cx({
			sidebar:      true,
			'is-visible': isVisible
		});

		let refreshClass = cx({
			'fa-arrows-cw':            ! isRefreshing,
			'fa-spinner animate-spin': isRefreshing
		});

		return (
			<div className={ sidebarClass }>
				<div className={ styles.actions }>
					<a onClick={ this.handleClickRefresh } className={ styles.refresh }>
						<i className={ refreshClass } />Refresh
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
				<div className={ styles.inside }>
					<CategoryList />
				</div>
			</div>
		);
	}
}

function mapStateToProps( state ) {
	return {
		isVisible:    state.ui.isSidebarVisible,
		isRefreshing: state.categories.isFetching
	};
}

export default connect( mapStateToProps )( Sidebar );
