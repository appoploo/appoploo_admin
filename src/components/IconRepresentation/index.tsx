import React, { ReactNode } from 'react';
import { Typography } from '@material-ui/core';

function IconRepresentation(props: { howMany: number; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        minWidth: '65px'
      }}>
      {props.howMany > 0 ? (
        <>
          {props.children}
          <Typography style={{ marginLeft: '10px' }} variant="body2">
            x {props.howMany}
          </Typography>
        </>
      ) : (
        '-'
      )}
    </div>
  );
}

export default IconRepresentation;
