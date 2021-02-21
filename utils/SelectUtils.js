const rdl = require("readline")
/**@module SelectUtils
 * @requires rdl:readline*/

/** Shorting for process.stdout
 * @const {Object}
 */
const stdout = process.stdout

/** Shorting for process.stdin
 * @const {Object}
 */
const stdin = process.stdin

/**Function shows cursor in console*/
function showCursor() {
	stdout.write("\x1B[?25h")
}

/**Function hides cursor in console*/
function hideCursor() {
	stdout.write("\x1B[?25l")
}

/** Function colors text in specified color
 * @param {string} str
 * @param {string} [colorName]
 * */
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

/**Clears screen from specified position
 * @param {number} startY - position, from which start to clear screen
 * */
function clearScreen(startY) {
	rdl.cursorTo(stdout, 0, startY)
	rdl.clearScreenDown(stdout)
}

/**Writes text on specified y position in console
 * @param {number} lineNum
 * @param {string} text
 * */
function writeOnLine(lineNum, text) {
	rdl.cursorTo(stdout, 0, lineNum)
	rdl.clearLine(stdout, 0)
	stdout.write(text)
}

/** Getting window height and width
 * @returns {object} Object with height and width keys
 * */
function getWindowSize() {
	const [width, height] = stdout.getWindowSize()

	return { width, height }
}

/** Setting console in raw mode*/
function startWorkWithRawConsole() {
	stdin.setRawMode(true)
	stdin.resume()
	stdin.setEncoding("utf-8")
	hideCursor()
}

/**Setting console back to norma and deleting 'data' and 'pause' listeners*/
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
