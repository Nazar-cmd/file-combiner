const Select = require("./Select.js")
const {
	getVolumesNames,
	makeFoldersPaths,
	removeOnePathLevel,
	getFoldersByPath,
	getInitialPath,
	clearScreen,
	writeOnLine,
	colorText
} = require("../utils")

class FolderManager extends Select {
	#tipLine = 1
	#pathLine = 2

	constructor(
		folderManagerSettings = {
			question: "",
			options: [],
			answers: [],
			pointer: ">",
			color: "blue"
		}
	) {
		super(folderManagerSettings)
		const initialPath = getInitialPath()

		this.makeReturnAndFoldersOptions(initialPath)
	}

	_start(resolve) {
		super._start(resolve)
		this.showPath(getInitialPath())
		this.showTip("Press 'Enter' to change folder, 'Space' to select")
	}

	onDataListener = (self) => {
		return (key) => {
			const keyFunction = super.onDataListener(self)(key)
			if (keyFunction) return keyFunction
			else if (key === " ") return this.onSpace()
		}
	}

	onSpace() {
		super.enter()
		clearScreen(0)
	}

	async enter() {
		try {
			const answer = this.answers[this.selectedItemIndex]
			await this.optionChooser(answer)

			clearScreen(1)
			this.showPath(answer)
			const lastElementIndex = this.getLastElementIndex()
			this.displayOptions(0, lastElementIndex)
		} catch (error) {
			this.showError(error)
		}
	}

	async optionChooser(path) {
		if (path === "MY_COMPUTER") await this.makeVolumesOptions()
		else this.makeReturnAndFoldersOptions(path)
	}

	async makeVolumesOptions() {
		const volumes = await getVolumesNames()

		this.options = [...volumes]
		this.answers = [...volumes]
	}

	makeReturnAndFoldersOptions(path) {
		const folders = getFoldersByPath(path)
		const foldersPaths = makeFoldersPaths(folders, path)

		const backButtonOption = "..."
		const backButtonAnswer = removeOnePathLevel(path)

		this.options = [backButtonOption, ...folders]
		this.answers = [backButtonAnswer, ...foldersPaths]
	}

	showPath(path) {
		writeOnLine(this.#pathLine, `Path: ${path}`)
	}

	showTip(tip) {
		const tipText = colorText(`! ${tip}`, "red")
		writeOnLine(this.#tipLine, tipText)
	}

	showError(error) {
		let erText = error.message
		for (const key in error) erText = erText.replace(error[key], "")
		erText = erText
			.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()']/g, "")
			.trim()
			.toUpperCase()
		this.showTip(erText)
	}
}

FolderManager.setSpacing(4, 2)

/*async function main() {
	const stylingTypeSel = new FolderManager({
		question: "Select Folder with .fna files to continue",
		pointer: ">",
		color: "red"
	})

	const a = await stylingTypeSel.start()

	console.log(a)
}

main()*/
//console.log("123")

module.exports = FolderManager
