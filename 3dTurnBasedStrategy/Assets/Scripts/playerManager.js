#pragma strict
import System.Collections.Generic;
import UnityEngine.UI;

public class playerManager extends MonoBehaviour{

    //player fields
    public var playerPrefab : player;
    public var numberOfPlayers : int;
    public var playerList : List.<player> = new List.<player>();
    public var playerMaterials= new Material[2];
    //UI fields
    public var resourcesText = new Text[2];
    public var subTurnText : Text;
    public var selectedMessageText : Text;
    public var helpMessageText : Text;
    public var helpMessageStartTime : float;
    public var helpMessageDisplayTime : float;
    public var TimeText : Text;
    //turn fields
    public var turn : int;
    public var subTurn : int;
    //selector fields
    public var selector : unit;
    public var selectorID : int;
    var selectorRange = new String[4];  //not used

    function Start () {

        helpMessageDisplayTime=2;

        for(var i=0;i<4;i++){
            selectorRange[i]="Empty";   //not used
        }

        //player setup
        numberOfPlayers=2;
        for(i=0;i<numberOfPlayers;i++){
            playerList.Add(Instantiate(playerPrefab));
            playerList[i].ID=i+1;
            playerList[i].startingPosition=GameObject.Find("mapManager").GetComponent(mapManager).startingPosition[i].transform;
            playerList[i].resources=350;
            resourcesText[i].text="Resource: "+playerList[i].resources;
        }
        //turn setup
        turn=1;
        subTurn=1;
        subTurnText.text="Turn: "+subTurn;

    }

    function Update () {

        if((helpMessageStartTime+helpMessageDisplayTime)<Time.realtimeSinceStartup){
            helpMessageText.text="";
        }
        //UI update
        resourcesText[subTurn-1].text="Resource: "+playerList[subTurn-1].resources;
        subTurnText.text="Turn: "+subTurn;
        //Material update (this should not be in update?)
        var objects = GameObject.FindGameObjectsWithTag("colored_parts");
        for (var obj : GameObject in objects) {
            if(obj.transform.parent.gameObject.GetComponent(worker)!=null){
                obj.GetComponent.<Renderer>().material=playerMaterials[obj.transform.parent.gameObject.GetComponent(worker).ownerID-1];
            }
            if(obj.transform.parent.gameObject.GetComponent(hq)!=null){
                obj.GetComponent.<Renderer>().material=playerMaterials[obj.transform.parent.gameObject.GetComponent(hq).ownerID-1];
            }
        }
        //winCondition update
        for(p in playerList){
            if(p.unitList.Count==0){
                SceneManager.LoadScene (SceneManager.GetActiveScene ().name);
            }
        }

    }

    function onEndTurn(){
        //turn update
        subTurn++;
        if(subTurn>numberOfPlayers){
            subTurn=1;
            turn++;
        }
        //selector update
        selector=playerList[subTurn-1].unitList[0];
        selectorID=0;
        //display selected unit and hp
        if(selector instanceof hq){
            selectedMessageText.text="Selected "+selector+"hp="+selector.hp+" cd="+(selector as hq).cooldown;
        }else{
            selectedMessageText.text="Selected "+selector+"hp="+selector.hp;
        }
        //reset all unit action flags
        for(unit in playerList[subTurn-1].unitList){
            if(unit instanceof worker){
                (unit as worker).buildingMode=false;
                (unit as worker).tookAction=false;
            }else if(unit instanceof hq){
                (unit as hq).cooldown-=1;
                if((unit as hq).buildingPhase<3){
                    (unit as hq).buildingPhase++;
                }
            }
            for(transformR in GameObject.Find("mapManager").GetComponent(mapManager).resourcePosition)
                if(unit.transform.position==transformR.transform.position){
                    playerList[subTurn-1].resources+=50;
                }
        }
        
        GameObject.Find("mapManager").GetComponent(mapManager).spawnPowerUps();

    }

    function selectorNext(){
        selector.buildingMode=false;
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
            selectedMessageText.text="Selected "+selector+"hp="+selector.hp+" cd="+(selector as hq).cooldown;
        }else{
            selectedMessageText.text="Selected "+selector+"hp="+selector.hp;
        }
    }

}