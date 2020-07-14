import React, { useEffect, useContext, useState, useCallback } from 'react';

import Leaflet from 'leaflet';
import { mapClass } from './css';
import {
  Typography,
  Card,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CardContent,
  CardHeader,
  useMediaQuery,
  Theme,
  Button,
  Popover
} from '@material-ui/core';
import I18n from '../../I18n';
import ExploreIcon from '@material-ui/icons/Explore';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import useApi from '../../Hooks';
import queryString from 'query-string';
import { useHistory } from 'react-router-dom';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles } from '@material-ui/styles';
import Calendar from 'react-calendar';
import { formatDate } from '../../utils';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { subWeeks, formatDistance } from 'date-fns';
const polyline = require('google-polyline');

const defaultFrom = subWeeks(Date.now(), 2).getTime();

interface IVesselType {
  id: number;
  vesselType: string;
}

type Vessel = {
  id: number;
  vesselType: IVesselType;
  name?: string;
  devices: any[];
};

const useStyles = makeStyles({
  active: {
    backgroundColor: '#3331 !important'
  }
});

const VesselURL = '/Appoploo2/vessels';

const GreceCoords = {
  lat: 37.98381,
  lng: 23.727539
};

function getTelematicsData(vessel: Vessel) {
  return vessel.devices[0]?.telematicsData?.device;
}

function getVesselPosition(vessel: Vessel) {
  return vessel.devices[0]?.telematicsData?.position;
}

