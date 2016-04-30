import React, { PropTypes } from 'react';
import _ from 'lodash';
import { fetchFeedArticles } from 'actions/articles';
import Spinner from 'components/Spinner';


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
			element = ( <i className="fa-cw" /> );
		}

		return element;
	}

	render() {
		let icon  = this.renderIcon();
		let attrs;

		if ( this.props.articles.isFetching ) {
			attrs = { disabled: 'disabled' };
		} else {
			attrs = {};
		}

		return (
			<p className="load-more-wrap">
				<button
					{ ...attrs }
					className="uk-button uk-button-large"
					onClick={ this.handleClick }
				>{ icon } Load More</button>
			</p>
		);
	}
}

export default ( LoadMoreButton );
