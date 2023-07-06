import { BirthChartInterface } from 'interfaces/birth-chart';
import { GetQueryInterface } from 'interfaces';

export interface PredictionInterface {
  id?: string;
  prediction_text: string;
  birth_chart_id?: string;
  created_at?: any;
  updated_at?: any;

  birth_chart?: BirthChartInterface;
  _count?: {};
}

export interface PredictionGetQueryInterface extends GetQueryInterface {
  id?: string;
  prediction_text?: string;
  birth_chart_id?: string;
}
