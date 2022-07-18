const myPlayerNumber = scope.getMyPlayerNumber();

function sortArrayGroundDistance(Array,X,Y){

    if(!Array  || typeof Array != "Array") return;

    let ArrayCopy = Array.concat();

    ArrayCopy.sort((a,b) =>{
        let distanceA = scope.getGroundDistance(a.getX(),a.getY(),X,Y);
        let distanceB = scope.getGroundDistance(b.getX(),b.getY(),X,Y);

        return distanceA - distanceB;
    });

    return ArrayCopy;
}

function filterUnitsInRange(Array,X,Y,Range){

    if(!Array || typeof Array != "Array") return;

    let arrayCopy = Array.concat()
    let newArray = []
    let distance = 0

    arrayCopy.forEach((item) => {

        distance = scope.getGroundDistance(item.getX(),item.getY(),X,Y)

        if(distance > range) return;

        newArray.push(item);

        return;
    });

    let sortedNewArray = sortArrayGroundDistance(newArray,X,Y);
    return sortedNewArray;
}

function trainWorkers(){
    let castles = scope.getBuildings({type:"Castle",player:myPlayerNumber});
    let workers = scope.getUinits({type:"Worker",player:myPlayerNumber});
    let workerCost = workers[0].getFieldValue("Cost");
    let gold = scope.getGold();

    if(gold < workerCost || castles.length * 11 < workers.length) return;

    castles.forEach(castle => {

        if(!castle.getUnitTypeNameInProductionQueAt(1)){
            scope.order("Train Worker", [castle] , false);
        }

        gold = scope.getGold();

        if(gold < workerCost) return;
    });
}
 
function unIdleWorkers(){
    /*

    TOO LAZY DIDN'T FINISH

    let idleWorkers = scope.getUnits({type:"Worker", player:myPlayerNumber,order:"Stop"});
    let miningWorkers = scope.getUnits({type:"Worker",player:myPlayerNumber,order:"Mine"});
    let castles = scope.getBuildings({type:"Castle",player:myPlayerNumber});
    let mines = scope.getBuildings({type:"GoldMine"})
    let sortedCastles = [];

    idleWorkers.forEach((worker) =>{
        sortedCastles = sortArrayGroundDistance(castles,worker.getX,worker.getY);

        sortedCastles.forEach((sortedCastle) =>{
            let filteredminingWorkers = filterUnitsInRange(miningWorkers,sortedCastle.getX(),sortedCastle.getY())

            if (filteredminingWorkers.length > 12) return;

            scope.order
        })
    });

    */
}

function step(){
    trainWorkers();
    unIdleWorkers();
}

setInterval(step, 1000);