import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPrediction } from 'apiSdk/predictions';
import { Error } from 'components/error';
import { predictionValidationSchema } from 'validationSchema/predictions';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { BirthChartInterface } from 'interfaces/birth-chart';
import { getBirthCharts } from 'apiSdk/birth-charts';
import { PredictionInterface } from 'interfaces/prediction';

function PredictionCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PredictionInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPrediction(values);
      resetForm();
      router.push('/predictions');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PredictionInterface>({
    initialValues: {
      prediction_text: '',
      birth_chart_id: (router.query.birth_chart_id as string) ?? null,
    },
    validationSchema: predictionValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Prediction
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="prediction_text" mb="4" isInvalid={!!formik.errors?.prediction_text}>
            <FormLabel>Prediction Text</FormLabel>
            <Input
              type="text"
              name="prediction_text"
              value={formik.values?.prediction_text}
              onChange={formik.handleChange}
            />
            {formik.errors.prediction_text && <FormErrorMessage>{formik.errors?.prediction_text}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<BirthChartInterface>
            formik={formik}
            name={'birth_chart_id'}
            label={'Select Birth Chart'}
            placeholder={'Select Birth Chart'}
            fetcher={getBirthCharts}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.birth_place}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'prediction',
    operation: AccessOperationEnum.CREATE,
  }),
)(PredictionCreatePage);
