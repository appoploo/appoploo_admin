import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography, Theme } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { IReduxStore } from '../../redux/reducers';
import * as R from 'ramda';
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(1),

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

function Profile() {
  const classes = useStyles();
  const account = useSelector((store: IReduxStore) => store.account);

  return (
    <div className={classes.root}>
      <Avatar
        alt="Person"
        to="/settings"
        className={classes.avatar}
        component={RouterLink}
        src={'/images/avatar.png'}
      />
      <Typography className={classes.name} variant="h4">
        {R.propOr('user', 'sub', account)}
      </Typography>
      <Typography variant="body2">{R.propOr('', 'iss', account)}</Typography>
    </div>
  );
}

export default Profile;
