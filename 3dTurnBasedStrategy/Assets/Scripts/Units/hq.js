﻿#pragma strict

public class hq extends unit{

    public var workerPrefab : worker;
    public var rocketLauncherPrefab : rocketLauncherMech;
    public var playerManagerScript : playerManager;
    public var mapManagerScript : mapManager;
    public var hpSlider : GameObject;
    public var cdSlider : GameObject;
    
    function Start () {
        playerManagerScript = GameObject.Find("playerManager").GetComponent(playerManager);
        mapManagerScript = GameObject.Find("mapManager").GetComponent(mapManager);
    }

    function Update () {
        if(hp<1){
            this.die();
        }
        //for every power up
        for(pu in GameObject.Find("mapManager").GetComponent(mapManager).powerUpList){
            if(pu.transform.position==transform.position){
                if(pu.tag=="resource_power_up"){
                    GameObject.Find("playerManager").GetComponent(playerManager).playerList[ownerID-1].resources+=50;
                    Destroy(pu);
                    GameObject.Find("mapManager").GetComponent(mapManager).powerUpList.Remove(pu);
                }else if(pu.tag=="rocket_launcher_power_up"){
                    mode="rocketLauncher";
                    //change the mode to rocket launcher hq
                }
            }
        }
        //display hp & cd
        hpSlider.GetComponent(Slider).value=hp;
        cdSlider.GetComponent(Slider).value=cooldown;
    }

    public function build(direction : Vector3){
        
        var targetValid : boolean = true;
        //if on cooldown (>0) cant build
        if(cooldown>0){
            targetValid=false;
            GameObject.Find("helpMessage").GetComponent.<Text>().text="Cooldown is "+cooldown+" turns";
            playerManagerScript.helpMessageStartTime=Time.realtimeSinceStartup;
        }

        //if not on floor cant build 
        if(mapManagerScript.onFloor(transform, direction)==false){
            targetValid=false;
            GameObject.Find("helpMessage").GetComponent.<Text>().text="Must build the hq on land";
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
                    GameObject.Find("helpMessage").GetComponent.<Text>().text="You cant build there";
                    playerManagerScript.helpMessageStartTime=Time.realtimeSinceStartup;
                }
            }
        }
    
        if(targetValid==true){
            if(mode=="worker"){
                playerManagerScript.playerList[ownerID-1].unitList.Add(Instantiate(workerPrefab,transform.position+direction,workerPrefab.transform.rotation));
                playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].ownerID=ownerID;
                playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].ID=playerManagerScript.playerList[ownerID-1].unitList.Count-1;
                playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].buildingMode=false;
                playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].tookAction=false;
                playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].hp=100;
                buildingMode=false;
                cooldown=5;
                playerManagerScript.playerList[ownerID-1].resources-=50;
            }else if(mode=="rocketLauncher"){
                playerManagerScript.playerList[ownerID-1].unitList.Add(Instantiate(rocketLauncherPrefab,transform.position+direction,rocketLauncherPrefab.transform.rotation));
                playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].ownerID=ownerID;
                playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].ID=playerManagerScript.playerList[ownerID-1].unitList.Count-1;
                playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].buildingMode=false;
                playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].tookAction=false;
                playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].hp=100;
                buildingMode=false;
                cooldown=5;
                playerManagerScript.playerList[ownerID-1].resources-=100;
            }
        }
        //add it to the buildingList of owner player unitsList
        //unitList.Add(Instantiate(workerPrefab,startingPosition.position,workerPrefab.transform.rotation));
    }

}