function Map() {
  const [map, setMap] = useState<Leaflet.DrawMap>();
  const [group, setGroup] = useState<Leaflet.FeatureGroup<any>>();
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [routes, setRoutes] = useState([]);
  const [notf, setNotf] = useState<Record<string, any>>({});
  const history = useHistory();
  const classes = useStyles();
  const api = useApi();

  const getNotf = useCallback(
    (id) => {
      api
        .get(
          `/Appoploo2/notifications?from=${defaultFrom}&vesselId=${id}&category=GEOFENCE_REGION`
        )
        .json()
        .then((obj: any) => {
          setNotf((notf) => ({ ...notf, [id]: obj[2]?.approach }));
        });
    },
    [history.location.search]
  );

  useEffect(() => {
    vessels
      .filter((v) => getVesselPosition(v))
      .forEach((v) => {
        getNotf(v.id);
      });
  }, [vessels]);

  useEffect(() => {
    if (!map || !group) return;
    group.clearLayers();

    if (routes.length < 1) {
      const vessel = vessels.find((obj) => obj.id === Number(params.selected));
      if (!vessel) return;
      const position = getVesselPosition(vessel);
      if (!position) return;
      const latLng: any = [position?.latitude, position?.longitude];
      map.setView(latLng, map.getZoom(), {
        animate: true
      });
      return;
    }

    Leaflet.polyline(routes, { color: 'red' }).addTo(group);
    const bounds = new Leaflet.LatLngBounds(routes);
    map.fitBounds(bounds);
  }, [routes]);

  useEffect(() => {
    if (!map) return;
    vessels.forEach((v, i) => {
      const position = getVesselPosition(v);
      if (!position || !position.latitude || !position.longitude) return null;

      const pos = {
        latitude: position.latitude,
        longitude: position.longitude
      };

      const marker = new Leaflet.Marker([pos.latitude, pos.longitude], {
        title: `${v.name}_${i}`
      }).addTo(map);
      marker.bindPopup(`<b>${v.name}</b>`).openPopup();
    });

    const allLatLng: [number, number][] = vessels.map((v, i) => {
      const position = getVesselPosition(v);
      return position && [position?.latitude, position?.longitude];
    });

    if (allLatLng.filter((e) => e).length > 0) {
      const bounds = new Leaflet.LatLngBounds(allLatLng);
      map.fitBounds(bounds);
    }
  }, [vessels]);

  useEffect(() => {
    const _map = Leaflet.map('mapid').setView(
      [GreceCoords.lat, GreceCoords.lng],
      7
    );
    Leaflet.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {}
    ).addTo(_map);

    const group = Leaflet.featureGroup().addTo(_map);
    setGroup(group);
    setMap(_map);

    getVessels();
  }, []);

  async function getVessels() {
    try {
      const res = await api.get(VesselURL);
      const data = await res.json();
      setVessels(data);
    } catch (error) {
      console.error(error);
    }
  }
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const t = useContext(I18n);

  const params = queryString.parse(history.location.search) as {
    from?: number;
    selected?: string;
  };

  async function getRoutes(from: number) {
    const firstDevice = vessels.find((v) => +v.id === Number(params.selected));
    const IMEI = firstDevice?.devices[0]?.deviceKey;
    if (IMEI && from) {
      const res = await api.get(`/Appoploo2/route/${IMEI}?from=${from}`).text();
      const routes = polyline.decode(`${res}`);
      setRoutes(routes);
    }
    // const response = yield res.text();
    // const routes = polyline.decode(`${response}`);
  }

  useEffect(() => {
    if (!map) return;
    const vessel = vessels.find((obj) => obj.id === Number(params.selected));
    if (!vessel) return;
    const position = getVesselPosition(vessel);
    if (!position) return;
    const latLng: any = [position?.latitude, position?.longitude];

    let marker: any;
    map.eachLayer((opt: any) => {
      if (opt?.options?.title === vessel.name) marker = opt;
    });

    map.setView(latLng, map.getZoom(), {
      animate: true
    });
    if (marker) marker.bindPopup(`<b>${vessel.name}</b>`).openPopup();
  }, [params.selected]);

  const [anchorEl, setAnchorEl] = useState<any>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: '36px'
        }}>
        <Typography variant="h4">{t('int.Map')}</Typography>
        {params.selected && (
          <>
            <Button
              variant="contained"
              aria-describedby={id}
              onClick={(event) => setAnchorEl(event.currentTarget)}>
              {t('int.routes-from')}:{' '}
              {params.from ? formatDate(+Number(params?.from)) : `DD/MM/YYYY`}
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}>
              <Calendar
                value={params.from ? new Date(+params.from) : undefined}
                maxDate={new Date()}
                onChange={(evt: any) => {
                  const from = new Date(evt).getTime();
                  getRoutes(from);
                  setAnchorEl(undefined);
                  history.push({
                    search: queryString.stringify({
                      ...params,
                      from
                    })
                  });
                }}
              />
            </Popover>
          </>
        )}
      </div>

      <br />
      <Grid spacing={3} container>
        <Grid xs={12} sm={12} md={12} lg={5} xl={5} item>
          <Card elevation={3}>
            <CardHeader title={t('int.vessels')} />
            <CardContent>
              <List
                style={{
                  maxHeight: 'calc(100vh -  290px)',
                  overflow: 'auto'
                }}>
                {vessels
                  .filter((v) => getVesselPosition(v))
                  .map((vessel) => {
                    const position = getVesselPosition(vessel);
                    const speed = position?.speed * 0.539957 || 0;
                    const volt = (
                      position?.attributes?.power / 1000 || 0
                    ).toFixed(2);
                    const isSelected = Number(params.selected) === vessel.id;
                    const rotate = position?.course || 0;

                    const telematicsDataDevice = getTelematicsData(vessel);
                    const lastUpdate = telematicsDataDevice.lastUpdate
                      ? formatDistance(
                          new Date(telematicsDataDevice?.lastUpdate),
                          new Date()
                        )
                      : '';

                    console.log(telematicsDataDevice);

                    const displayLastUpdate =
                      lastUpdate === `less than a minute`
                        ? 'Just now'
                        : lastUpdate === ``
                        ? ''
                        : `${lastUpdate} ago`;

                    return (
                      <ListItem
                        classes={{
                          selected: classes.active
                        }}
                        key={vessel.id}
                        divider
                        selected={isSelected}>
                        <ListItemIcon>
                          <ExploreIcon
                            htmlColor="#202F3F"
                            style={{ transform: `rotate(${-45 + rotate}deg)` }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          style={{ minWidth: 50 }}
                          primary={vessel.name}
                          secondary={vessel.vesselType.vesselType}
                        />
                        <ListItemText
                          primary={t('int.lastUpdate')}
                          secondary={displayLastUpdate}
                        />
                        <ListItemText
                          primary={`${speed?.toFixed(2)} kts`}
                          secondary={`${volt} Volt`}
                        />
                        <ListItemSecondaryAction>
                          {position && (
                            <ListItemIcon>
                              <a
                                style={{ all: 'unset' }}
                                href={isMd && isSelected ? '#mapid' : '#'}>
                                <IconButton
                                  onClick={() => {
                                    group?.clearLayers();
                                    history.push(
                                      isSelected
                                        ? '/map'
                                        : `/map?selected=${vessel.id}`
                                    );
                                  }}>
                                  {isSelected ? (
                                    <ClearIcon />
                                  ) : (
                                    <GpsFixedIcon />
                                  )}
                                </IconButton>
                              </a>
                            </ListItemIcon>
                          )}

                          {notf[vessel.id] && (
                            <IconButton
                              size={'small'}
                              onClick={() =>
                                history.push(
                                  `/notifications?from=${defaultFrom}&vesselId=${vessel.id}&category=GEOFENCE_REGION`
                                )
                              }
                              title={t('int.notifications')}>
                              <NotificationsIcon htmlColor="#f00c" />
                            </IconButton>
                          )}
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={12} md={12} lg={7} xl={7} item>
          <Card elevation={4} className={mapClass} id="mapid" />
        </Grid>
      </Grid>
    </>
  );
}
export default Map;
