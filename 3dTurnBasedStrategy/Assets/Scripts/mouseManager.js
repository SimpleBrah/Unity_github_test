#pragma strict

public class mouseManager extends MonoBehaviour{
    
    function Start () {

    }

    function Update () {
        var ray : Ray = Camera.main.ScreenPointToRay( Input.mousePosition );

        var hitInfo : RaycastHit;

        if(Input.GetMouseButtonDown(0)){
            if(Physics.Raycast(ray, hitInfo)){
                Debug.Log("ray fired");
                var hitObject : GameObject = hitInfo.transform.root.gameObject;
                
                if(hitObject.GetComponent(worker) && hitObject.GetComponent(worker).ownerID==GameObject.Find("playerManager").GetComponent(playerManager).subTurn){
                    GameObject.Find("playerManager").GetComponent(playerManager).selector=GameObject.Find("playerManager").GetComponent(playerManager).playerList[hitObject.GetComponent(worker).ownerID-1].unitList[hitObject.GetComponent(worker).ID];
                    GameObject.Find("playerManager").GetComponent(playerManager).selectorID=hitObject.GetComponent(worker).ID;
                }

                if(hitObject.GetComponent(hq) && hitObject.GetComponent(hq).ownerID==GameObject.Find("playerManager").GetComponent(playerManager).subTurn){
                    GameObject.Find("playerManager").GetComponent(playerManager).selector=GameObject.Find("playerManager").GetComponent(playerManager).playerList[hitObject.GetComponent(hq).ownerID-1].unitList[hitObject.GetComponent(hq).ID];
                    GameObject.Find("playerManager").GetComponent(playerManager).selectorID=hitObject.GetComponent(hq).ID;
                }

            }
        }
    }

}