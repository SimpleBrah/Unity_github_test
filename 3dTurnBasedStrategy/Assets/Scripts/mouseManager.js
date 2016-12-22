#pragma strict

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
                        if(GameObject.Find("playerManager").GetComponent(playerManager).selector.inputMode=="attack" && GameObject.Find("playerManager").GetComponent(playerManager).selector.tookAction==false){
                            GameObject.Find("playerManager").GetComponent(playerManager).selector.attack(hitObject.GetComponent(worker) as unit);
                            Debug.Log("attack called");
                        }else{
                            GameObject.Find("helpMessage").GetComponent.<Text>().text=hitObject.name+" hp:"+hitObject.GetComponent(worker).hp;
                            GameObject.Find("playerManager").GetComponent(playerManager).helpMessageStartTime=Time.realtimeSinceStartup;
                        }
                    }
                }else if(hitObject.GetComponent(hq)){
                    if(hitObject.GetComponent(hq).ownerID==GameObject.Find("playerManager").GetComponent(playerManager).subTurn){
                        GameObject.Find("selector").GetComponent(selector).setSelectedUnit(hitObject);
                    }else{
                        if(GameObject.Find("playerManager").GetComponent(playerManager).selector.inputMode=="attack" && GameObject.Find("playerManager").GetComponent(playerManager).selector.tookAction==false){
                            GameObject.Find("playerManager").GetComponent(playerManager).selector.attack(hitObject.GetComponent(hq) as unit);
                            Debug.Log("attack called");
                        }else{
                            GameObject.Find("helpMessage").GetComponent.<Text>().text=hitObject.name+" hp:"+hitObject.GetComponent(hq).hp+" cd:"+hitObject.GetComponent(hq).cooldown;
                            GameObject.Find("playerManager").GetComponent(playerManager).helpMessageStartTime=Time.realtimeSinceStartup;
                        }
                    }
                }else if(hitObject.GetComponent(rocketLauncherMech)){
                    if(hitObject.GetComponent(rocketLauncherMech).ownerID==GameObject.Find("playerManager").GetComponent(playerManager).subTurn){
                        GameObject.Find("selector").GetComponent(selector).setSelectedUnit(hitObject);
                    }else{
                        if(GameObject.Find("playerManager").GetComponent(playerManager).selector.inputMode=="attack" && GameObject.Find("playerManager").GetComponent(playerManager).selector.tookAction==false){
                            GameObject.Find("playerManager").GetComponent(playerManager).selector.attack(hitObject.GetComponent(rocketLauncherMech) as unit);
                            Debug.Log("attack called");
                        }else{
                            GameObject.Find("helpMessage").GetComponent.<Text>().text=hitObject.name+" hp:"+hitObject.GetComponent(rocketLauncherMech).hp;
                            GameObject.Find("playerManager").GetComponent(playerManager).helpMessageStartTime=Time.realtimeSinceStartup;
                        }
                    }
                }/*else if(hitInfo.transform.gameObject.tag=="floor" && GameObject.Find("playerManager").GetComponent(playerManager).selector.tookAction==false){
                    Debug.Log("floor");
                    if(Vector3.Distance(hitInfo.transform.gameObject.transform.position+Vector3(0,1,0),GameObject.Find("playerManager").GetComponent(playerManager).selector.transform.position)==1){
                        var direction : Vector3 = (hitInfo.transform.gameObject.transform.position+Vector3(0,1,0)-GameObject.Find("playerManager").GetComponent(playerManager).selector.transform.position).normalized;
                        if(GameObject.Find("playerManager").GetComponent(playerManager).selector.inputMode=="move"){
                            GameObject.Find("playerManager").GetComponent(playerManager).selector.moveOrAttack(direction);
                        }else if(GameObject.Find("playerManager").GetComponent(playerManager).selector.inputMode=="build"){
                            GameObject.Find("playerManager").GetComponent(playerManager).selector.build(direction);
                        }
                    }
                }*/
            }
        }
    }

    public function getRayCastHit(){
        //Create a ray from camera to mouse position
        var ray : Ray = Camera.main.ScreenPointToRay( Input.mousePosition );
        //Create a RaycastHit to store target hit
        var hitInfo : RaycastHit;
        //If ray has hit something (only units and floor have colliders)
        if(Physics.Raycast(ray, hitInfo)){
            if(hitInfo.transform.gameObject.tag=="floor"){
                return hitInfo.transform.gameObject;
            }else if(hitInfo.transform.root.gameObject.tag=="unit"){
                return hitInfo.transform.root.gameObject;
            }else{
                return null;
            }
        }else{
            return null;
        }
    }

}