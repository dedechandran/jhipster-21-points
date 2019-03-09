import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IBlood {
    id?: number;
    date?: Moment;
    systolic?: number;
    diastolic?: number;
    user?: IUser;
}

export class Blood implements IBlood {
    constructor(public id?: number, public date?: Moment, public systolic?: number, public diastolic?: number, public user?: IUser) {}
}
