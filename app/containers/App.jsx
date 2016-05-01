import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { sessionShape } from 'reducers/session';
import { checkLastSession } from 'actions/session';
import { getCount } from 'helpers';
import SettingsForm from 'containers/SettingsForm';
import SubscribeForm from 'containers/SubscribeForm';
import LoginForm from 'containers/LoginForm';
import Header from 'containers/Header';
import Sidebar from 'containers/Sidebar';
import Main from 'containers/Main';
import Alert from 'components/Alert';
import Spinner from 'components/Spinner';
import Helmet from 'react-helmet';


class App extends React.Component {
	static propTypes = {
		session:           PropTypes.shape( sessionShape ).isRequired,
		freshCount:        PropTypes.number.isRequired,
		isSubscribing:     PropTypes.bool.isRequired,
		isEditingSettings: PropTypes.bool.isRequired,
		dispatch:          PropTypes.func.isRequired
	}

	componentDidMount() {
		this.props.dispatch( checkLastSession() );
	}

	renderSpinner() {
		return (
			<div className="main-init"><Spinner /></div>
		);
	}

	render() {
		const { dispatch, session, isEditingSettings, isSubscribing, freshCount } = this.props;
		const { isChecked, isAsking, url, sid } = session;
		let title = 'Tiny Tiny RSS Reader';
		let content;

		if ( url && sid ) {
			if ( isEditingSettings ) {
				content = (
					<div className="whole-wrap">
						<Helmet title={ `Settings « ${title}` } />
						<SettingsForm />
					</div>
				);
			} else {
				if ( isSubscribing ) {
					content = (
						<div className="whole-wrap">
							<Helmet title={ `Add Feed « ${title}` } />
							<SubscribeForm />
						</div>
					);
				} else {
					if ( 0 < freshCount ) {
						title = `(${getCount( freshCount )}) ${title}`;
					}

					content = (
						<div className="whole-wrap">
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
				content = this.renderSpinner();
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
		freshCount:        state.categories.freshCount,
		isSubscribing:     state.subscription.isOpen,
		isEditingSettings: state.settings.isEditing
	};
}

export default connect( mapStateToProps )( App );
