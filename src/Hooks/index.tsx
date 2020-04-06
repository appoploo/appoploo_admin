import { useCallback, useEffect } from 'react';
import { IReduxStore } from '../redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { setErrors } from '../redux/actions/errors';
import { updateToken, logout } from '../redux/actions/account';
import ky from 'ky';

function useApi() {
  const account = useSelector((store: IReduxStore) => store.account);
  const err = useSelector((store: IReduxStore) => store.errors);
  const dispatch = useDispatch();

  const _setErr = useCallback(
    (errors) => {
      dispatch(setErrors(errors));
    },
    [dispatch]
  );

  const _updateToken = useCallback(
    (token) => {
      dispatch(updateToken(token));
    },
    [dispatch]
  );

  const _logout = useCallback(() => dispatch(logout()), [dispatch]);
  const api = ky.extend({
    hooks: {
      beforeRequest: [
        async (request) => {
          if (!account.rTokenExp || !account.tokenExp) return;
          request.headers.set('Content-Type', 'application/json');
          request.headers.set('cache-control', 'no-cache,no-cache');
          request.headers.set('X-Authorization', `Bearer ${account.token}`);
          request.headers.set('tenant-id', `${account.tenant}`);

          if (account?.rTokenExp < Date.now()) {
            _logout();
            return;
          }

          if (account?.tokenExp < Date.now()) {
            const headers = {
              'X-Authorization': `Bearer ${account.refreshToken}`,
              'tenant-id': `${account.tenant}`
            } as Record<string, any>;

            fetch('/Appoploo2/api/auth/token', { headers })
              .then((res) => res.json())
              .then((obj) => {
                request.headers.set('X-Authorization', obj.token);
                _updateToken(obj.token);
              });
          }
        }
      ]
    }
  });

  return api;
}

export default useApi;
