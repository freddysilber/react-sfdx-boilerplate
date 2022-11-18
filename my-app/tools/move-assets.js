const path = require('path');
const fs = require('fs-extra');
const colors = require('colors');

const buildDir = path.resolve(__dirname, '../build');
const resourcesDir = path.resolve(__dirname, '../force-app/main/default/staticresources/my_app');

console.log(buildDir);
console.log(resourcesDir);


fs.move(buildDir, resourcesDir, (error) => {
	if (error) {
		return console.error(colors.red(error));
	}
	console.log('success!');
});
