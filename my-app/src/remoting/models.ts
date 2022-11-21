export interface RequestBody {
	apexType: `c.${string}`,
	[x: string]: any,
}

export function buildBody(method: string, args?: Record<string, any>): RequestBody {
	const body: RequestBody = {
		apexType: `c.${method}`,
	};
	if (args && Object.keys(args).length) {
		Object.assign(body, args);
	}
	return body;
}