import { SObjectFieldValues } from '../App';

export default function Contacts(props: {
	contacts: SObjectFieldValues[] | undefined
}) {
	if (props.contacts?.length) {
		return (
			<>
				<span className="slds-badge slds-theme_warning slds-m-vertical_medium">
					{props.contacts.length} Contact{props.contacts.length === 1 ? '' : 's'}
				</span>

				{props.contacts.map((a: SObjectFieldValues) => {
					return (
						<p key={a.Id}>
							<span className="slds-text-color_inverse-weak">Name: </span>
							<span className='slds-text-title--caps'>{a.Name}</span>
						</p>
					)
				})}
			</>
		);
	} else {
		return <div className="slds-align_absolute-center">No Contacts Found</div>
	}
}
