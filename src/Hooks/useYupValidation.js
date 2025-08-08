import { useState, useCallback } from 'react';
import * as Yup from 'yup';

const useYupValidation = (validationSchema) => {
  const [errors, setErrors] = useState({});

  const validateJson = useCallback(async (data) => {
    try {
      await validationSchema.validate(data, { abortEarly: false });
      setErrors({}); // Clear errors
      return null; // No errors
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrors(createErrorObject(error));
        return error;
      } else {
        console.error('An unexpected error occurred:', error);
        setErrors({ general: error.message || 'An unexpected error occured' });
        return error;
      }
    }
  }, [validationSchema]);

  const validateField = useCallback(async (path, value) => {
    try {
      await Yup.reach(validationSchema, path).validate(value);
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[path];
        return newErrors;
      });
      return null; // No error
    } catch (err) {
      setErrors((prevErrors) => ({ ...prevErrors, [path]: err.message }));
      return err;
    }
  }, [validationSchema]);

  const createErrorObject = useCallback((validationError) => {
    if (!(validationError instanceof Yup.ValidationError)) {
      return {};
    }

    const errorObject = {};
    validationError.inner.forEach((error) => {
      errorObject[error.path] = error.message;
    });
    return errorObject;
  }, []);

  return { errors, validateJson, validateField };
};

export default useYupValidation;