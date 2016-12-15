#pragma strict

public class hq extends unit{

    public var workerPrefab : worker;

    public var playerManagerScript : playerManager;
    public var mapManagerScript : mapManager;

    public var buildingPhase : int;
    public var cooldown : int;
    
    function Start () {
        playerManagerScript = GameObject.Find("playerManager").GetComponent(playerManager);
        mapManagerScript = GameObject.Find("mapManager").GetComponent(mapManager);
        buildingPhase=0;
        cooldown=0;
        hp=100;
    }

    function Update () {
        if(hp<0){
            playerManagerScript.playerList[ownerID-1].unitList.Remove(this);
            playerManagerScript.playerList[ownerID-1].renewIDs();
            Destroy(this.gameObject);
        }
    }

    public function build(direction : Vector3){
        
        var targetValid : boolean = true;
        //if on cooldown (>0) cant build
        if(cooldown>0){
            targetValid=false;
            playerManagerScript.helpMessageText.text="Cooldown is "+cooldown+" turns";
            playerManagerScript.helpMessageStartTime=Time.realtimeSinceStartup;
        }

        //if not on floor cant build 
        if(mapManagerScript.onFloor(transform, direction)==false){
            targetValid=false;
            playerManagerScript.helpMessageText.text="Must build the hq on land";
            playerManagerScript.helpMessageStartTime=Time.realtimeSinceStartup;
        }

        //for every player
        for(p in playerManagerScript.playerList){
            //for his each unit
            for(unit in p.unitList){
                if(unit.ID==playerManagerScript.selectorID && unit.ownerID==playerManagerScript.selector.ownerID){
                    //that is not this unit
                }
                //check for collision
                else if(unit.transform.position==transform.position+direction){
                    targetValid=false;
                    playerManagerScript.helpMessageText.text="You cant build there";
                    playerManagerScript.helpMessageStartTime=Time.realtimeSinceStartup;
                }
            }
        }
    
        if(targetValid==true){
            playerManagerScript.playerList[ownerID-1].unitList.Add(Instantiate(workerPrefab,transform.position+direction,workerPrefab.transform.rotation));
            playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].ownerID=ownerID;
            playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].ID=playerManagerScript.playerList[ownerID-1].unitList.Count-1;
            buildingMode=false;
            cooldown=5;
            playerManagerScript.playerList[ownerID-1].resources-=50;
        }
        //add it to the buildingList of owner player unitsList
        //unitList.Add(Instantiate(workerPrefab,startingPosition.position,workerPrefab.transform.rotation));
    }

}