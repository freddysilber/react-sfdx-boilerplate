import apexInvoke from './apex';
import restInvoke from './rest';

export default async function remotingInvoke<T = any>(method: string, args?: Record<string, any>): Promise<T> {
	if (process.env.NODE_ENV === 'development') {
		return restInvoke(method, args);
	} else if (process.env.NODE_ENV === 'production') {
		return apexInvoke(method, args);
	} else {
		return Promise.resolve(null as any);
	}
}
