import React, { useContext, forwardRef } from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import I18n from '../../I18n';
import { Button, Theme, colors } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import Profile from './Profiles';
import DirectionsBoatIcon from '@material-ui/icons/DirectionsBoat';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { subWeeks } from 'date-fns/esm';

const defaultFrom = subWeeks(Date.now(), 4).getTime();
const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    height: 'calc(100% - 64px)',
    marginTop: '64px',
    width: '240px'
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(1, 2)
  },
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: colors.blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    color: '#546E7A',
    marginRight: theme.spacing(1)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  }
}));

const CustomRouterLink = forwardRef((props: any, ref: any) => (
  <div ref={ref} style={{ flexGrow: 1 }}>
    <NavLink {...props} />
  </div>
));

type Props = {
  open: boolean;
  setOpen: () => void;
  isSmallDevice: boolean;
};

function Menu(props: Props) {
  const t = useContext(I18n);
  const pages = [
    {
      title: t('Vessels'),
      href: '/vessels',
      icon: <DirectionsBoatIcon />,
      exact: false,
      perm: []
      //   perm: ['report:view']
    },
    {
      title: t('Notifications'),
      href: `/notifications?from=${defaultFrom}&to=${Date.now()}`,
      icon: <NotificationsIcon />,
      exact: false,
      perm: []
      //   perm: ['report:view']
    }
  ];
  const classes = useStyles();
  return (
    <Drawer
      classes={{ paper: classes.drawer }}
      onClose={() => props.setOpen()}
      variant={props.isSmallDevice ? 'temporary' : 'persistent'}
      open={props.open}>
      <div className={classes.root}>
        <Profile />
        <Divider className={classes.divider} />
        <List>
          {pages.map((page) => (
            <ListItem key={page.title} className={classes.item} disableGutters>
              <Button
                exact={page.exact}
                activeClassName={classes.active}
                className={classes.button}
                component={CustomRouterLink}
                to={page.href}>
                <div className={classes.icon}>{page.icon}</div>
                {page.title}
              </Button>
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
}
export default Menu;
