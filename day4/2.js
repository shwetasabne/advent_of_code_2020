const fs = require('fs');
const readline = require('readline');
const path = require('path');

function createPassport(line, passport) {
  const kvs = line.trim().split(' ');
  console.log(kvs)
  let keyValues = {};
  for (let i=0; i < kvs.length; i++) {
    const temp = kvs[i].split(':');
    keyValues[temp[0]] = temp[1]
  }
  console.log(`keyValues ${JSON.stringify(keyValues)}`)
  return Object.assign({}, passport, keyValues);
}

function validatePassport(passport) {
  const isByrValid = 
    (passport?.byr && passport.byr <= 2002 && passport.byr >= 1920) ? true : false;
  
  const isIyrValid = 
    (passport?.iyr && passport.iyr <= 2020 && passport.iyr >= 2010) ? true : false;

  const isEyrValid = 
    (passport?.eyr && passport.eyr <= 2030 && passport.eyr >= 2020) ? true : false;

  const height = passport?.hgt ? passport.hgt : '';
  let isHgtValid = false;
  if (height.includes('cm')) {
    const tempH = height.replace('cm', '');
    isHgtValid = (tempH <= 193 && tempH >= 150) ? true : false;
  } else {
    const tempH = height.replace('in', '');
    isHgtValid = (tempH <= 76 && tempH >= 59) ? true : false;
  }
   
  const isHclValid = 
    (passport?.hcl && passport.hcl.length === 7 && /^#[a-z0-9]/.test(passport.hcl)) ? true : false;

  const isEclValid = 
    ( passport?.ecl && ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(passport.ecl) ) ?
      true : false;
  
  const isPidValid = 
    (passport?.pid && passport.pid.length === 9 && /[0-9]{9}/.test(passport.pid)) ?
      true : false;
  
  if (isByrValid && isIyrValid && isEyrValid && isHgtValid && isHclValid && isEclValid && isPidValid) {
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
  let tempPassport = {};
  for await (const line of rl) {
    if (line === '') {
      console.log(`----- and tempPassport keys are ${JSON.stringify(tempPassport)}`)
      validPassports += validatePassport(tempPassport);
      tempPassport = {};
      totalPassports++;
    } else {
      console.log(`line is ${line} and tempPassport is ${JSON.stringify(tempPassport)}`)
      tempPassport = createPassport(line, tempPassport);
    }
  }
  validPassports += validatePassport(tempPassport);
  console.log(`Total passports ${totalPassports}`)
  return validPassports;
}

countValidPassports(path.resolve(__dirname, 'input', '2.txt'))
  .then(data => console.log(data))