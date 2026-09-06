const fs = require('fs');
const path = require('path');

function readData(filename) {
  const filePath = path.join(__dirname, filename);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function writeData(filename, data) {
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function getNextId(data, field) {
  if (data.length === 0) return 1;
  return Math.max(...data.map(item => item[field])) + 1;
}

module.exports = { readData, writeData, getNextId };
