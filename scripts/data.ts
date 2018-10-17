import commandLineArgs from 'command-line-args';
import data from '../src/data';

const optionDefinitions = [
  {
    defaultValue: ['activities', 'dining', 'parks', 'resorts', 'shops'],
    multiple: true,
    name: 'type',
    type: String,
  }
];

const options = commandLineArgs(optionDefinitions);
// by default include all
let dataOptions;
// let them filter
if (options.type.includes('parks')) {
  dataOptions = { parks: true, dining: false, activities: false, resorts: false };
}
if (options.type.includes('resorts')) {
  dataOptions = { parks: false, dining: false, activities: false, resorts: true };
}
if (options.type.includes('activities')) {
  dataOptions = { locations: false, dining: false, activities: true, resorts: false };
}
if (options.type.includes('dining')) {
  dataOptions = { locations: false, dining: true, activities: false, resorts: false };
}
if (options.type.includes('shops')) {
  dataOptions = { locations: false, dining: false, activities: false, shops: true, resorts: false };
}
data(dataOptions).then(() => process.exit);
