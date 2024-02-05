import { createContext, useEffect, useRef, useState } from "react";
import "./css/Map.css";
import { fromLonLat } from "ol/proj";
import * as ol from "ol";

export const mapContext = createContext();

const Map = ({ children }) => {
  const [map, setMap] = useState(null);
  const [details, setDetails] = useState(null);
  const [listofAC, setListofAC] = useState([]);
  const [selectedAC, setSelectedAC] = useState("");
  const [highlight, setHighlight] = useState("");
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
    details,
    setDetails,
    listofAC,
    setListofAC,
    selectedAC,
    setSelectedAC,
    highlight,
    setHighlight,
    center,
    setCenter,
    zoom,
    setZoom,
  };

  return (
    <mapContext.Provider value={values}>
      <div className="wrapper">
        <div className="left-pane">
          <h1>India - Assembly Constituencies</h1>
          <div>
            <div className="input-sec">
              <label htmlFor="constituencyInput">Constituency Name:</label>
              <input
                placeholder="Enter Constituency Name to Search"
                id="constituencyInput"
                type="text"
                value={selectedAC}
                onChange={(e) => setSelectedAC(e.target.value)}
              />
              <button
                onClick={() =>{
                  setZoom(5)
                  setCenter(fromLonLat([77.580643, 22.972442]))}}
              >&#8635;</button>
              <button onClick={()=>{setZoom(prev=>prev+1)}}>+</button>
              <button disabled={zoom === 1} onClick={()=>{setZoom(prev=>prev-1)}}>-</button>
            </div>
            { listofAC.length ?
            <div className="ac-list">
              <ul>
                {listofAC.map((AC, i) => {
                  return (
                    <li
                      key={i}
                      onClick={() => {
                        setZoom(5);
                        setHighlight(AC);
                      }}
                    >
                      {AC}
                    </li>
                  );
                })}
              </ul>
            </div> : null
            }
          </div>
        </div>
        <div ref={mapRef} id="map" className="ol-map">
          {children}
        </div>
        {details ? (
          <div className="details-pane">
            <span>
              <b>Assembly Constituency :</b> {details.AC_NAME}
            </span>
            <span>
              <b>District Name : </b> {details.DIST_NAME}
            </span>
            <span>
              <b>Parliamentary Constituency : </b>
              {details.PC_NAME}
            </span>
            <span>
              <b>State Name :</b> {details.ST_NAME}
            </span>
            <span>
              <b>Area :</b> {Math.round(details.Shape_Area * 10 ** 6)} sq.km
            </span>
          </div>
        ) : (
          <div className="details-pane">
            {" "}
            Hover over a constituency to see details
          </div>
        )}
      </div>
    </mapContext.Provider>
  );
};

export default Map;
