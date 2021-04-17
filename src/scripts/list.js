// Задача "Список" из книги "Выразительный JavaScript"

const inputArray = [1, 2, 3];

/* Список - это иерархический набор объектов, где первый объект содержит ссылку на
второй, второй - на третий и т. д. Данная функция возвращает такой список из переданного массива */
function arrayToList(arr, i = 0) {
  if (arr[i] === undefined) return null;
  return {
    value: arr[i],
    rest: arrayToList(arr, i + 1),
  };
}
const inputList = arrayToList(inputArray);
console.log(inputList);

// Функция возвращает массив созданный из списка
function listToArray(list) {
  const arr = [];
  for (let obj = list; obj; obj = obj.rest) {
    arr.push(obj.value);
  }
  return arr;
}
console.log(listToArray(inputList));

/*  Функция принимает элемент и список и возвращает новый список,
в котором заданный элемент добавлен в начало исходного списка */
function prepend(value, list) {
  return { value, rest: list };
}
console.log(prepend(0, inputList));

// Функция возвращает элемент из списка по заданному номеру
function nth(list, num) {
  if (list.rest === null) return undefined;
  if (num === 0) return list.value;
  return nth(list.rest, num - 1);
}
console.log(nth(inputList, 2));
