import { SObjectFieldValues } from '../App';

export default function Accounts(props: {
	accounts: SObjectFieldValues[] | undefined
}) {
	if (props.accounts?.length) {
		return (
			<div>
				<span className="slds-badge slds-theme_success slds-m-vertical_medium">{props.accounts.length} Accounts</span>

				{props.accounts.map((a: any) => {
					return (
						<div key={a.Id}>
							<p>
								<span className="slds-text-color_inverse-weak">Name: </span>
								<span className='slds-text-title--caps'>{a.Name}</span>
							</p>
						</div>
					)
				})}
			</div>
		);
	} else {
		return (
			<div className="slds-align_absolute-center">No Records Found</div>
		);
	}
}
