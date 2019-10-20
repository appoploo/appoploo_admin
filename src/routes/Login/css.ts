import { css } from 'emotion';
import { mq } from '../../css';

export const loginContainer = css`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #c9d6ff; /* fallback for old browsers */
  background: linear-gradient(to right, #e2e2e2, #c9d6ff);
`;

export const cardContainer = css`
  position: relative;
  width: 65vw;
  height: 450px;
  padding: 20px;
  ${mq[1]} {
    width: 70vw;
  }

  ${mq[0]} {
    width: 80vw;
    min-height: 45vh;
  }
  display: flex;
`;

export const card = css`
  justify-content: space-beteen;
  width: 100%;
  display: flex;
`;

export const svg = css`
  top: -32px;
  left: 32px;
  color: #fff;
  width: 64px;
  height: 64px;
  padding: 8px;
  position: absolute;
  font-size: 32px;
  border-radius: 4px;
  background-image: linear-gradient(180deg, #66bb6a 0%, #43a047 100%);
`;

export const content = css`
  padding: 50px 30px 10px 30px !important;
  display: flex;
  flex-direction: column;
  flex: 1;
`;
export const media = css`
  flex: 1;
  ${mq[3]} {
    display: none !important;
    flex: 1;
  }
`;

export const btn = css`
  align-self: flex-end;
`;
