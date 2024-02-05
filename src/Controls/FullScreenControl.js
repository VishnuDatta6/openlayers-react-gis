import { useContext, useEffect } from "react"
import { mapContext } from "../map/context";
import {FullScreen} from "ol/control";

const FullScreenControl = ()=>{
    const {map} = useContext(mapContext);
    useEffect(()=>{
        if(!map) return;
        let fullScreenControl = new FullScreen({});
        map.controls.push(fullScreenControl);
        return ()=>{
            map.controls.remove(fullScreenControl);
        }
    },[map]);
    return null;
};

export default FullScreenControl;