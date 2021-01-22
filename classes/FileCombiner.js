import {progressBar} from "../ProgressBar.js";
import {UserCommunication} from "./UserCommunication";
import fs from "fs"


class FileCombiner extends UserCommunication{
    constructor(filesFolderName="FilesToCombine") {
        super();
        this.filesFolderName = filesFolderName;
        this.filesFolderPath = `./${filesFolderName}`
    }

    deleteFileFromFolder() {
        fs.unlinkSync(`${this.filesFolderPath}/united.fna`);
    }

    folderExists() {
        return fs.existsSync(this.filesFolderPath)
    }

    getFilesQuantity() {
        return fs.readdirSync(this.filesFolderPath).length
    }

    createFilesDir() {
        fs.mkdirSync(this.filesFolderPath);
    }

    deleteAllFilesInDir() {
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
            this.createFilesDir(this.filesFolderPath)
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