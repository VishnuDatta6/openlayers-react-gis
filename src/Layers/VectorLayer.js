import { useContext, useEffect } from "react";
import { mapContext } from "../map/context";
import OLVectorLayer from "ol/layer/Vector";
import Select from "ol/interaction/Select";
import { Fill, Stroke, Style } from "ol/style";
import { pointerMove } from "ol/events/condition";

const VectorLayer = ({ source, style, zIndex = 0 }) => {
  const {
    map,
    setDetails,
    selectedAC,
    setListofAC,
    highlight,
    setZoom,
    setCenter,
  } = useContext(mapContext);

  let vectorLayer = new OLVectorLayer({
    source,
    style,
  });

  const handleInputChange = (inputValue, vLayer) => {
    if (!inputValue) {
      setListofAC([]);
      return null;
    }
    const matching = vLayer
      .getSource()
      .getFeatures()
      .filter((feature) => {
        const featureConstituency = feature.values_["AC_NAME"];
        return featureConstituency
          .toLowerCase()
          .includes(inputValue.toLowerCase());
      })
      .map((feature) => feature.values_["AC_NAME"]);
    setListofAC(matching);
  };

  const handleListItemClick = (clickedConst) => {
    if (!clickedConst) {
      setZoom(5);
    setCenter([77.580643, 	22.972442]);
      return null;
    }
    setZoom(10);
    vectorLayer.getSource().forEachFeature((feature) => {
      const featureConstituency = feature.values_["AC_NAME"];
      const isSelected = featureConstituency === clickedConst;
        if(isSelected){
            const coOrds = feature.getGeometry().getCoordinates();
            if(coOrds[0][0].length === 2) setCenter(coOrds[0][0]);
            else setCenter(coOrds[0][0][0]);
        }
      feature.setStyle(
        new Style({
          fill: new Fill({
            color: isSelected ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 0, 255, 0.2)",
          }),
          stroke: new Stroke({
            color: isSelected ? "red" : "blue",
            width: 2,
          }),
        })
      );
    });
  };

  useEffect(() => {
    if (!map) return;

    map.addLayer(vectorLayer);
    vectorLayer.setZIndex(zIndex);

    const select = new Select({
      condition: pointerMove,
      layers: [vectorLayer],
      style: new Style({
        fill: new Fill({
          color: "rgba(0,255,0,0.4)",
        }),
        stroke: new Stroke({
          color: "rgba(0,255,0,0.4)",
          width: 2,
        }),
      }),
      hover: true,
    });

    select.on("select", (event) => {
      if (event.selected.length > 0) {
        const selectedFeature = event.selected[0];
        const properties = selectedFeature.getProperties();
        setDetails(properties);
      } else {
        setDetails(null);
      }
    });

    map.addInteraction(select);

    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
        map.removeInteraction(select);
      }
    };
    // eslint-disable-next-line
  }, [map]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleInputChange(selectedAC, vectorLayer);
    }, 350);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line
  }, [selectedAC]);

  useEffect(() => {
    handleListItemClick(highlight);
    // eslint-disable-next-line
  }, [highlight]);

  return null;
};

export default VectorLayer;
