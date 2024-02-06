
import "./App.css";
import Map from "./map/context";
import Layers from "./Layers/Layers";
import TileLayer from "./Layers/TileLayer";
import VectorLayer from "./Layers/VectorLayer";
import { osm, vector } from "./Source";
import { get } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import geojsonObject from "./assets/India_AC.json";
import FeatureStyle from "./Styles";
import Controls from "./Controls/Controls";
import FullScreenControl from "./Controls/FullScreenControl";


function App() {
  return (
    <div className="App">
      <Map>
        <Layers>
          <TileLayer source={osm()} zIndex={0} />
          <VectorLayer
          source={vector({
            features : new GeoJSON().readFeatures(geojsonObject, {
              featureProjection : get("EPSG:3857"),
            }),
          })}
          style={FeatureStyle.Polygon}
          zIndex={1}
          />
        </Layers>
        <Controls>
          <FullScreenControl />
        </Controls>
      </Map>
    </div>
  );
}

export default App;
