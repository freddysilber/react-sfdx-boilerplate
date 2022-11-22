import apexInvoke from './apex';
import restInvoke from './rest';

/**
 * Hits an endpoint in SF
 * @param method Apex classname and method to use ('MyClass.myMethod')
 * @param args Params to use
 * @returns Promise of the return value
 */
export default async function remotingInvoke<T = any>(
	method: string,
	args?: Record<string, any>
): Promise<T> {
	switch (process.env.NODE_ENV) {
		case 'development':
			if (!process.env.REACT_APP_TOKEN) {
				throw Promise.reject<string>('No Auth Token Provided!');
			}
			/**
			 * Use REST API in dev mode
			 */
			return restInvoke<T>(method, process.env.REACT_APP_TOKEN, args);
		case 'production':
			/**
			 * Use Visualforce Remoting in prod mode
			 */
			return apexInvoke<T>(method, args);
		case 'test':
		default:
			return Promise.resolve(null as any);
	}
}
