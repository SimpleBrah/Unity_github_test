#pragma strict

import System.Collections.Generic;


public class player extends MonoBehaviour{

    public var playerManagerScript : playerManager;
    //unit fields
    public var workerPrefab : worker;
    public var unitList : List.<unit> = new List.<unit>();
    //resource fields
    public var resources : int;
    //id field
    public var ID : int;    //IN LISTS THIS IS -1
    
    public var startingPosition : Transform;    //this is not used?
    
    function Start() {
        playerManagerScript = GameObject.Find("playerManager").GetComponent(playerManager);
        //setup starting units
        unitList.Add(Instantiate(workerPrefab,startingPosition.position,workerPrefab.transform.rotation));
        unitList[0].ownerID=ID;
        unitList[0].ID=0;
        //setup selector
        if(ID==1){
            playerManagerScript.selector=unitList[0];
            playerManagerScript.selectorID=0;
            //playerManagerScript.helpMsgText.text="Selected "+selector+"hp="+selector.hp;
        }

    }

    function Update () {
        //if its my turn check for events
        if(playerManagerScript.subTurn==ID){
            if(playerManagerScript.selector instanceof hq)
                buildingEvent(playerManagerScript.selector as hq);
            else if(playerManagerScript.selector instanceof worker)
                workerEvent(playerManagerScript.selector as worker);
        }
    }

    function buildingEvent(unit : hq){
        if(unit.buildingMode==true){
            //Build the worker in given direction
            if(Input.GetKeyDown(KeyCode.W)){
                unit.build(Vector3(0,0,1));
            }
            else if(Input.GetKeyDown(KeyCode.S)){
                unit.build(Vector3(0,0,-1));
            }
            else if(Input.GetKeyDown(KeyCode.A)){
                unit.build(Vector3(-1,0,0));
            }
            else if(Input.GetKeyDown(KeyCode.D)){
                unit.build(Vector3(1,0,0));
            }
            //Exit build mode
            else if(Input.GetKeyDown(KeyCode.B)){
                unit.buildingMode=false;
            }
            //select next unit
            else if(Input.GetKeyDown(KeyCode.Tab) && unitList.Count>1){
                playerManagerScript.selectorNext();
            }
        }//the selected unit is in movement mode
        else{
            //Open up building mode
            if(Input.GetKeyDown(KeyCode.B)){
                if(resources>=50){
                    unit.buildingMode=true;
                }else{
                    playerManagerScript.helpMessageText.text="You need at least 50 resources to train a worker";
                    playerManagerScript.helpMessageStartTime=Time.realtimeSinceStartup;
                }
            }
            //select the next unit
            else if(Input.GetKeyDown(KeyCode.Tab) && unitList.Count>1){
                playerManagerScript.selectorNext();
            }
        }
       
    }

    function workerEvent(unit : worker){
        if(unit.buildingMode==true){
        //Build the c.c. in given direction
            if(Input.GetKeyDown(KeyCode.W)){
                unit.build(Vector3(0,0,1));
            }
            else if(Input.GetKeyDown(KeyCode.S)){
                unit.build(Vector3(0,0,-1));
            }
            else if(Input.GetKeyDown(KeyCode.A)){
                unit.build(Vector3(-1,0,0));
            }
            else if(Input.GetKeyDown(KeyCode.D)){
                unit.build(Vector3(1,0,0));
            }
            //Exit build mode
            else if(Input.GetKeyDown(KeyCode.B)){
                unit.buildingMode=false;
            }
            else if(Input.GetKeyDown(KeyCode.Tab) && unitList.Count>1){
                playerManagerScript.selectorNext();
            }
            }//else the selected unit is in movement mode
        else{
            //Move in the given direction if we didnt take an action
            if(Input.GetKeyDown(KeyCode.W) && unit.tookAction==false){
                unit.moveOrAttack(Vector3(0,0,1));
            }
            else if(Input.GetKeyDown(KeyCode.S) && unit.tookAction==false){
                unit.moveOrAttack(Vector3(0,0,-1));
            }
            else if(Input.GetKeyDown(KeyCode.A) && unit.tookAction==false){
                unit.moveOrAttack(Vector3(-1,0,0));
            }
            else if(Input.GetKeyDown(KeyCode.D) && unit.tookAction==false){
                unit.moveOrAttack(Vector3(1,0,0));
            }
            //Open up building mode
            else if(Input.GetKeyDown(KeyCode.B)){
                if(resources>=400){
                    if(unit.tookAction==false){
                        unit.buildingMode=true;
                    }else{
                        playerManagerScript.helpMessageText.text="This unit took an action this turn already";
                        playerManagerScript.helpMessageStartTime=Time.realtimeSinceStartup;
                    }
                }else{
                    playerManagerScript.helpMessageText.text="You need at least 400 resources to build a hq";
                    playerManagerScript.helpMessageStartTime=Time.realtimeSinceStartup;
                }
            }
            //select next unit
            else if(Input.GetKeyDown(KeyCode.Tab) && unitList.Count>1){
                playerManagerScript.selectorNext();
            }
        }
    }

        public function renewIDs(){
            var i=0;
            for(u in unitList){
                u.ID=i;
                i++;
            }
        }

}