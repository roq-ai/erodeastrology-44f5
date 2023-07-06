import { PredictionInterface } from 'interfaces/prediction';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface BirthChartInterface {
  id?: string;
  birth_time: any;
  birth_place: string;
  birth_date: any;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  prediction?: PredictionInterface[];
  user?: UserInterface;
  _count?: {
    prediction?: number;
  };
}

export interface BirthChartGetQueryInterface extends GetQueryInterface {
  id?: string;
  birth_place?: string;
  user_id?: string;
}
