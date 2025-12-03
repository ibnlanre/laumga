import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  PersonalDetailsFormValues,
  LocationAccountFormValues,
  CompleteRegistrationData,
} from "@/services/registration-schemas";

/**
 * Registration steps
 */
export type RegistrationStep = 1 | 2 | 3;

/**
 * Registration state interface
 */
interface RegistrationState {
  currentStep: RegistrationStep;
  personalDetails: PersonalDetailsFormValues | null;
  locationAccount: LocationAccountFormValues | null;
  isSubmitting: boolean;
  error: string | null;
}

/**
 * Registration context value
 */
interface RegistrationContextValue extends RegistrationState {
  // Navigation
  goToStep: (step: RegistrationStep) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Data updates
  setPersonalDetails: (data: PersonalDetailsFormValues) => void;
  setLocationAccount: (data: LocationAccountFormValues) => void;

  // Get complete data for submission
  getCompleteData: () => CompleteRegistrationData | null;

  // Submit state
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;

  // Reset
  reset: () => void;
}

const RegistrationContext = createContext<RegistrationContextValue | null>(
  null
);

/**
 * Initial state
 */
const initialState: RegistrationState = {
  currentStep: 1,
  personalDetails: null,
  locationAccount: null,
  isSubmitting: false,
  error: null,
};

/**
 * Registration Provider
 */
export function RegistrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<RegistrationState>(initialState);

  const goToStep = useCallback((step: RegistrationStep) => {
    setState((prev) => ({ ...prev, currentStep: step, error: null }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(3, prev.currentStep + 1) as RegistrationStep,
      error: null,
    }));
  }, []);

  const previousStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1) as RegistrationStep,
      error: null,
    }));
  }, []);

  const setPersonalDetails = useCallback((data: PersonalDetailsFormValues) => {
    setState((prev) => ({
      ...prev,
      personalDetails: data,
      error: null,
    }));
  }, []);

  const setLocationAccount = useCallback((data: LocationAccountFormValues) => {
    setState((prev) => ({
      ...prev,
      locationAccount: data,
      error: null,
    }));
  }, []);

  const getCompleteData = useCallback((): CompleteRegistrationData | null => {
    if (!state.personalDetails || !state.locationAccount) {
      return null;
    }

    return {
      ...state.personalDetails,
      ...state.locationAccount,
      signature: "", // Will be filled in step 3
    };
  }, [state.personalDetails, state.locationAccount]);

  const setSubmitting = useCallback((submitting: boolean) => {
    setState((prev) => ({ ...prev, isSubmitting: submitting }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const value: RegistrationContextValue = {
    ...state,
    goToStep,
    nextStep,
    previousStep,
    setPersonalDetails,
    setLocationAccount,
    getCompleteData,
    setSubmitting,
    setError,
    reset,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

/**
 * Hook to use registration context
 */
export function useRegistration() {
  const context = useContext(RegistrationContext);

  if (!context) {
    throw new Error(
      "useRegistration must be used within a RegistrationProvider"
    );
  }

  return context;
}
