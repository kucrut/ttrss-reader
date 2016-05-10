import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import HeaderTitle from 'components/HeaderTitle';
import MenuToggle from 'components/MenuToggle';
import FeedActions from 'components/FeedActions';
import ArticleActions from 'components/ArticleActions';

import stlElements from 'css/common/elements';
import stlHeader from 'css/containers/header';
const styles = Object.assign({}, stlElements, stlHeader );


class Header extends React.Component {
	static propTypes = {
		feed:     PropTypes.object.isRequired,
		articles: PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	renderActions() {
		const { feed, articles: { currentId } } = this.props;
		let actions;

		if ( currentId ) {
			actions = ( <ArticleActions /> );
		} else if ( feed.id ) {
			actions = ( <FeedActions /> );
		}

		return actions;
	}

	render() {
		return (
			<div className={ styles.head }>
				<div className={ styles.feedTitle }>
					<MenuToggle />
					<HeaderTitle />
				</div>

				{ this.renderActions() }
			</div>
		);
	}
}

function mapStateToProps( state ) {
	return {
		feed:     state.feeds.current,
		articles: state.articles
	};
}

export default connect( mapStateToProps )( Header );
