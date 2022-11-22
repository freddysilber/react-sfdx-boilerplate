import { SObjectFieldValues } from '../App';

export default function Accounts(props: {
	accounts: SObjectFieldValues[] | undefined
}) {
	if (props.accounts?.length) {
		return (
			<>
				<span className="slds-badge slds-theme_success slds-m-vertical_medium">
					{props.accounts.length} Account{props.accounts.length === 1 ? '' : 's'}
				</span>

				{props.accounts.map((a: any) => {
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
		return (
			<div className="slds-align_absolute-center">No Records Found</div>
		);
	}
}
