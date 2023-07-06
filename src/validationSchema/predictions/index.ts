import * as yup from 'yup';

export const predictionValidationSchema = yup.object().shape({
  prediction_text: yup.string().required(),
  birth_chart_id: yup.string().nullable(),
});
