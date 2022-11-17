export default function Accounts(props: any) {
	return (
		<div>
			<h1>Accounts</h1>

			{props.accounts.map((a: any) => {
				return (
					<div key={a.Id}>
						<p>Name: {a.Name}</p>
					</div>
				)
			})}
		</div>
	);
}
