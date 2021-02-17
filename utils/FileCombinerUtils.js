const fs = require("fs")
const path = require("path")

function deleteFileFromFolder(path) {
	fs.unlinkSync(path)
	console.log(`File ${path} was deleted`)
}

function getFilesFromFolder(folderPath) {
	return fs.readdirSync(folderPath)
}

function filterFilesByType(files, type) {
	return files.filter((file) => path.extname(file) === type)
}

function fileTypeFormat(fileType) {
	return fileType.startsWith(".") ? fileType : `.${fileType}`
}

function ignoreSpecialNamedFiles(files, name) {
	const ignoredFiles = files.filter((file) => file.includes(name)).join(", ")
	ignoredFiles && console.log(`${ignoredFiles} - ignored`)

	return files.filter((file) => !file.includes(name))
}

module.exports = {
	deleteFileFromFolder,
	ignoreSpecialNamedFiles,
	getFilesFromFolder,
	filterFilesByType,
	fileTypeFormat
}
