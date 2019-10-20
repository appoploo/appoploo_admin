import React, { useState, useEffect, ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles({
  root: {
    maxWidth: 'none'
  },
  paper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'transparent',
    width: 'inherit',
    maxWidth: 'unset'
  }
});

export interface IProps {
  src: string;
  children: ReactNode;
  className?: string;
}

function ImageModal(props: IProps) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };

  return (
    <>
      <div className={props.className} onClick={handleClickOpen}>
        {props.children}
      </div>
      <Dialog classes={classes} onClose={handleClose} open={open}>
        <img
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }}
          src={props.src}></img>
      </Dialog>
    </>
  );
}

export default ImageModal;
