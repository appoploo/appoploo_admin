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
import { Button, Typography, IconButton, Dialog } from '@material-ui/core';
import { Columns } from '../../../components/Table/types';
import { Link, useHistory } from 'react-router-dom';
import useApi from '../../../Hooks';
import queryString from 'query-string';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import * as R from 'ramda';
import { toast } from 'react-toastify';
import VisibilityIcon from '@material-ui/icons/Visibility';
import QRcode from 'qrcode.react';
import { css } from 'emotion';
import { useSelector } from 'react-redux';
import { IReduxStore } from '../../../redux/reducers';
import { formatDate } from '../../../utils';
import { makeStyles } from '@material-ui/styles';

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

  const tenant = useSelector((store: IReduxStore) => store.account.tenant);

  const [code, setCode] = useState();

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
    const headers: any = {
      'Content-Type': 'application/json',
      'cache-control': 'no-cache,no-cache',
      'tenant-id': tenant
    };

    try {
      const res = await fetch(URL, {
        headers
      });
      const data = await res.json();
      setVessels(data);
    } catch (error) {
      console.error(error);
    }
  }

  const deleteVessel = useCallback(
    (id: string) => {
      const params = queryString.parse(history.location.search);
      api.delete(`/api/bo/vessels/${id}`);
      toast.success(t('vessel-delete-successfully'));
      getVessels();
    },
    [history.location.search]
  );

  const filterConf = useMemo(() => [] as FilterType[], [t]);

  const columns: Columns = [
    {
      title: t('name'),
      field: 'name'
    },
    {
      title: t('description'),
      render: obj => R.propOr('-', 'description', obj)
    },
    {
      title: t('Vessel Type'),
      render: obj => `${R.pathOr('-', ['vesselType', 'vesselType'], obj)}`
    },

    {
      title: t('Length overall'),
      render: obj => R.propOr('-', 'loa', obj)
    },
    {
      title: t('Date Created'),
      render: obj => {
        const d = new Date(obj.createdAt as Date);
        return formatDate(d.getTime());
      }
    },
    {
      title: t('Last Update'),
      render: obj => {
        const d = new Date(obj.updatedAt as Date);
        return formatDate(d.getTime());
      }
    },

    {
      title: t('actions'),
      render: (obj: any, idx: number) => {
        const code: any = R.path(['devices', 0, 'deviceKey'], obj);
        console.log(code);
        return (
          <>
            <IconButton
              classes={{ root: marginRight }}
              size={'small'}
              onClick={() => history.push(`/vessels/${obj._id}`)}
              title={t('view')}>
              <VisibilityIcon />
            </IconButton>

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

            <IconButton
              classes={{ root: marginRight }}
              size={'small'}
              onClick={() => history.push(`/vessels/${obj._id}/edit`)}
              title={t('edit')}>
              <EditIcon />
            </IconButton>

            <IconButton
              classes={{ root: marginRight }}
              size={'small'}
              onClick={() => deleteVessel(obj._id)}
              title={t('delete')}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      }
    }
  ];

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
        data={vessels}
        loading={loading}
        columns={columns}
        onChange={getVessels}
      />

      <Dialog classes={classes} onClose={handleClose} open={Boolean(code)}>
        {<QRcode size={500} value={code || ''} />}
      </Dialog>
    </>
  );
}

export default AllVessels;
