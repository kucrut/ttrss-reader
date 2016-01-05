import React, { PropTypes }     from 'react'
import { connect }              from 'react-redux'
import classNames               from 'classnames'
import { getCategories }        from '../actions/categories'
import { editSettings }         from '../actions/settings'
import { openSubscriptionForm } from '../actions/subscription'
import { requestLogout }        from '../actions/session'
import CategoryList             from './CategoryList'

class Sidebar extends React.Component {
	handleClickRefresh() {
		this.props.dispatch( getCategories() )
	}

	handleClickLogout() {
		this.props.dispatch( requestLogout() )
	}

	handleClickSettings() {
		this.props.dispatch( editSettings() )
	}

	handleClickSubscribe() {
		this.props.dispatch( openSubscriptionForm() )
	}

	render() {
		const{ isVisible, isRefreshing } = this.props

		let sidebarClass = classNames({
			'sidebar':    true,
			'is-visible': isVisible
		})

		let refreshClass = classNames({
			'fa-arrows-cw': ! isRefreshing,
			'fa-spinner animate-spin': isRefreshing
		})

		return (
			<div className={ sidebarClass }>
				<div className="actions">
					<a onClick={ this.handleClickRefresh.bind( this ) } className="refresh"><i className={ refreshClass } />Refresh</a>
					<a onClick={ this.handleClickSubscribe.bind( this ) } className="fa-eye" title="Subscribe to feed" />
					<a onClick={ this.handleClickSettings.bind( this ) } className="fa-cog" title="Settings" />
					<a onClick={ this.handleClickLogout.bind( this ) } className="fa-logout" title="Logout" />
				</div>
				<div className="inside">
					<CategoryList />
				</div>
			</div>
		)
	}
}

Sidebar.propTypes = {
	isVisible:    PropTypes.bool.isRequired,
	isRefreshing: PropTypes.bool.isRequired,
	dispatch:     PropTypes.func.isRequired
}

function mapStateToProps( state ) {
	return {
		isVisible:    state.ui.isSidebarVisible,
		isRefreshing: state.categories.isFetching
	}
}

export default connect( mapStateToProps )( Sidebar )
