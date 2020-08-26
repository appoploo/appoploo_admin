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
  DialogActions
} from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Columns } from '../../../components/Table/types';
import { Link, useHistory } from 'react-router-dom';
import useApi from '../../../Hooks';
import DeleteIcon from '@material-ui/icons/Delete';
import { toast } from 'react-toastify';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { css } from 'emotion';
import { formatDate } from '../../../utils';
import queryString from 'query-string';

const marginRight = css`
  margin-right: 15px !important;
`;

function AllBoundaries() {
  const t = useContext(I18n);
  const [boundaries, setBoundaries] = useState<any>([]);
  const history = useHistory();
  const api = useApi();
  const [deleteModal, setDeleteModal] = useState();

  const getGeoObj = () =>
    api
      .get(
        'https://server.cruiser.gr:8443/Appoploo2/geoobjects?category=GEOFENCE_REGION'
      )
      .json()
      .then((data) => setBoundaries(data))
      .catch(async (e) => console.log(await e.response.json()));

  useEffect(() => {
    getGeoObj();
  }, []);

  const deleteGeo = () => {
    api
      .delete(
        `https://server.cruiser.gr:8443/Appoploo2/geoobjects/${deleteModal}`
      )
      .then(() => {
        toast.success(t('boundaries-deleted-successfully'));
        getGeoObj();
      })
      .catch(async (e) => console.log(await e.response.json()));
    setDeleteModal(undefined);
  };
  async function getboundaries() {
    try {
      const res = await api.get(
        'https://server.cruiser.gr:8443/Appoploo2/geoobjects'
      );
      const data = await res.json();
      setBoundaries(data);
    } catch (error) {
      console.error(error);
    }
  }

  const columns: Columns = [
    {
      title: t('int.name'),
      field: 'name'
    },

    {
      title: t('int.Date Created'),
      render: (obj) => {
        const d = new Date(obj.createdAt as Date);
        return formatDate(d.getTime());
      }
    },
    {
      title: t('int.actions'),
      render: (obj: any, idx: number) => {
        return (
          <>
            <IconButton
              classes={{ root: marginRight }}
              size={'small'}
              onClick={() => history.push(`/boundaries/${obj.id}`)}
              title={t('int.view')}>
              <VisibilityIcon />
            </IconButton>

            <IconButton
              classes={{ root: marginRight }}
              size={'small'}
              onClick={() => setDeleteModal(obj.id)}
              title={t('int.delete')}>
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
  const re = new RegExp(searchTerm.toLocaleLowerCase(), 'g');

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}>
        <Typography variant="h4">{t('int.boundaries')}</Typography>

        <Button component={Link} to="/boundaries/new" variant="contained">
          {t('int.add-new')}
        </Button>
      </div>
      <br />
      <MaterialTable
        data={boundaries.filter((v: any) =>
          v.name.toLocaleLowerCase().match(re)
        )}
        columns={columns}
        onChange={(w) => void 0}
      />
      <Dialog
        open={Boolean(deleteModal)}
        onClose={() => setDeleteModal(undefined)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to delete this boundary?'}
        </DialogTitle>

        <DialogActions>
          <Button onClick={() => setDeleteModal(undefined)} color="primary">
            Disagree
          </Button>
          <Button onClick={deleteGeo}>Agree</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AllBoundaries;
