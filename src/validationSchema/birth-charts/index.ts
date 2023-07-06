import * as yup from 'yup';

export const birthChartValidationSchema = yup.object().shape({
  birth_time: yup.date().required(),
  birth_place: yup.string().required(),
  birth_date: yup.date().required(),
  user_id: yup.string().nullable(),
});
