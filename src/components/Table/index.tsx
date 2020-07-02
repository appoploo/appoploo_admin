import React, { useContext, useMemo, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { TextField, InputAdornment } from '@material-ui/core';
import I18n from '../../I18n';
import SearchIcon from '@material-ui/icons/Search';
import { Columns, Data } from './types';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import * as R from 'ramda';
import { debounce } from '../../utils';
import { cx } from 'emotion';

const useStyles = makeStyles({
  root: {
    width: 'calc(100% - 20px)',
    padding: '10px'
  },
  container: {
    maxHeight: `59vh`
  },
  searchTermCont: {
    display: 'flex',
    padding: '10px',
    height: '20px'
  },
  textField: {
    width: '200px'
  },
  loading: {
    opacity: 0.5
  },
  underline: {
    '&::before': {
      borderBottom: 'solid 1px #0002'
    },
    '&::after': {
      borderBottom: 'solid 1px #0005'
    },
    '&:hover': {
      '&::before': {
        borderBottom: 'solid 1px #0005 !important'
      }
    }
  }
});

type Props = {
  columns: Columns;
  data: Data;
  onChange: (e: Record<string, any>) => void;
  loading?: boolean;
  hideSearch?: boolean;
};

function MaterialTable(props: Props) {
  const classes = useStyles();

  const t = useContext(I18n);
  const history = useHistory();
  const debouncePush = debounce(history.push, 200);
  const debounceOnChange = debounce(props.onChange, 200);
  const params = queryString.parse(history.location.search);

  const filters = useMemo(
    () => ({
      offset: params.offset,
      limit: params.limit,
      searchTerm: params.searchTerm
    }),
    [params]
  );
  useEffect(() => {
    const url = queryString.stringify({ offset: 0, limit: 10, ...params });
    history.replace(`?${url}`);
  }, []);

  const handleChange = useCallback(
    (obj: Record<string, any>) => {
      const url = queryString.stringify({ ...params, ...obj });
      debounceOnChange({ ...filters, ...obj });
      debouncePush(`?${url}`);
    },
    [params]
  );

  return (
    <Paper className={classes.root}>
      <div className={classes.searchTermCont}>
        {!props.hideSearch && (
          <TextField
            InputProps={{
              classes: { underline: classes.underline },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            className={cx(classes.textField, 'without-padding')}
            defaultValue={R.propOr('', 'searchTerm', params)}
            onChange={(evt) => {
              const searchTerm =
                evt.currentTarget.value === ''
                  ? undefined
                  : evt.currentTarget.value;
              handleChange({ searchTerm, offset: 0 });
            }}
            placeholder={t('int.search')}
          />
        )}
      </div>
      <br />
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {props.columns.map((column, idx) => (
                <TableCell key={idx} align={'left'}>
                  {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className={cx({ [classes.loading]: props.loading })}>
            {props.data.map((row, idx) => (
              <TableRow key={idx} hover role="checkbox" tabIndex={-1}>
                {props.columns.map((column, idx) => (
                  <TableCell key={idx}>
                    {'render' in column
                      ? column.render(row, idx)
                      : row[column.field] || '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
export default MaterialTable;
