const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function processInput(inputFilePath) {
  const fileStream = fs.createReadStream(inputFilePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const output = [];
  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    const [range, character, password] = line.split(' ');
    const [pIndex, qIndex] = range.split('-'); 
    output.push({
      character: character.replace(':', ''),
      password,
      pIndex,
      qIndex
    });
  }
  return output;
}

function checkValidPasswords(inputData) {
  const validPasswords = []
  for (let i=0; i < inputData.length; i++) {
    const { character, password, pIndex, qIndex } = inputData[i];
    const arrayPIndex = pIndex - 1;
    const arrayQIndex = qIndex - 1;
    const strArray = [...password];
    if (strArray[arrayPIndex] === character && strArray[arrayQIndex] === character) {
      console.log(`${character} is present in both ${strArray[arrayPIndex]} and ${strArray[arrayQIndex]} hence invalid`)
      // character is present in both places; hence invalid
    } else if (strArray[arrayPIndex] === character && strArray[arrayQIndex] !== character) {
      // charachter is present only 1 place hence valid
      console.log(`${character} is present in ${strArray[arrayPIndex]} and not ${strArray[arrayQIndex]} hence valid`)
      validPasswords.push(password)
    } else if (strArray[arrayPIndex] !== character && strArray[arrayQIndex] === character) {
      console.log(`${character} is not present in ${strArray[arrayPIndex]} and in ${strArray[arrayQIndex]} hence valid`)
      // charachter is present only 1 place hence valid
      validPasswords.push(password)
    } else {
      console.log(`${character} is not present in ${strArray[arrayPIndex]} and not in ${strArray[arrayQIndex]} hence invvalid`)
      // character is not present at all hence invalid
    }
  }

  console.log(`Valid passwords ${validPasswords}`)
  return validPasswords.length;
}

async function main() {
  const input = await processInput(path.resolve(__dirname, 'input', '2.txt'));
  const output = checkValidPasswords(input);
  return output;
}

main().then(output => console.log(output))