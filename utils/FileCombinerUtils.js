const { unlinkSync, readdirSync } = require("fs")
const { extname } = require("path")
const readline = require("readline")

/**@module FileCombinerUtils
 * @requires unlinkSync, readdirSync:fs
 * @requires extname:path
 * @requires readline
 * */

/** Deletes file from specified path*/
function deleteFile(path) {
	unlinkSync(path)
	console.log(`File ${path} was deleted`)
}

/** Getting files from folder by specified path
 * @param {string} folderPath
 * @returns {string[]}*/
function getFilesFromFolder(folderPath) {
	return readdirSync(folderPath)
}

/** Filter files by type
 * @param {string[]} files
 * @param {string} type
 * @returns {string[]} - Array of only one type files
 * */
function filterFilesByType(files, type) {
	return files.filter((file) => extname(file) === type)
}

/** Adds a point before filetype
 * @param {string} fileType
 * @returns {string}
 * */
function fileTypeFormat(fileType) {
	return fileType.startsWith(".") ? fileType : `.${fileType}`
}

/** Exclude from files that, which includes specialName in name
 * @param {string[]} files
 * @param {string} specialName
 * @returns {string[]}
 * */
function ignoreSpecialNamedFiles(files, specialName) {
	const ignoredFiles = files.filter((file) => file.includes(specialName)).join(", ")
	ignoredFiles && console.log(`${ignoredFiles} - ignored`)

	return files.filter((file) => !file.includes(specialName))
}

/** Asks question in user and waits for answer
 * @param {string} query - question
 * @returns {Promise}
 * */
function askQuestion(query) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	})

	return new Promise((resolve) =>
		rl.question(query, (ans) => {
			rl.close()
			resolve(ans)
		})
	)
}

/** Initialisation of progress bar
 * @param {number} filesQuantity
 * @param {string} message
 * @returns {function} - function which get current file index and rewrite in console current progress
 * */
function initProgressBar(filesQuantity, message) {
	console.log(message)

	return function (currentFileIndex) {
		// ~~ stands for rounding down
		const dotsQuantity = ~~((currentFileIndex * 20) / filesQuantity)

		const dots = ".".repeat(dotsQuantity)

		const emptyQuantity = 20 - dotsQuantity
		const empty = " ".repeat(emptyQuantity)

		const percents = (currentFileIndex * 100) / filesQuantity

		process.stdout.write(
			`\r[${dots}${empty}] ${percents.toFixed(2)}% (${currentFileIndex} of ${filesQuantity})`
		)
	}
}

module.exports = {
	initProgressBar,
	askQuestion,
	deleteFile,
	ignoreSpecialNamedFiles,
	getFilesFromFolder,
	filterFilesByType,
	fileTypeFormat
}
