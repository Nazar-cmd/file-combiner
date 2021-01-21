function progressBar(files) {

    return function (currentFile) {
        const dotsQuantity = Math.floor((currentFile*20)/files);
        const dots = ".".repeat(dotsQuantity);

        const emptyQuantity = 20 - dotsQuantity;
        const empty = " ".repeat(emptyQuantity);

        const percents = (currentFile*100)/files;

        process.stdout.write(`\r[${dots}${empty}] ${percents.toFixed(2)}%`);
    }
}

export {progressBar};

