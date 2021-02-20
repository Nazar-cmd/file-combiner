/**@module Select*/
const {
	getWindowSize,
	writeOnLine,
	clearScreen,
	colorText,
	startWorkWithRawConsole,
	endWorkWithRawConsole
} = require("../utils")

/** Shorting for process.stdout
 * @const {Object}
 */
const stdout = process.stdout

/** Shorting for process.stdin
 * @const {Object}
 */
const stdin = process.stdin

/**Class representing a list of options in console
 * @class
 * @requires ...utils:utils/SelectUtils*/
class Select {
	/**
	 * Quantity of lines before list
	 * @type {Number}
	 * @static
	 * @private
	 * */
	static #linesBeforeList = 3
	/**
	 * Quantity of lines after list
	 * @type {Number}
	 * @static
	 * @private
	 * */
	static #linesAfterList = 2

	/** Init of settings
	 * @param {object} selectSettings 			   - Settings for list
	 * @property {string} selectSettings.question  - question to the list of answers
	 * @property {string[]} selectSettings.options - array of visible options
	 * @property {string[]} selectSettings.answers - array of returnable answers
	 * @property {string} [selectSettings.pointer]   - sign before every option
	 * @property {string} [selectSettings.color]     - name of selected option color
	 * */
	constructor(selectSettings) {
		let { question, options = [], answers = [], pointer = ">", color = "blue" } = selectSettings

		if (question.length <= 0) throw Error("There must be a 'question'")
		if (options.length !== answers.length)
			throw Error("'answers' and 'options' must be of the same length")

		//Error if program is running not in console
		if (!stdout.isTTY) throw Error("stdout is not a console")

		//Represents height and width of current window
		this.windowSize = getWindowSize()

		this.question = question
		this.options = options
		this.answers = answers
		this.pointer = pointer
		this.color = color

		//Index of user-selected option
		this.selectedItemIndex = 0

		//Object that shows current cursor position in x and y*/
		this.cursorPos = {
			x: 0,
			y: 0
		}
	}

	/** Set lines before list
	 * @param {number} before
	 * @static
	 * */
	static setSpacingBefore(before = 3) {
		Select.#linesBeforeList = before
	}

	/** Set lines after list
	 * @param {number} after
	 * @static
	 * */
	static setSpacingAfter(after = 2) {
		Select.#linesAfterList = after
	}

	/** Returns before and after list spacing
	 * @returns {Object}
	 * @static
	 * */
	static getSpacing() {
		const before = Select.#linesBeforeList
		const after = Select.#linesAfterList

		return { before, after }
	}

	/** Main class function. Wrapper for _start method
	 * @return {Promise} Promise object with resolved _start method
	 * @async
	 * */
	async start() {
		return new Promise((resolve) => this._start(resolve))
	}

	/**Start of program. Writing question and list of answers. Hanging listeners
	 * @param {Function} resolve
	 * */
	_start(resolve) {
		clearScreen(0)
		stdout.write(this.question + "\n")

		const lastElementIndex = this.getLastElementIndex()
		this.displayOptions(0, lastElementIndex)

		/**/
		startWorkWithRawConsole()
		stdin.on("data", this.onDataListener(this))
		stdin.on("pause", this.onPauseListener(resolve))
	}

	/**Displaying on screen options from start position to end
	 * @param {number} start - index of first shown element
	 * @param {number} end - index of last shown element
	 * @param {boolean} [cursorOnTop] - will last or first element be colored
	 * */
	displayOptions(start, end, cursorOnTop = false) {
		if (start > 0) writeOnLine(Select.#linesBeforeList - 1, " ... \n")
		else writeOnLine(Select.#linesBeforeList - 1, "        ")

		clearScreen(Select.#linesBeforeList)

		for (let opt = start; opt < end; opt++) {
			const decoratedOption = this.makeDecoratedOption(opt)

			if (opt === end - 1 && !cursorOnTop) {
				this.selectedItemIndex = end - 1
				this.cursorPos.y = this.getLastElementIndex() + Select.#linesBeforeList - 1

				stdout.write(colorText(decoratedOption, this.color))
			} else if (opt === start && cursorOnTop) {
				this.selectedItemIndex = start
				this.cursorPos.y = Select.#linesBeforeList

				stdout.write(colorText(decoratedOption, this.color))
			} else stdout.write(decoratedOption)
		}

		if (end < this.options.length) stdout.write(" ... \n")
	}

	/**Pause (end) listener function
	 * @method
	 * @param {function} resolve
	 * @listens pause
	 * @return {function} - function which return selected answer resolve
	 * */
	onPauseListener = (resolve) => () => {
		const answer = this.answers[this.selectedItemIndex]

		return resolve(answer)
	}

	/** Data listener function
	 * @method
	 * @param {Object} self - current this
	 * @listens data
	 * @return {function} - function which get key and returns method in accordance to it
	 * */
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

	/** On Enter key pressed function*/
	enter() {
		endWorkWithRawConsole()
	}

	/**On Ctrl+C keys pressed function*/
	ctrlc() {
		endWorkWithRawConsole()

		process.exit(0)
	}

	/**On up arrow key pressed function*/
	upArrow() {
		let y = this.cursorPos.y
		let index = this.selectedItemIndex

		const lastElementIndex = this.getLastElementIndex()

		//Considering if rerender or list or just two elements
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

			const newOption = colorText(this.makeDecoratedOption(index), this.color)
			writeOnLine(y, newOption)

			this.selectedItemIndex = index
			this.cursorPos.y = y
		}
	}

	/**On up down key pressed function*/
	downArrow() {
		let y = this.cursorPos.y
		let index = this.selectedItemIndex

		const lastElementIndex = this.getLastElementIndex()
		const lastElementPosition = lastElementIndex + Select.#linesBeforeList

		//Considering if rerender or list or just two elements
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

			const newOption = colorText(this.makeDecoratedOption(index), this.color)
			writeOnLine(y, newOption)

			this.selectedItemIndex = index
			this.cursorPos.y = y
		}
	}

	/**Returns last possible shown item index of options, due to spacing
	 * @returns {number}
	 * */
	getLastElementIndex() {
		const spacing = Select.#linesBeforeList + Select.#linesBeforeList

		return this.windowSize.height - spacing <= this.options.length
			? this.windowSize.height - spacing
			: this.options.length
	}

	/**Returns an option text with pointer
	 * @param {number} optionIndex
	 * @returns {string}
	 * */
	makeDecoratedOption(optionIndex) {
		return `${this.pointer} ${this.options[optionIndex]}\n`
	}
}

module.exports = Select
