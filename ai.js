const myPlayerNumber = scope.getMyPlayerNumber();

const settings = {
      "maxWorkerToCastleRatio": 10,
      "minGoldForWorkerProduction": 50,
      "maxWorkersOnMine": 6,
}

function isProducing(unit) {
      if (unit.getUnitTypeNameInProductionQueAt(1)) {
            return true;
      } else {
            return false;
      }
}

function getGold() {
      return scope.getGold();
}

function trainWorker(castle) {
      if (isProducing(castle)) return;

      let castles = scope.getBuildings({ type: "Castle", player: myPlayerNumber });
      let workers = scope.getUnits({ type: "Worker", player: myPlayerNumber });
      if (workers.length / castles.length >= settings.maxWorkerToCastleRatio) return;

      let gold = getGold();
      if (gold < settings.minGoldForWorkerProduction) return;

      scope.order("Train Worker", [castle])
}

function manageCastles() {
      let castles = scope.getBuildings({ type: "Castle", player: myPlayerNumber });

      if (!castles[0]) return;

      castles.forEach((castle) => {
            trainWorker(castle);
      });
}

function getOrderedListOfMinesByDistanceFromUnit(unit) {
      let mines = scope.getBuildings({ type: "Goldmine" });
      if (!mines[0]) return;

      let newMines = mines.sort(function (a, b) {
            let distanceA = Math.pow(a.getX() - unit.getX(), 2) + Math.pow(a.getY() - unit.getY(), 2);
            let distanceB = Math.pow(b.getX() - unit.getX(), 2) + Math.pow(b.getY() - unit.getY(), 2);

            return distanceA - distanceB;
      });

      return newMines;
}

function workNearestUnsaturatedMine(workerToStartWorking) {
      
      let orderedMines = getOrderedListOfMinesByDistanceFromUnit(workerToStartWorking);

      scope.order("Mine", [workerToStartWorking], {unit: orderedMines[0]});
}

function manageWorkers() {
      let workers = scope.getUnits({ type: "Worker", player: myPlayerNumber });

      if (!workers[0]) return;

      workers.forEach(worker => {
            workNearestUnsaturatedMine(worker)
      });
}

function run() {
      try {
            manageCastles();
            manageWorkers();
      } catch (e) {
            console.log(e)
      }
}

run();