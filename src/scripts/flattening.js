// Задача "Свертка" из книги "Выразительный JavaScript"

/* Функции сворачивает массив, состоящий из нескольких массивов,
в один массив, у которого есть все элементы входных массивов */

const array = [
  [1, 2, 3],
  [4, 5, 6],
  ['A', 'B', 'C'],
];

function flattening(arrayInput) {
  const reducer = (arrayAcc, arrayCurrent) => arrayAcc.concat(arrayCurrent);
  return arrayInput.reduce(reducer);
}

console.log(flattening(array));
