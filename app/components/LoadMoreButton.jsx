import React, { PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames/bind';
import { fetchFeedArticles } from 'actions/articles';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';

import stlFa from 'css/common/fa';
import stlElements from 'css/common/elements';
import stlButton from 'css/components/load-more-button';
const cx = classNames.bind( Object.assign({}, stlFa, stlButton ) );


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
		let element;

		if ( this.props.articles.isFetching ) {
			element = ( <Spinner /> );
		} else {
			element = ( <Icon type="cw" /> );
		}

		return element;
	}

	render() {
		const icon    = this.renderIcon();
		const clsWrap = cx( 'loadMoreWrap' );
		let attrs;

		if ( this.props.articles.isFetching ) {
			attrs = { disabled: 'disabled' };
		} else {
			attrs = {};
		}

		return (
			<p className={ clsWrap }>
				<button { ...attrs } onClick={ this.handleClick }>{ icon } Load More</button>
			</p>
		);
	}
}

export default ( LoadMoreButton );
