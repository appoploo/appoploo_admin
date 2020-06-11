import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback
} from 'react';
import I18n from '../../../I18n';
import Filters from '../../../components/Filters';
import { FilterType } from '../../../components/Filters/types';
import MaterialTable from '../../../components/Table';
import {
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  useMediaQuery,
  Theme
} from '@material-ui/core';
import { Columns } from '../../../components/Table/types';
import { Link, useHistory } from 'react-router-dom';
import useApi from '../../../Hooks';
import DeleteIcon from '@material-ui/icons/Delete';
import * as R from 'ramda';
import { toast } from 'react-toastify';
import VisibilityIcon from '@material-ui/icons/Visibility';
import QRcode from 'qrcode.react';
import { css } from 'emotion';
import { formatDate } from '../../../utils';
import { makeStyles } from '@material-ui/styles';
import queryString from 'query-string';
import { subWeeks } from 'date-fns';
import NotificationsIcon from '@material-ui/icons/Notifications';

const URL = '/Appoploo2/vessels';

const marginRight = css`
  margin-right: 15px !important;
`;

const useStyles = makeStyles({
  root: {
    maxWidth: 'none'
  },
  paper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'transparent',
    width: 'inherit',
    maxWidth: 'unset'
  }
});

function AllVessels() {
  const t = useContext(I18n);
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const api = useApi();

  const classes = useStyles();

  const [code, setCode] = useState();
  const [deleteModal, setDeleteModal] = useState();
  const defaultFrom = subWeeks(Date.now(), 2).getTime();

  const handleClickOpen = (value: string) => {
    setCode(value);
  };

  const handleClose = () => {
    setCode(undefined);
  };

  useEffect(() => {
    getVessels();
  }, []);

  async function getVessels() {
    try {
      const res = await api.get(URL);
      const data = await res.json();
      setVessels(data);
    } catch (error) {
      console.error(error);
    }
  }

  const deleteVessel = useCallback(async () => {
    await api.delete(`/Appoploo2/api/rest/vessels/${deleteModal}`);
    setDeleteModal(undefined);
    toast.success(t('vessel-delete-successfully'));
    await getVessels();
  }, [history.location.search, deleteModal]);
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const filterConf = useMemo(() => [] as FilterType[], [t]);

  const columns: Columns = [
    {
      title: t('name'),
      field: 'name'
    },
    {
      title: t('description'),
      render: (obj) => R.propOr('-', 'description', obj)
    },
    {
      title: t('Vessel Type'),
      render: (obj) => `${R.pathOr('-', ['vesselType', 'vesselType'], obj)}`
    },

    {
      title: t('Length overall'),
      render: (obj) => R.propOr('-', 'loa', obj)
    },
    {
      title: t('Date Created'),
      render: (obj) => {
        const d = new Date(obj.createdAt as Date);
        return formatDate(d.getTime());
      }
    },
    {
      title: t('Last Update'),
      render: (obj) => {
        const d = new Date(obj.updatedAt as Date);
        return formatDate(d.getTime());
      }
    },

    {
      title: t('actions'),
      render: (obj: any, idx: number) => {
        const code: any = R.path(['devices', 0, 'deviceKey'], obj);
        console.log(obj);
        return (
          <>
            {obj.devices?.length > 0 && (
              <IconButton
                classes={{ root: marginRight }}
                size={'small'}
                onClick={() =>
                  history.push(
                    `/map?selected=${obj.id}${isMd ? '#mapid' : '#'}`
                  )
                }
                title={t('view')}>
                <VisibilityIcon />
              </IconButton>
            )}

            {code && (
              <IconButton
                classes={{ root: marginRight }}
                size={'small'}
                onClick={() => handleClickOpen(code)}
                title={t('show qr code')}>
                <img
                  src="/images/qrScan.png"
                  alt=":)"
                  style={{ width: '25px' }}
                />
              </IconButton>
            )}

            <IconButton
              classes={{ root: marginRight }}
              size={'small'}
              onClick={() =>
                history.push(
                  `/notifications?from=${defaultFrom}&vesselId=${obj.id}`
                )
              }
              title={t('notifications')}>
              <NotificationsIcon />
            </IconButton>

            <IconButton
              classes={{ root: marginRight }}
              size={'small'}
              onClick={() => setDeleteModal(obj.id)}
              title={t('delete')}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      }
    }
  ];
  const params = useMemo(() => queryString.parse(history.location.search), [
    history.location.search
  ]);
  const searchTerm: string = (params.searchTerm as string) || '';
  const re = new RegExp(searchTerm, 'g');

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}>
        <Typography variant="h4">{t('Vessels')}</Typography>

        <Button component={Link} to="/vessels/new" variant="contained">
          {t('add-new')}
        </Button>
      </div>
      <br />
      <Filters onSubmit={getVessels} filterConf={filterConf} />
      <MaterialTable
        data={vessels.filter((v: any) => v.name.toLowerCase().match(re))}
        loading={loading}
        columns={columns}
        onChange={getVessels}
      />
      <Dialog
        open={Boolean(deleteModal)}
        onClose={() => setDeleteModal(undefined)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to delete this vessel?'}
        </DialogTitle>

        <DialogActions>
          <Button onClick={() => setDeleteModal(undefined)} color="primary">
            Disagree
          </Button>
          <Button onClick={deleteVessel}>Agree</Button>
        </DialogActions>
      </Dialog>
      <Dialog classes={classes} onClose={handleClose} open={Boolean(code)}>
        {code && <QRcode size={500} value={code} />}
      </Dialog>
    </>
  );
}

export default AllVessels;
