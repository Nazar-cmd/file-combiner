import rdl from "readline"
import { readdirSync } from "fs"
import { dirname } from "path"

import child from "child_process"
import util from "util"
import Select from "./Select.js"

const { stdout, stdin, stderr } = process

class FolderManager extends Select {
	constructor(
		folderManagerSettings = {
			question: "",
			options: [],
			answers: [],
			pointer: ">",
			color: "blue"
		}
	) {
		super(folderManagerSettings)

		const initialPath = this.getInitialPath()
		//this.path = initialPath;

		this.makeReturnAndFoldersOptions(initialPath)
	}

	async enter() {
		this.clearScreen(1)

		const answer = this.answers[this.input]
		this.path = answer

		await this.optionChooser(answer)
		this.displayOptions()
	}

	async optionChooser(path) {
		if (path === "MY_COMPUTER") {
			await this.makeVolumesOptions()
		} else {
			this.makeReturnAndFoldersOptions(path)
		}
	}

	async makeVolumesOptions() {
		const volumes = await this.getVolumesNames()

		this.options = [...volumes]
		this.answers = [...volumes]
	}

	makeReturnAndFoldersOptions(path) {
		const folders = this.getFoldersByPath(path)
		const foldersPaths = this.makeFoldersPaths(folders, path)

		const backButtonOption = "..."
		const backButtonAnswer = this.removeOnePathLevel(path)

		this.options = [backButtonOption, ...folders]
		this.answers = [backButtonAnswer, ...foldersPaths]
	}

	makeFoldersPaths(folders, path) {
		const backslash = path[path.length - 1] !== "\\" ? "\\" : ""
		return folders.map((folderName) => `${path}${backslash}${folderName}`)
	}

	removeOnePathLevel(path) {
		const newPath = dirname(path)

		if (newPath !== path) return newPath
		else return "MY_COMPUTER"
	}

	getFoldersByPath(path) {
		const pathItems = readdirSync(path, { withFileTypes: true })
		return pathItems
			.filter((item) => item.isDirectory())
			.map((folder) => folder.name)
	}

	getInitialPath() {
		return process.cwd()
	}

	async getVolumesNames() {
		const exec = util.promisify(child.exec)

		const { stdout, stderr } = await exec("wmic logicaldisk get name")

		if (stderr) throw Error(stderr)

		return stdout
			.split("\r\r\n")
			.filter((value) => /[A-Za-z]:/.test(value))
			.map((value) => value.trim() + "\\")
	}
}

const stylingTypeSel = new FolderManager({
	question: "Select Folder with .fna files to continue",
	pointer: ">",
	color: "red"
})

stylingTypeSel.start()

//console.log("123")
