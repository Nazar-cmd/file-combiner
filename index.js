const { FolderWithFilesManager, FileCombiner } = require("./classes")

async function main() {
	const folderWithFilesManager = new FolderWithFilesManager({
		question: "Select Folder with .fna files to continue",
		pointer: ">",
		color: "green",
		fileType: ".fna"
	})

	const folderPath = await folderWithFilesManager.start()

	const fileCombiner = new FileCombiner(folderPath, ".fna")

	await fileCombiner.start()
}

main()
