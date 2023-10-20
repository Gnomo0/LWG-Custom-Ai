const myPlayerNumber = scope.getMyPlayerNumber();

function getOwnedBuildings(building) {
  return scope.getBuidlings({ type: building, player: myPlayerNumber });
}

function getOwnedUnits(){}

function isProducing(unit) {
  if (unit.getUnitTypeNameInProductionQueAt(1)) {
    return true;
  } else {
    return false;
  }
}

function manageCastles() {
  let castles = scope.getBuildings("Castle");

  if (!castles[0]) return;

  castles.forEach((castle) => {
    if (isProducing(castle)) return;

    let 
  });
}
