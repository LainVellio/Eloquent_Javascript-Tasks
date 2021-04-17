/* Задача "Робот" из книги "Выразительный JavaScript"
Робот разносит посылки по графу домов.
Разработаны разные алгоритмы поиска путей по графу, 
а так же тестируется и сравнивается их эффективность*/
/* eslint-disable max-classes-per-file */

const roads = [
  'Дом Алисы-Дом Боба',
  'Дом Алисы-Почта',
  'Дом Дарии-Дом Эрни',
  'Дом Эрни-Дом Греты',
  'Дом Греты-Магазин',
  'Рынок-Почта',
  'Рынок-Ратуша',
  'Дом Алисы-Склад',
  'Дом Боба-Ратуша',
  'Дом Дарии-Ратуша',
  'Дом Греты-Ферма',
  'Рынок-Ферма',
  'Рынок-Магазин',
  'Магазин-Ратуша',
];

function buildGraph(edges) {
  const graph = Object.create(null);

  function addEdge(from, to) {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }

  for (const [from, to] of edges.map((r) => r.split('-'))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);
console.log('Граф переходов: ', roadGraph);

class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    }
    const parcels = this.parcels
      .map((p) => {
        if (p.place !== this.place) return p;
        return { place: destination, address: p.address };
      })
      .filter((p) => p.place !== p.address);
    return new VillageState(destination, parcels);
  }
}

function runRobot(state, robot, memory) {
  console.log('Начинает из ', state.place);
  for (let turn = 0; ; turn += 1) {
    if (state.parcels.length === 0) {
      return console.log(`Выполнено за ${turn} ходов`);
    }
    const action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(turn + 1, `переход в ${action.direction}`);
  }
}

function randomPick(array) {
  const choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

/* function randomRobot(state) {
  return { direction: randomPick(roadGraph[state.place]) };
} */

VillageState.random = (parcelCount = 3) => {
  const parcels = [];
  for (let i = 0; i < parcelCount; i += 1) {
    const address = randomPick(Object.keys(roadGraph));
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place === address);
    parcels.push({ place, address });
  }
  // console.log('Список посылок: ', parcels);
  return new VillageState('Почта', parcels);
};

VillageState.static = function () {
  const parcels = [
    { place: 'Ратуша', address: 'Рынок' },
    { place: 'Рынок', address: 'Дом Греты' },
  ];
  return new VillageState('Почта', parcels);
};

// runRobot(VillageState.random(), randomRobot);

const mailRoute = [
  'Дом Алисы',
  'Склад',
  'Дом Алисы',
  'Дом Боба',
  'Ратуша',
  'Дом Дарии',
  'Дом Эрни',
  'Дом Греты',
  'Магазин',
  'Дом Греты',
  'Ферма',
  'Рынок',
  'Почта',
];

function routeRobot(state, memory = mailRoute) {
  if (memory.length === 0) {
    memory = mailRoute;
  }
  return { direction: memory[0], memory: memory.slice(1) };
}

// runRobot(VillageState.random(), routeRobot);

function findRoute(graph, from, to) {
  const work = [{ at: from, route: [] }];
  for (let i = 0; i < work.length; i += 1) {
    const { at, route } = work[i];
    for (const place of graph[at]) {
      if (place === to) return route.concat(place);
      if (!work.some((w) => w.at === place)) {
        work.push({ at: place, route: route.concat(place) });
      }
    }
  }
}

