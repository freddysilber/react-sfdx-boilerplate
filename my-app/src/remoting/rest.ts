import { buildBody } from './remoting-utils';

export default async function restInvoke<T = any>(
	method: string,
	token: string,
	args?: Record<string, any>,
): Promise<T> {
	const response = await fetch(
		`/services/apexrest/remoting`,
		{
			method: 'POST',
			mode: 'cors',
			headers: new Headers({
				// Use token from env vars (dev). This is set in the 'auth.js' script
				'Authorization': `OAuth ${token}`,
				'Content-Type': 'application/json',
			}),
			credentials: 'include',
			body: JSON.stringify(buildBody(method, args)),
		}
	);
	const res = await response.json();

	switch (response.status) {
		case 200:
			return Promise.resolve(res);
		default:
			return Promise.reject(res[0].message);
	}
}