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

  let occupiedSeats = new Array(1024);
  for (let i = 0 ; i < occupiedSeats.length; i++) {
    occupiedSeats[i] = false;
  }
  for await (const line of rl) {
    const currentSeatId = generateSeatId(line);
    if (currentSeatId === 642) {
      console.log(`--------- current seat id ${currentSeatId}`)
    }
    occupiedSeats[currentSeatId] = true;
  }
  
  let seatId = -1;
  for (let i = 0; i < occupiedSeats.length; i++) {
    //console.log(`i ${i} ${occupiedSeats[i-1]} ${occupiedSeats[i]} ${occupiedSeats[i+1]}`)
    if (occupiedSeats[i] === false && occupiedSeats[i-1] === true && occupiedSeats[i+1] === true) {
      seatId = i;
      break;
    }
  }
  console.log(`Seat Id is ${seatId}`)
  console.log(occupiedSeats[567] + ' '+ occupiedSeats[119] + ' '+ occupiedSeats[820] + ' ')
  return occupiedSeats;
}

fetchSeatIds(path.resolve(__dirname, 'input', '1.txt'))
  .then(data => console.log(`${data}`))