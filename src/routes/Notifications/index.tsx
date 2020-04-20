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
import { Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import useApi from '../../Hooks';
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
      const params = Boolean(search) ? `?${search}` : history.location.search;
      api
        .get(`${URL}${params}`)
        .then((e) => e.json())
        .then((data) => setNotf(data));
    },
    [history.location.search]
  );

  useEffect(() => {
    getNotf();
  }, []);
  const filterConf = useMemo(
    () =>
      [
        {
          label: 'from - to',
          keyNameTo: 'to',
          keyNameFrom: 'from',
          type: 'date'
        }
      ] as FilterType[],
    [t]
  );

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: '36px'
        }}>
        <Typography variant="h4">{t('Notifications')}</Typography>
      </div>
      <br />
      <Filters
        onSubmit={(obj) => getNotf(queryString.stringify(obj))}
        filterConf={filterConf}
      />
      <AlignItemsList data={notf} />
    </>
  );
}

export default AllVessels;
