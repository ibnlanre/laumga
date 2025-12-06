import {
  createContext,
  useContext,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import {
  type AccountCredentialsFormValues,
  type RegistrationFormValues,
  registrationSchema,
  type LocationDetailsFormValues,
  type PersonalDetailsFormValues,
  personalDetailsSchema,
} from "@/api/registration";
import { createFormContext } from "@mantine/form";
import { usePagination } from "@mantine/hooks";
import { zod4Resolver } from "mantine-form-zod-resolver";

export type RegistrationStep = 1 | 2 | 3;
type RegistrationPanel = "steps" | "review";

const TOTAL_STEPS: RegistrationStep = 3;

export const [
  RegistrationFormProvider,
  useRegistrationForm,
  useCreateRegistrationForm,
] = createFormContext<RegistrationFormValues>();

interface RegistrationFlowContextValue {
  currentStep: RegistrationStep;
  totalSteps: number;
  activePanel: RegistrationPanel;
  goToStep: (step: RegistrationStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToPanel: (panel: RegistrationPanel) => void;
  openReviewPanel: () => void;
  closeReviewPanel: () => void;
  reset: () => void;
  markStepComplete: (step: RegistrationStep) => void;
  hasCompletedStep: (step: RegistrationStep) => boolean;
}

const RegistrationFlowContext =
  createContext<RegistrationFlowContextValue | null>(null);

const initialFormValues: RegistrationFormValues = {
  title: "",
  firstName: "",
  lastName: "",
  middleName: "",
  maidenName: "",
  nickname: "",
  gender: "male",
  profilePictureUrl: "",
  dateOfBirth: "",
  phoneNumber: "",
  classSet: null,
  countryOfOrigin: "Nigeria",
  stateOfOrigin: "",
  countryOfResidence: "Nigeria",
  stateOfResidence: "",
  address: "",
  email: "",
  password: "",
};

export function RegistrationProvider({ children }: PropsWithChildren) {
  const form = useCreateRegistrationForm({
    mode: "uncontrolled",
    initialValues: initialFormValues,
    validate: zod4Resolver(registrationSchema),
  });

  const pagination = usePagination({ total: TOTAL_STEPS, initialPage: 1 });
  const completedStepsRef = useRef<Set<RegistrationStep>>(new Set());
  const [activePanel, setActivePanel] = useState<RegistrationPanel>("steps");

  const goToStep = (step: RegistrationStep) => {
    pagination.setPage(step);
    setActivePanel("steps");
  };

  const nextStep = () => {
    pagination.next();
    setActivePanel("steps");
  };

  const previousStep = () => {
    pagination.previous();
    setActivePanel("steps");
  };

  const reset = () => {
    form.reset();
    completedStepsRef.current.clear();
    pagination.setPage(1);
    setActivePanel("steps");
  };

  const goToPanel = (panel: RegistrationPanel) => {
    setActivePanel(panel);
  };

  const openReviewPanel = () => {
    setActivePanel("review");
  };

  const closeReviewPanel = () => {
    setActivePanel("steps");
  };

  const markStepComplete = (step: RegistrationStep) => {
    completedStepsRef.current.add(step);
  };

  const hasCompletedStep = (step: RegistrationStep) =>
    completedStepsRef.current.has(step);

  const value: RegistrationFlowContextValue = {
    currentStep: pagination.active as RegistrationStep,
    totalSteps: TOTAL_STEPS,
    activePanel,
    goToStep,
    nextStep,
    previousStep,
    goToPanel,
    openReviewPanel,
    closeReviewPanel,
    reset,
    markStepComplete,
    hasCompletedStep,
  };

  return (
    <RegistrationFlowContext.Provider value={value}>
      <RegistrationFormProvider form={form}>
        {children}
      </RegistrationFormProvider>
    </RegistrationFlowContext.Provider>
  );
}

function selectPersonalDetails(
  values: RegistrationFormValues
): PersonalDetailsFormValues {
  personalDetailsSchema.keyof().options;
  const {
    title,
    firstName,
    lastName,
    middleName,
    maidenName,
    nickname,
    gender,
    profilePictureUrl,
    dateOfBirth,
    phoneNumber,
    classSet,
  } = values;

  return {
    title,
    firstName,
    lastName,
    middleName,
    maidenName,
    nickname,
    gender,
    profilePictureUrl,
    dateOfBirth,
    phoneNumber,
    classSet,
  } satisfies PersonalDetailsFormValues;
}

function selectLocationDetails(
  values: RegistrationFormValues
): LocationDetailsFormValues {
  const {
    countryOfOrigin,
    stateOfOrigin,
    countryOfResidence,
    stateOfResidence,
    address,
  } = values;

  return {
    countryOfOrigin,
    stateOfOrigin,
    countryOfResidence,
    stateOfResidence,
    address,
  } satisfies LocationDetailsFormValues;
}

function selectCredentials(
  values: RegistrationFormValues
): AccountCredentialsFormValues {
  const { email, password } = values;
  return { email, password } satisfies AccountCredentialsFormValues;
}

export function useRegistration() {
  const context = useContext(RegistrationFlowContext);
  const form = useRegistrationForm();

  if (!context) {
    throw new Error(
      "useRegistration must be used within a RegistrationProvider"
    );
  }

  const values = form.getValues();

  return {
    ...context,
    form,
    personalDetails: selectPersonalDetails(values),
    locationDetails: selectLocationDetails(values),
    credentials: selectCredentials(values),
  };
}
