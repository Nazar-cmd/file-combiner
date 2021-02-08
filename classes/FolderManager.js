const Select = require("./Select.js")
const {
	getVolumesNames,
	showPath,
	makeFoldersPaths,
	removeOnePathLevel,
	getFoldersByPath,
	getInitialPath,
	clearScreen,
	writeOnLine
} = require("../utils")

class FolderManager extends Select {
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
		Select.setSpacing(4, 2)

		const initialPath = getInitialPath()

		this.makeReturnAndFoldersOptions(initialPath)
	}

	_start() {
		super._start()
		showPath(getInitialPath())
	}

	onDataListener = (self) => {
		return (key) => {
			const keyFunction = super.onDataListener(self)(key)
			if (keyFunction) return keyFunction
			else if (key === " ") return writeOnLine(2, "space")
		}
	}

	async enter() {
		clearScreen(1)

		const answer = this.answers[this.selectedItemIndex]

		showPath(answer)
		await this.optionChooser(answer)
		const lastElementIndex = this.getLastElementIndex()
		this.displayOptions(0, lastElementIndex)
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
}

const stylingTypeSel = new FolderManager({
	question: "Select Folder with .fna files to continue",
	pointer: ">",
	color: "red"
})

const a = stylingTypeSel.start()

console.log(a)
//console.log("123")

module.exports = FolderManager
