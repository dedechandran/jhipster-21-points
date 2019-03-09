import { IUser } from 'app/core/user/user.model';

export const enum Units {
    KG = 'KG',
    LB = 'LB'
}

export interface IPreference {
    id?: number;
    weeklyGoal?: number;
    weightUnits?: Units;
    user?: IUser;
}

export class Preference implements IPreference {
    constructor(public id?: number, public weeklyGoal?: number, public weightUnits?: Units, public user?: IUser) {}
}
