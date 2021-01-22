import {progressBar} from "./ProgressBar.js";
import fs from "fs"
import readline from "readline"


const filesDir = './TestFiles';



function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

function getFilesQuantity(targetFolder) {
    return fs.readdirSync(targetFolder).length
}

function createFilesDir(path) {
    fs.mkdirSync(path);
}




if (!fs.existsSync(filesDir)) {
    createFilesDir(filesDir)
}
else {
    while (getFilesQuantity(filesDir)) {

        const answer = await askQuestion("Delete all files from 'FilesToCombine' folder? (Y/N): ")

        if (['Y','y','yes','Yes','YES'].includes(answer)) {
            if (fs.existsSync(filesDir)) {
                const filesToDelete = fs.readdirSync(filesDir);

                const deletingProgressBar = progressBar(filesToDelete.length, 'Deleting files')

                filesToDelete.forEach((file, index) => {
                    fs.unlinkSync(`${filesDir}/${file}`)
                    deletingProgressBar(index+1)
                })
            }
            else {
                console.log("No such folder. Empty folder was created.");
                createFilesDir(filesDir)
            }
        }
        else if (['N','n','no','No','NO'].includes(answer)) {
            break
        }
        else {
            console.log("\nYou can only write 'yes' or 'no' ")
        }
    }
}

while (getFilesQuantity(filesDir) < 2) {
    await askQuestion("\nUpload at least 2 files. Press 'Enter' to continue...")
}

const testFiles = [...fs.readdirSync(filesDir)];

const unitedFileIndex = testFiles.indexOf('united.fna')

if (unitedFileIndex > -1) {
    fs.unlinkSync(`${filesDir}/united.fna`);
    console.log('File united.fna was deleted')
    testFiles.splice(unitedFileIndex, 1)
}

const filesQuantity = testFiles.length;
const progressBarUniting = progressBar(filesQuantity, "Uniting files")

try {
    testFiles.forEach((file, index)=>{
            let fileContent = fs.readFileSync(`${filesDir}/${file}`, "utf8");

            const appendContent = index? `\n${fileContent}` : fileContent;

            fs.appendFileSync(`${filesDir}/united.fna`, appendContent);

            progressBarUniting(index+1)
        }
    )
}
catch (e) {
    console.error(e)
}
console.log("\nFile united.fna was created")

