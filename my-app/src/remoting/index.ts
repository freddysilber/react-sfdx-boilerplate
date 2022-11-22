import apexInvoke from './apex';
import restInvoke from './rest';

export default async function remotingInvoke<T = any>(
	method: string,
	args?: Record<string, any>
): Promise<T> {
	switch (process.env.NODE_ENV) {
		case 'development':
			/**
			 * Use REST API in dev mode
			 */
			return restInvoke(method, args);
		case 'production':
			/**
			 * Use Visualforce Remoting in prod mode
			 */
			return apexInvoke(method, args);
		case 'test':
		default:
			return Promise.resolve(null as any);
	}
}
