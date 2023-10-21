const myPlayerNumber = scope.getMyPlayerNumber();

function isProducing(unit) {
      if (unit.getUnitTypeNameInProductionQueAt(1)) {
            return true;
      } else {
            return false;
      }
}

function trainWorker(castle) {
      if (isProducing(castle)) return;

      let gold = getGold();
      if (gold < 50) return;

      scope.order("Train Worker", [castle])
}

function getGold() {
      return scope.getGold();
}

function manageCastles() {
      let castles = scope.getBuildings({ type: "Castle", player: myPlayerNumber });
      console.log(castles)

      if (!castles[0]) return;

      castles.forEach((castle) => {
            trainWorker(castle);
      });
}

function run() {
      try {
            manageCastles();
      } catch (e) {
            console.error(e)
      }
}

run();