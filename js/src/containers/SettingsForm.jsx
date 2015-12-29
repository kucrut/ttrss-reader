import React, { PropTypes } from 'react'
import { connect }          from 'react-redux'
import { classNames }       from 'classnames'
import { saveSettings }     from '../actions/settings'

class SettingsForm extends React.Component {
	constructor( props ) {
		super( props )

		this.state = {
			limit: props.settings.limit,
			unreadOnly: props.settings.unreadOnly
		}
	}

	submitForm( e ) {
		e.preventDefault()
		this.props.dispatch( saveSettings( Object.assign( {}, this.state ) ) )
	}

	handleChange( e ) {
		let value

		switch ( e.target.name ) {
			case 'limit':
				if ( 0 < e.target.value && 200 >= e.target.value ) {
					value = e.target.value
				} else {
					value = this.props.settings.limit
				}
				break;

			case 'unreadOnly':
				value = e.target.checked ? 1 : 0
				break;

			default:
				value = e.target.value
		}

		this.setState({ [ e.target.name ]: value })
	}

	render() {
		const { unreadOnly, limit } = this.state

		let modeClass = ''
		let modeAttrs = {}

		if ( unreadOnly ) {
			modeClass = 'fa-toggle-on'
			modeAttrs.checked = 'checked'
		} else {
			modeClass = 'fa-toggle-off'
		}

		return (
			<form className="login-form" onSubmit={ this.submitForm.bind( this ) }>
				<h1><i className="fa-cog" /> Settings</h1>
				<div className="form-row">
					<label htmlFor="s-mode">Mode</label>
					<label className="iwrap">
						<input id="s-mode" type="checkbox" name="unreadOnly" value="1" { ...modeAttrs } onChange={ this.handleChange.bind( this ) } />
						<span><i className={ modeClass } /> Unread Only</span>
					</label>
				</div>
				<div className="form-row">
					<label htmlFor="s-limit">Limit</label>
					<input id="s-limit" type="number" name="limit" min="1" max="200" required value={ limit } onChange={ this.handleChange.bind( this ) } />
				</div>
				<div className="form-row submit-row">
					<button type="submit"><i className="fa-cog-alt" /> Save</button>
				</div>
			</form>
		)
	}
}

SettingsForm.propTypes = {
	settings: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired
}

export default connect( state => ({ settings: state.settings }) )( SettingsForm )
