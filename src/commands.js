const { program } = require('commander');

const path = require('path');
const handle = require('./convert');

program
	.option('--only-size', 'only size')
	.arguments('<svgPath>')
	.action((svgPath) => {
		const folders = svgPath.split('/');
		handle(
			path.join(process.cwd(), svgPath),
			path.join(process.cwd(), `src/components/${folders[folders.length - 1]}`)
		);
	});

module.exports = program;
