import readline from "readline";

export class UserCommunication {

    noVariants = ['N','n','no','No','NO'];
    yesVariants = ['Y','y','yes','Yes','YES'];

    askQuestion(query) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        return new Promise(resolve => rl.question(query, ans => {
            rl.close();
            resolve(ans);
        }))
    }

}
