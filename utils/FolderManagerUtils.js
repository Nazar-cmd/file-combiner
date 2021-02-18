const util = require("util")
const child = require("child_process")
const rs = require("fs")
const { dirname } = require("path")

async function getVolumesNames() {
	const exec = util.promisify(child.exec)

	const { stdout, stderr } = await exec("wmic logicaldisk get name")

	if (stderr) throw Error(stderr)

	return stdout
		.split("\r\r\n")
		.filter((value) => /[A-Za-z]:/.test(value))
		.map((value) => value.trim() + "\\")
}

function getInitialPath() {
	return process.cwd()
}

function getFoldersByPath(path) {
	const pathItems = rs.readdirSync(path, { withFileTypes: true })

	return pathItems.filter((item) => item.isDirectory()).map((folder) => folder.name)
}

function removeOnePathLevel(path) {
	const newPath = dirname(path)

	if (newPath !== path) return newPath
	else return "MY_COMPUTER"
}

function makeFoldersPaths(folders, path) {
	const backslash = path[path.length - 1] !== "\\" ? "\\" : ""

	return folders.map((folderName) => `${path}${backslash}${folderName}`)
}

function errorToText(error) {
	let erText = error.message
	for (const key in error) erText = erText.replace(error[key], "")
	erText = erText
		.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()']/g, "")
		.trim()
		.toUpperCase()

	return erText
}

module.exports = {
	errorToText,
	getInitialPath,
	getFoldersByPath,
	removeOnePathLevel,
	makeFoldersPaths,
	getVolumesNames
}
