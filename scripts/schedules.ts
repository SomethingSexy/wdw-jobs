import commandLineArgs from 'command-line-args';
import locationSchedules from '../src/locationSchedules';

const optionDefinitions = [
  {
    defaultValue: ['activities', 'locations'],
    multiple: true,
    name: 'type',
    type: String,
  }
];

const options = commandLineArgs(optionDefinitions);
if (options.type.includes('locations')) {
  locationSchedules(4).then(() => process.exit);
}
