import React, { PropTypes } from 'react';
import { filter, map } from 'lodash';
import classNames from 'classnames/bind';
import { updateSortOrder } from 'actions/settings';
import { fetchFeedArticles, markArticlesRead } from 'actions/articles';

import stlFa from 'css/common/fa';
import stlHeader from 'css/containers/header';
const styles = Object.assign({}, stlFa, stlHeader );
const cx = classNames.bind( styles );

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
		const clsIcon = cx({
			fa:         true,
			'fa-ok':    true,
			'disabled': ( isFetching || ! unread.length )
		});

		return (
			<a onClick={ this.handleClickCheck } title="Mark all as read" className={ clsIcon } />
		);
	}

	renderRefresh() {
		const { isFetching } = this.props.articles;
		const clsIcon = cx({
			fa:             true,
			'fa-arrows-cw': true,
			disabled:       isFetching
		});

		return (
			<a onClick={ this.handleClickRefresh } title="Refresh" className={ clsIcon } />
		);
	}

	renderSort() {
		const { dateReverse, articles } = this.props;
		const { isFetching, items } = articles;
		const title = dateReverse ? 'Oldest First' : 'Newest First';
		const clsIcon = cx({
			fa:                 true,
			'fa-sort-alt-up':   dateReverse,
			'fa-sort-alt-down': ! dateReverse,
			disabled:           ( isFetching || ! items.length )
		});

		return (
			<a className={ clsIcon } title={ title } onClick={ this.handleClickSort } />
		);
	}

	render() {
		return (
			<div className={ styles.actions }>
				{ this.renderCheck() }
				{ this.renderRefresh() }
				{ this.renderSort() }
			</div>
		);
	}
}
