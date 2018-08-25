import commandLineArgs from 'command-line-args';
import data from '../src/data';

const optionDefinitions = [
  {
    defaultValue: ['activities', 'dining', 'locations'],
    multiple: true,
    name: 'type',
    type: String,
  }
];

const options = commandLineArgs(optionDefinitions);
// by default include all
let dataOptions;
// let them filter
if (options.type.includes('locations')) {
  dataOptions = { locations: true, dining: false, activities: false };
}
if (options.type.includes('activities')) {
  dataOptions = { locations: false, dining: false, activities: true };
}
if (options.type.includes('dining')) {
  dataOptions = { locations: false, dining: true, activities: false };
}

data(dataOptions).then(() => process.exit);
