const stdout = process.stdout
const stdin = process.stdin
const stderr = process.stderr

import rdl from "readline"

class Select {
	#linesBeforeList = 3
	#linesAfterList = 2

	constructor(
		selectSettings = {
			question: "",
			options: [],
			answers: [],
			pointer: ">",
			color: "blue"
		}
	) {
		let {
			question,
			options = [],
			answers = [],
			pointer = ">",
			color = "blue"
		} = selectSettings

		if (question.length <= 0) throw Error("There must be a 'question'")
		if (options.length !== answers.length)
			throw Error("'answers' and 'options' must be of the same length")

		this.windowSize = this.getWindowSize()

		this.question = question
		this.options = options
		this.answers = answers
		this.pointer = pointer
		this._color = color
		this.input
		this.cursorLocs = {
			x: 0,
			y: 0
		}
	}

	start() {
		this.clearScreen(0)
		stdout.write(this.question + "\n")

		const lastElementIndex = this.getLastElementIndex()

		this.displayOptions(0, lastElementIndex)

		//Todo: make this prettier

		/*	try {
			stdin.setRawMode(true)
        } catch (err) {
            if (stdin.isTTY) {
                stdin.setRawMode(true)
            }
        }*/

		stdin.setRawMode(true)
		stdin.resume()
		stdin.setEncoding("utf-8")
		this.hideCursor()
		stdin.on("data", this.pn(this))
	}

	getLastElementIndex() {
		const totalSpacing = this.#linesAfterList + this.#linesBeforeList

		return this.windowSize.height - totalSpacing <= this.options.length
			? this.windowSize.height - totalSpacing
			: this.options.length
	}

	displayOptions(start, end) {
		//TODO:
		this.clearScreen(this.#linesBeforeList)
		//rdl.cursorTo(stdout, 0, this.#linesBeforeList)

		for (let opt = start; opt < end; opt++) {
			const decoratedOption = this.makeDecoratedOption(opt)
			if (opt === end - 1) {
				this.input = end - 1
				stdout.write(this.color(decoratedOption, this._color))
			} else {
				stdout.write(decoratedOption)
			}
			this.cursorLocs.y = opt
		}

		if (end < this.options.length) {
			stdout.write(" ... ")
		}
	}

	makeDecoratedOption(optionIndex) {
		return `${this.pointer} ${this.options[optionIndex]}\n`
	}

	pn(self) {
		return (c) => {
			switch (c) {
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

				/*case '\u001B\u005B\u0041': // up
                    return self.upArrow()
                case '\u001B\u005B\u0042': // right
                    return self.upArrow()
                case '\u001B\u005B\u0043': // down
                    return self.downArrow()
                case '\u001B\u005B\u0044': // left
                    return self.downArrow()*/
			}
		}
	}

	enter() {
		stdin.removeListener("data", this.pn)
		stdin.setRawMode(false)
		stdin.pause()
		this.showCursor()
		rdl.cursorTo(stdout, 0, this.options.length + 1)
		console.log("\nYou selected: " + this.answers[this.input])
		//this.input = null
	}

	ctrlc() {
		stdin.removeListener("data", this.pn)
		stdin.setRawMode(false)
		stdin.pause()
		this.showCursor()
	}

	upArrow() {
		let y = this.cursorLocs.y

		const oldOption = this.makeDecoratedOption(y)

		rdl.cursorTo(stdout, 0, y + this.#linesBeforeList)
		stdout.write(oldOption)

		if (this.cursorLocs.y + 1 === 1) {
			this.cursorLocs.y = this.options.length - 1
		} else {
			this.cursorLocs.y--
		}
		y = this.cursorLocs.y

		const newOption = this.makeDecoratedOption(y)
		rdl.cursorTo(stdout, 0, y + this.#linesBeforeList)
		stdout.write(this.color(newOption, this._color))
		this.input = y
	}

	downArrow() {
		let y = this.cursorLocs.y
		const lastElementIndex = this.getLastElementIndex()

		if (y + 1 >= lastElementIndex && y + 1 !== this.options.length) {
			//TODO: Why +2

			const startIndex = y + 2 - lastElementIndex

			this.displayOptions(startIndex, y + 2)
			return
		}

		rdl.cursorTo(stdout, 0, y + this.#linesBeforeList)
		stdout.write(this.options[y])

		if (this.cursorLocs.y + 1 === this.options.length) {
			this.cursorLocs.y = 0
		} else {
			this.cursorLocs.y++
		}

		y = this.cursorLocs.y
		rdl.cursorTo(stdout, 0, y + this.#linesBeforeList)
		stdout.write(this.color(this.options[y], this._color))
		this.input = y
	}

	hideCursor() {
		stdout.write("\x1B[?25l")
	}

	showCursor() {
		stdout.write("\x1B[?25h")
	}

	color(str, colorName = "yellow") {
		const colors = {
			yellow: [33, 89],
			blue: [34, 89],
			green: [32, 89],
			cyan: [35, 89],
			red: [31, 89],
			magenta: [36, 89]
		}
		const _color = colors[colorName]
		const start = "\x1b[" + _color[0] + "m"
		const stop = "\x1b[" + _color[1] + "m\x1b[0m"
		return start + str + stop
	}

	clearScreen(startY) {
		rdl.cursorTo(stdout, 0, startY)
		rdl.clearScreenDown(stdout)
	}

	getWindowSize() {
		const [width, height] = stdout.getWindowSize()
		return { width, height }
	}
}

const stylingTypeSel = new Select({
	question: "Select Folder with .fna files to continue",
	pointer: ">",
	options: [...Array(100).keys()],
	answers: [...Array(100).keys()],
	color: "red"
})

stylingTypeSel.start()

export default Select
