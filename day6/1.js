const fs = require('fs');
const readline = require('readline');
const path = require('path');

function constructQuestionBack(line, questionBank) {
  const temp = line.split('');
  const output = temp.concat(questionBank);
  return output;
}

function countYesInOneBack(questionBank) {
  let map = new Map();
  let count = 0;
  for (let i =0; i < questionBank.length; i++) {
    if (!map.has(questionBank[i])) {
      count++;
      map.set(questionBank[i], 1);
    }
  }
  return count;
}

async function countSumOfYes(inputFilePath) {
  const fileStream = fs.createReadStream(inputFilePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let questionBank = [];
  let sum = 0;
  for await (const line of rl) {
    //console.log(`--- line is ${line}`)
    if (line === '') {
      //console.log(`questionBank is ${questionBank}`)
      // implies a new group count their stuff
      const newSum = countYesInOneBack(questionBank);
      sum = sum + newSum
      console.log(`For ${questionBank} sum is ${newSum}`)
      questionBank = [];
    } else {
      // implies keep constructing question bank
      questionBank = constructQuestionBack(line, questionBank);
      //console.log(`constructed qb is ${questionBank}`)
    }
  }
  return sum = sum + countYesInOneBack(questionBank);
}

countSumOfYes(path.resolve(__dirname, 'input', '1.txt'))
  .then(data => console.log(data))