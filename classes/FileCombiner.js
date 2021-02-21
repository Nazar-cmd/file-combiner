/**@module FileCombiner*/
const fs = require("fs")
const {
	initProgressBar,
	askQuestion,
	deleteFileFromFolder,
	getFilesFromFolder,
	filterFilesByType,
	fileTypeFormat,
	ignoreSpecialNamedFiles,
	errorToText,
	startWorkWithRawConsole,
	endWorkWithRawConsole,
	colorText
} = require("../utils")

/**Class combining list of files with specified type in one with \n between them
 * @class
 * @requires ...utils:utils/FileCombinerUtils
 * @requires fs*/
class FileCombiner {
	/**
	 * Name of end file
	 * @type {string}
	 * @private
	 * */
	#endFileName = "_united.fna"

	/**
	 * Wanted file type
	 * @type {string}
	 * @private
	 * */
	#fileType

	/**
	 * Path of folder with specified filetype
	 * @type {string}
	 * @private
	 * */
	#filesFolderPath

	/** Init of settings
	 * @param {string} filesFolderPath
	 * @param {string} fileType
	 * */
	constructor(filesFolderPath, fileType) {
		this.#filesFolderPath = filesFolderPath
		this.#fileType = fileTypeFormat(fileType)
	}

	/** Program stops until previous end file will be deleted
	 * @async
	 * */
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

	/** Sequential call of each file to be read and append to main file
	 * @param {string[]} files - filenames in destination folder
	 * @async
	 * */
	async combineFiles(files) {
		await this.savePreviousEndFile()

		const progressBarUniting = initProgressBar(
			files.length,
			`\nUniting files in ${this.#filesFolderPath}`
		)

		startWorkWithRawConsole()
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
		endWorkWithRawConsole()
	}

	/** Main class method
	 * @async
	 */
	async start() {
		try {
			const files = getFilesFromFolder(this.#filesFolderPath)

			const oneTypeFilesOnly = filterFilesByType(files, this.#fileType)
			const withoutSpecialFiles = ignoreSpecialNamedFiles(oneTypeFilesOnly, this.#endFileName)

			await this.combineFiles(withoutSpecialFiles)

			console.log("\nCombining successfully done!")
		} catch (error) {
			const erText = errorToText(error)

			console.log("\n" + colorText(erText, "red"))
		} finally {
			console.log("\nPress any key to exit...")
		}
	}
}

module.exports = FileCombiner
