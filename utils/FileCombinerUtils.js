const fs = require("fs")
const path = require("path")
const readline = require("readline")

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

function initProgressBar(filesQuantity, message) {
	console.log(message)

	return function (currentFileIndex) {
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
	deleteFileFromFolder,
	ignoreSpecialNamedFiles,
	getFilesFromFolder,
	filterFilesByType,
	fileTypeFormat
}
