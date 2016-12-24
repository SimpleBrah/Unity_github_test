#pragma strict

import UnityEngine.SceneManagement;

public class worker extends unit{

    public var playerManagerScript : playerManager;
    public var mapManagerScript : mapManager;
    public var hqPrefab : hq;
    public var rocketLauncherPrefab : rocketLauncherMech;
    public var hpSlider : GameObject;
    

    function Start () {
        playerManagerScript = GameObject.Find("playerManager").GetComponent(playerManager);
        mapManagerScript = GameObject.Find("mapManager").GetComponent(mapManager);
        //Debug.Log("worker starting");
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
                        GameObject.Find("playerManager").GetComponent(playerManager).playerList[ownerID-1].unitList.Remove(this);
                        GameObject.Find("playerManager").GetComponent(playerManager).playerList[ownerID-1].unitList.Insert(ID,Instantiate(rocketLauncherPrefab,transform.position,rocketLauncherPrefab.transform.rotation));
                        //GameObject.Find("playerManager").GetComponent(playerManager).playerList[ownerID-1].unitList[ID]=Instantiate(rocketLauncherPrefab,transform.position,rocketLauncherPrefab.transform.rotation);
                        GameObject.Find("playerManager").GetComponent(playerManager).selector=GameObject.Find("playerManager").GetComponent(playerManager).playerList[ownerID-1].unitList[ID];
                        GameObject.Find("playerManager").GetComponent(playerManager).playerList[ownerID-1].unitList[ID].ownerID=ownerID;
                        GameObject.Find("playerManager").GetComponent(playerManager).playerList[ownerID-1].unitList[ID].ID=ID;
                        GameObject.Find("playerManager").GetComponent(playerManager).playerList[ownerID-1].unitList[ID].inputMode="move";
                        GameObject.Find("playerManager").GetComponent(playerManager).playerList[ownerID-1].unitList[ID].tookAction=false;
                        GameObject.Find("playerManager").GetComponent(playerManager).playerList[ownerID-1].unitList[ID].hp=100;
                        Destroy(gameObject);
                        Destroy(pu);
                        GameObject.Find("mapManager").GetComponent(mapManager).powerUpList.Remove(pu);
                    }            
                }
            }
            //display hp
            hpSlider.GetComponent(Slider).value=hp;
    }

    public function moveOrAttack(target : Vector3){
        var move : boolean = true;
        //move
        //transform.position+=direction;
        //if not on floor go back
        if(Vector3.Distance(transform.position,target)==1 && mapManagerScript.onFloor(target)==false){
            //transform.position-=direction;
            Debug.Log("cant move there");
            GameObject.Find("helpMessage").GetComponent.<Text>().text="Cant move there";
            playerManagerScript.helpMessageStartTime=Time.realtimeSinceStartup;
        }else{
            Debug.Log("distance on floor");
        
        //for every player
        for(p in playerManagerScript.playerList){
            //for his each unit
            for(unit in p.unitList){
                if(unit.ID==playerManagerScript.selectorID && unit.ownerID==playerManagerScript.selector.ownerID){
                    //that is not this unit
                }
                //check for collision
                else if(unit.transform.position==target){
                    //move back
                    //transform.position-=direction;
                    //if enemy attack
                    if(p.ID!=ownerID){
                        move=false;
                        unit.takeDamage();
                    }else{
                        move=false;
                        unit.healDamage();
                    }
                }
            }
        }
        for(w in GameObject.FindGameObjectsWithTag("wire_fence")){
            if(w.GetComponent(fence).inCollision(target)){
                move=false;
            }
        }

        //if over ramp go again and down
        /*for(ramp in mapManagerScript.rampPosition){
            if(transform.position==ramp.transform.position+Vector3(0,1,0)){
                transform.position+=direction;
                transform.position+=Vector3(0,-1,0);
            }
            if(transform.position==ramp.transform.position){
                transform.position+=direction;
                transform.position+=Vector3(0,1,0);
            }
        }*/
        if(move){
            transform.position=target;
            tookAction=true;
        } 
        

        }

    }

    public function build(target : Vector3){
        
        var targetValid : boolean = true;
        
        //if not on floor cant build 
        if(mapManagerScript.onFloor(target)==false){
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
                else if(unit.transform.position==target){
                    targetValid=false;
                    GameObject.Find("helpMessage").GetComponent.<Text>().text="You cant build there";
                    playerManagerScript.helpMessageStartTime=Time.realtimeSinceStartup;
                }
            }
        }
        if(targetValid && playerManagerScript.playerList[ownerID-1].resources>=400){
            playerManagerScript.playerList[ownerID-1].unitList.Add(Instantiate(hqPrefab,target,hqPrefab.transform.rotation));
            playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].ownerID=ownerID;
            playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].ID=playerManagerScript.playerList[ownerID-1].unitList.Count-1;
            playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].cooldown=0;
            playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].hp=100;
            (playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1] as hq).mode="worker";
            playerManagerScript.playerList[ownerID-1].unitList[playerManagerScript.playerList[ownerID-1].unitList.Count-1].inputMode="move";
            tookAction=true;
            playerManagerScript.playerList[ownerID-1].resources-=400;
        }
        //add it to the buildingList of owner player unitsList
        //unitList.Add(Instantiate(workerPrefab,startingPosition.position,workerPrefab.transform.rotation));
    }

    public function attack(target : unit){
        if(Vector3.Distance(target.transform.position,transform.position)==1){
            target.takeDamage();
            tookAction=true;
        }
    }

}