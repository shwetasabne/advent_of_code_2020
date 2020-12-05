const fs = require('fs');
const readline = require('readline');
const path = require('path');

function createPassport(line, passport) {
  const kvs = line.trim().split(' ');
  const keys = [];
  for (let i = 0; i < kvs.length; i++) {
    keys.push(kvs[i].split(':')[0])
  }
  return keys.concat(passport);
}

function validatePassport(passport) {
  const requiredKeys = ['byr',
  'iyr',
  'eyr',
  'hgt',
  'hcl',
  'ecl',
  'pid'];

  if (passport.includes('byr') &&
  passport.includes('iyr') &&
  passport.includes('eyr') &&
  passport.includes('hgt') &&
  passport.includes('hcl') &&
  passport.includes('ecl') &&
  passport.includes('pid')) {
    return 1;
  } else {
    return 0;
  }

}

async function countValidPassports(inputFilePath) {
  const fileStream = fs.createReadStream(inputFilePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let validPassports = 0;
  let totalPassports = 0;
  let tempPassport = [];
  for await (const line of rl) {
    if (line === '') {
      console.log(`----- and tempPassport keys are ${tempPassport}`)
      validPassports += validatePassport(tempPassport);
      tempPassport = [];
      totalPassports++;
    } else {
      console.log(`line is ${line} and tempPassport is ${tempPassport}`)
      tempPassport = createPassport(line, tempPassport);
    }
  }
  validPassports += validatePassport(tempPassport);
  console.log(`Total passports ${totalPassports}`)
  return validPassports;
}

countValidPassports(path.resolve(__dirname, 'input', '1.txt'))
  .then(data => console.log(data))