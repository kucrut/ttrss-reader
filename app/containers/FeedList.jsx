import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { fetchFeeds } from 'actions/feeds';
import FeedItem from 'components/FeedItem';
import Icon from 'components/Icon';

import styles from 'css/containers/feed-list';
const cx = classNames.bind( styles );


class FeedList extends React.Component {
	static propTypes = {
		category: PropTypes.object.isRequired,
		feeds:    PropTypes.object.isRequired,
		isOpen:   PropTypes.bool.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	componentDidMount() {
		this.getFeeds();
	}

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.category.unread !== this.props.category.unread ) {
			this.getFeeds();
		}
	}

	getFeeds() {
		const { dispatch, category } = this.props;

		dispatch( fetchFeeds( category ) );
	}

	renderSpinner() {
		return (
			<li className={ styles.placeholder }>
				<Icon type="spinner" spin={ true } /> Loading Feeds
			</li>
		);
	}

	renderNoFeed() {
		return (
			<li className={ styles.placeholder }>No Feeds found.</li>
		);
	}

	renderList( items ) {
		const { current } = this.props.feeds;

		return (
			items.map( feed => (
				<FeedItem key={ feed.id } feed={ feed } current={ current } />
			) )
		);
	}

	render() {
		const { feeds, category, isOpen } = this.props;
		const clsFeedList = cx({
			feedList: true,
			isOpen
		});
		const key = `c${category.id}`;
		const items = feeds.groups[ key ];
		let listItems;

		if ( ! items ) {
			listItems = this.renderSpinner();
		} else {
			if ( items.length ) {
				listItems = this.renderList( items );
			} else {
				listItems = this.renderNoFeed();
			}
		}

		return (
			<ul className={ clsFeedList }>
				{ listItems }
			</ul>
		);
	}
}

function mapStateToProps( state ) {
	return {
		feeds: state.feeds
	};
}

export default connect( mapStateToProps )( FeedList );
