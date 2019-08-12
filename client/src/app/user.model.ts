export class User {
  id: number;
  eNo: string;
  eName: string;
  eMobile: string;
  deptCode: string;
  deptName: string;
  deptType: string;
  levelName: string;
  positionName: string;

  constructor(user?: {
    id?: number,
    eNo?: string,
    eName?: string,
    eMobile?: string,
    deptCode?: string,
    deptName?: string,
    deptType?: string,
    levelName?: string,
    positionName?: string,
  }) {
    if (user) {
      Object.assign(this, user);
    }
  }
}
