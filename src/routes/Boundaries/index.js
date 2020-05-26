import React, { useEffect, useContext, useState } from 'react';

import Leaflet from 'leaflet';
import { mapClass } from './css';
import { Button, Typography, Card } from '@material-ui/core';

import I18n from '../../I18n';
import useApi from '../../Hooks';
import { json } from 'd3';

const GreceCoords = {
  lat: 37.98381,
  lng: 23.727539
};

function Boundaries() {
  const [latLngs, setLatLngs] = useState([]);
  const [map, setMap] = useState();
  const [group, setGroup] = useState();

  const api = useApi();

  const save = () =>
    api.post('/geoobjects/persist', {
      json: {
        name: 'Test',
        geometry: {
          type: 'MultiPoint',
          coordinates: latLngs.map((obj) => [obj.lng, obj.lat])
        },
        category: 'GEOFENCE_REGION'
      }
    });

  useEffect(() => {
    const _map = Leaflet.map('mapid', {
      editable: true,
      doubleClickZoom: false
    }).setView([GreceCoords.lat, GreceCoords.lng], 7);
    Leaflet.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {}
    ).addTo(_map);

    // FeatureGroup is to store editable layers
    const drawnItems = new Leaflet.FeatureGroup();
    _map.addLayer(drawnItems);

    const group = Leaflet.featureGroup().addTo(_map);
    setGroup(group);
    setMap(_map);

    const drawControl = new Leaflet.Control.Draw({
      position: 'topright',
      draw: {
        polyline: false,
        marker: false,
        circlemarker: false,
        circle: false
      },
      edit: {
        featureGroup: group,
        remove: true
      }
    });
    _map.addControl(drawControl);

    _map.on(Leaflet.Draw.Event.CREATED, (e) => {
      setLatLngs(e.layer.getLatLngs());
    });

    _map.on('draw:edited', function (e) {
      const coords = e.layers.toGeoJSON().features[0]?.geometry?.coordinates[0];
      if (coords)
        setLatLngs(coords.map((arr) => ({ lat: arr[1], lng: arr[0] })));
    });
  }, []);

  useEffect(() => {
    if (!map || !latLngs.length || !group) return;
    console.log(latLngs);
    const polygon = Leaflet.polygon(latLngs).addTo(group);
    // zoom the map to the polygon
    map.fitBounds(polygon.getBounds());
  }, [latLngs, map, group]);

  const t = useContext(I18n);
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}>
        <Typography variant="h4">{t('Boundaries')}</Typography>

        <Button onClick={save} variant="contained">
          {t('save')}
        </Button>
      </div>

      <Card elevation={4} className={mapClass} id="mapid" />
    </>
  );
}
export default Boundaries;
