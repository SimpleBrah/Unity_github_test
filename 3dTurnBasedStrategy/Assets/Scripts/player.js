﻿#pragma strict

import System.Collections.Generic;


public class player extends MonoBehaviour{

    public var playerManagerScript : playerManager;
    //unit fields
    public var workerPrefab : worker;
    public var unitList : List.<unit> = new List.<unit>();
    //resource fields
    public var resources : int;
    public var energy : int;
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
        //calculate energy
        var currentEnergy : int = 20;
        for(u in unitList){
            if(u instanceof hq){
                currentEnergy+=30;
            }else if(u instanceof worker){
                currentEnergy-=10;
            }else if(u instanceof rocketLauncherMech){
                currentEnergy-=15;
            }
        }
        energy=currentEnergy;
        //if its my turn check for events
        if(playerManagerScript.subTurn==ID){
            if(Input.GetButtonDown("Next") && unitList.Count>1){
                playerManagerScript.selectorNext();
            }
            else if(Input.GetKeyDown(KeyCode.KeypadPlus)){
                GameObject.Find("Main Camera").transform.position.y-=1;
            }
            else if(Input.GetKeyDown(KeyCode.KeypadMinus)){
                GameObject.Find("Main Camera").transform.position.y+=1;
            }
            else if(Input.GetKeyDown(KeyCode.M)){
                playerManagerScript.selector.inputMode="move";
            }
            else if(Input.GetKeyDown(KeyCode.B)){
                playerManagerScript.selector.inputMode="build";
            }
            else if(Input.GetKeyDown(KeyCode.A)){
                playerManagerScript.selector.inputMode="attack";
            }
            else if(Input.GetKey(KeyCode.LeftControl)){
                if(inputVector()!=Vector3(0,0,0)){
                    GameObject.Find("Main Camera").transform.position+=inputVector();
                }
            }
            else if(playerManagerScript.selector.inputMode=="move" && playerManagerScript.selector.tookAction==false){
                if(inputVector()!=Vector3(0,0,0)){
                    playerManagerScript.selector.moveOrAttack(playerManagerScript.selector.transform.position+inputVector());
                }else if(Input.GetMouseButtonDown(1)){
                    var mTarget : GameObject = GameObject.Find("mouseManager").GetComponent(mouseManager).getRayCastHit();
                    if(mTarget.tag=="floor"){
                        Debug.Log("clicked on floor");
                        var temp : Vector3=playerManagerScript.selector.transform.position+Vector3(0,-1,0);
                        if(parseInt(Vector3.Distance(mTarget.transform.position,temp))==1){
                            Debug.Log("distance from "+mTarget.transform.position+" to "+temp+" is 1 when actualy it is"+Vector3.Distance(mTarget.transform.position,temp));
                            playerManagerScript.selector.moveOrAttack(mTarget.transform.position+Vector3(0,1,0));
                        }else{
                            Debug.Log("distance from "+mTarget.transform.position+" to "+temp+" is not 1 when actualy it is"+Vector3.Distance(mTarget.transform.position,temp));
                        }
                    }else{
                        Debug.Log("didnt click on floor");
                        //Debug.Log("target is a "+mTarget.tag+" and distance from "+mTarget.transform.position+" to "+playerManagerScript.selector.transform.position+Vector3(0,-1,0)+" is "+Vector3.Distance(mTarget.transform.position,playerManagerScript.selector.transform.position+Vector3(0,-1,0)));
                    }
                }
            }
            else if(playerManagerScript.selector.inputMode=="build" && playerManagerScript.selector.tookAction==false){
                if(inputVector()!=Vector3(0,0,0)){
                    playerManagerScript.selector.build(playerManagerScript.selector.transform.position+inputVector());
                }else if(Input.GetMouseButtonDown(0)){
                    var bTarget : GameObject = GameObject.Find("mouseManager").GetComponent(mouseManager).getRayCastHit();
                    if(bTarget.tag=="floor" && Vector3.Distance(bTarget.transform.position,playerManagerScript.selector.transform.position+Vector3(0,-1,0))==1){
                        playerManagerScript.selector.build(bTarget.transform.position+Vector3(0,1,0));
                    }
                }
            }
            else if(playerManagerScript.selector.inputMode=="attack"  && playerManagerScript.selector.tookAction==false){
                if(inputVector()!=Vector3(0,0,0)){
                    for(p in playerManagerScript.playerList){
                        for(u in p.unitList){
                            if(u.transform.position==playerManagerScript.selector.transform.position+inputVector()){
                                playerManagerScript.selector.moveOrAttack(playerManagerScript.selector.transform.position+inputVector());
                            }
                        }
                    }
                    playerManagerScript.selector.moveOrAttack(playerManagerScript.selector.transform.position+inputVector());
                }else if(Input.GetMouseButtonDown(1)){
                    var aTarget : GameObject = GameObject.Find("mouseManager").GetComponent(mouseManager).getRayCastHit();
                    if(aTarget.tag=="unit" && Vector3.Distance(aTarget.transform.position,playerManagerScript.selector.transform.position)==1){
                        playerManagerScript.selector.moveOrAttack(aTarget.transform.position);
                    }
                }
            }
        }
    }

    public function inputVector(){
        if(Input.GetButton("Vertical")){
            return Vector3(0,0,Input.GetAxisRaw("Vertical"));
        }else if(Input.GetButton("Horizontal")){
            return Vector3(Input.GetAxisRaw("Horizontal"),0,0);
        }else{
            return Vector3(0,0,0);
        }
        /*if(Input.GetKeyDown(KeyCode.UpArrow)){
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
        }*/
    }
    
    public function renewIDs(){
        var i=0;
        for(u in unitList){
            u.ID=i;
            i++;
        }
    }

}