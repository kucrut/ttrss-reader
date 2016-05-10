import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { saveSettings, closeSettingsForm } from 'actions/settings';
import Icon from 'components/Icon';
import IconLink from 'components/IconLink';
import styles from 'css/containers/form';


class SettingsForm extends React.Component {
	static propTypes = {
		settings: PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );

		this.state = {
			limit:        props.settings.limit,
			interval:     props.settings.interval,
			unreadOnly:   props.settings.unreadOnly,
			noPagination: props.settings.noPagination
		};

		this.handleSubmit = this.handleSubmit.bind( this );
		this.handleChange = this.handleChange.bind( this );
		this.handleClickClose = this.handleClickClose.bind( this );
	}

	handleSubmit( e ) {
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
		const { unreadOnly, limit, interval, noPagination } = this.state;
		let modeType;
		let modeAttrs;
		let noPaginationType;
		let noPaginationAttrs;

		if ( unreadOnly ) {
			modeType  = 'toggle-on';
			modeAttrs = { checked: 'checked' };
		} else {
			modeType  = 'toggle-off';
			modeAttrs = {};
		}

		if ( noPagination ) {
			noPaginationType = 'toggle-on';
			noPaginationAttrs = { checked: 'checked' };
		} else {
			noPaginationType = 'toggle-off';
			noPaginationAttrs = {};
		}

		return (
			<form className={ styles.form } onSubmit={ this.handleSubmit }>
				<Icon tagName="h1" type="cog" text="Settings" />

				<div className={ styles.formRow }>
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
				<div className={ styles.formRow }>
					<label htmlFor="s-interval">Refresh Int.</label>
					<input
						id="s-interval"
						type="number"
						name="interval"
						min="0"
						required
						value={ interval }
						onChange={ this.handleChange }
					/>
					<label htmlFor="s-interval" className={ styles.iwrap }>
						<small><em>Set to <code>0</code> to disable auto-refresh.</em></small>
					</label>
				</div>
				<div className={ styles.formRow }>
					<label htmlFor="s-mode">Mode</label>
					<label className={ styles.iwrap }>
						<input
							id="s-mode"
							type="checkbox"
							name="unreadOnly"
							value="1"
							{ ...modeAttrs }
							onChange={ this.handleChange }
						/>
						<Icon type={ modeType } text="Unread Only" />
					</label>
				</div>
				<div className={ styles.formRow }>
					<label htmlFor="s-noPagination">Pagination</label>
					<label className={ styles.iwrap }>
						<input
							id="s-noPagination"
							type="checkbox"
							name="noPagination"
							value="1"
							{ ...noPaginationAttrs }
							onChange={ this.handleChange }
						/>
						<Icon type={ noPaginationType } text="Disabled" />
					</label>
				</div>
				<div className={ styles.submitRow }>
					<button type="submit"><Icon type="cog-alt" text="Save" /></button>
				</div>

				<IconLink
					type="cancel"
					text="Close"
					title="Close Settings"
					extraClass={ styles.close }
					handler={ this.handleClickClose }
				/>
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
