const myPlayerNumber = scope.getMyPlayerNumber();

const settings = {
      "maxWorkerToCastleRatio": 10,
      "minGoldForWorkerProduction": 50,
      "maxWorkersOnMine": 6,
      "mapwidth": scope.getMapWidth(),
      "mapHeight": scope.getMapHeight(),
}

var globals = {
      workers: {},
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

      scope.order("Mine", [workerToStartWorking], { unit: orderedMines[0] });
}

function handleWorkersByOrder() {
      if (globals.workers.Stop) {
            globals.workers.Stop.forEach(StopWorker => {
                  workNearestUnsaturatedMine(StopWorker);
            });
      }
}

function manageWorkers() {
      let workers = scope.getUnits({ type: "Worker", player: myPlayerNumber });

      if (!workers[0]) return;

      workers.forEach(worker => {
            let currentOrder = worker.getCurrentOrderName()

            if (!globals.workers[currentOrder]) {
                  globals.workers[currentOrder] = [];
            }
            globals.workers[currentOrder].push(worker)
      });

      handleWorkersByOrder()
}

function findBuildableSpot(width, centerOffsetX, centerOffsetY) {
      let coords = {
            x: 0,
            y: 0,
      }

      return coords;
}

function getOrderedListOfUnitsByDistanceFromCoords(units, coords) {
      let orderedUnits = units.sort(function(a,b){
            let distanceA = Math.pow(a.getX() - coords.x,2) + Math.pow(a.getY() - coords.y,2)
            let distanceB = Math.pow(b.getX() - coords.x,2) + Math.pow(b.getY() - coords.y,2)

            return distanceA - distanceB;
      });

      return orderedUnits;
}

function build() {

      if (!globals.workers.Mine) return;

      let supply = {
            "Current": scope.getCurrentSupply(),
            "Max": scope.getMaxSupply(),
            "Remaining": supply.Max - supply.Current,
      };

      let castles = scope.getBuildings({ type: "Castle", player: myPlayerNumber });

      let productionCapability = castles.length * 2;


      //Build House

      if (supply.Remaining - productionCapability <= 0) {
            let coords = findBuildableSpot(3, 1, 1);
            let builder = getOrderedListOfUnitsByDistanceFromCoords(globals.workers.Mine, coords)[0]

            scope.order("Build House",[builder],{x:coords.x,y:coords.y})
      }

}

function run() {
      try {
            manageCastles();
            manageWorkers();
            build()
            console.log(globals);
      } catch (e) {
            console.log(e)
      }
}

run();