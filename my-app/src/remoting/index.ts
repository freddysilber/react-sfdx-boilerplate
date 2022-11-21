import apexInvoke from './apex';
import restInvoke from './rest';

export default async function remotingInvoke<T = any>(method: string, args?: Record<string, any>): Promise<T> {
	switch (process.env.NODE_ENV) {
		case 'development':
			return restInvoke(method, args);
		case 'production':
			return apexInvoke(method, args);	
		default:
			return Promise.resolve(null as any);
	}
}
