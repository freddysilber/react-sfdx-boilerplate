import { buildBody } from './models';

// eslint-disable-next-line no-var, @typescript-eslint/naming-convention
declare var Visualforce: any;

export default function apexInvoke<T = any>(method: string, args?: Record<string, any>): Promise<T> {
	return new Promise((resolve, reject) => {
		Visualforce.remoting.Manager.invokeAction(
			// 'project_cloud.Remoting.execute',
			'Remoting.execute',
			buildBody(method, args),
			function (result: any, event: any) {
				console.log(result, event);
				if (event.status) {
					return resolve(result);
				} else if (event.type === 'exception') {
					return reject(event.message);
				} else {
					return reject();
				}
			},
			{ escape: true }
		);
	});
}