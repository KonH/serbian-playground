import { readFileSync, appendFileSync } from 'fs';

const inputFile = 'src/assets/verbs.tmp';
const outputFile = 'src/assets/verbs.csv';

try {
  const data = readFileSync(inputFile, 'utf8');
  const lines = data.split('\n');
  let currentVerb = '';
  let output = '';
  for(const line in lines) {
    if (line.trim() === '') continue;
    if (!line.includes('\t')) {
      if (currentVerb !== '') {
        appendFileSync(outputFile, `${currentVerb}${output}\n`);
        output = '';
      }
      currentVerb = line.trim();
    } else {
      const [_, form] = line.split('\t').map((s: string) => s.trim());
      output += ',' + form;
    }
  }
  if (currentVerb !== '') {
    appendFileSync(outputFile, `${currentVerb}${output}\n`);
  }
  console.log('Verbs have been successfully converted and appended to verbs.csv');
} catch (err) {
  console.error('Error reading or appending to the file:', err);
}