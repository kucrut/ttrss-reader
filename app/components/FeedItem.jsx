import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectFeed } from 'actions/feeds';
import { hideSidebar } from 'actions/ui';
import { getCount } from 'helpers';
import Icon from 'components/Icon';
import styles from 'css/containers/category-list';


class FeedItem extends React.Component {
	static propTypes = {
		feed:     PropTypes.object.isRequired,
		current:  PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );
		this.handleClick = this.handleClick.bind( this );
	}

	handleClick() {
		const { feed, current, dispatch } = this.props;

		if ( feed.id !== current.id ) {
			dispatch( selectFeed( feed.id ) );
		}

		dispatch( hideSidebar() );
	}

	renderCount() {
		const { feed } = this.props;
		let element;

		if ( 0 < feed.unread ) {
			element = (
				<span className={ styles.count }>{ getCount( feed.unread ) }</span>
			);
		}

		return element;
	}

	render() {
		const { feed, current } = this.props;
		const isSelected = feed.id === current.id;
		const clsLink = isSelected ? styles.current : '';

		return (
			<li>
				<a onClick={ this.handleClick } className={ clsLink }>
					<Icon type="rss-squared" />
					<span className={ styles.name }>{ feed.title }</span>
					{ this.renderCount() }
				</a>
			</li>
		);
	}
}

export default connect()( FeedItem );
