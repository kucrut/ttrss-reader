import React, { PropTypes } from 'react';
import { filter, map } from 'lodash';
import { updateSortOrder } from 'actions/settings';
import { fetchFeedArticles, markArticlesRead } from 'actions/articles';


export default class FeedActions extends React.Component {
	static propTypes = {
		feed:        PropTypes.object.isRequired,
		articles:    PropTypes.object.isRequired,
		dateReverse: PropTypes.number.isRequired,
		dispatch:    PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );

		this.handleClickSort = this.handleClickSort.bind( this );
		this.handleClickCheck = this.handleClickCheck.bind( this );
		this.handleClickRefresh = this.handleClickRefresh.bind( this );
	}

	handleClickCheck() {
		const { articles, dispatch } = this.props;

		if ( articles.isFetching ) {
			return;
		}

		const ids = map( filter( articles.items, { unread: true }), 'id' );

		dispatch( markArticlesRead( ids ) );

		// TODO: Maybe provide option for automatic refresh?
		// this.handleClickRefresh()
	}

	handleClickRefresh() {
		const { feed, dispatch } = this.props;

		dispatch( fetchFeedArticles( feed ) );
	}

	handleClickSort() {
		const { dateReverse, dispatch } = this.props;
		const val = dateReverse ? 0 : 1;

		dispatch( updateSortOrder( val ) );
		this.handleClickRefresh();
	}

	renderCheck() {
		const { items, isFetching } = this.props.articles;
		const unread = filter( items, { unread: true });
		let classes = 'fa-ok';

		if ( isFetching || ! unread.length ) {
			classes += ' disabled';
		}

		return (
			<a onClick={ this.handleClickCheck } title="Mark all as read" className={ classes } />
		);
	}

	renderRefresh() {
		const { isFetching } = this.props.articles;
		let classes = 'fa-arrows-cw';

		if ( isFetching ) {
			classes += ' disabled';
		}

		return (
			<a onClick={ this.handleClickRefresh } title="Refresh" className={ classes } />
		);
	}

	renderSort() {
		const { dateReverse, articles } = this.props;
		const { isFetching, items } = articles;
		let iconClass;
		let title;

		if ( dateReverse ) {
			title = 'Oldest First';
			iconClass = 'fa-sort-alt-up';
		} else {
			title = 'Newest First';
			iconClass = 'fa-sort-alt-down';
		}

		if ( isFetching || ! items.length ) {
			iconClass += ' disabled';
		}

		return (
			<a className={ iconClass } title={ title } onClick={ this.handleClickSort } />
		);
	}

	render() {
		return (
			<div className="actions">
				{ this.renderCheck() }
				{ this.renderRefresh() }
				{ this.renderSort() }
			</div>
		);
	}
}
