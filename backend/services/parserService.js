const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const Tesseract = require('tesseract.js');

const parsePDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

const parseDOCX = async (filePath) => {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
};

const parseXLSX = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  let text = '';
  sheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    text += xlsx.utils.sheet_to_txt(sheet) + '\n';
  });
  return text;
};

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(JSON.stringify(data)))
      .on('end', () => resolve(results.join('\n')))
      .on('error', (error) => reject(error));
  });
};

const parseImage = async (filePath) => {
  const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
  return text;
};

const parseJSON = (filePath) => {
  return fs.readFileSync(filePath, 'utf-8');
};

const parseTXT = (filePath) => {
  return fs.readFileSync(filePath, 'utf-8');
};

exports.extractText = async (filePath, mimetype) => {
  try {
    if (mimetype === 'application/pdf') {
      return await parsePDF(filePath);
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimetype === 'application/msword') {
      return await parseDOCX(filePath);
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || mimetype === 'application/vnd.ms-excel') {
      return parseXLSX(filePath);
    } else if (mimetype === 'text/csv') {
      return await parseCSV(filePath);
    } else if (mimetype.startsWith('image/')) {
      return await parseImage(filePath);
    } else if (mimetype === 'application/json') {
      return parseJSON(filePath);
    } else if (mimetype === 'text/plain') {
      return parseTXT(filePath);
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    throw new Error(`Failed to parse file: ${error.message}`);
  }
};
