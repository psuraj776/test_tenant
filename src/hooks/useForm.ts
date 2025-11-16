import { useState, useCallback } from 'react';

// Generic form hook that can be reused across different forms
export interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit?: (values: T) => void | Promise<void>;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: any) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  clearAllErrors: () => void;
  validateField: (field: keyof T) => boolean;
  validateForm: () => boolean;
  handleSubmit: () => Promise<void>;
  reset: () => void;
  setValues: (values: Partial<T>) => void;
}

export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const { initialValues, validate, onSubmit } = options;
  
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrorsState] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when value changes
    if (errors[field]) {
      setErrorsState(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const setError = useCallback((field: keyof T, error: string) => {
    setErrorsState(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  const clearError = useCallback((field: keyof T) => {
    setErrorsState(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrorsState({});
  }, []);

  const validateField = useCallback((field: keyof T): boolean => {
    if (!validate) return true;
    
    const fieldErrors = validate(values);
    const fieldError = fieldErrors[field];
    
    if (fieldError) {
      setError(field, fieldError);
      return false;
    } else {
      clearError(field);
      return true;
    }
  }, [values, validate, setError, clearError]);

  const validateForm = useCallback((): boolean => {
    if (!validate) return true;
    
    const formErrors = validate(values);
    setErrorsState(formErrors);
    
    return Object.keys(formErrors).length === 0;
  }, [values, validate]);

  const handleSubmit = useCallback(async () => {
    if (!onSubmit) return;
    
    const isValid = validateForm();
    if (!isValid) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      // Error handling can be done by the calling component
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);

  const reset = useCallback(() => {
    setValuesState(initialValues);
    setErrorsState({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({
      ...prev,
      ...newValues
    }));
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setError,
    clearError,
    clearAllErrors,
    validateField,
    validateForm,
    handleSubmit,
    reset,
    setValues,
  };
}