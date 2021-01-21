import {progressBar} from "./ProgressBar.js";
import fs from "fs"


const testFolder = './TestFiles';

let testFiles = []

try {
    testFiles = [...fs.readdirSync(testFolder)];
}
catch (err) {
    console.log(err)
}


const unitedFileIndex = testFiles.indexOf('united.fna')

if (unitedFileIndex > -1) {
    fs.unlinkSync(`${testFolder}/united.fna`)
    testFiles.splice(unitedFileIndex, 1)
}

const filesQuantity = testFiles.length;
const progressBarIteration = progressBar(filesQuantity)

try {
    testFiles.forEach((file, index)=>{
            let fileContent = fs.readFileSync(`${testFolder}/${file}`, "utf8");

            const appendContent = index? `\n${fileContent}` : fileContent;

            fs.appendFileSync(`${testFolder}/united.fna`, appendContent);

            progressBarIteration(index+1)
        }
    )
}
catch (e) {
    console.error(e)
}



