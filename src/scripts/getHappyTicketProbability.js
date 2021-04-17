// Вероятность вытащить счастливый билет

import readlineSync from 'readline-sync';

const isHappyTicket = (num) => {
  let firstHalf = Number(num[0]);
  let secondHalf = Number(num[num.length / 2]);

  for (let i = 1; i < num.length / 2; i += 1) {
    firstHalf += Number(num[i]);
    secondHalf += Number(num[i + num.length / 2]);
  }

  if (firstHalf === secondHalf) {
    return true;
  }
  return false;
};

const getHappyTicketProbability = (countNum) => {
  if (countNum % 2 > 0) {
    return 'Нечетное количество цифр в билете';
  }
  let currentTicketNum = '';
  let counter = 0;

  for (let i = 0; i < 10 ** countNum; i += 1) {
    currentTicketNum = '0'.repeat(countNum - String(i).length) + String(i);
    if (isHappyTicket(currentTicketNum)) counter += 1;
  }
  const result = (counter / 10 ** countNum) * 100;
  return `Вероятность вытащить счастливый билет равна ${result}%`;
};

const launch = () => {
  const countNum = readlineSync.question('Введите количество цифр в билете ');
  const result = getHappyTicketProbability(Number(countNum));
  return console.log(result);
};

launch();
