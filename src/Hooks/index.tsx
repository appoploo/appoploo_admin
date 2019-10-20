import { useCallback } from 'react';
import { IReduxStore } from '../redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { setErrors } from '../redux/actions/errors';
import { updateToken, logout } from '../redux/actions/account';
import * as R from 'ramda';
import ky from 'ky';

function useApi() {
  const account = useSelector((store: IReduxStore) => store.account);
  const err = useSelector((store: IReduxStore) => store.errors);
  const dispatch = useDispatch();

  const _setErr = useCallback(
    errors => {
      dispatch(setErrors(errors));
    },
    [dispatch]
  );

  const _updateToken = useCallback(
    infos => {
      dispatch(updateToken(infos));
    },
    [dispatch]
  );

  const _logout = useCallback(() => dispatch(logout()), [dispatch]);

  const api = ky.extend({
    hooks: {
      beforeRequest: [
        async request => {
          if (!account.refreshToken) {
            _logout();
            return;
          }

          if (account.tokenExp && account.tokenExp < Date.now()) {
            const res = await ky.post('/auth/refresh-token', {
              json: {
                refreshToken: account.refreshToken
              }
            });
            const infos = await res.json();
            _updateToken(infos);
            return request.headers.set(
              'Authorization',
              `Bearer ${infos.token}`
            );
          }

          if (!R.isEmpty(err)) _setErr({});
          return request.headers.set(
            'Authorization',
            `Bearer ${account.token}`
          );
        }
      ],
      afterResponse: [
        async (_request, _options, response) => {
          const data = await response.json();
          if ('error' in data) _setErr(data.error);
        }
      ]
    }
  });

  return api;
}

export default useApi;
