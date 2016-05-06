import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { toggleSidebar } from 'actions/ui';
import { selectArticle } from 'actions/articles';
import classNames from 'classnames/bind';
import IconLink from 'components/IconLink';
import FeedActions from 'components/FeedActions';
import ArticleActions from 'components/ArticleActions';

const styles = {};
import stlElements from 'css/common/elements';
import stlHeader from 'css/containers/header';
Object.assign( styles, stlElements, stlHeader );
const cx = classNames.bind( styles );


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
		const clsTextTruncate = cx( 'text-truncate' );
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
			<h2 className={ clsTextTruncate }>
				<IconLink
					type="rss"
					text={ title }
					handler={ this.handleClickTitle }
					extraClass={ styles.title }
				/>
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
		const clsHead = cx( 'head' );
		const clsFeedTitle = cx( 'feedTitle' );

		return (
			<div className={ clsHead }>
				<div className={ clsFeedTitle }>
					<IconLink
						type="menu"
						title="Show menu"
						handler={ this.handleClickMenu }
						extraClass={ styles.menuToggle }
					/>
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
