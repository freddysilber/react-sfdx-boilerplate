import { buildBody } from './models';

export default async function restInvoke<T = any>(method: string, ...args: any): Promise<T> {
	const response = await fetch(
		`/services/apexrest/remoting`,
		// TODO need to resolve this namespace
		// `/services/apexrest/project_cloud/remoting`,
		{
			method: 'POST',
			mode: 'cors',
			headers: new Headers({
				// Use token from env vars (dev). This is set in the 'auth.js' script
				'Authorization': `OAuth ${process.env.REACT_APP_TOKEN}`,
				'Content-Type': 'application/json',
			}),
			credentials: 'include',
			body: JSON.stringify(buildBody(method, ...args)),
		}
	);
	const res = await response.json();
	if (response.status === 200) {
		return Promise.resolve(res);
	} else {
		return Promise.reject(res[0].message);
	}
}