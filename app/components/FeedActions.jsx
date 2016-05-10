import React, { PropTypes } from 'react';
import { filter, map } from 'lodash';
import { updateSortOrder } from 'actions/settings';
import { fetchFeedArticles, markArticlesRead } from 'actions/articles';
import IconLink from 'components/IconLink';
import styles from 'css/containers/header';


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
		const clsIcon = ( isFetching || ! unread.length ) ? styles.disabled : '';

		return (
			<IconLink
				type="ok"
				text="Mark as read"
				title="Mark all articles as read"
				handler={ this.handleClickCheck }
				hideText={ true }
				extraClass={ clsIcon }
			/>
		);
	}

	renderRefresh() {
		const extraClass = this.props.articles.isFetching ? styles.disabled : '';

		return (
			<IconLink
				type="arrows-cw"
				text="Refresh"
				title="Refresh"
				handler={ this.handleClickRefresh }
				hideText={ true }
				extraClass={ extraClass }
			/>
		);
	}

	renderSort() {
		const { dateReverse, articles } = this.props;
		const { isFetching, items } = articles;
		const iconType = dateReverse ? 'sort-alt-up' : 'sort-alt-down';
		const title = dateReverse ? 'Show oldest articles first' : 'Sort newest articles first';
		const extraClass = ( isFetching || ! items.length ) ? styles.disabled : '';

		return (
			<IconLink
				type={ iconType }
				text="Sort Articles"
				title={ title }
				handler={ this.handleClickSort }
				hideText={ true }
				extraClass={ extraClass }
			/>
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
