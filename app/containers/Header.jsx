import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { toggleSidebar } from 'actions/ui';
import { selectArticle } from 'actions/articles';
import FeedActions from 'components/FeedActions';
import ArticleActions from 'components/ArticleActions';


class Header extends React.Component {
	static propTypes = {
		feed:        PropTypes.object.isRequired,
		articles:    PropTypes.object.isRequired,
		dateReverse: PropTypes.number.isRequired,
		dispatch:    PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );

		this.handleClickMenu = this.handleClickMenu.bind( this );
		this.handleClickTitle = this.handleClickTitle.bind( this );
	}

	handleClickMenu() {
		this.props.dispatch( toggleSidebar() );
	}

	handleClickTitle() {
		this.props.dispatch( selectArticle( '' ) );
	}

	renderFeedTitle() {
		const { feed } = this.props;
		let title;

		if ( feed.is_cat ) {
			title = feed.cat_title;
		} else {
			if ( feed.title ) {
				title = feed.title;
			} else {
				title = 'Tiny Tiny RSS Reader';
			}
		}

		return (
			<h2 className="text-truncate">
				<a className="fa-rss title" onClick={ this.handleClickTitle }>{ title }</a>
			</h2>
		);
	}

	renderActions() {
		const { feed, articles } = this.props;
		const { currentId, currentIndex, items } = articles;
		let actions;

		if ( currentId ) {
			actions = ( <ArticleActions article={ items[ currentIndex ] } /> );
		} else if ( feed.id ) {
			actions = ( <FeedActions { ...this.props } /> );
		}

		return actions;
	}

	render() {
		return (
			<div className="head">
				<div className="feed-title">
					<a onClick={ this.handleClickMenu } title="Show menu" className="menu-toggle fa-menu" />
					{ this.renderFeedTitle() }
				</div>

				{ this.renderActions() }
			</div>
		);
	}
}

function mapStateToProps( state ) {
	return {
		feed:        state.feeds.current,
		articles:    state.articles,
		dateReverse: state.settings.dateReverse
	};
}

export default connect( mapStateToProps )( Header );
