const progressBar = require("../ProgressBar.js")
const fs = require("fs")
const userCommunication = require("../classes/UserCommunication")
const path = require("path")

class FileCombiner {
	static #endFileName = "_united.fna"

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
	/*
	getFilesQuantity() {
		return fs.readdirSync(this.filesFolderPath).length
	}*/

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
		return fs.readdirSync(folderPath).filter((file) => path.extname(file) === ".fna")
	}

	async combineFiles(files) {
		if (files.includes(FileCombiner.#endFileName))
			this.deleteFileFromFolder(FileCombiner.#endFileName)

		const progressBarUniting = progressBar(files.length, "Uniting files")

		for (let i = 0; i < files.length; i++) {
			const file = `${this.filesFolderPath}\\${files[i]}`

			const r1 = fs.createReadStream(file)
			const w = fs.createWriteStream(`${this.filesFolderPath}\\${FileCombiner.#endFileName}`, {
				flags: "a"
			})

			i && w.write("\n")

			await new Promise((resolve) =>
				r1.pipe(w).on("finish", () => {
					resolve()
					progressBarUniting(i + 1)
				})
			)
		}

		//return index ? `\n${fileContent}` : fileContent*/
	}

	/*async combineFiles(files) {
		/!*		if (files.includes("united.fna")) {
			let answer = ""
			while (
				!userCommunication.yesVariants.includes(answer) &&
				!userCommunication.noVariants.includes(answer)
			) {
				answer = await userCommunication.askQuestion(
					"united.fna file was found. Delete it? (Y/N): "
				)
			}
			if (userCommunication.yesVariants.includes(answer)) {
				this.deleteFileFromFolder("united.fna")
				const fileIndex = files.indexOf("united.fna")
				files.splice(fileIndex, 1)
			}
		}*!/

		this.writeStream = fs.createWriteStream(`${this.filesFolderPath}\\united.fna`, { flags: "a" })
		const filesQuantity = files.length

		await files.forEach(this.combineFile)
	}*/

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
