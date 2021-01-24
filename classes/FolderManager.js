import rdl from "readline"
import { readdirSync, statSync } from "fs";
import { join } from "path"

import child from 'child_process';
import util from "util"
import Select from "./Select.js"

const {stdout, stdin, stderr} = process;

class FolderManager extends Select{

    constructor(folderManagerSettings = {
        question: "",
        options: [],
        answers: [],
        pointer: ">",
        color: "blue"
    }) {
        super(folderManagerSettings)

        const initialPath = this.getInitialPath();
        const folders = this.getFoldersByPath(initialPath);
        const foldersPaths = folders.map(folderName => `${initialPath}\\${folderName}`)

        this.path = initialPath;
        this.options = folders;
        this.answers = foldersPaths;

    }

    getFoldersByPath(path) {
        const pathItems = readdirSync(path, { withFileTypes: true });
        return pathItems
            .filter(item => item.isDirectory())
            .map(folder => folder.name);
    }

    getInitialPath() {
        return process.cwd()
    }


    async getVolumesNames() {
        const exec = util.promisify(child.exec);

        const { stdout, stderr } = await exec('wmic logicaldisk get name');

        if (stderr)
            throw Error(stderr);

        return stdout.split('\r\r\n')
            .filter(value => /[A-Za-z]:/.test(value))
            .map(value => value.trim())
    }
}

const stylingTypeSel = new FolderManager({
    question: "Which styling do you want?",
    pointer: "-",
    color: 'red'
})

stylingTypeSel.start()

console.log("123")
