import {
	getWindowSize,
	writeOnLine,
	clearScreen,
	colorText,
	startWorkWithRawConsole,
	endWorkWithRawConsole
} from "../utils/SelectUtils.js"

const stdout = process.stdout
const stdin = process.stdin

class Select {
	static #linesBeforeList = 3
	static #linesAfterList = 2

	constructor(
		selectSettings = {
			question: "",
			options: [],
			answers: [],
			pointer: ">",
			color: "blue"
		}
	) {
		let { question, options = [], answers = [], pointer = ">", color = "blue" } = selectSettings

		if (question.length <= 0) throw Error("There must be a 'question'")
		if (options.length !== answers.length)
			throw Error("'answers' and 'options' must be of the same length")
		if (!stdout.isTTY) throw Error("stdout is not a console")

		this.windowSize = getWindowSize()
		this.question = question
		this.options = options
		this.answers = answers
		this.pointer = pointer
		this._color = color
		this.selectedItemIndex = 0
		this.cursorPos = {
			x: 0,
			y: 0
		}
	}

	static setSpacing(before = 3, after = 2) {
		Select.#linesBeforeList = before
		Select.#linesAfterList = after
	}

	static getSpacing() {
		const before = Select.#linesBeforeList,
			after = Select.#linesAfterList

		return { before, after }
	}

	async start() {
		return new Promise(this._start)
	}

	_start = () => {
		clearScreen(0)
		stdout.write(this.question + "\n")

		const lastElementIndex = this.getLastElementIndex()
		this.displayOptions(0, lastElementIndex)

		startWorkWithRawConsole()
		stdin.on("data", this.onDataListener(this))
		stdin.on("pause", this.onPauseListener)
	}

	displayOptions(start, end, cursorOnTop = false) {
		clearScreen(Select.#linesBeforeList)

		for (let opt = start; opt < end; opt++) {
			const decoratedOption = this.makeDecoratedOption(opt)

			if (opt === end - 1 && !cursorOnTop) {
				this.selectedItemIndex = end - 1
				this.cursorPos.y = this.getLastElementIndex() + Select.#linesBeforeList - 1

				stdout.write(colorText(decoratedOption, this._color))
			} else if (opt === start && cursorOnTop) {
				this.selectedItemIndex = start
				this.cursorPos.y = Select.#linesBeforeList

				stdout.write(colorText(decoratedOption, this._color))
			} else stdout.write(decoratedOption)
		}

		if (end < this.options.length) stdout.write(" ... ")
	}

	onPauseListener = () => {
		const answer = this.answers[this.selectedItemIndex]

		return Promise.resolve(answer)
	}

	onDataListener(self) {
		return (key) => {
			switch (key) {
				case "\u0004": // Ctrl-d
				case "\r":
				case "\n":
					return self.enter()
				case "\u0003": // Ctrl-c
					return self.ctrlc()
				case "\u001b[A":
					return self.upArrow()
				case "\u001b[B":
					return self.downArrow()
				default:
					return null
			}
		}
	}

	enter() {
		endWorkWithRawConsole()
		stdin.removeListener("data", this.onDataListener)
		stdin.removeListener("pause", this.onPauseListener)

		const answerIndex = this.getLastElementIndex() + Select.#linesAfterList + 1
		writeOnLine(answerIndex, "\nYou selected: " + this.answers[this.selectedItemIndex])
	}

	ctrlc() {
		endWorkWithRawConsole()
		stdin.removeListener("data", this.onDataListener)
		stdin.removeListener("pause", this.onPauseListener)

		process.exit(0)
	}

	upArrow() {
		let y = this.cursorPos.y
		let index = this.selectedItemIndex

		const lastElementIndex = this.getLastElementIndex()

		if (y === Select.#linesBeforeList && index !== 0) {
			const endIndex = index + lastElementIndex - 1

			this.displayOptions(index - 1, endIndex, true)
		} else if (index === 0) {
			const startIndex = this.options.length - lastElementIndex
			const endIndex = this.options.length

			this.displayOptions(startIndex, endIndex)
		} else {
			const oldOption = this.makeDecoratedOption(index)
			writeOnLine(y, oldOption)

			index--
			y--

			const newOption = colorText(this.makeDecoratedOption(index), this._color)
			writeOnLine(y, newOption)

			this.selectedItemIndex = index
			this.cursorPos.y = y
		}
	}

	downArrow() {
		let y = this.cursorPos.y
		let index = this.selectedItemIndex

		const lastElementIndex = this.getLastElementIndex()
		const lastElementPosition = lastElementIndex + Select.#linesBeforeList

		//TODO: Why +2 + if

		if (y + 1 === lastElementPosition && index + 1 !== this.options.length) {
			const startIndex = index + 2 - lastElementIndex

			this.displayOptions(startIndex, index + 2)
		} else if (index + 1 === this.options.length) {
			const lastElementIndex = this.getLastElementIndex()

			this.displayOptions(0, lastElementIndex, true)
		} else {
			const oldOption = this.makeDecoratedOption(index)
			writeOnLine(y, oldOption)

			index++
			y++

			const newOption = colorText(this.makeDecoratedOption(index), this._color)
			writeOnLine(y, newOption)

			this.selectedItemIndex = index
			this.cursorPos.y = y
		}
	}

	getLastElementIndex() {
		const spacing = Select.#linesBeforeList + Select.#linesBeforeList

		return this.windowSize.height - spacing <= this.options.length
			? this.windowSize.height - spacing
			: this.options.length
	}

	makeDecoratedOption(optionIndex) {
		return `${this.pointer} ${this.options[optionIndex]}\n`
	}
}

/*const stylingTypeSel = new Select({
	question: "Select Folder with .fna files to continue",
	pointer: ">",
	options: [...Array(100).keys()],
	answers: [...Array(100).keys()],
	color: "red"
})

const answer = stylingTypeSel.start()*/

export default Select
