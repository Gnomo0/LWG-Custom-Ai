const myPlayerNumber = scope.getMyPlayerNumber();

function getOwnedUnits() { }

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

function manageCastles() {
      let castles = scope.getBuildings({type: "Castle", player: myPlayerNumber});

      if (!castles[0]) return;

      castles.forEach((castle) => {
            if (isProducing(castle)) return;

            let gold = getGold();
            if(gold < 50) return;

            scope.order("Train Worker",[castle])
      });
}

function run(){
      try{
            manageCastles();
      } catch(e){
            console.error(e)
      }
}