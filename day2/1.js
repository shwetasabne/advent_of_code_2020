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
    const [min, max] = range.split('-'); 
    output.push({
      character: character.replace(':', ''),
      password,
      min,
      max
    });
  }
  return output;
}

//processInput(path.resolve(__dirname, 'input', '1.txt')).then(data => console.log(JSON.stringify(data, null, 2)))

function checkValidPasswords(inputData) {
  const validPasswords = []
  for (let i=0; i < inputData.length; i++) {
    const { character, password, min, max } = inputData[i];
    const strArray = [...password];
    let characterCount = 0;
    for (let j=0; j < strArray.length; j++) {
      if (strArray[j] === character) {
        characterCount++;
      } else {
        
      }
    }
    if (characterCount >= min && characterCount <= max) {
      validPasswords.push(password);
    }
  }
  console.log(`Valid passwords ${validPasswords}`)
  return validPasswords.length;
}

async function main() {
  const input = await processInput(path.resolve(__dirname, 'input', '1.txt'));
  const output = checkValidPasswords(input);
  return output;
}

main().then(output => console.log(output))