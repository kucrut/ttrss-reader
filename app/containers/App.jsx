import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { sessionShape } from 'reducers/session';
import { getCategories } from 'actions/categories';
import { checkLastSession } from 'actions/session';
import { fetchUnreadCount } from 'actions/articles';
import { getCount } from 'helpers';
import classNames from 'classnames/bind';
import SettingsForm from 'containers/SettingsForm';
import SubscribeForm from 'containers/SubscribeForm';
import LoginForm from 'containers/LoginForm';
import Header from 'containers/Header';
import Sidebar from 'containers/Sidebar';
import Main from 'containers/Main';
import Alert from 'components/Alert';
import MainSpinner from 'components/MainSpinner';
import Helmet from 'react-helmet';
import styles from 'css/common/layout';

const cx = classNames.bind( styles );

class App extends React.Component {
	static propTypes = {
		session:           PropTypes.shape( sessionShape ).isRequired,
		unreadCount:       PropTypes.number.isRequired,
		refreshInterval:   PropTypes.number.isRequired,
		isSubscribing:     PropTypes.bool.isRequired,
		isEditingSettings: PropTypes.bool.isRequired,
		dispatch:          PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );

		this.state = { refreshInterval: 0 };
		this.refresher = null;
		this.updateCounts = this.updateCounts.bind( this );
	}

	componentDidMount() {
		this.props.dispatch( checkLastSession() );
	}

	componentWillReceiveProps( nextProps ) {
		const { session, refreshInterval } = nextProps;
		let newInterval;

		if ( session.url && session.sid ) {
			newInterval = refreshInterval;
		} else {
			newInterval = 0;
		}

		this.setState({ refreshInterval: newInterval });
	}

	componentDidUpdate() {
		this.updateRefresher();
	}

	updateCounts() {
		this.props.dispatch( fetchUnreadCount() );
		this.props.dispatch( getCategories() );
	}

	updateRefresher() {
		const { refreshInterval } = this.state;

		clearInterval( this.refresher );

		if ( 1 > refreshInterval ) {
			return;
		}

		this.refresher = setInterval( this.updateCounts, ( refreshInterval * 60 * 1000 ) );
		this.updateCounts();
	}

	render() {
		const { dispatch, session, isEditingSettings, isSubscribing, unreadCount } = this.props;
		const { isChecked, isAsking, url, sid } = session;
		const clsWholeWrap = cx( 'whole-wrap' );

		let title = 'Tiny Tiny RSS Reader';
		let content;

		if ( url && sid ) {
			if ( isEditingSettings ) {
				content = (
					<div className={ clsWholeWrap }>
						<Helmet title={ `Settings « ${title}` } />
						<SettingsForm />
					</div>
				);
			} else {
				if ( isSubscribing ) {
					content = (
						<div className={ clsWholeWrap }>
							<Helmet title={ `Add Feed « ${title}` } />
							<SubscribeForm />
						</div>
					);
				} else {
					if ( 0 < unreadCount ) {
						title = `(${getCount( unreadCount )}) ${title}`;
					}

					content = (
						<div className={ clsWholeWrap }>
							<Helmet title={ title } />
							<Header />
							<Sidebar />
							<Main />
							<Alert />
						</div>
					);
				}
			}
		} else {
			if ( ! isChecked ) {
				content = ( <MainSpinner /> );
			} else {
				content = (
					<div className="whole-wrap">
						<Helmet title={ `Login « ${title}` } />
						<LoginForm dispatch={ dispatch } isAsking={ isAsking } />
						<Alert />
					</div>
				);
			}
		}

		return content;
	}
}

function mapStateToProps( state ) {
	return {
		session:           state.session,
		unreadCount:       state.articles.unread,
		refreshInterval:   state.settings.interval,
		isSubscribing:     state.subscription.isOpen,
		isEditingSettings: state.settings.isEditing
	};
}

export default connect( mapStateToProps )( App );
