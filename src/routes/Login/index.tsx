import React, { useContext, useEffect, useState, useCallback } from 'react';
import I18n from '../../I18n';
import {
  Card,
  Typography,
  CardContent,
  TextField,
  Button,
  Divider,
  CardMedia
} from '@material-ui/core';
import {
  cardContainer,
  loginContainer,
  card,
  media,
  content,
  btn
} from './css';
import CardHeader from '@material-ui/core/CardHeader';
import { format } from 'date-fns/esm';
import LockIcon from './LockIcon';
import * as R from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/actions/account';
import { useHistory } from 'react-router-dom';
import { IReduxStore } from '../../redux/reducers';

const dateNow = format(new Date(), 'EEEE dd MMMM yyyy');

const Login = () => {
  const t = useContext(I18n);
  const token = useSelector((store: IReduxStore) => store.account.token);
  const [infos, setInfos] = useState({
    username: '',
    password: ''
  });
  const [err, setErr] = useState({});

  const handleChange = useCallback(obj => {
    setInfos(s => ({ ...s, ...obj }));
  }, []);

  const dispatch = useDispatch();
  const _login = React.useCallback(data => dispatch(login(data)), [dispatch]);

  const handleSubmit = useCallback(
    (infos: { username: string; password: string }) => {
      setErr({});

      return fetch('/Appoploo2/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'cache-control': 'no-cache,no-cache'
        },
        body: JSON.stringify(infos)
      })
        .then(res => {
          if (res.status > 400) throw new Error('err');
          return res.json();
        })
        .then(data => {
          _login(data);
        })
        .catch(reason => {
          console.error(reason);
        });
    },
    []
  );

  const history = useHistory();
  useEffect(() => {
    if (Boolean(token)) history.push('/');
  }, [token]);

  return (
    <div className={loginContainer}>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit(infos);
        }}
        className={cardContainer}>
        <LockIcon />
        <Card classes={{ root: card }} elevation={3}>
          <CardContent classes={{ root: content }}>
            <CardHeader
              title={<Typography variant="h3">{t('Login')}</Typography>}
              subheader={
                <Typography variant="caption">{dateNow}</Typography>
              }></CardHeader>
            <br />
            <br />
            <TextField
              onChange={evt =>
                handleChange({
                  username: evt.currentTarget.value
                })
              }
              error={Boolean(R.propOr('', 'username', err))}
              helperText={R.propOr('', 'username', err)}
              label={t('Username')}
              required
              variant="outlined"
              fullWidth
            />

            <br />
            <TextField
              onChange={evt =>
                handleChange({
                  password: evt.currentTarget.value
                })
              }
              type="password"
              error={Boolean(R.propOr('', 'password', err))}
              helperText={R.propOr('', 'password', err)}
              label={t('Password')}
              required
              variant="outlined"
              fullWidth
            />
            <br />
            <br />
            <br />
            <Button
              classes={{ root: btn }}
              type="submit"
              size="large"
              variant="contained"
              color="secondary"
              fullWidth>
              {t('Login')}
            </Button>
          </CardContent>
          <CardMedia
            className={media}
            image="https://source.unsplash.com/random/800x600/?boat"
          />
          <Divider />
        </Card>
      </form>
    </div>
  );
};

export default Login;
