import React, { PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames/bind';
import { fetchFeedArticles } from 'actions/articles';
import Icon from 'components/Icon';
import styles from 'css/components/load-more-button';


class LoadMoreButton extends React.Component {
	static propTypes = {
		feed:       PropTypes.object.isRequired,
		articles:   PropTypes.object.isRequired,
		unreadOnly: PropTypes.number.isRequired,
		dispatch:   PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );
		this.handleClick = this.handleClick.bind( this );
	}

	handleClick() {
		const { feed, articles, unreadOnly, dispatch } = this.props;
		let skipNum;

		if ( articles.isFetching ) {
			return;
		}

		if ( unreadOnly && ! feed.is_cat ) {
			skipNum = _.filter( articles.items, { unread: true }).length;
		} else {
			skipNum = articles.items.length;
		}

		dispatch( fetchFeedArticles( feed, false, {
			skip: skipNum
		}) );
	}

	renderIcon() {
		let attrs;

		if ( this.props.articles.isFetching ) {
			attrs = {
				type: 'spinner',
				spin: true
			};
		} else {
			attrs = { type: 'cw' };
		}

		return ( <Icon {...attrs} /> );
	}

	render() {
		const icon = this.renderIcon();
		let attrs;

		if ( this.props.articles.isFetching ) {
			attrs = { disabled: 'disabled' };
		} else {
			attrs = {};
		}

		return (
			<p className={ styles.loadMoreWrap }>
				<button { ...attrs } onClick={ this.handleClick }>{ icon } Load More</button>
			</p>
		);
	}
}

export default ( LoadMoreButton );
