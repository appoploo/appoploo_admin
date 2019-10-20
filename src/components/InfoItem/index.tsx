import React from 'react';
import { Typography } from '@material-ui/core';
import { css, cx } from 'emotion';

const container = css`
  display: flex;
  align-items: flex-start;
  padding: 5.5px;
`;

const labelClass = css`
  min-width: 150px;
  padding-right: 20px;
`;

function InfoItem(props: { label: string; value: string; className?: string }) {
  return (
    <div className={cx(container, props.className)}>
      <Typography className={labelClass} variant="h6">
        {props.label}:
      </Typography>
      <Typography>{props.value}</Typography>
    </div>
  );
}

export default InfoItem;
