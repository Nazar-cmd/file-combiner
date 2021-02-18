const FolderManager = require("./FolderManager")

const {
	getFilesFromFolder,
	filterFilesByType,
	fileTypeFormat,
	ignoreSpecialNamedFiles,
	errorToText
} = require("../utils")

class FolderWithFilesManager extends FolderManager {
	#fileType

	constructor(
		folderWithFilesManagerSettings = {
			question: "",
			options: [],
			answers: [],
			pointer: ">",
			color: "blue",
			fileType: ""
		}
	) {
		super(folderWithFilesManagerSettings)

		const { fileType } = folderWithFilesManagerSettings

		this.#fileType = fileTypeFormat(fileType)
	}

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

/*async function main() {
	const stylingTypeSel = new FolderWithFilesManager({
		question: "Select Folder with .fna files to continue",
		pointer: ">",
		color: "red",
		fileType: ".fna"
	})

	await stylingTypeSel.start()

	await askQuestion("dsfsdfsdfdf")
}

main()*/

module.exports = FolderWithFilesManager
