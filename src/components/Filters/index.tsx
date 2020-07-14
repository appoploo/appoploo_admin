import React, {
  useContext,
  useCallback,
  useState,
  useEffect,
  useMemo
} from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import FilterListIcon from '@material-ui/icons/FilterList';
import {
  TextField,
  MenuItem,
  Typography,
  Card,
  IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import queryString from 'query-string';
import Calendar from 'react-calendar';
import I18n from '../../I18n';
import { FilterType } from './types';
import { useHistory } from 'react-router-dom';
import { formatDate } from '../../utils';
import { cx } from 'emotion';

const useStyles = makeStyles((theme: Theme) => ({
  list: {
    width: 330,
    padding: 10
  },

  range: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rangeTextfield: {
    width: '135px'
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  header: {
    display: 'flex',
    padding: '0 15px 0 15px',
    alignItems: 'center',
    background: '#fff',
    height: '60px',
    overflowX: 'scroll'
  },
  spacer: {
    marginLeft: 'auto'
  },
  giveMeMargin: { minWidth: '100px', marginRight: '20px' },

  closeBtnIcon: {
    marginRight: theme.spacing(1)
  }
}));

type Props = {
  filterConf: FilterType[];
  onSubmit: (obj: Record<string, any>) => void;
};

function Filters(props: Props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<Record<string, any>>({});
  const history = useHistory();
  const t = useContext(I18n);

  const handleChangeValue = useCallback((obj: Record<string, any>) => {
    setState((s) => ({ ...s, ...obj }));
  }, []);

  useEffect(() => {
    const params = queryString.parse(history.location.search);
    setState(params);
  }, [open, history]);

  function getComponent(obj: FilterType) {
    switch (obj.type) {
      case 'select':
        return (
          <TextField
            label={obj.label}
            fullWidth
            select
            margin="dense"
            value={state[obj.keyName] || 'All'}
            onChange={(e) =>
              e.target.value === 'All'
                ? handleChangeValue({ [obj.keyName]: undefined })
                : handleChangeValue({ [obj.keyName]: e.target.value })
            }
            variant="outlined">
            {obj.options.map((obj, idx) => (
              <MenuItem key={idx} value={obj.value}>
                {obj.label}
              </MenuItem>
            ))}
          </TextField>
        );

      case 'range':
        return (
          <div className={classes.range}>
            <TextField
              className={cx(classes.rangeTextfield, 'margin')}
              type={'number'}
              margin="dense"
              label={obj.labelMin}
              value={state[obj.keyNameMin] || ''}
              onChange={(e) =>
                handleChangeValue({ [obj.keyNameMin]: e.target.value })
              }
              variant="outlined"
            />
            <div>-</div>
            <TextField
              className={classes.rangeTextfield}
              type={'number'}
              margin="dense"
              label={obj.labelMax}
              value={state[obj.keyNameMax] || ''}
              onChange={(e) =>
                handleChangeValue({ [obj.keyNameMax]: e.target.value })
              }
              variant="outlined"
            />
          </div>
        );

      case 'date':
        const dateValues = state[obj.keyNameFrom]
          ? [new Date(+state[obj.keyNameFrom])]
          : undefined;

        return (
          <Calendar
            onChange={(date) => {
              const d = new Date(date as Date).getTime();
              handleChangeValue({
                [obj.keyNameFrom]: d
              });
            }}
            value={dateValues}
          />
        );

      case 'number':
        return (
          <TextField
            label={obj.label}
            fullWidth
            type="number"
            margin="dense"
            value={state[obj.keyName] || ''}
            onChange={(e) =>
              handleChangeValue({ [obj.keyName]: e.target.value })
            }
            variant="outlined"
          />
        );

      default:
        break;
    }
  }

  function handleSubmit() {
    const params = queryString.parse(history.location.search);
    const newParams = { ...params, ...state };
    const url = queryString.stringify(newParams);
    history.push(`?${url}`);
    props.onSubmit({ ...state });
    setOpen(false);
  }

  function handleClear() {
    const clearObj = Object.keys(state).reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: undefined
      }),
      {}
    );
    setState(clearObj);
  }

  const filtersInfo = props.filterConf
    .map((obj) => {
      return obj.type === 'date'
        ? [
            {
              label: [obj.label],
              value: [formatDate(Number(state[obj.keyNameFrom]))].join(' - ')
            }
          ]
        : obj.type === 'range'
        ? [
            {
              label: [obj.label],
              value: [state[obj.keyNameMin], state[obj.keyNameMax]].join(' - ')
            }
          ]
        : obj.type === 'select'
        ? {
            label: [obj.label],
            value: obj.setLabelValue(state[obj.keyName])
          }
        : {
            label: '',
            value: ''
          };
    })
    .flatMap((e) => e);

  return (
    <>
      <Card className={classes.header}>
        {filtersInfo.map((obj, idx) => (
          <div key={idx} className={classes.giveMeMargin}>
            <Typography variant="caption">{obj.label}</Typography>
            <br />
            <Typography variant="body2">{obj.value || '-'}</Typography>
          </div>
        ))}
        <span className={classes.spacer} />

        <Button
          title={t('int.filters')}
          onClick={() => setOpen(!open)}
          color="primary">
          <Typography variant="h5" style={{ marginRight: '20px' }}>
            {t('int.filters')}
          </Typography>

          <FilterListIcon />
        </Button>
      </Card>
      <br />

      <Drawer
        variant="temporary"
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}>
        <div className={classes.list}>
          <Button onClick={() => setOpen(false)}>
            <CloseIcon className={classes.closeBtnIcon} />
            <Typography variant="h6">{t('int.close')}</Typography>
          </Button>
          <br />
          <br />
          <Divider />

          {props.filterConf.map((obj, idx) => (
            <ListItem key={idx}>{getComponent(obj)}</ListItem>
          ))}

          <br />
          <br />

          <ListItem>
            <Button
              onClick={handleClear}
              fullWidth
              color="default"
              variant="contained">
              <DeleteOutlineIcon className={classes.icon} />
              {t('int.clear')}
            </Button>
          </ListItem>

          <ListItem>
            <Button
              onClick={handleSubmit}
              fullWidth
              color="primary"
              variant="contained">
              {t('int.apply-filters')}
            </Button>
          </ListItem>
        </div>
      </Drawer>
    </>
  );
}
export default Filters;
