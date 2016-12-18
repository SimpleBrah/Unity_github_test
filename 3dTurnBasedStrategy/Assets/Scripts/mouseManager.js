﻿#pragma strict

public class mouseManager extends MonoBehaviour{
    
    function Start () {

    }

    function Update () {
        //ray origin camera, end mouse position
        var ray : Ray = Camera.main.ScreenPointToRay( Input.mousePosition );

        var hitInfo : RaycastHit;

        if(Input.GetMouseButtonDown(0)){
            //if ray hit anything
            if(Physics.Raycast(ray, hitInfo)){
                //gameObject that is hit
                var hitObject : GameObject = hitInfo.transform.root.gameObject;

                if(hitObject.GetComponent(worker)){
                    if(hitObject.GetComponent(worker).ownerID==GameObject.Find("playerManager").GetComponent(playerManager).subTurn){
                        GameObject.Find("selector").GetComponent(selector).setSelectedUnit(hitObject);
                    }else{
                        if(GameObject.Find("playerManager").GetComponent(playerManager).selector instanceof rocketLauncherMech && GameObject.Find("playerManager").GetComponent(playerManager).selector.inputMode=="attack" && GameObject.Find("playerManager").GetComponent(playerManager).selector.tookAction==false){
                            GameObject.Find("playerManager").GetComponent(playerManager).selector.attack(hitObject);
                        }else{
                            GameObject.Find("helpMessage").GetComponent.<Text>().text=hitObject.name;
                            GameObject.Find("playerManager").GetComponent(playerManager).helpMessageStartTime=Time.realtimeSinceStartup;
                        }
                    }
                }else if(hitObject.GetComponent(hq)){
                    if(hitObject.GetComponent(hq).ownerID==GameObject.Find("playerManager").GetComponent(playerManager).subTurn){
                        GameObject.Find("selector").GetComponent(selector).setSelectedUnit(hitObject);
                    }else{
                        if(GameObject.Find("playerManager").GetComponent(playerManager).selector instanceof rocketLauncherMech){
                            GameObject.Find("playerManager").GetComponent(playerManager).selector.attack(hitObject);
                        }else{
                            GameObject.Find("helpMessage").GetComponent.<Text>().text=hitObject.name;
                            GameObject.Find("playerManager").GetComponent(playerManager).helpMessageStartTime=Time.realtimeSinceStartup;
                        }
                    }
                }else if(hitObject.GetComponent(rocketLauncherMech)){
                    if(hitObject.GetComponent(rocketLauncherMech).ownerID==GameObject.Find("playerManager").GetComponent(playerManager).subTurn){
                        GameObject.Find("selector").GetComponent(selector).setSelectedUnit(hitObject);
                    }else{
                        if(GameObject.Find("playerManager").GetComponent(playerManager).selector instanceof rocketLauncherMech){
                            GameObject.Find("playerManager").GetComponent(playerManager).selector.attack(hitObject);
                        }else{
                            GameObject.Find("helpMessage").GetComponent.<Text>().text=hitObject.name;
                            GameObject.Find("playerManager").GetComponent(playerManager).helpMessageStartTime=Time.realtimeSinceStartup;
                        }
                    }
                }
            }
        }
    }

}