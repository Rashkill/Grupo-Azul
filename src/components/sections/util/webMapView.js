import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

export const WebMapView = () => {
    const mapRef = useRef();

    useEffect(
      () => {
        // lazy load the required ArcGIS API for JavaScript modules and CSS
        loadModules(['esri/Map',
         'esri/views/MapView'
        ], 
        { css: true })
        .then(([ArcGISMap, MapView]) => {
          const map = new ArcGISMap({
            basemap: 'streets'
          });

          // load the map view at the ref's DOM node
          const view = new MapView({
            container: mapRef.current,
            map: map,
            // center: [-118, 34],
            center: [-60.7, -31.633333333333],
            zoom: 13
          });

          return () => {
            if (view) {
              // destroy the map view
              view.destroy();
            }
          };
        });
      }
    );

    return <div className="webmap" ref={mapRef} />;
}
export default WebMapView