function goalOrientedRobot({ place, parcels }, route = []) {
  if (route.length === 0) {
    const parcel = parcels[0];

    if (parcel.place !== place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return { direction: route[0], memory: route.slice(1) };
}

function indexClosestDestination({ place, parcels }) {
  const lengthRoutes = [];

  for (let i = 0; i < parcels.length; i += 1) {
    const parcel = parcels[i];
    lengthRoutes.push(
      findRoute(roadGraph, place, parcel.place).length +
        findRoute(roadGraph, parcel.place, parcel.address).length,
    );
  }
  const minValue = Math.min(...lengthRoutes);
  return lengthRoutes.findIndex((element) => minValue === element);
}

function robotEfficiency({ place, parcels }, route = []) {
  if (route.length === 0) {
    const parcel = parcels[indexClosestDestination({ place, parcels })];

    if (parcel.place !== place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return { direction: route[0], memory: route.slice(1) };
}

function robotVeryEfficiency({ place, parcels }, route = []) {
  if (route.length === 0) {
    const directions = [];

    for (const parcel of parcels) {
      const direction = parcel.place === place ? parcel.address : parcel.place;
      route = findRoute(roadGraph, place, direction);
      const distance = route.length;
      const cohesion = roadGraph[direction].length;
      directions.push({
        direction,
        route,
        distance,
        cohesion,
      });
    }

    const minDistance = Math.min(...directions.map((e) => e.distance));
    let bestDirection = directions.filter((e) => minDistance === e.distance);

    if (bestDirection.length > 1) {
      const minCohesion = Math.min(...bestDirection.map((e) => e.cohesion));
      bestDirection = bestDirection.filter((e) => minCohesion === e.cohesion);
    }
    route = bestDirection[0].route;
  }

  return { direction: route[0], memory: route.slice(1) };
}

function minPath(place, route, parcels) {
  let minRoute = [];
  parcels = parcels
    .map((p) => {
      if (p.place !== place) return p;
      return { place: 'robot', address: p.address };
    })
    .filter((p) => !(place === p.address && p.place === 'robot'));
  function path(place, route, parcels) {
    let directions = [];
    directions = Array.from(
      new Set(
        parcels.map((p) => {
          if (p.place === place || p.place === 'robot') {
            return p.address;
          }
          return p.place;
        }),
      ),
    );
    for (const direction of directions) {
      const routeTurn = findRoute(roadGraph, place, direction);
      const parcelsBegin = parcels;
      for (const turn of routeTurn) {
        parcels = parcels
          .map((p) => {
            if (p.place !== turn) return p;
            return { place: 'robot', address: p.address };
          })
          .filter((p) => !(turn === p.address && p.place === 'robot'));
      }
      const routeBegin = route;
      route = route.concat(routeTurn);
      if (minRoute.length === 0 || route.length < minRoute.length) {
        if (parcels.length === 0) {
          minRoute = route;
        } else path(direction, route, parcels);
      }
      route = routeBegin;
      parcels = parcelsBegin;
    }
  }
  path(place, route, parcels);
  return minRoute;
}

function mostEfficientRobot({ place, parcels }, route = []) {
  if (route.length === 0) {
    route = minPath(place, [], parcels);
  }
  return { direction: route[0], memory: route.slice(1) };
}

function lazyRobot({ place, parcels }, route = []) {
  // This determines the precedence a route gets when choosing.
  // Route length counts negatively, routes that pick up a package
  // get a small bonus.
  function score({ route, pickUp }) {
    return (pickUp ? 0.5 : 0) - route.length;
  }

  if (route.length === 0) {
    // Describe a route for every parcel
    const routes = parcels.map((parcel) => {
      if (parcel.place !== place) {
        return {
          route: findRoute(roadGraph, place, parcel.place),
          pickUp: true,
        };
      }
      return {
        route: findRoute(roadGraph, place, parcel.address),
        pickUp: false,
      };
    });
    route = routes.reduce((a, b) => (score(a) > score(b) ? a : b)).route;
  }

  return { direction: route[0], memory: route.slice(1) };
}

const state = VillageState.random(5);

// const state = VillageState.static();

console.log(state);

/* console.log('Рандомный робот');
runRobot(state, randomRobot);
console.log('------------------------------------------------');

console.log('Робот с постоянным маршрутом');
runRobot(state, routeRobot);
console.log('------------------------------------------------');

console.log('Робот с поиском пути по списку посылок');
runRobot(state, goalOrientedRobot);
console.log('------------------------------------------------');

console.log('Робот с эффективным поиском');
runRobot(state, robotEfficiency);
console.log('------------------------------------------------');

console.log('Робот с очень эффективным поиском');
runRobot(state, robotVeryEfficiency);
console.log('------------------------------------------------');

console.log('Робот с самым эффективным поиском');
runRobot(state, mostEfficientRobot);
console.log('------------------------------------------------'); */

console.log('Робот из решения книги');
runRobot(state, lazyRobot);
console.log('------------------------------------------------');

function countTurnTask(state, robot, memory) {
  for (let turn = 0; ; turn += 1) {
    if (state.parcels.length === 0) return turn;
    const action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
  }
}

function compareRobots(
  robotOne,
  memoryRobotOne,
  robotTwo,
  memoryRobotTwo,
  taskCount = 100,
) {
  let turnCountRobotOne = 0;
  let turnCountRobotTwo = 0;
  for (let i = 0; i < taskCount; i += 1) {
    const state = VillageState.random(5);
    turnCountRobotOne += countTurnTask(state, robotOne, memoryRobotOne);
    turnCountRobotTwo += countTurnTask(state, robotTwo, memoryRobotTwo);
  }
  console.log(`Количество задач - ${taskCount}`);
  const averangeTurnRobotOne = turnCountRobotOne / taskCount;
  const averangeTurnRobotTwo = turnCountRobotTwo / taskCount;
  console.log('Среднее количество ходов');
  console.log('Первого робота: ', averangeTurnRobotOne);
  console.log('Второго робота: ', averangeTurnRobotTwo);
  if (averangeTurnRobotOne > averangeTurnRobotTwo) {
    console.log(`Второй робот быстрее первого на 
    ${100 - (averangeTurnRobotTwo / averangeTurnRobotOne) * 100} %`);
  } else {
    console.log(`Первый робот быстрее второго на 
    ${100 - (averangeTurnRobotOne / averangeTurnRobotTwo) * 100} %`);
  }
}

compareRobots(routeRobot, [], goalOrientedRobot, [], 3000);
compareRobots(goalOrientedRobot, [], robotEfficiency, [], 3000);
compareRobots(robotEfficiency, [], robotVeryEfficiency, [], 3000);
compareRobots(robotVeryEfficiency, [], mostEfficientRobot, [], 3000);
compareRobots(lazyRobot, [], mostEfficientRobot, [], 3000);
