/* eslint-disable linebreak-style */
function getDate(string) {
  const [_, month, day, year] = /(\d{1,2})-(\d{1,2})-(\d{4})/.exec(string);
  return new Date(year, month - 1, day);
}
console.log(getDate('1-30-2003'));

console.log(new Date());

console.log(/кoт/.test('aнтpeкoт'));
console.log(/\bкот\b/.test('sdf кот'));

const animalCount = /\b\d+ (pig|cow|chicken)s?\b/;
console.log(animalCount.test('15 pigs'));
console.log(animalCount.test('the 3 pigs'));

console.log('papa'.replace('p', 'm'));
