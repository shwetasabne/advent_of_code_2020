const fs = require('fs');
const readline = require('readline');
const path = require('path');

function constructQuestionBank(line, personNumber, questionBankObject = {}) {
  var temp = line.split('');
  questionBankObject[personNumber] = temp;
  return questionBankObject;
}

function countCommonYes(questionBank) {
  const keys = Object.keys(questionBank);
  const tempMap = new Map();
  for (let i=0; i < keys.length; i++) {
    const value = questionBank[keys[i]];
    for (let j=0; j < value.length; j++) {
      if (tempMap.has(value[j])) {
        const currCount = tempMap.get(value[j]);
        tempMap.set(value[j], currCount+1);
      } else {
        tempMap.set(value[j], 1);
      }
    }
  }

  let commonYesCount = 0;
  tempMap.forEach((value, key, map) => {
    if (value === keys.length) {
      commonYesCount++;
    }
  });
  console.log(`for ${JSON.stringify(questionBank, null, 2)} commonYesCount ${commonYesCount}`)
  return commonYesCount;
}

async function countSumOfYes(inputFilePath) {
  const fileStream = fs.createReadStream(inputFilePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let questionBank = {};
  let person = 1;
  let sum = 0;
  for await (const line of rl) {
    //console.log(`--- line is ${line}`)
    if (line === '') {
      //console.log(`questionBank is ${JSON.stringify(questionBank, null, 2)}`);
      sum = sum + countCommonYes(questionBank)
      questionBank = {};
      person = 1;
    } else {
      // implies keep constructing question bank
      questionBank = constructQuestionBank(line, person, questionBank);
      person++;
    }
  }
  sum = sum + countCommonYes(questionBank)
  return sum;
}

countSumOfYes(path.resolve(__dirname, 'input', '2.txt'))
  .then(data => console.log(data))