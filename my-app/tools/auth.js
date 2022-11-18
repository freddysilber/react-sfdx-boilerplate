const fs = require('fs');
const path = require('path');
const { spawnChild, spawnQueue } = require('./child_process.js');

// Paths
const authDir = path.resolve(__dirname, '../auth') + '/';
const curlPath = authDir + 'curl';
const curlTmpFileName = curlPath + '/environment.ts';

// Utils
const utils = {
	writeJSON(name, contents) {
		fs.writeFileSync(name, JSON.stringify(contents, undefined, '\t'));
	},
	createProxyConfig(target) {
		const proxyConfig = {
			// SF Rest
			'/services': {
				target: target,
				changeOrigin: true,
				contentType: 'application/json'
			},
			// Stock SF images (health image fields)
			'/img/samples': {
				target: 'http://blogforce9dev-developer-edition.ap1.force.com',
				changeOrigin: true
			}
		};
		[
			// AJAX Toolkit
			'/soap/ajax',
			// Lightning Out
			'/lightning',
			'/auraFW',
			'/aura',
			'aura',
			'/c',
			'/l',
			'/project_cloud',
			// Lightning out stylesheets
			'/_slds',
			'/slds'
		].forEach(function (endpoint) {
			proxyConfig[endpoint] = {
				target: target,
				changeOrigin: true
			};
		});
		utils.writeJSON(authDir + 'proxy.config.json', proxyConfig);
	},
	createRestConfig(token) {
		const restConfig = { token };
		// Set token in environment variables for use in React
		process.env['REACT_APP_TOKEN'] = token;
		utils.writeJSON(authDir + 'rest.config.json', restConfig);
	},
	createSfdcConst(user) {
		const sfdcConst = {
			USER: {
				id: user.id,
				name: 'User User',
			}
		}
		utils.writeJSON(authDir + 'sfdc-const.json', sfdcConst);
	},
	removeDir(curPath, onlyContents) {
		if (fs.existsSync(curPath)) {
			fs.readdirSync(curPath).forEach((file) => {
				var nestedPath = path.join(curPath, file);

				if (fs.lstatSync(nestedPath).isDirectory()) {
					utils.removeDir(nestedPath);
				} else {
					fs.unlinkSync(nestedPath);
				}
			});
			if (!onlyContents) {
				fs.rmdirSync(utils.nestedPath);
			}
		}
	},
	cleanDir(dirPath) {
		if (fs.existsSync(dirPath)) {
			// Don't delete folder, we'd just need to create it again
			utils.removeDir(dirPath, true);
		} else {
			fs.mkdirSync(dirPath);
		}
	}
};

// SFDX
function authSFDX(username, callback) {
	console.log('Authenticating', username ? '(' + username + ')' : '');
	const usernameArgs = username ? ['-u', username] : [];
	const opts = { stdio: ['pipe', 'pipe', 'inherit'] };

	spawnQueue([
		// Request login url (updates accessToken)
		{
			cmd: 'sfdx',
			args: ['force:org:open', '--json', '--urlonly'].concat(usernameArgs),
			opts,
			onClose(code) {
				if (code) {
					callback(code);
				}
			}
		},
		// Grab relevant data from SFDX user 
		{
			cmd: 'sfdx',
			args: ['force:user:display', '--json'].concat(usernameArgs),
			opts,
			onClose: callback,
			onExecute(spawnedProcess) {
				// Read data from "force:user:display" process
				spawnedProcess.stdout.on('data', function (data) {
					const user = JSON.parse(data.toString()).result;
					// Create the auth folder if it doesn't exist
					if (!fs.existsSync(authDir)) {
						fs.mkdirSync(authDir);
					}
					utils.createProxyConfig(user.loginUrl);
					utils.createRestConfig(user.accessToken);
					utils.createSfdcConst(user);
				});
			}
		},
	]);
}

// CURL
function authCURL() {
	utils.cleanDir(authDir);
	// Create temporary file
	fs.mkdirSync(curlPath);
	fs.writeFileSync(curlTmpFileName, '');

	spawnChild({
		cmd: '../../node_modules/.bin/sf-get-auth',
		args: ['-d', '.'],
		opts: { cwd: curlPath, stdio: 'inherit' },
		onClose(code, wasCancelled) {
			if (wasCancelled) {
				// Skip to next line when cancelled
				console.log('\n');
			} else if (!code) {
				try {
					extractSfAuthToken();
					extractSfProxyConfig();
					utils.createSfdcConst({ id: null }); // Need to update script to grab user id
				} catch (err) { }
			}
			utils.cleanDir(curlPath);
			fs.rmdirSync(curlPath);
		},
	});

	function readAndExtract(filePath, regex, matchIndex) {
		const fileStr = fs.readFileSync(filePath, { encoding: 'UTF-8' });
		const match = fileStr.match(regex);

		return match && matchIndex < match.length ? match[matchIndex] : null;
	}
	function extractSfAuthToken() {
		const token = readAndExtract(`${curlPath}/environment.ts`, /(?<="token":\s")(.*)(?=",?\s)/, 0);

		if (token) {
			utils.createRestConfig(token);
		} else {
			console.error('Unable to extract api token config');
		}
	}
	function extractSfProxyConfig() {
		const target = readAndExtract(`${curlPath}/proxy.conf.ts`, /(?<=target:\s')(.*)(?=',?\s)/, 0);

		if (target) {
			utils.createProxyConfig(target);
		} else {
			console.error('Unable to extract proxy config');
		}
	}
}

module.exports = {
	authCURL,
	authSFDX,
};
