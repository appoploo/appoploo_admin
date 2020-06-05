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
const VESSELS_URL = '/Appoploo2/vessels';

function AllVessels() {
  const t = useContext(I18n);
  const history = useHistory();
  const api = useApi();
  const [vessels, setVessels] = useState([]);
  const [notf, setNotf] = useState([]);

  async function getVessels() {
    try {
      const res = await api.get(VESSELS_URL);
      const data = await res.json();
      setVessels(data);
    } catch (error) {
      console.error(error);
    }
  }

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
    getVessels();
  }, []);

  const filterConf = useMemo(
    () =>
      [
        {
          label: 'from',
          keyNameFrom: 'from',
          type: 'date'
        },
        {
          keyName: 'vesselId',
          options: [
            { label: 'All', value: 'All' },
            ...vessels.map((obj: any) => ({
              value: obj.id,
              label: obj.name
            }))
          ],
          setLabelValue: (id) => {
            const found: any = vessels.find((obj: any) => +obj.id === +id);
            return `${found?.name ?? 'All'}`;
          },
          label: 'vessel',
          type: 'select'
        }
      ] as FilterType[],

    [t, vessels]
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
