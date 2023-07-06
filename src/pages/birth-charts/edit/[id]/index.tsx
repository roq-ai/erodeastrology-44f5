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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getBirthChartById, updateBirthChartById } from 'apiSdk/birth-charts';
import { Error } from 'components/error';
import { birthChartValidationSchema } from 'validationSchema/birth-charts';
import { BirthChartInterface } from 'interfaces/birth-chart';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function BirthChartEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<BirthChartInterface>(
    () => (id ? `/birth-charts/${id}` : null),
    () => getBirthChartById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: BirthChartInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateBirthChartById(id, values);
      mutate(updated);
      resetForm();
      router.push('/birth-charts');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<BirthChartInterface>({
    initialValues: data,
    validationSchema: birthChartValidationSchema,
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
            Edit Birth Chart
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="birth_time" mb="4">
              <FormLabel>Birth Time</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.birth_time ? new Date(formik.values?.birth_time) : null}
                  onChange={(value: Date) => formik.setFieldValue('birth_time', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <FormControl id="birth_place" mb="4" isInvalid={!!formik.errors?.birth_place}>
              <FormLabel>Birth Place</FormLabel>
              <Input type="text" name="birth_place" value={formik.values?.birth_place} onChange={formik.handleChange} />
              {formik.errors.birth_place && <FormErrorMessage>{formik.errors?.birth_place}</FormErrorMessage>}
            </FormControl>
            <FormControl id="birth_date" mb="4">
              <FormLabel>Birth Date</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.birth_date ? new Date(formik.values?.birth_date) : null}
                  onChange={(value: Date) => formik.setFieldValue('birth_date', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
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
    entity: 'birth_chart',
    operation: AccessOperationEnum.UPDATE,
  }),
)(BirthChartEditPage);
