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

	onDataListener(self) {
		return (key) => {
			const keyFunction = super.onDataListener(self)(key)
			if (keyFunction) return keyFunction
			else if (key === " ") return this.onSpace()
		}
	}

	onSpace() {
		clearScreen(0)
		super.enter()
	}

	async enter() {
		const answer = this.answers[this.selectedItemIndex]

		await this.optionChooser(answer)
		clearScreen(1)
		this.showPath(answer)
		const lastElementIndex = this.getLastElementIndex()
		this.displayOptions(0, lastElementIndex)
		/*	try {
			await this.optionChooser(answer)
			clearScreen(1)
			this.showPath(answer)
			const lastElementIndex = this.getLastElementIndex()
			this.displayOptions(0, lastElementIndex)
		} catch (error) {
			const erText = errorToText(error)
			this.showTip(erText)
		}*/
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
}

FolderManager.setSpacing(4, 2)

/*async function main() {
	const stylingTypeSel = new FolderManager({
		question: "Select Folder with .fna files to continue",
		pointer: ">",
		color: "red"
	})

	await stylingTypeSel.start()

	await setTimeout(Promise.resolve, 100000)
}

main()*/
//console.log("123")

module.exports = FolderManager
