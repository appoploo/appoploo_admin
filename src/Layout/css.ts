import { css } from 'emotion';

export const container = css`
  width: 100vw;
  min-height: 100vh;
  display: grid;
  &.isSmallDevice {
    grid-template-columns: 0px 1fr;
  }
  grid-template-columns: 240px 1fr;
  grid-template-rows: 64px 1fr;
  grid-template-areas:
    'header header'
    '. main';
`;

export const header = css`
  grid-area: header;
`;

export const main = css`
  grid-area: main;
  * {
    max-width: 90vw !important;
  }
`;
