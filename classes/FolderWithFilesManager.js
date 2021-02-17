const fs = require("fs")
const path = require("path")

const FolderManager = require("./FolderManager")

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

		this.#fileType = fileType.startsWith(".") ? fileType : `.${fileType}`
	}

	getFilesFromFolder(folderPath) {
		return [...fs.readdirSync(folderPath)]
	}

	onSpace() {
		const answer = this.answers[this.selectedItemIndex]

		const files = this.getFilesFromFolder(answer)

		const usefulFiles = files.filter((file) => path.extname(file) === this.fileType)

		if (usefulFiles.length < 2) this.showTip(`There is less than 2 ${this.fileType} files`)
		else super.onSpace()
	}
}

async function main() {
	const stylingTypeSel = new FolderWithFilesManager({
		question: "Select Folder with .fna files to continue",
		pointer: ">",
		color: "red",
		fileType: ".fna"
	})

	const a = await stylingTypeSel.start()

	console.log(a)
	console.log(123)
}

main()

module.exports = FolderWithFilesManager
