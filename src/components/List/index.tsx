import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import FlightLandIcon from '@material-ui/icons/FlightLand';
import { ListItemIcon } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '100%`',
      backgroundColor: theme.palette.background.paper
    },
    inline: {
      display: 'inline'
    }
  })
);

type Props = {
  data: {
    approach: boolean;
    dateText: string;
    geoObjectName: string;
    vesselName: string;
  }[];
};

function AlignItemsList(props: Props) {
  const classes = useStyles();

  return props.data.length > 0 ? (
    <List className={classes.root}>
      {props.data.map((notf, key) => {
        const msg = notf.approach ? 'arrived at' : 'departed from';
        const icon = notf.approach
          ? '/images/arrival.png'
          : '/images/departure.png';

        return (
          <React.Fragment key={key}>
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                <img style={{ width: '32px' }} src={icon} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <Typography
                      component="span"
                      variant="h6"
                      className={classes.inline}
                      color="textPrimary">
                      {notf.vesselName}{' '}
                    </Typography>
                    <Typography
                      component="span"
                      style={{ marginRight: '5px' }}
                      color="textSecondary">
                      {msg}
                    </Typography>

                    <Typography
                      component="span"
                      variant="h6"
                      className={classes.inline}
                      color="textPrimary">
                      {notf.geoObjectName}{' '}
                    </Typography>
                  </>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      style={{ marginRight: '5px' }}
                      color="textSecondary">
                      at
                    </Typography>
                    <Typography
                      component="span"
                      variant="h6"
                      className={classes.inline}
                      color="textPrimary">
                      <strong>{notf.dateText}</strong>
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        );
      })}
    </List>
  ) : (
    <></>
  );
}
export default AlignItemsList;
