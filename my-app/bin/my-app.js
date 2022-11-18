const { Command } = require('commander');
const { authSFDX } = require('../tools/auth');
const { serveSafe } = require('../tools/serve');

const program = new Command();

program
	.storeOptionsAsProperties(false)
	.version('1.0.0')
	.description('React API');

program
	.command('start1')
	.description('Serves a React App')
	.requiredOption('--app <app>', 'Project to serve')
	.allowUnknownOption()
	.option('--no-auth', 'Skip authentication (must set if using CURL authentication')
	.option('-u --username <username>', 'The username to authenticate against. This is ignored if the "--no-auth" option is set')
	.action(function (options) {
		if (options.auth) {
			authSFDX(options.username || undefined, function (code) {
				if (!code) {
					serveSafe(options.app);
				}
			});
		} else {
			serveSafe(options.app);
		}
	});

program.parse();
