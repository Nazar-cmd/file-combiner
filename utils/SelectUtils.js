const rdl = require("readline")

const stdout = process.stdout
const stdin = process.stdin

function showCursor() {
	stdout.write("\x1B[?25h")
}

function hideCursor() {
	stdout.write("\x1B[?25l")
}

function colorText(str, colorName = "yellow") {
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

function clearScreen(startY) {
	rdl.cursorTo(stdout, 0, startY)
	rdl.clearScreenDown(stdout)
}

function writeOnLine(lineNum, text) {
	rdl.cursorTo(stdout, 0, lineNum)
	rdl.clearLine(stdout, 0)
	stdout.write(text)
}

function getWindowSize() {
	const [width, height] = stdout.getWindowSize()

	return { width, height }
}

function startWorkWithRawConsole() {
	stdin.setRawMode(true)
	stdin.resume()
	stdin.setEncoding("utf-8")
	hideCursor()
}

function endWorkWithRawConsole() {
	stdin.setRawMode(false)
	stdin.pause()
	showCursor()

	stdin.removeAllListeners("data")
	stdin.removeAllListeners("pause")
}

module.exports = {
	startWorkWithRawConsole,
	endWorkWithRawConsole,
	colorText,
	clearScreen,
	writeOnLine,
	getWindowSize
}
