import {progressBar} from "../ProgressBar.js";
import fs from "fs"


class FileCombiner {
    constructor(filesFolderName) {
        this.filesFolderName = filesFolderName;
        this.filesFolderPath = `./${filesFolderName}`
    }

    deleteFileFromFolder(filename) {
        fs.unlinkSync(`${this.filesFolderPath}/${filename}`);
        console.log(`File ${filename} was deleted`)
    }

    folderExists() {
        return fs.existsSync(this.filesFolderPath)
    }

    getFilesQuantity() {
        return fs.readdirSync(this.filesFolderPath).length
    }

    createFilesFolder() {
        fs.mkdirSync(this.filesFolderPath);
    }

    deleteAllFilesFromFolder() {
        if (fs.existsSync(this.filesFolderPath)) {
            const filesToDelete = fs.readdirSync(this.filesFolderPath);

            const deletingProgressBar = progressBar(filesToDelete.length, 'Deleting files')

            filesToDelete.forEach((file, index) => {
                fs.unlinkSync(`${this.filesFolderPath}/${file}`)
                deletingProgressBar(index+1)
            })
        }
        else {
            console.log("No such folder. Empty folder was created.");
            this.createFilesFolder(this.filesFolderPath)
        }
    }

    getFilesFromFolder() {
        return [...fs.readdirSync(this.filesFolderPath)];
    }

    combineFile(file, index) {
        let fileContent = fs.readFileSync(`${this.filesFolderPath}/${file}`, "utf8");

        const appendContent = index? `\n${fileContent}` : fileContent;

        fs.appendFileSync(`${this.filesFolderPath}/united.fna`, appendContent);
    }

    combineFiles(files) {

        const filesQuantity = files.length;
        const progressBarUniting = progressBar(filesQuantity, "Uniting files")

        files.forEach((file, index)=>{

                this.combineFile(file, index)

                progressBarUniting(index+1)
            }
        )
    }
}

export {FileCombiner};