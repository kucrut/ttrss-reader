import React, { PropTypes } from 'react'
import _                    from 'lodash'
import { updateSortOrder }  from '../actions/settings'
import {
	updateArticle,
	fetchFeedArticles,
	markArticlesRead
} from '../actions/articles'

class FeedActions extends React.Component {
	static propTypes = {
		feed:        PropTypes.object.isRequired,
		articles:    PropTypes.object.isRequired,
		dateReverse: PropTypes.number.isRequired,
		dispatch:    PropTypes.func.isRequired
	}

	handleClickCheck() {
		const { articles, dispatch } = this.props

		if ( articles.isFetching ) {
			return;
		}

		let ids = _.pluck( _.filter( articles.items, { unread: true } ), 'id' )

		dispatch( markArticlesRead( ids ) )

		// TODO: Maybe provide option for automatic refresh?
		//this.handleClickRefresh()
	}

	handleClickRefresh() {
		const { feed, dispatch } = this.props

		dispatch( fetchFeedArticles( feed ) )
	}

	handleClickSort() {
		const { dateReverse, dispatch } = this.props
		let val = dateReverse ? 0 : 1

		dispatch( updateSortOrder( val ) )
		this.handleClickRefresh()
	}

	renderCheck() {
		const { items, isFetching } = this.props.articles
		let unread = _.filter( items, { unread: true } )
		let classes = 'fa-ok'

		if ( isFetching || ! unread.length ) {
			classes += ' disabled'
		}

		return (
			<a onClick={ this.handleClickCheck.bind( this ) } title="Mark all as read" className={ classes } />
		)
	}

	renderRefresh() {
		const { isFetching } = this.props.articles
		let classes = 'fa-arrows-cw'

		if ( isFetching ) {
			classes += ' disabled'
		}


		return (
			<a onClick={ this.handleClickRefresh.bind( this ) } title="Refresh" className={ classes } />
		)
	}

	renderSort() {
		const { dateReverse, articles } = this.props
		let iconClass, title

		if ( dateReverse ) {
			title = 'Oldest First'
			iconClass = 'fa-sort-alt-up'
		} else {
			title = 'Newest First'
			iconClass = 'fa-sort-alt-down'
		}

		if ( articles.isFetching ) {
			iconClass += ' disabled'
		}

		return (
			<a className={ iconClass } title={ title } onClick={ this.handleClickSort.bind( this ) } />
		)
	}

	render() {
		return (
			<div className="actions">
				{ this.renderCheck() }
				{ this.renderRefresh() }
				{ this.renderSort() }
			</div>
		)
	}
}

export default ( FeedActions )
