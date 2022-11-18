#!/usr/bin/env node

const colors = require('colors');
const fs = require('fs');
const path = require('path');
const { spawnChild } = require('./child_process.js');

// const angularJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../angular.json')));
const utils = {
	canServe(appName) {
		return true;
		// console.log(appName);
		// const appConfig = angularJson.projects[appName];
		// console.log(appConfig);

		// return appConfig && ('serve' in appConfig.architect);
	},
};

function serve(appName, additionalArgs) {
	if (!additionalArgs) {
		additionalArgs = [];
	}

	return spawnChild({
		cmd: 'react-scripts',
		args: [
			'start',
			// `${appName}:serve:local`,
			// '--parallel=1',
			// '--proxy-config', 'auth/proxy.config.json',
			...additionalArgs,
		],
		opts: { stdio: ['pipe', 'inherit', 'inherit'] },

		// cmd: 'nx',
		// args: [
		// 	'run',
		// 	`${appName}:serve:local`,
		// 	'--parallel=1',
		// 	'--proxy-config', 'auth/proxy.config.json',
		// 	...additionalArgs,
		// ],
		// opts: { stdio: ['pipe', 'inherit', 'inherit'] },
	});
}

function serveSafe(appName, additionalArgs) {
	if (utils.canServe(appName)) {
		return serve(appName, additionalArgs);
	}

	// Should we throw error here?
	console.error(colors.red('Cannot serve app "' + appName + '", no configuration found.'));
	return undefined;
}

module.exports = {
	serve,
	serveSafe
};
