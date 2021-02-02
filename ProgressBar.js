function progressBar(filesQuantity, message) {
	console.log(message)
	return function (currentFileIndex) {
		const dotsQuantity = ~~((currentFileIndex * 20) / filesQuantity)

		const dots = ".".repeat(dotsQuantity)

		const emptyQuantity = 20 - dotsQuantity
		const empty = " ".repeat(emptyQuantity)

		const percents = (currentFileIndex * 100) / filesQuantity

		process.stdout.write(
			`\r[${dots}${empty}] ${percents.toFixed(
				2
			)}% (${currentFileIndex} of ${filesQuantity})`
		)
	}
}

export { progressBar }
