'use strict';

export const r2gSmokeTest = async () => {
  return true;
};

export interface Registry {
  list: Array<{src:string,dest:string}>
}