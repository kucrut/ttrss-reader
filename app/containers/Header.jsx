import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { toggleSidebar } from 'actions/ui';
import { selectArticle } from 'actions/articles';
import IconLink from 'components/IconLink';
import FeedActions from 'components/FeedActions';
import ArticleActions from 'components/ArticleActions';

import stlElements from 'css/common/elements';
import stlHeader from 'css/containers/header';
const styles = Object.assign({}, stlElements, stlHeader );


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

	renderAppTitle() {
		return (
			<span className={ styles.title }>Tiny Tiny RSS Reader</span>
		);
	}

	renderFeedTitle() {
		const { feed } = this.props;
		const title = feed.is_cat ? feed.cat_title : feed.title;

		return (
			<a onClick={ this.handleClickTitle } className={ styles.title }>{ title }</a>
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
		const title = this.props.feed.id ? this.renderFeedTitle() : this.renderAppTitle();

		return (
			<div className={ styles.head }>
				<div className={ styles.feedTitle }>
					<IconLink
						type="menu"
						title="Show menu"
						handler={ this.handleClickMenu }
						extraClass={ styles.menuToggle }
					/>
					<h2 className={ styles[ 'text-truncate' ] }>{ title }</h2>
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
