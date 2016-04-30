import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { classNames } from 'classnames';
import { saveSettings, closeSettingsForm } from 'actions/settings';


class SettingsForm extends React.Component {
	static propTypes = {
		settings: PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );

		this.state = {
			limit:        props.settings.limit,
			unreadOnly:   props.settings.unreadOnly,
			noPagination: props.settings.noPagination
		};

		this.submitForm = this.submitForm.bind( this );
		this.handleChange = this.handleChange.bind( this );
		this.handleClickClose = this.handleClickClose.bind( this );
	}

	submitForm( e ) {
		e.preventDefault();
		this.props.dispatch( saveSettings( Object.assign({}, this.state ) ) );
	}

	handleChange( e ) {
		let value;

		switch ( e.target.name ) {
			case 'limit':
				if ( 0 < e.target.value && 200 >= e.target.value ) {
					value = e.target.value;
				} else {
					value = this.props.settings.limit;
				}
				break;

			case 'unreadOnly':
			case 'noPagination':
				value = e.target.checked ? 1 : 0;
				break;

			default:
				value = e.target.value;
		}

		this.setState({ [ e.target.name ]: value });
	}

	handleClickClose() {
		this.props.dispatch( closeSettingsForm() );
	}

	render() {
		const { unreadOnly, limit, noPagination } = this.state;

		let modeClass = '';
		let modeAttrs = {};

		if ( unreadOnly ) {
			modeClass = 'fa-toggle-on';
			modeAttrs = { checked: 'checked' };
		} else {
			modeClass = 'fa-toggle-off';
		}

		let noPaginationClass = '';
		let noPaginationAttrs = {};

		if ( noPagination ) {
			noPaginationClass = 'fa-toggle-on';
			noPaginationAttrs = { checked: 'checked' };
		} else {
			noPaginationClass = 'fa-toggle-off';
		}

		return (
			<form className="login-form" onSubmit={ this.submitForm }>
				<h1><i className="fa-cog" /> Settings</h1>
				<div className="form-row">
					<label htmlFor="s-limit">Limit</label>
					<input
						id="s-limit"
						type="number"
						name="limit"
						min="1"
						max="200"
						required
						value={ limit }
						onChange={ this.handleChange }
					/>
				</div>
				<div className="form-row">
					<label htmlFor="s-mode">Mode</label>
					<label className="iwrap">
						<input
							id="s-mode"
							type="checkbox"
							name="unreadOnly"
							value="1"
							{ ...modeAttrs }
							onChange={ this.handleChange }
						/>
						<span className={ modeClass }>Unread Only</span>
					</label>
				</div>
				<div className="form-row">
					<label htmlFor="s-noPagination">Pagination</label>
					<label className="iwrap">
						<input
							id="s-noPagination"
							type="checkbox"
							name="noPagination"
							value="1"
							{ ...noPaginationAttrs }
							onChange={ this.handleChange }
						/>
						<span className={ noPaginationClass }>Disabled</span>
					</label>
				</div>
				<div className="form-row submit-row">
					<button type="submit"><i className="fa-cog-alt" /> Save</button>
				</div>

				<a className="fa-cancel close" title="Close" onClick={ this.handleClickClose } />
			</form>
		);
	}
}

function mapStateToProps( state ) {
	return {
		settings: state.settings
	};
}

export default connect( mapStateToProps )( SettingsForm );
