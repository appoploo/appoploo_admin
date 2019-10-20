const breakpoints = [576, 768, 992, 1200, 1360, 1600];
export const mq = breakpoints.map(bp => `@media (max-width: ${bp}px)`);
