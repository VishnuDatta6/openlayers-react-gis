import { useContext, useEffect, useState } from "react";
import { mapContext } from "../map/context";
import OLVectorLayer from "ol/layer/Vector";
import Select from "ol/interaction/Select";
import { Fill, Stroke, Style } from "ol/style";
import { pointerMove } from "ol/events/condition";
import "../css/vectorlayer.css";
import { fromLonLat } from "ol/proj";

const VectorLayer = ({ source, style, zIndex = 0 }) => {
  const [listofAC, setListofAC] = useState([]);
  const [selectedAC, setSelectedAC] = useState("");
  const [details, setDetails] = useState(null);
  const { map, setZoom, setCenter, zoom } = useContext(mapContext);

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
      setCenter([77.580643, 22.972442]);
      return null;
    }
    setListofAC([]);
    setZoom(10);
    vectorLayer.getSource().forEachFeature((feature) => {
      const featureConstituency = feature.values_["AC_NAME"];
      const isSelected = featureConstituency === clickedConst;
      if (isSelected) {
        const coOrds = feature.getGeometry().getCoordinates();
        if (coOrds[0][0].length === 2) setCenter(coOrds[0][0]);
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

  return (
    <div className="vector-layer">
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
              onClick={() => {
                setZoom(5);
                setCenter(fromLonLat([77.580643, 22.972442]));
              }}
            >
              &#8635;
            </button>
            <button
              onClick={() => {
                setZoom((prev) => prev + 1);
              }}
            >
              +
            </button>
            <button
              disabled={zoom === 1}
              onClick={() => {
                setZoom((prev) => prev - 1);
              }}
            >
              -
            </button>
          </div>
          {listofAC.length ? (
            <div className="ac-list">
              <ul>
                {listofAC.map((AC, i) => {
                  return (
                    <li
                      key={i}
                      onClick={() => {
                        setZoom(5);
                        handleListItemClick(AC);
                      }}
                    >
                      {AC}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
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
  );
};

export default VectorLayer;
