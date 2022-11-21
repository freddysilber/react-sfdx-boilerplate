#!/usr/bin/env node

const colors = require('colors');
const { spawnChild } = require('./child_process.js');

const utils = {
	canServe(appName) {
		return true;
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
			...additionalArgs,
		],
		opts: { stdio: ['pipe', 'inherit', 'inherit'] },
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
