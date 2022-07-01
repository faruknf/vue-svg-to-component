const fs = require('fs');
const { promisify } = require('util');
const { program } = require('commander');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const properties = ['width', 'height', 'fill', 'stroke', 'stroke-width', 'opacity'];

const newProperties = [
	':width="width"',
	':height="height"',
	':fill="fill"',
	':stroke="stroke"',
	':stroke-width="strokeWidth"',
	':opacity="opacity"',
];

const localProperties = ['opacity'];

async function read(svgPath) {
	return (await readFile(svgPath, 'utf-8')).toString();
}

async function write(file, svg, defaultProps) {
	await writeFile(file, createComponent(svg, defaultProps));
}

async function createDirectory(target) {
	if (!fs.existsSync(target)) {
		fs.mkdirSync(target, { recursive: true });
	}
}

function getSvgTag(svg) {
	const regex = /<svg[\s\S]*<\/svg>/gu;
	const svgTag = svg.match(regex);
	if (svgTag) {
		return svgTag[0];
	}
	return null;
}

function getOpenSvgTag(svg) {
	const regex = /(<svg)([^>]*)>/gu;
	const openTag = svg.match(regex);
	if (openTag) {
		return openTag[0];
	}
	return null;
}

function setProps(svgTag, properties, newProperties) {
	const defaultProps = [];
	const { onlySize } = program.opts();
	for (let index = 0; index < properties.length; index += 1) {
		const regexString = `(?<=\\s)(${properties[index]}="[^"]*")`;

		let regex = new RegExp(regexString, 'gu');
		const matches = svgTag.match(regex);

		if (matches) {
			if (!getOpenSvgTag(svgTag).match(regex) && localProperties.includes(properties[index])) {
				svgTag = `${svgTag.slice(0, 4)} ${newProperties[index]}${svgTag.slice(4)}`;
				/* eslint-disable */
				continue;
			} else if (!matches.every((e) => e === matches[0]) && onlySize) {
				regex = new RegExp(regexString, 'u');
			}
			defaultProps.push(matches[0].split('=')[1]);
			svgTag = svgTag.replace(regex, newProperties[index]);
		} else {
			defaultProps.push(null);

			// If tag already don't have the properties, add the newProperties to the svg
			svgTag = `${svgTag.slice(0, 4)} ${newProperties[index]}${svgTag.slice(4)}`;
		}
	}

	return { newSvgTag: svgTag, defaultProps };
}

function createComponent(svg, defaultProps) {
	return `<template>${svg}
</template>

<script>
export default {
  props: {
	width:{type:String,default:${defaultProps[0] ?? "'24'"}},
    height: {type:String,default:'auto'},
    fill: {type:String,default:${defaultProps[2] ?? "'none'"}},
    stroke: {type:String,default:${defaultProps[3] ?? "'none'"}},
    strokeWidth:{type:String,default:${defaultProps[4] ?? "'1'"}},
    opacity:{type:String,default:${defaultProps[5] ?? "'1'"}}
  },
};
</script>

`;
}

async function convert(svgPath, target) {
	await createDirectory(target);
	const dirs = await readdir(svgPath);

	for (let index = 0; index < dirs.length; index += 1) {
		const fullDir = `${svgPath}/${dirs[index]}`;
		if (fs.lstatSync(fullDir).isDirectory()) {
			await convert(fullDir, `${target}/${dirs[index]}`);
		} else {
			const content = await read(fullDir);
			const svgTag = getSvgTag(content);

			if (svgTag) {
				const { newSvgTag, defaultProps } = await setProps(svgTag, properties, newProperties);
				const fileName =
					dirs[index].split('.')[0][0].toUpperCase() + dirs[index].split('.')[0].slice(1);
				await write(`${target}/${fileName}Svg.vue`, newSvgTag, defaultProps);
			}
		}
	}
}

async function handle(svgPath, target) {
	try {
		if (!fs.existsSync(svgPath)) {
			throw new Error(`No such file or directory ${svgPath}`);
		} else {
			fs.rmdirSync(target, { recursive: true });
			convert(svgPath, target);
		}
	} catch (error) {
		console.log(error.message);
	}
}

module.exports = handle;
