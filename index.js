const fs = require("fs");
const testFolder = './TestFiles';

let testFiles = []

try {
    testFiles = [...fs.readdirSync(testFolder)];
}
catch (err) {
    console.log(err)
}


const unitedFileIndex = testFiles.indexOf('united.txt')

if (unitedFileIndex > -1) {
    fs.unlinkSync(`${testFolder}/united.txt`)
    testFiles.splice(unitedFileIndex, 1)
}

const testFilesQuantity = testFiles.length;

try {
    testFiles.forEach((file, index)=>{
            let fileContent = fs.readFileSync(`${testFolder}/${file}`, "utf8");

            fs.appendFileSync(`${testFolder}/united.txt`, `\n${fileContent}`);

            console.log(`${index+1}/${testFilesQuantity} done`)
        }
    )
}
catch (e) {
    console.log(e)
}


//const UnitedFileContent = fs.readFileSync(`${testFolder}/united.txt`, "utf8");

