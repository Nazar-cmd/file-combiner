const child = require("child_process")
const { promisify } = require("util")
const { readdirSync } = require("fs")
const { dirname } = require("path")

/**@module FolderManagerUtils
 * @requires child:child_process
 * @requires promisify:util
 * @requires readdirSync:fs
 * @requires dirname:path
 * */

/** Getting system volumes names via calling child.exec
 * @returns {string[]} Array of system volumes names*/
async function getVolumesNames() {
	const exec = promisify(child.exec)

	const { stdout, stderr } = await exec("wmic logicaldisk get name")

	if (stderr) throw Error(stderr)

	return stdout
		.split("\r\r\n")
		.filter((value) => /[A-Za-z]:/.test(value))
		.map((value) => value.trim() + "\\")
}

/**@returns {string} - current program location*/
function getInitialPath() {
	return process.cwd()
}

/** Getting only directories by specified path
 * @returns {string[]} - Array of directories names
 * */
function getFoldersByPath(path) {
	const pathItems = readdirSync(path, { withFileTypes: true })

	return pathItems.filter((item) => item.isDirectory()).map((folder) => folder.name)
}

/** Function to go down only by one level in filesystem
 * @returns {string}
 * */
function removeOnePathLevel(path) {
	const newPath = dirname(path)

	if (newPath !== path) return newPath
	else return "MY_COMPUTER"
}

/** Function concat specified path and folder name
 * @param {string[]} folders
 * @param {string} path
 * @returns {string[]} - Array of folders path
 * */
function makeFoldersPaths(folders, path) {
	const backslash = path[path.length - 1] !== "\\" ? "\\" : ""

	return folders.map((folderName) => `${path}${backslash}${folderName}`)
}

/** Function removes redundant info from error.message
 * @param {object} error
 * @returns {string} - normalized error message
 * */
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
