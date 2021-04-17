// Задача "Тип вектора" из книги "Выразительный JavaScript"

/* Напишите класс Vec, который представляет вектор в двумерном пространстве.
Вектор принимает параметры х и у (числа) и сохраняет их в свойствах с тем же именем.
Напишите для прототипа Vec два метода, plus и minus, которые принимают в качестве параметра
другой вектор и возвращают новый вектор,
представляющий собой сумму или разность значений х и у для двух векторов.
Добавьте в прототип свойство-геттер length, которое вычисляет длину вектора
- расстояние от точки (х, у) до начала координат (О, О). */

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plus(inputVector) {
    return new Vec(this.x + inputVector.x, this.y + inputVector.y);
  }

  minus(inputVector) {
    return new Vec(this.x - inputVector.x, this.y - inputVector.y);
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}

console.log(new Vec(1, 2).plus(new Vec(2, 3))); // → Vec{x: 3, y: 5}
console.log(new Vec(1, 2).minus(new Vec(2, 3))); // → Vec{x: -1, y: -1}
console.log(new Vec(3, 4).length); // → 5
