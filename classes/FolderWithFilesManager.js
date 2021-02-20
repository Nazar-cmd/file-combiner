/**@module FolderWithFilesManager*/
const FolderManager = require("./FolderManager")

const {
	getFilesFromFolder,
	filterFilesByType,
	fileTypeFormat,
	ignoreSpecialNamedFiles,
	errorToText
} = require("../utils")

/**Class which allows as to select folder only with at least two files of the specified type
 * @class
 * @extends FolderManager
 * @requires ...utils:utils/FolderManagerUtils
 * @requires FolderManager
 * */
class FolderWithFilesManager extends FolderManager {
	/**
	 * Wanted file type
	 * @type {string}
	 * @private
	 * */
	#fileType

	/** Init of settings
	 * @param {object} folderWithFilesManagerSettings  - Settings for list
	 * @property {string} selectSettings.question 	   - question to the list of answers
	 * @property {string[]} selectSettings.options     - array of visible options
	 * @property {string[]} selectSettings.answers     - array of returnable answers
	 * @property {string} [selectSettings.pointer]     - sign before every option
	 * @property {string} [selectSettings.color]       - name of selected option color
	 * @property {string} [fileType]       			   - with this filetype files folder must to be
	 * */
	constructor(folderWithFilesManagerSettings) {
		super(folderWithFilesManagerSettings)

		const { fileType = ".txt" } = folderWithFilesManagerSettings

		this.#fileType = fileTypeFormat(fileType)
	}

	/** Checking if folder contains at least two files with filetype
	 * @override
	 * */
	onSpace() {
		const answer = this.answers[this.selectedItemIndex]
		try {
			const files = getFilesFromFolder(answer)

			const usefulFiles = filterFilesByType(files, this.#fileType)

			if (usefulFiles.length < 2) this.showTip(`There is less than 2 ${this.#fileType} files`)
			else super.onSpace()
		} catch (error) {
			const erText = errorToText(error)
			this.showTip(erText)
		}
	}
}

module.exports = FolderWithFilesManager
