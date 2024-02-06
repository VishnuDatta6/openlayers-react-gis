import { createContext, useEffect, useRef, useState } from "react";
import "../css/Map.css";
import { fromLonLat } from "ol/proj";
import * as ol from "ol";

export const mapContext = createContext();

const Map = ({ children }) => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState();
  const [zoom, setZoom] = useState(5);
  const mapRef = useRef();

  useEffect(() => {
    let options = {
      view: new ol.View({ zoom, center }),
      layers: [],
      controls: [],
      overlays: [],
    };
    let mapObject = new ol.Map(options);
    mapObject.setTarget(mapRef.current);
    setMap(mapObject);
    setCenter(fromLonLat([77.580643, 22.972442]));

    return () => {
      mapObject.setTarget(undefined);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!map) return;
    map.getView().setZoom(zoom);
    // eslint-disable-next-line
  }, [zoom]);

  useEffect(() => {
    if (!map) return;
    map.getView().setCenter(center);
    // eslint-disable-next-line
  }, [center]);

  const values = {
    map,
    center,
    setCenter,
    zoom,
    setZoom,
  };

  return (
    <mapContext.Provider value={values}>
      <div className="wrapper">
        <div ref={mapRef} id="map" className="ol-map">
          {children}
        </div>
      </div>
    </mapContext.Provider>
  );
};

export default Map;
