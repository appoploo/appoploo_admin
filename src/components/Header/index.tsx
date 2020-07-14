import React, { useState, useContext, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {
  Hidden,
  Typography,
  Theme,
  Menu,
  MenuItem,
  ListItemIcon,
  Popover,
  ListItem,
  List,
  Divider,
  ListItemText,
  Avatar
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import I18n from '../../I18n';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxStore } from '../../redux/reducers';
import { useHistory } from 'react-router-dom';
import { logout } from '../../redux/actions/account';
import { setLang } from '../../redux/actions/i18n';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    xx: {
      width: theme.spacing(4),
      height: theme.spacing(4)
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
);

type Props = {
  setOpen: () => void;
};
function Header(props: Props) {
  const classes = useStyles();

  const history = useHistory();
  const token = useSelector((store: IReduxStore) => store.account.token);
  const locale = useSelector((store: IReduxStore) => store.i18n.lang);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElLocale, setAnchorElLocale] = useState<null | HTMLElement>(
    null
  );
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();
  const _logout = React.useCallback(() => dispatch(logout()), [dispatch]);
  const _setLang = React.useCallback((locale) => dispatch(setLang(locale)), [
    dispatch
  ]);
  const t = useContext(I18n);
  return (
    <AppBar style={{ backgroundColor: '#486493' }} elevation={0}>
      <Toolbar>
        <img
          style={{ width: '190px' }}
          src="/images/Appoploo_logo_one_line.png"
        />
        <Hidden mdUp>
          <IconButton
            onClick={props.setOpen}
            edge="start"
            color="inherit"
            aria-label="menu">
            <MenuIcon />
          </IconButton>
        </Hidden>

        <Typography variant="h6" className={classes.title}></Typography>

        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={(evt) => setAnchorElLocale(evt.currentTarget)}
          color="inherit">
          <img src={`/images/${locale}.svg`} className={classes.xx} />
        </IconButton>

        {token && (
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit">
            <Avatar className={classes.xx} />
          </IconButton>
        )}
        <Popover
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          anchorEl={anchorEl}
          onClose={handleClose}
          open={open}>
          <List component="nav" aria-label="main mailbox folders">
            <ListItem onClick={_logout} button>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary={t('int.logout')} />
            </ListItem>
          </List>
          <Divider />
        </Popover>

        <Popover
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          anchorEl={anchorElLocale}
          onClose={() => setAnchorElLocale(null)}
          open={Boolean(anchorElLocale)}>
          <List component="nav" aria-label="main mailbox folders">
            <ListItem
              onClick={() => {
                _setLang('el');
                setAnchorElLocale(null);
              }}
              button>
              <ListItemIcon>
                <img src="/images/el.svg" />
              </ListItemIcon>
              <ListItemText primary={t('int.el')} />
            </ListItem>
            <ListItem
              onClick={() => {
                _setLang('en');
                setAnchorElLocale(null);
              }}
              button>
              <ListItemIcon>
                <img src="/images/en.svg" />
              </ListItemIcon>
              <ListItemText primary={t('int.en')} />
            </ListItem>
          </List>
          <Divider />
        </Popover>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
