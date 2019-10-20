import React, { ReactNode } from 'react';
import { Theme, IconButton, Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    display: 'flex',
    background: '#fff',
    paddingRight: '10px',
    height: '60px',
    alignItems: 'center'
  },
  spacer: {
    marginLeft: 'auto'
  }
}));

type Props = {
  children: ReactNode;
};

function ActionHeader(props: Props) {
  const classes = useStyles();
  const history = useHistory();
  return (
    <Card className={classes.header}>
      <IconButton onClick={() => history.goBack()}>
        <ArrowBackIcon />
      </IconButton>

      <span className={classes.spacer} />
      {props.children}
    </Card>
  );
}
export default ActionHeader;
