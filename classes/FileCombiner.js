const fs = require("fs")

const {
	initProgressBar,
	askQuestion,
	deleteFileFromFolder,
	getFilesFromFolder,
	filterFilesByType,
	fileTypeFormat,
	ignoreSpecialNamedFiles
} = require("../utils")

class FileCombiner {
	#endFileName = "_united.fna"
	#fileType
	#filesFolderPath

	constructor(filesFolderPath, fileType) {
		this.#filesFolderPath = filesFolderPath
		this.#fileType = fileTypeFormat(fileType)
	}

	async savePreviousEndFile() {
		const endFilePath = `${this.#filesFolderPath}\\${this.#endFileName}`

		if (!fs.existsSync(endFilePath)) return

		let answer = ""

		while (answer !== "Y" && answer !== "N") {
			answer = await askQuestion(`Delete previous ${this.#endFileName}? (Y/N): `)
			answer = answer.toUpperCase()
		}

		if (answer === "Y") deleteFileFromFolder(endFilePath)
		else if (answer.toUpperCase() === "N") {
			while (fs.existsSync(endFilePath))
				await askQuestion(`${this.#endFileName} detected. Remove it manually and press 'Enter'`)
		}
	}

	async combineFiles(files) {
		await this.savePreviousEndFile()

		const progressBarUniting = initProgressBar(files.length, "Uniting files")

		for (let i = 0; i < files.length; i++) {
			const file = `${this.#filesFolderPath}\\${files[i]}`

			const r1 = fs.createReadStream(file)
			const w = fs.createWriteStream(`${this.#filesFolderPath}\\${this.#endFileName}`, {
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
	}

	async start() {
		const files = getFilesFromFolder(this.#filesFolderPath)

		const oneTypeFilesOnly = filterFilesByType(files, this.#fileType)
		const withoutSpecialFiles = ignoreSpecialNamedFiles(oneTypeFilesOnly, this.#endFileName)

		await this.combineFiles(withoutSpecialFiles)
	}
}

module.exports = FileCombiner
