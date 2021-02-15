const progressBar = require("../ProgressBar.js")
const fs = require("fs")
const userCommunication = require("../classes/UserCommunication")

class FileCombiner {
	constructor(filesFolderPath) {
		this.filesFolderPath = filesFolderPath
	}

	deleteFileFromFolder(filename) {
		fs.unlinkSync(`${this.filesFolderPath}\\${filename}`)
		console.log(`File ${filename} was deleted`)
	}

	/*folderExists() {
		return fs.existsSync(this.filesFolderPath)
	}*/

	getFilesQuantity() {
		return fs.readdirSync(this.filesFolderPath).length
	}

	/*createFilesFolder() {
		fs.mkdirSync(this.filesFolderPath)
	}*/

	/*deleteAllFilesFromFolder() {
		if (fs.existsSync(this.filesFolderPath)) {
			const filesToDelete = fs.readdirSync(this.filesFolderPath)

			const deletingProgressBar = progressBar(filesToDelete.length, "Deleting files")

			filesToDelete.forEach((file, index) => {
				fs.unlinkSync(`${this.filesFolderPath}/${file}`)
				deletingProgressBar(index + 1)
			})
		} else {
			console.log("No such folder. Empty folder was created.")
			this.createFilesFolder(this.filesFolderPath)
		}
	}*/

	getFilesFromFolder(folderPath) {
		return [...fs.readdirSync(folderPath)]
	}

	combineFile(file, index) {
		let fileContent = fs.readFileSync(`${this.filesFolderPath}\\${file}`, "utf8")

		const appendContent = index ? `\n${fileContent}` : fileContent

		fs.appendFileSync(`${this.filesFolderPath}\\united.fna`, appendContent)
	}

	async combineFiles(files) {
		if (files.includes("united.fna")) {
			let answer = ""
			while (
				!userCommunication.yesVariants.includes(answer) &&
				!userCommunication.noVariants.includes(answer)
			)
				answer = await userCommunication.askQuestion("united.fna file was found. Delete it? (Y/N)")
			if (userCommunication.yesVariants.includes(answer)) this.deleteFileFromFolder("united.fna")
		}

		const filesQuantity = files.length
		const progressBarUniting = progressBar(filesQuantity, "Uniting files")

		files.forEach((file, index) => {
			this.combineFile(file, index)

			progressBarUniting(index + 1)
		})
	}

	async start() {
		const files = this.getFilesFromFolder(this.filesFolderPath)
		await this.combineFiles(files)
	}
}

async function main() {
	const fileCombiner = new FileCombiner("C:\\Users\\Nazar\\Desktop\\TestFiles")
	await fileCombiner.start()
}

main()

module.exports = FileCombiner
