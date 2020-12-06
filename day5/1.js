const fs = require('fs');
const readline = require('readline');
const path = require('path');

function getMedian(low, high, tag) {
  const median = Math.floor((high + low) / 2);
  if (tag === 'F' || tag === 'L') {
    return median
  } else {
    return median + 1;
  }
}

function generateSeatId(line) {
  let i = 0;
  let rowLow = 0; let rowHigh = 127;
  let seatRow = '';
  while(line[i] === 'F' || line[i] === 'B') {
    seatRow = getMedian(rowLow, rowHigh, line[i])
    if (line[i] === 'F') {
      rowHigh = seatRow
    } else {
      rowLow = seatRow;
    }
    console.log(`for ${line[i]} rowLow = ${rowLow} rowHigh ${rowHigh}  seatRow ${seatRow}`)
    i++;
  }

  let colLow = 0; let colHigh = 7;
  let seatCol = '';
  for (let i=7; i < line.length; i++) {
    seatCol = getMedian(colLow, colHigh, line[i]);
    if (line[i] === 'L') {
      colHigh = seatCol
    } else {
      colLow = seatCol;
    }
    console.log(`for ${line[i]} colLow = ${colLow} colHigh ${colHigh}  seatCol ${seatCol}`)
  }
  console.log(`seatRow ${seatRow} seatCol ${seatCol}`)
  return seatRow * 8 + (seatCol);
}

async function fetchSeatIds(inputFilePath) {
  const fileStream = fs.createReadStream(inputFilePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let maxSeatId = 0;
  for await (const line of rl) {
    const currentSeatId = generateSeatId(line);
    if (currentSeatId > maxSeatId) {
      maxSeatId = currentSeatId;
    }
  }
  return maxSeatId;
}

fetchSeatIds(path.resolve(__dirname, 'input', '1.txt'))
  .then(data => console.log(data))