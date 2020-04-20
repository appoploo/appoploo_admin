import React, { useEffect, useContext, useState } from 'react';

import Leaflet, { LatLng } from 'leaflet';
import { mapClass } from './css';
import { Button, Typography, Card } from '@material-ui/core';
import I18n from '../../I18n';

const GreceCoords = {
  lat: 37.98381,
  lng: 23.727539
};

function Boundaries() {
  const [latLngs, setLatLngs] = useState<LatLng[]>([]);
  const [map, setMap] = useState<Leaflet.DrawMap>();
  const [group, setGroup] = useState<Leaflet.FeatureGroup<any>>();

  useEffect(() => {
    const _map = Leaflet.map('mapid').setView(
      [GreceCoords.lat, GreceCoords.lng],
      7
    );
    Leaflet.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {}
    ).addTo(_map);

    // FeatureGroup is to store editable layers
    const drawnItems = new Leaflet.FeatureGroup();
    _map.addLayer(drawnItems);
    const drawControl = new Leaflet.Control.Draw({
      position: 'topright',
      draw: {
        polyline: false,
        marker: false,
        circlemarker: false,
        circle: false
      }
    });
    _map.addControl(drawControl);

    _map.on(Leaflet.Draw.Event.CREATED, (e) => {
      setLatLngs(e.layer.getLatLngs());
    });
    const group = Leaflet.featureGroup().addTo(_map);
    setGroup(group);
    setMap(_map);

    _map.on(Leaflet.Draw.Event.DRAWSTART, (e) => {
      setLatLngs([]);
      group.clearLayers();
    });

    _map.on(Leaflet.Draw.Event.DELETESTART, (e) => {
      setLatLngs([]);
      group.clearLayers();
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

        <Button variant="contained">{t('save')}</Button>
      </div>

      <Card elevation={4} className={mapClass} id="mapid" />
    </>
  );
}
export default Boundaries;
