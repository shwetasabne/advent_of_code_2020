const fs = require('fs');
const readline = require('readline');
const path = require('path');

function constructQuestionBank(line, questionBankObject = {}) {
  var temp = line.split('');
  for (let i =0; i < temp.length; i++) {
    if (questionBankObject[temp[i]]) {
      let val = questionBankObject[temp[i]];
      questionBankObject[temp[i]] = ++val
    } else {
      questionBankObject[temp[i]] = 1;
    }
  }
  return questionBankObject;
}

function countCommonYes(questionBank, personCount) {
  console.log(`questionBank is ${JSON.stringify(questionBank, null, 2)} and person is ${personCount}`)
  let count = 0;
  const keys = Object.keys(questionBank);
  for (let i =0; i < keys.length; i++) {
    const value = questionBank[keys[i]];
    if (value === personCount) {
      count++;
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

  let questionBank = {};
  let person = 0;
  let sum = 0;
  for await (const line of rl) {
    //console.log(`--- line is ${line}`)
    if (line === '') {
      console.log(`person ${person} questionBank is ${JSON.stringify(questionBank, null, 2)}`);
      sum = sum + countCommonYes(questionBank, person)
      questionBank = {};
      person = 0;
    } else {
      // implies keep constructing question bank
      questionBank = constructQuestionBank(line, questionBank);
      person++;
    }
  }
  sum = sum + countCommonYes(questionBank)
  return sum;
}

countSumOfYes(path.resolve(__dirname, 'input', '2.txt'))
  .then(data => console.log(data))