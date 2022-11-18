const path = require('path');
const fs = require('fs-extra');
const colors = require('colors');

const buildDir = path.resolve(__dirname, '../build');
const resourcesDir = path.resolve(__dirname, '../../force-app/main/default/staticresources/my_app/build');

console.log('Moving build from: ' + colors.green(buildDir));
console.log('To: ' + colors.green(resourcesDir));

fs.move(
	buildDir,
	resourcesDir,
	{ overwrite: true },
	(error) => {
		if (error) {
			return console.error(colors.red(error));
		}
		console.log(colors.green('★ Success! ★'));
	}
)