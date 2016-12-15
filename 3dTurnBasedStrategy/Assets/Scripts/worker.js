#pragma strict

import UnityEngine.SceneManagement;

public class worker extends unit{

    public var playerManagerScript : playerManager;
    public var mapManagerScript : mapManager;
    
    public var hqPrefab : hq;
    public var tookAction : boolean;
    

    function Start () {
        playerManagerScript = GameObject.Find("playerManager").GetComponent(playerManager);
        mapManagerScript = GameObject.Find("mapManager").GetComponent(mapManager);
        //Debug.Log("worker starting");
        buildingMode=false;
        tookAction=false;
        hp=100;
    }

    function Update () {
        if(hp<0){
            playerManagerScript.playerList[ownerID-1].unitList.Remove(this);
            playerManagerScript.playerList[ownerID-1].renewIDs();
            Destroy(this.gameObject);
        }
    }

    public function moveOrAttack(direction : Vector3){
        //move
        transform.position+=direction;
        //if not on floor go back
        if(mapManagerScript.onFloor(transform,Vector3(0,0,0))==false){
            transform.position-=direction;
            playerManagerScript.helpMessageText.text="Cant move there";
            playerManagerScript.helpMessageStartTime=Time.realtimeSinceStartup;
        }else{
        
        //for every player
        for(p in playerManagerScript.playerList){
            //for his each unit
            for(unit in p.unitList){
                if(unit.ID==playerManagerScript.selectorID && unit.ownerID==playerManagerScript.selector.ownerID){
                    //that is not this unit
                }
                //check for collision
                else if(unit.transform.position==transform.position){
                    //move back
                    transform.position-=direction;
                    //if enemy attack
                    if(p.ID!=ownerID){
                        var dmg = Random.Range(20,50); 
                        unit.hp-=dmg;
                        playerManagerScript.helpMessageText.text="Hit for "+dmg;
                        playerManagerScript.helpMessageStartTime=Time.realtimeSinceStartup;
                    }
                }
            }
        }

        //for every power up
        for(pu in GameObject.Find("mapManager").GetComponent(mapManager).powerUpList){
            if(pu.transform.position==transform.position){
                GameObject.Find("playerManager").GetComponent(playerManager).playerList[ownerID-1].resources+=50;
                Destroy(pu);
                GameObject.Find("mapManager").GetComponent(mapManager).powerUpList.Remove(pu);
            }
        }

        //if over ramp go again and down
        for(ramp in mapManagerScript.rampPosition){
            if(transform.position==ramp.transform.position+Vector3(0,1,0)){
                transform.position+=direction;
                transform.position+=Vector3(0,-1,0);
            }
            if(transform.position==ramp.transform.position){
                transform.position+=direction;
                transform.position+=Vector3(0,1,0);
            }
        }
  
        tookAction=true;

        }

    }

    public function build(direction : Vector3){
        
        var targetValid : boolean = true;
        
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
                }
            }
        }
        if(targetValid){
            playerManagerScript.playerList[ownerID-1].unitList.Add(Instantiate(hqPrefab,transform.position+direction,hqPrefab.transform.rotation));
            playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].ownerID=ownerID;
            playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].ID=playerManagerScript.playerList[ownerID-1].unitList.Count-1;
            buildingMode=false;
            tookAction=true;
            playerManagerScript.playerList[ownerID-1].resources-=400;
        }
        //add it to the buildingList of owner player unitsList
        //unitList.Add(Instantiate(workerPrefab,startingPosition.position,workerPrefab.transform.rotation));
    }

}