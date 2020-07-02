import React, { useState, useContext, useEffect } from 'react';
import {
  Grid,
  Button,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Theme,
  colors,
  TextField,
  InputAdornment,
  MenuItem
} from '@material-ui/core';
import ActionHeader from '../../../components/ActionHeader';
import I18n from '../../../I18n';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import useApi from '../../../Hooks';
import { IReduxStore } from '../../../redux/reducers';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

type vesselType = 'Motor Yacht' | 'Sailing Yacht' | 'Catamaran' | 'Power boat';

const mapVesselTypeToValue: Record<vesselType, string> = {
  'Motor Yacht':
    'http://server.cruiser.gr:8290/Appoploo2/api/rest/vesselTypes/1',
  'Sailing Yacht':
    'http://server.cruiser.gr:8290/Appoploo2/api/rest/vesselTypes/2',
  Catamaran: 'http://server.cruiser.gr:8290/Appoploo2/api/rest/vesselTypes/3',
  'Power boat': 'http://server.cruiser.gr:8290/Appoploo2/api/rest/vesselTypes/4'
};
const vesselTypes = Object.keys(mapVesselTypeToValue).map((k) => ({
  label: k,
  value: mapVesselTypeToValue[k as vesselType]
}));

const defaultValues = {
  engine: null,
  width: null,
  createdAt: new Date(),
  fuelTank: null,
  callsign: '',
  registryNumber: '',
  cabins: null,
  wc: null,
  pax: null,
  builtYear: null,
  waterTank: null,
  tareWeight: null,
  devices: [],
  updatedAt: new Date(),
  owner: null,
  readings: {}
};

const useStyles = makeStyles((theme: Theme) => ({
  cardContent: {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    minHeight: '167px',
    maxHeight: '61vh',
    overflowY: 'auto'
  }
}));

function NewVessel() {
  const t = useContext(I18n);
  const classes = useStyles();
  const [state, setState] = useState({
    name: '',
    vesselType:
      'http://server.cruiser.gr:8290/Appoploo2/api/rest/vesselTypes/1',
    description: '',
    loa: 0,
    draught: 0
  });

  const api = useApi();
  const history = useHistory();

  return (
    <>
      <ActionHeader>
        <Button
          onClick={() =>
            api
              .post(`/Appoploo2/api/rest/vessels`, {
                json: { ...defaultValues, ...state }
              })
              .then(() => {
                toast.success(t('int.vessel-created-successfully'));
                history.push('/vessels');
              })
          }
          variant="outlined">
          {t('int.save')}
        </Button>
      </ActionHeader>
      <br />
      <Grid container spacing={4}>
        <Grid item xl={6} lg={6} md={12} xs={12}>
          <Card>
            <CardHeader
              subheader={t('int.edit-vessel-info')}
              title={t('int.vessel')}></CardHeader>
            <Divider />
            <CardContent className={classes.cardContent}>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    label={t('int.vessel-name')}
                    margin="dense"
                    required
                    value={state.name}
                    onChange={(evt) => {
                      const name = evt.currentTarget.value;
                      setState((s) => ({
                        ...s,
                        name
                      }));
                    }}
                    variant="outlined"
                  />
                </Grid>

                <Grid item md={12} xs={12}>
                  <TextField
                    select
                    fullWidth
                    value={state.vesselType}
                    onChange={(evt) => {
                      const vesselType = evt.target.value;
                      setState((s) => ({
                        ...s,
                        vesselType
                      }));
                    }}
                    label={t('int.vessel-type')}
                    margin="dense"
                    required
                    variant="outlined">
                    {vesselTypes.map((obj, idx) => (
                      <MenuItem key={idx} value={obj.value}>
                        {obj.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    label={t('Vessel description')}
                    required
                    value={state.description}
                    onChange={(evt) => {
                      const description = evt.currentTarget.value;
                      setState((s) => ({
                        ...s,
                        description
                      }));
                    }}
                    margin="dense"
                    variant="outlined"
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label={t('int.Length (LOA)')}
                    value={state.loa}
                    onChange={(evt) => {
                      const loa = +evt.target.value;
                      setState((s) => ({
                        ...s,
                        loa
                      }));
                    }}
                    required
                    type="number"
                    margin="dense"
                    variant="outlined"
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    value={state.draught}
                    onChange={(evt) => {
                      const draught = +evt.target.value;
                      setState((s) => ({
                        ...s,
                        draught
                      }));
                    }}
                    fullWidth
                    type="number"
                    label={t('int.Draught')}
                    required
                    margin="dense"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default NewVessel;
