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

		const totalSpacing = this.#linesAfterList + this.#linesBeforeList

		const lastElementIndex =
			this.windowSize.height - totalSpacing <= this.options.length
				? this.windowSize.height - totalSpacing
				: this.options.length

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

	displayOptions(start, end) {
		//TODO:

		rdl.cursorTo(stdout, 0, this.#linesBeforeList)

		for (let opt = start; opt < end; opt++) {
			this.options[opt] = this.pointer + " " + this.options[opt]
			if (opt === end - 1) {
				this.input = end - 1
				this.options[opt] += "\n"
				stdout.write(this.color(this.options[opt], this._color))
			} else {
				this.options[opt] += "\n"
				stdout.write(this.options[opt])
			}
			this.cursorLocs.y = opt
		}

		/*if (this.windowSize.height - 5 < this.options.length) {
			stdout.write(" vvv ")
			this.cursorLocs.y++
		}*/
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
		rdl.cursorTo(stdout, 0, y + this.#linesBeforeList)
		stdout.write(this.options[y])

		if (this.cursorLocs.y + 1 === 1) {
			this.cursorLocs.y = this.options.length - 1
		} else {
			this.cursorLocs.y--
		}
		y = this.cursorLocs.y
		rdl.cursorTo(stdout, 0, y + this.#linesBeforeList)
		stdout.write(this.color(this.options[y], this._color))
		this.input = y
	}

	downArrow() {
		let y = this.cursorLocs.y
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
	options: [...Array(10).keys()],
	answers: [...Array(10).keys()],
	color: "red"
})

stylingTypeSel.start()

export default Select
