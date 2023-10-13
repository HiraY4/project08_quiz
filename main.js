#!/usr/bin/env node
import showBanner from "node-banner";
import inquirer from "inquirer";
import chalk from "chalk";
(async () => {
    await showBanner("QUIZ", "Time To Test Your General Knowledge", "blue", "white");
})();
const apiLink = "https://opentdb.com/api.php?amount=6&category=9&difficulty=easy&type=multiple";
let fetchData = async (data) => {
    let fetchQuiz = await fetch(data);
    let response = await fetchQuiz.json();
    return response.results;
};
let data = await fetchData(apiLink);
// console.log(data.results);
let startQuiz = async () => {
    let score = 0;
    let askName = await inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: chalk.grey.bold("Please enter your name:")
        }
    ]);
    for (let index = 1; index <= 5; index++) {
        let answers = [...data[index].incorrect_answers, data[index].correct_answer];
        let ans = await inquirer.prompt([
            {
                name: "quiz",
                type: "list",
                message: chalk.blue.bold(data[index].question),
                choices: answers.map((value) => value)
            }
        ]);
        if (ans.quiz == data[index].correct_answer) {
            ++score;
            console.log(`${chalk.green.bold("Correct Answer")}`);
        }
        else {
            console.log(`Correct answer is ${chalk.red.bold(data[index].correct_answer)}`);
        }
    }
    console.log(chalk.green.bold(`Dear ${chalk.green(askName.name)}, your score is ${chalk.green(score)} out of ${chalk.red("5")}`));
    // console.log(score);   
    let re = await inquirer.prompt([
        {
            name: "start",
            type: "list",
            choices: ["Yes", "No"],
            message: chalk.grey.bold("Would you like to give the Quiz again? Yes or No:")
        }
    ]);
    re.start == "Yes"
        ? startQuiz()
        : process.exit();
};
setTimeout(() => {
    startQuiz();
}, 1000);
