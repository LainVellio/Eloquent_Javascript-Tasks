// Задача "Тип вектора" из книги "Выразительный JavaScript"

/* Напишите класс с именем Group (поскольку имя Set уже занято).
Как и Set, он располагает методами add, delete и has.
Его конструктор создает пустую группу, add добавляет в нее значение
(но только если такого значения там еще нет), метод delete удаляет свой аргумент из группы
(если таковой там был), а has возвращает логическое значение, указывающее,
является ли его аргумент членом группы.
Присвойте классу статический метод from, который принимает в качестве
аргумента итерируемый объект и создает группу, содержащую все значения,
полученные посредством перебора. */

class Group {
  constructor() {
    this.members = [];
  }

  add(value) {
    if (!this.has(value)) {
      this.members.push(value);
    }
  }

  delete(value) {
    this.members = this.members.filter((m) => m !== value);
  }

  has(value) {
    return this.members.includes(value);
  }

  static from(object) {
    const group = new Group();
    // eslint-disable-next-line no-restricted-syntax
    for (const value of object) {
      group.add(value);
    }
    return group;
  }
}

const group = Group.from([10, 20]);
console.log(group.has(10)); // → true
console.log(group.has(30)); // → false
group.add(10);
group.delete(10);
console.log(group.has(10)); // → false
