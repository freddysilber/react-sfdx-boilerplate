import { buildBody } from './models';

// eslint-disable-next-line no-var, @typescript-eslint/naming-convention
declare var Visualforce: any;

interface VisualforceRemotingEvent<T = any> {
	action: string;
	method: string;
	ref: boolean;
	statusCode: number;
	message?: string;
	result: T;
	status: boolean;
	tid: number;
	data?: {
		apexType: string;
		[key: string]: any;
	}
	type: 'exception';
	vfDbg?: boolean;
	vfTx?: boolean;
	where?: string;
}

export default function apexInvoke<T = any>(
	method: string,
	args?: Record<string, any>
): Promise<T> {
	return new Promise((resolve, reject) => {
		const callback = (result: T, event: VisualforceRemotingEvent<T>) => {
			if (event.status) {
				return resolve(result);
			} else if (event.type === 'exception') {
				return reject(event.message);
			} else {
				console.log({ result, event });
				return reject('There was an error!');
			}
		};

		/**
		 * Heres a link: https://developer.salesforce.com/docs/atlas.en-us.pages.meta/pages/pages_js_remoting.htm
		 */
		Visualforce.remoting.Manager.invokeAction(
			'Remoting.execute',
			buildBody(method, args),
			callback,
			// Options
			{
				escape: true,
			}
		);
	});
}