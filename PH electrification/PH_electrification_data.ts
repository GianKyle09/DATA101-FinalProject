
import * as XLSX from 'xlsx';
import * as fs from 'fs';

interface DataRow {
  [key: string]: any;
}

function convertXlsxToTs(inputFilePath: string, outputFilePath: string, variableName: string = 'data') {
  try {
    // Read the XLSX file
    const workbook = XLSX.readFile(inputFilePath);

    // Assume the first sheet is the data sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert the worksheet to an array of JSON objects
    const jsonData: DataRow[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (!jsonData || jsonData.length === 0) {
      console.warn('Warning: No data found in the XLSX file.');
      fs.writeFileSync(outputFilePath, `export const ${variableName}: any[] = [];\n`);
      return;
    }

    // Extract headers (first row)
    const headers = jsonData[0] as string[];

    // Convert the rest of the rows to an array of objects
    const dataObjects: DataRow[] = jsonData.slice(1).map(row => {
      const rowData: DataRow = {};
      (row as any[]).forEach((cell, index) => {
        if (headers[index] !== undefined) {
          rowData[headers[index]] = cell;
        }
      });
      return rowData;
    });

    // Convert the array of objects to a TypeScript string
    const tsString = `export const ${variableName}: any[] = ${JSON.stringify(dataObjects, null, 2)};\n`;

    // Write the TypeScript string to the output file
    fs.writeFileSync(outputFilePath, tsString);

    console.log(`Successfully converted "${inputFilePath}" to "${outputFilePath}" with variable name "${variableName}".`);

  } catch (error: any) {
    console.error('Error converting XLSX to TS:', error.message);
  }
}

// Example usage:
const inputXlsxFile = 'RegionElecrateYearCode.xlsx'; // Replace with your input XLSX file path
const outputTsFile = 'regionElectrificationData.ts'; // Replace with your desired output TS file path
const tsVariableName = 'regionData'; // Replace with your desired TypeScript variable name

convertXlsxToTs(inputXlsxFile, outputTsFile, tsVariableName);
