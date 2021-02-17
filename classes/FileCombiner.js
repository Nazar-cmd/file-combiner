const progressBar = require("../ProgressBar.js")
const fs = require("fs")
const userCommunication = require("../classes/UserCommunication")
const {
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

	async combineFiles(files) {
		const progressBarUniting = progressBar(files.length, "Uniting files")

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

async function main() {
	const fileCombiner = new FileCombiner("C:\\Users\\Nazar\\Desktop\\TestFiles")
	await fileCombiner.start()
}

main()

module.exports = FileCombiner
