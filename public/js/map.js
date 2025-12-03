require(
  ["esri/Map", "esri/Basemap", "esri/views/SceneView" ],
  function (Map, Basemap, SceneView) {
    const basemap3D = new Basemap({
      portalItem: {
        id: "0560e29930dc4d5ebeb58c635c0909c9"
      }
    });

    const map = new Map({
      basemap: basemap3D
    });

    const view = new SceneView({
      container: "viewDiv", 
      map: map,
      camera: {
        position: {
          longitude: 5.394594042544371,   
          latitude: 43.30040303197376,   
          z: 261.47949998732656            // altitude
        },
        heading: 10.766081115754021,          // orientation
        tilt: 62.81206614938708             // tilt
      }
    });

});