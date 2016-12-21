#pragma strict
import System.Collections.Generic;
import UnityEngine.UI;

public class playerManager extends MonoBehaviour{

    //player fields
    public var playerPrefab : player;
    public var numberOfPlayers : int;
    public var playerList : List.<player> = new List.<player>();
    //public var playerMaterials= new Material[2];
    //UI fields
    //public var resourcesText = new Text[2];
    //public var subTurnText : Text;
    //public var selectedMessageText : Text;
    //public var helpMessageText : Text;
    //MOVE TO A POPUP MESSAGE SCRIPT SOMEWHERE
    public var helpMessageStartTime : float;
    public var helpMessageDisplayTime : float;
    public var TimeText : Text;
    public var startOfTurnTime : float;
    //MOVE TO A POPUP MESSAGE SCRIPT SOMEWHERE
    //turn fields
    public var turn : int;
    public var subTurn : int;
    //selector fields
    //MOVE TO SELECTOR
    public var selector : unit;
    public var selectorID : int;
    var selectorRange = new String[4];  //not used
    //MOVE TO SELECTOR

    function Start () {
        startOfTurnTime=0;
        //MOVE TO A POPUP MESSAGE SCRIPT SOMEWHERE
        helpMessageDisplayTime=2;
        //MOVE TO A POPUP MESSAGE SCRIPT SOMEWHERE
        //MOVE TO SELECTOR
        for(var i=0;i<4;i++){
            selectorRange[i]="Empty";   //not used
        }
        //MOVE TO SELECTOR
        //player setup
        numberOfPlayers=2;
        for(i=0;i<numberOfPlayers;i++){
            playerList.Add(Instantiate(playerPrefab));
            playerList[i].ID=i+1;
            playerList[i].startingPosition=GameObject.Find("mapManager").GetComponent(mapManager).startingPosition[i].transform;
            playerList[i].resources=350;
            GameObject.Find("HUD/RawImage/player"+(i+1)+"Resources").GetComponent.<Text>().text=""+playerList[i].resources;//resourcesText[i].text="Resource: "+playerList[i].resources;
        }
        //turn setup
        turn=1;
        subTurn=1;
        GameObject.Find("HUD/subTurn").GetComponent.<Text>().text="Turn: "+subTurn;

    }

    function Update () {
        GameObject.Find("Timer").GetComponent.<Slider>().value=Time.realtimeSinceStartup-startOfTurnTime;
        if(GameObject.Find("Timer").GetComponent.<Slider>().value>=60){
            onEndTurn();
        }
        //MOVE TO A POPUP MESSAGE SCRIPT SOMEWHERE
        if((helpMessageStartTime+helpMessageDisplayTime)<Time.realtimeSinceStartup){
            GameObject.Find("helpMessage").GetComponent.<Text>().text="";
        }
        //MOVE TO A POPUP MESSAGE SCRIPT SOMEWHERE
        //UI update
        GameObject.Find("HUD/RawImage/player"+subTurn+"Resources").GetComponent.<Text>().text=""+playerList[subTurn-1].resources;
        GameObject.Find("HUD/subTurn").GetComponent.<Text>().text="Turn: "+subTurn;
        //Material update (this should not be in update?)
        var objects = GameObject.FindGameObjectsWithTag("colored_parts");
        for (var obj : GameObject in objects) {
            if(obj.transform.parent.gameObject.GetComponent(worker)!=null){
                var Wmaterial : String = "player"+obj.transform.parent.gameObject.GetComponent(worker).ownerID;
                obj.GetComponent.<Renderer>().material=Resources.Load(Wmaterial, typeof(Material));//playerMaterials[obj.transform.parent.gameObject.GetComponent(worker).ownerID-1];
            }
            if(obj.transform.parent.gameObject.GetComponent(hq)!=null){
                var HQmaterial : String = "player"+obj.transform.parent.gameObject.GetComponent(hq).ownerID;
                obj.GetComponent.<Renderer>().material=Resources.Load(HQmaterial, typeof(Material));//playerMaterials[obj.transform.parent.gameObject.GetComponent(hq).ownerID-1];
            }
            if(obj.transform.parent.gameObject.GetComponent(rocketLauncherMech)!=null){
                var RLmaterial : String = "player"+obj.transform.parent.gameObject.GetComponent(rocketLauncherMech).ownerID;
                obj.GetComponent.<Renderer>().material=Resources.Load(RLmaterial, typeof(Material));//playerMaterials[obj.transform.parent.gameObject.GetComponent(hq).ownerID-1];
            }
        }
        //winCondition update
        for(p in playerList){
            if(p.unitList.Count==0){
                SceneManager.LoadScene (SceneManager.GetActiveScene ().name);
            }
        }
            //display selected unit and hp
            if(selector instanceof hq){
                GameObject.Find("selectedMessage").GetComponent.<Text>().text="Selected "+selector+"hp="+selector.hp+" cd="+(selector as hq).cooldown;
            }else{
                GameObject.Find("selectedMessage").GetComponent.<Text>().text="Selected "+selector+"hp="+selector.hp;
            }

    }

    function onEndTurn(){
        startOfTurnTime=Time.realtimeSinceStartup;
        //turn update
        subTurn++;
        if(subTurn>numberOfPlayers){
            subTurn=1;
            turn++;
        }
        //selector update
        selector=playerList[subTurn-1].unitList[0];
        selectorID=0;
        
        //reset all unit action flags
        for(unit in playerList[subTurn-1].unitList){
            if(unit instanceof worker){
                (unit as worker).inputMode="move";
                (unit as worker).tookAction=false;
            }else if(unit instanceof hq){
                (unit as hq).cooldown-=1;
            }else if(unit instanceof rocketLauncherMech){
                (unit as rocketLauncherMech).inputMode="move";
                (unit as rocketLauncherMech).tookAction=false;
            }
            for(transformR in GameObject.FindGameObjectsWithTag("resource"))
                if(unit.transform.position==transformR.transform.position){
                    playerList[subTurn-1].resources+=50;
                }
        }
        
        GameObject.Find("mapManager").GetComponent(mapManager).spawnPowerUps();

    }

    function onMoveButton(){
        GameObject.Find("playerManager").GetComponent(playerManager).selector.inputMode="move";
    }

    function onBuildButton(){
        GameObject.Find("playerManager").GetComponent(playerManager).selector.inputMode="build";
    }

    function onAttackButton(){
        if(GameObject.Find("playerManager").GetComponent(playerManager).selector instanceof rocketLauncherMech){
            GameObject.Find("playerManager").GetComponent(playerManager).selector.inputMode="attack";
        }
    }

    //MOVE TO SELECTOR
    function selectorNext(){
        selector.inputMode="move";
        //select the next id
        if(selectorID<playerList[selector.ownerID-1].unitList.Count-1){
            selector=playerList[selector.ownerID-1].unitList[selectorID+1];
            selectorID++;
        }else{
            selector=playerList[selector.ownerID-1].unitList[0];
            selectorID=0;
        }
        //display selected unit and hp
        if(selector instanceof hq){
            GameObject.Find("selectedMessage").GetComponent.<Text>().text="Selected "+selector+"hp="+selector.hp+" cd="+(selector as hq).cooldown;
        }else if(selector instanceof worker){
            GameObject.Find("selectedMessage").GetComponent.<Text>().text="Selected "+selector+"hp="+selector.hp;
        }else{
            GameObject.Find("selectedMessage").GetComponent.<Text>().text="Selected "+selector+"hp="+selector.hp;
        }
    }
    //MOVE TO SELECTOR
}