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
        unitList[0].hp=100;
        unitList[0].inputMode="move";
        unitList[0].tookAction=false;
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
            if(Input.GetKeyDown(KeyCode.Tab) && unitList.Count>1){
                playerManagerScript.selectorNext();
            }
            else if(Input.GetKeyDown(KeyCode.M)){
                playerManagerScript.selector.inputMode="move";
            }
            else if(Input.GetKeyDown(KeyCode.B)){
                playerManagerScript.selector.inputMode="build";
            }
            else if(Input.GetKeyDown(KeyCode.A) && (playerManagerScript.selector instanceof rocketLauncherMech)){
                playerManagerScript.selector.inputMode="attack";
            }
            else if(playerManagerScript.selector.inputMode=="move" && playerManagerScript.selector.tookAction==false && inputVector()!=Vector3(0,0,0)){
                playerManagerScript.selector.moveOrAttack(inputVector());
            }else if(playerManagerScript.selector.inputMode=="build" && playerManagerScript.selector.tookAction==false  && inputVector()!=Vector3(0,0,0)){
                playerManagerScript.selector.build(inputVector());
            }
            else if(playerManagerScript.selector.inputMode=="attack"){
                //not done here
            }
            //inputMode build
            /*if(playerManagerScript.selector.inputMode=="build"){
                if(Input.GetKeyDown(KeyCode.W)){
                    playerManagerScript.selector.build(Vector3(0,0,1));
                }
                else if(Input.GetKeyDown(KeyCode.S)){
                    playerManagerScript.selector.build(Vector3(0,0,-1));
                }
                else if(Input.GetKeyDown(KeyCode.A)){
                    playerManagerScript.selector.build(Vector3(-1,0,0));
                }
                else if(Input.GetKeyDown(KeyCode.D)){
                    playerManagerScript.selector.build(Vector3(1,0,0));
                }
                else if(Input.GetKeyDown(KeyCode.B)){
                    playerManagerScript.selector.inputMode="move";
                }
                else if(Input.GetKeyDown(KeyCode.Tab) && unitList.Count>1){
                    playerManagerScript.selectorNext();
                }
            }//inputMode move
            else if(playerManagerScript.selector.inputMode=="move"){
                if(Input.GetKeyDown(KeyCode.W) && playerManagerScript.selector.tookAction==false){
                    playerManagerScript.selector.moveOrAttack(Vector3(0,0,1));
                }
                else if(Input.GetKeyDown(KeyCode.S) && playerManagerScript.selector.tookAction==false){
                    playerManagerScript.selector.moveOrAttack(Vector3(0,0,-1));
                }
                else if(Input.GetKeyDown(KeyCode.A) && playerManagerScript.selector.tookAction==false){
                    playerManagerScript.selector.moveOrAttack(Vector3(-1,0,0));
                }
                else if(Input.GetKeyDown(KeyCode.D) && playerManagerScript.selector.tookAction==false){
                    playerManagerScript.selector.moveOrAttack(Vector3(1,0,0));
                }
                if(Input.GetKeyDown(KeyCode.B)){
                    if(resources>=50){
                        playerManagerScript.selector.inputMode="build";
                    }else{
                        GameObject.Find("helpMessage").GetComponent.<Text>().text="You need at least 50 resources to train a worker";
                        playerManagerScript.helpMessageStartTime=Time.realtimeSinceStartup;
                    }
                }
                else if(Input.GetKeyDown(KeyCode.Tab) && unitList.Count>1){
                    playerManagerScript.selectorNext();
                }
            }else if(playerManagerScript.selector.inputMode=="attack"){

            }*/
        }
    }

    public function inputVector(){
        if(Input.GetKeyDown(KeyCode.UpArrow)){
            return Vector3(0,0,1);
        }
        else if(Input.GetKeyDown(KeyCode.DownArrow)){
            return Vector3(0,0,-1);
        }
        else if(Input.GetKeyDown(KeyCode.LeftArrow)){
            return Vector3(-1,0,0);
        }
        else if(Input.GetKeyDown(KeyCode.RightArrow)){
            return Vector3(1,0,0);
        }else{
            return Vector3(0,0,0);
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