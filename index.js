import {FileCombiner} from "./classes/FileCombiner.js";

const fileCombiner = new FileCombiner("files")


if (!fileCombiner.folderExists()) {
    fileCombiner.createFilesFolder()
}
else {
    while (fileCombiner.getFilesQuantity()) {

        const answer = await fileCombiner.askQuestion(`Delete all files from '${fileCombiner.filesFolderName}' folder? (Y/N): `)

        if (fileCombiner.yesVariants.includes(answer)) {
            fileCombiner.deleteAllFilesFromFolder()
        }
        else if (fileCombiner.noVariants.includes(answer)) {
            break
        }
        else {
            console.log("\nYou can only write 'yes' or 'no' ")
        }
    }
}

while (fileCombiner.getFilesQuantity() < 2) {
    await fileCombiner.askQuestion("\nUpload at least 2 files. Press 'Enter' to continue...")
}

const files = [...fileCombiner.getFilesFromFolder()];

const unitedFileIndex = files.indexOf('united.fna')

if (unitedFileIndex > -1) {
    fileCombiner.deleteFileFromFolder("united.fna")
    files.splice(unitedFileIndex, 1)
}

try {
    fileCombiner.combineFiles(files)
}
catch (e) {
    console.error(e)
}

console.log("\nFile united.fna was created")

