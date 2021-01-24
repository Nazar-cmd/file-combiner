import {FileCombiner} from "./classes/FileCombiner.js";
import userCommunication from "./classes/UserCommunication.js"

const fileCombiner = new FileCombiner("ForFnaFilesCombiner")



if (!fileCombiner.folderExists()) {
    fileCombiner.createFilesFolder()
}
else {
    while (fileCombiner.getFilesQuantity()) {

        const answer = await userCommunication.askQuestion(`Delete all files from '${fileCombiner.filesFolderName}' folder? (Y/N): `)

        if (userCommunication.yesVariants.includes(answer)) {
            fileCombiner.deleteAllFilesFromFolder()
        }
        else if (userCommunication.noVariants.includes(answer)) {
            break
        }
        else {
            console.log("\nYou can only write 'yes' or 'no' ")
        }
    }
}

while (fileCombiner.getFilesQuantity() < 2) {
    await userCommunication.askQuestion(`\nUpload at least 2 files in '${fileCombiner.filesFolderName}' folder. Press 'Enter' to continue...`)
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

console.log(`\nFile united.fna was created in '${fileCombiner.filesFolderName}' folder.`)

