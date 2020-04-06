import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback
} from 'react';
import I18n from '../../I18n';
import Filters from '../../components/Filters';
import { FilterType } from '../../components/Filters/types';
import MaterialTable from '../../components/Table';
import {
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions
} from '@material-ui/core';
import { Columns } from '../../components/Table/types';
import { Link, useHistory } from 'react-router-dom';
import useApi from '../../Hooks';
import DeleteIcon from '@material-ui/icons/Delete';
import * as R from 'ramda';
import { toast } from 'react-toastify';
import VisibilityIcon from '@material-ui/icons/Visibility';
import QRcode from 'qrcode.react';
import { css } from 'emotion';
import { formatDate } from '../../utils';
import { makeStyles } from '@material-ui/styles';
import queryString from 'query-string';
import AlignItemsList from '../../components/List';

const URL = 'Appoploo2/notifications';

function AllVessels() {
  const t = useContext(I18n);
  const history = useHistory();
  const api = useApi();

  const [notf, setNotf] = useState([]);

  const getNotf = useCallback(
    (search?: string) => {
      console.log(history.location.search);
      const params = Boolean(search) ? search : history.location.search;
      api
        .get(`${URL}${params}`)
        .then((e) => e.json())
        .then((data) => setNotf(data));
    },
    [history.location.search]
  );

  useEffect(() => {
    getNotf();
  }, [history.location.search]);

  const filterConf = useMemo(
    () =>
      [
        { label: 'from-to', keyNameTo: 'to', keyNameFrom: 'from', type: 'date' }
      ] as FilterType[],
    [t]
  );

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}>
        <Typography variant="h4">{t('Notifications')}</Typography>
      </div>
      <br />
      <Filters onSubmit={console.log} filterConf={filterConf} />
      <AlignItemsList data={notf} />
    </>
  );
}

export default AllVessels;
