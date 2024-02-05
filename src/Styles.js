import { Style, Fill, Stroke } from "ol/style";

export default {
    Polygon : new Style({
        stroke : new Stroke({
            color: "blue",
            lineDash : [4],
            width : 3,
        }),
        fill : new Fill({
            color: "rgba(0,0,255,0.1)",
        })
    }),
}