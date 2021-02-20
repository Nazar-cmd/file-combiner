/**@module FolderManager*/
const Select = require("./Select.js")
const {
	getVolumesNames,
	makeFoldersPaths,
	removeOnePathLevel,
	getFoldersByPath,
	getInitialPath,
	clearScreen,
	writeOnLine,
	colorText,
	errorToText
} = require("../utils")

/**Class which enables to search folder in filesystem with arrow/enter/space keys
 * @class
 * @extends Select
 * @requires ...utils:utils/FolderManagerUtils
 * @requires Select
 * */
class FolderManager extends Select {
	/**
	 * y position of tip line
	 * @type {Number}
	 * @private
	 * */
	#tipLine = 1

	/**
	 * y position of path line
	 * @type {Number}
	 * @private
	 * */
	#pathLine = 2

	/** @inheritDoc*/
	constructor(folderManagerSettings) {
		super(folderManagerSettings)
		const initialPath = getInitialPath()

		this.makeReturnAndFoldersOptions(initialPath)
	}

	/**Making initial option/answer arrays
	 * @override
	 * */
	_start(resolve) {
		super._start(resolve)
		this.showPath(getInitialPath())
		this.showTip("Press 'Enter' to change folder, 'Space' to select")
	}

	/** onSpace keypress function added
	 * @override*/
	onDataListener(self) {
		return (key) => {
			const keyFunction = super.onDataListener(self)(key)
			if (keyFunction) return keyFunction
			else if (key === " ") return this.onSpace()
		}
	}

	/** On Space key pressed function. super.enter function performing*/
	onSpace() {
		clearScreen(0)
		super.enter()
	}

	/** Displaying new set of options/answers
	 * @override
	 * @async
	 * */
	async enter() {
		const answer = this.answers[this.selectedItemIndex]

		try {
			await this.optionChooser(answer)
			clearScreen(1)
			this.showPath(answer)
			const lastElementIndex = this.getLastElementIndex()
			this.displayOptions(0, lastElementIndex)
		} catch (error) {
			const erText = errorToText(error)
			this.showTip(erText)
		}
	}

	/** Making a new set of options/answers due to new path
	 * @async
	 * */
	async optionChooser(path) {
		if (path === "MY_COMPUTER") await this.makeVolumesOptions()
		else this.makeReturnAndFoldersOptions(path)
	}

	/** making new options/answers with volumes names
	 * @async
	 * */
	async makeVolumesOptions() {
		const volumes = await getVolumesNames()

		this.options = [...volumes]
		this.answers = [...volumes]
	}

	/** making new options/answers with folders names*/
	makeReturnAndFoldersOptions(path) {
		const folders = getFoldersByPath(path)
		const foldersPaths = makeFoldersPaths(folders, path)

		const backButtonOption = "..."
		const backButtonAnswer = removeOnePathLevel(path)

		this.options = [backButtonOption, ...folders]
		this.answers = [backButtonAnswer, ...foldersPaths]
	}

	/**Showing path on pathLine position
	 * @param {string} path - current path*/
	showPath(path) {
		writeOnLine(this.#pathLine, `Path: ${path}`)
	}

	/**Showing tip on pathLine position
	 * @param {string} tip - tip/message*/
	showTip(tip) {
		const tipText = colorText(`! ${tip}`, "red")
		writeOnLine(this.#tipLine, tipText)
	}
}

/*Setting to have space for path and tip*/
FolderManager.setSpacingBefore(4)
FolderManager.setSpacingAfter(2)

module.exports = FolderManager
