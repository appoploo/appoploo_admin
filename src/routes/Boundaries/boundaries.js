import React, { useEffect, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import Leaflet from 'leaflet';
import { mapClass } from './css';
import {
  Button,
  Typography,
  Card,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@material-ui/core';

import I18n from '../../I18n';
import useApi from '../../Hooks';
import { useParams } from 'react-router-dom';

const GreceCoords = {
  lat: 37.98381,
  lng: 23.727539
};

function Boundaries() {
  const [latLngs, setLatLngs] = useState([]);
  const [map, setMap] = useState();
  const [group, setGroup] = useState();
  const [modal, setModal] = useState(false);
  const [name, setName] = useState(undefined);

  const api = useApi();

  const { id } = useParams();

  const save = () =>
    name &&
    api
      .post('/Appoploo2/geoobjects/persist', {
        json: {
          uuid: id === 'new' ? null : id,
          name: name,
          owner: 1,
          uuid: 'a',
          geometry: {
            type: 'MultiPoint',
            coordinates: latLngs.map((obj) => [obj.lng, obj.lat])
          },
          category: 'GEOFENCE_REGION'
        }
      })
      .json()
      .then(() => {
        toast.success(t('int.boundaries-save-successfully'));
        setModal(false);
      })
      .catch(async (e) => console.log(await e.response.json()));

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
      setLatLngs(e.layer.getLatLngs()[0]);
    });

    _map.on('draw:edited', function (e) {
      const coords = e.layers.toGeoJSON().features[0]?.geometry?.coordinates[0];
      if (coords)
        setLatLngs(coords.map((arr) => ({ lat: arr[1], lng: arr[0] })));
    });
  }, []);

  useEffect(() => {
    if (!map || !latLngs.length || !group) return;
    const polygon = Leaflet.polygon(latLngs).addTo(group);
    // zoom the map to the polygon
    map.fitBounds(polygon.getBounds());
  }, [latLngs, map, group]);

  useEffect(() => {
    if (id === 'new') return;
    api
      .get(`  /Appoploo2/geoobjects/${id}`)
      .json()
      .then((res) => {
        res.geometry.coordinates.length > 0 &&
          setLatLngs(
            res.geometry.coordinates.map((arr) => ({
              lat: arr[1],
              lng: arr[0]
            }))
          );
        setName(res.name);
      })
      .catch(async (e) => console.log(e.response));
  }, []);

  const t = useContext(I18n);
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}>
        <Typography variant="h4">{name || t('int.new-boundary')}</Typography>

        <Button
          disabled={!latLngs.length}
          onClick={() => (id === 'new' ? setModal(true) : save())}
          variant="contained">
          {t(id === 'new' ? 'int.save' : 'int.update')}
        </Button>
      </div>
      <Card elevation={4} className={mapClass} id="mapid" />

      <Dialog
        open={Boolean(modal)}
        onClose={() => setModal(undefined)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {t('int.Enter name for this boundary')}.
        </DialogTitle>

        <DialogContent>
          <TextField
            onChange={(e) => setName(e.currentTarget.value)}
            autoFocus
            margin="dense"
            id="name"
            label="name"
            type="name"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModal(undefined)} color="primary">
            {t('int.cancel')}
          </Button>
          <Button onClick={save}>{t('int.save')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default Boundaries;
