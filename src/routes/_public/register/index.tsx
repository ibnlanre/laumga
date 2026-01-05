import { useState, type FormEventHandler } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Tabs,
  TextInput,
  Tooltip,
  Select,
  FileInput,
  Button,
  Stack,
  Loader,
  PasswordInput,
  Text,
  Avatar,
} from "@mantine/core";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Edit,
  Info,
  Mail,
  Shield,
  Upload,
} from "lucide-react";
import { YearPickerInput } from "@mantine/dates";
import { Form } from "@mantine/form";
import { modals } from "@mantine/modals";
import { RegistrationLayout } from "@/components/registration-layout";
import { PhoneInput } from "@/components/phone-input";
import { PasswordStrengthCheck } from "@/components/password-strength-check";
import {
  useRegistration,
  useRegistrationForm,
} from "@/contexts/registration-context";
import { formatDate } from "@/utils/date";
import { useUserImageUpload } from "@/api/upload/hooks";
import { useCreateUser } from "@/api/user/hooks";
import {
  accountCredentialsSchema,
  branches,
  departmentsByFaculty,
  faculties,
  personalDetailsSchema,
} from "@/api/registration/schema";

export const Route = createFileRoute("/_public/register/")({
  head: () => ({
    meta: [
      {
        title: "Register - LAUMGA",
      },
      {
        name: "description",
        content:
          "Join the LAUMGA community of LAUTECH Muslim alumni. Register to connect with fellow graduates and access exclusive member benefits.",
      },
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { activePanel } = useRegistration();

  return (
    <Tabs
      value={activePanel}
      onChange={() => undefined}
      keepMounted={false}
      className="w-full"
    >
      <Tabs.Panel value="steps">
        <StepsPanel />
      </Tabs.Panel>
      <Tabs.Panel value="review">
        <ReviewPanel />
      </Tabs.Panel>
    </Tabs>
  );
}

function StepsPanel() {
  const { currentStep } = useRegistration();

  if (currentStep === 1) {
    return <PersonalDetailsStep />;
  }

  return <CredentialsStep />;
}

function PersonalDetailsStep() {
  const form = useRegistrationForm();
  const { nextStep, markStepComplete } = useRegistration();

  const imageQuery = useUserImageUpload();

  const handlePhotoChange = async (file: File | null) => {
    form.clearFieldError("photoUrl");

    if (!file) {
      form.setFieldValue("photoUrl", "");
      return;
    }

    imageQuery.mutate(file, {
      onSuccess(uploadedUrl) {
        form.setFieldValue("photoUrl", uploadedUrl);
      },
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    if (validatePersonalDetails(form)) return;

    form.clearErrors();
    markStepComplete(1);
    nextStep();
  };

  const faculty = form.values.faculty;
  const departmentOptions = departmentsByFaculty[faculty];

  form.watch("faculty", () => {
    form.setFieldValue("department", null);
  });

  return (
    <RegistrationLayout
      sidebarTitle="The Prestige Application"
      sidebarDescription="Begin your journey with the association."
    >
      <Form form={form} onSubmitCapture={handleSubmit} className="space-y-8">
        <div>
          <h2 className="font-serif text-3xl font-bold text-deep-forest mb-2">
            Personal Details
          </h2>
          <p className="text-gray-600">Tell us about yourself</p>
        </div>

        <Stack gap="md">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="Title"
              placeholder="e.g. Dr., Engr., Prof."
              {...form.getInputProps("title")}
              autoComplete="section-personal honorific-prefix"
              labelProps={{ lh: 2, fz: "sm" }}
              radius="lg"
              size="lg"
            />
            <TextInput
              label="Surname"
              placeholder="e.g. Al-Faruq"
              withAsterisk
              {...form.getInputProps("lastName")}
              autoComplete="section-personal family-name"
              labelProps={{ lh: 2, fz: "sm" }}
              radius="lg"
              size="lg"
            />
            <TextInput
              label="First Name"
              placeholder="e.g. Aminah"
              withAsterisk
              {...form.getInputProps("firstName")}
              autoComplete="section-personal given-name"
              labelProps={{ lh: 2, fz: "sm" }}
              radius="lg"
              size="lg"
            />
            <TextInput
              label="Middle Name"
              placeholder="Optional"
              {...form.getInputProps("middleName")}
              autoComplete="section-personal additional-name"
              labelProps={{ lh: 2, fz: "sm" }}
              radius="lg"
              size="lg"
            />
            <TextInput
              label={
                <div className="flex items-center gap-1">
                  Nickname / Kunyah
                  <Tooltip
                    withArrow
                    label="Your alias or nickname from school days or within the association."
                    multiline
                    w={280}
                  >
                    <Info className="h-3.5 w-3.5 text-gray-400" />
                  </Tooltip>
                </div>
              }
              placeholder="e.g. Abu Labeeb"
              {...form.getInputProps("nickname")}
              autoComplete="section-personal nickname"
              labelProps={{ lh: 2, fz: "sm" }}
              radius="lg"
              size="lg"
            />
            <Select
              label="Gender"
              placeholder="Select gender"
              data={[
                { value: "male", label: "Brother (Male)" },
                { value: "female", label: "Sister (Female)" },
              ]}
              withAsterisk
              {...form.getInputProps("gender")}
              autoComplete="section-personal sex"
              labelProps={{ lh: 2, fz: "sm" }}
              radius="lg"
              size="lg"
            />
          </div>

          {form.values.gender === "female" && (
            <div className="grid grid-cols-1">
              <TextInput
                label="Maiden Name"
                placeholder="If applicable"
                {...form.getInputProps("maidenName")}
                autoComplete="off"
                labelProps={{ lh: 2, fz: "sm" }}
                radius="lg"
                size="lg"
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Branch"
              placeholder="Select your branch"
              data={branches}
              withAsterisk
              searchable
              {...form.getInputProps("branch")}
              autoComplete="section-personal address-level2"
              labelProps={{ lh: 2, fz: "sm" }}
              radius="lg"
              size="lg"
            />
            <PhoneInput
              label="Phone Number"
              placeholder="080XXXXXXXX"
              {...form.getInputProps("phoneNumber")}
              withAsterisk
              autoComplete="section-personal tel-national"
              labelProps={{ lh: 2, fz: "sm" }}
              radius="lg"
              size="lg"
            />

            <FileInput
              label="Profile Picture"
              placeholder="Upload photo"
              accept="image/*"
              clearable
              leftSection={<Upload className="size-4" />}
              onChange={handlePhotoChange}
              disabled={imageQuery.isPending}
              leftSectionPointerEvents="none"
              rightSection={
                imageQuery.isPending ? <Loader size="sm" /> : undefined
              }
              labelProps={{ lh: 2, fz: "sm" }}
              radius="lg"
              size="lg"
            />
            <YearPickerInput
              label="Class Set"
              withAsterisk
              maxDate={new Date()}
              placeholder="Select year"
              {...form.getInputProps("classSet")}
              labelProps={{ lh: 2, fz: "sm" }}
              radius="lg"
              size="lg"
            />

            <Select
              label="Faculty"
              withAsterisk
              clearable
              searchable
              placeholder="Select your faculty"
              data={faculties}
              {...form.getInputProps("faculty")}
              autoComplete="section-education faculty"
              labelProps={{ lh: 2, fz: "sm" }}
              radius="lg"
              size="lg"
            />

            <Select
              label="Department"
              withAsterisk
              clearable
              searchable
              placeholder="Enter your department"
              data={departmentOptions || []}
              {...form.getInputProps("department")}
              autoComplete="section-education department"
              labelProps={{ lh: 2, fz: "sm" }}
              radius="lg"
              size="lg"
            />
          </div>
        </Stack>

        <Button
          type="submit"
          fullWidth
          radius="lg"
          autoContrast
          tt="uppercase"
          size="lg"
          fz="sm"
          className="bg-vibrant-lime text-deep-forest font-bold hover:brightness-105"
        >
          Proceed to Account Setup
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Form>
    </RegistrationLayout>
  );
}

function CredentialsStep() {
  const form = useRegistrationForm();
  const { previousStep, markStepComplete, openReviewPanel } = useRegistration();

  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  form.watch("password", ({ value }) => setPassword(value));

  const handleSubmit = () => {
    if (validateCredentials(form)) return;

    form.clearErrors();
    markStepComplete(2);
    openReviewPanel();
  };

  return (
    <RegistrationLayout
      sidebarTitle="Secure Your Access."
      sidebarDescription="Create your login credentials to finalize the process."
    >
      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">
        <div>
          <h2 className="font-serif text-3xl font-bold text-deep-forest mb-2">
            Account Credentials
          </h2>
          <p className="text-gray-600">
            Use a valid email and a strong password to protect your profile.
          </p>
        </div>

        <Stack gap="lg">
          <TextInput
            label="Email Address"
            placeholder="you@laumga.org"
            type="email"
            withAsterisk
            leftSection={<Mail size={16} />}
            {...form.getInputProps("email")}
            autoComplete="section-credentials email"
            labelProps={{ lh: 2, fz: "sm" }}
            radius="lg"
            size="lg"
          />

          <div className="space-y-3">
            <PasswordInput
              label="Create Password"
              placeholder="••••••••••••"
              withAsterisk
              visible={isPasswordVisible}
              onVisibilityChange={setPasswordVisible}
              leftSection={<Shield size={16} />}
              {...form.getInputProps("password")}
              autoComplete="section-credentials new-password"
              labelProps={{ lh: 2, fz: "sm" }}
              radius="lg"
              size="lg"
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="••••••••••••"
              withAsterisk
              visible={isPasswordVisible}
              onVisibilityChange={setPasswordVisible}
              leftSection={<Shield size={16} />}
              {...form.getInputProps("confirmPassword")}
              autoComplete="section-credentials new-password"
              labelProps={{ lh: 2, fz: "sm" }}
              radius="lg"
              size="lg"
            />

            <PasswordStrengthCheck password={password} />
          </div>
        </Stack>

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={previousStep}
            className="flex items-center gap-2 font-semibold text-deep-forest transition hover:text-institutional-green"
          >
            <ArrowLeft size={16} />
            Back to Personal Details
          </button>
          <Button
            type="submit"
            radius="lg"
            autoContrast
            tt="uppercase"
            size="lg"
            fz="sm"
            className="bg-vibrant-lime text-deep-forest font-bold hover:brightness-105"
          >
            Review Application
            <ArrowRight className="ml-2" size={18} />
          </Button>
        </div>
      </form>
    </RegistrationLayout>
  );
}

function ReviewPanel() {
  const { form, personalDetails, credentials, closeReviewPanel, goToStep } =
    useRegistration();

  const { mutate, isPending } = useCreateUser();
  const navigate = useNavigate();

  const handleEdit = (step: 1 | 2) => {
    closeReviewPanel();
    goToStep(step);
  };

  const handleSubmit = async (data: typeof form.values) => {
    mutate(
      { data },
      {
        onSuccess() {
          const salutation = data.title
            ? data.title + " "
            : data.gender === "male"
              ? "Bro. "
              : "Sis. ";

          modals.open({
            padding: 0,
            radius: "xl",
            centered: true,
            withCloseButton: false,
            closeOnClickOutside: false,
            closeOnEscape: false,
            children: (
              <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="bg-linear-to-r from-deep-forest via-institutional-green to-vibrant-lime px-6 py-5 text-white">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-white/20 p-3 shadow-inner">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                        Registration complete
                      </p>
                      <p className="font-serif text-2xl font-semibold leading-snug">
                        Welcome home, {salutation}
                        {data.firstName}!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 px-8 py-8 text-center">
                  <Text size="lg" c="dimmed">
                    You're good to go. Head to the login page to access your
                    account and explore the dashboard.
                  </Text>
                  <Button
                    size="lg"
                    radius="xl"
                    className="bg-institutional-green text-white font-semibold shadow-lg transition hover:brightness-110"
                    fullWidth
                    onClick={() => {
                      modals.closeAll();
                      navigate({ to: "/login" });
                    }}
                  >
                    Go to Login
                  </Button>
                </div>
              </div>
            ),
          });
        },
      }
    );
  };

  return (
    <RegistrationLayout
      showStepper={false}
      sidebarTitle="Seal Your Legacy."
      sidebarDescription="You're one step away from becoming part of something greater."
    >
      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">
        <div>
          <h2 className="font-serif text-3xl font-bold text-deep-forest mb-2">
            Review & Submit
          </h2>
          <p className="text-gray-600">
            Please verify your details to ensure your membership card and
            records are accurate.
          </p>
        </div>

        <div className="relative rounded-lg bg-white p-6 shadow-lg border border-sage-green">
          <button
            type="button"
            onClick={() => handleEdit(1)}
            className="absolute top-4 right-4 text-institutional-green transition-transform hover:scale-110"
            aria-label="Edit personal details"
          >
            <Edit className="h-5 w-5" />
          </button>
          <div className="flex items-start gap-6">
            <div className="shrink-0">
              <Avatar
                size={24}
                alt="Profile Picture"
                radius="xl"
                className="rounded-full border-[1.75px] border-institutional-green object-cover"
                src={
                  personalDetails?.photoUrl || "https://via.placeholder.com/96"
                }
              />
            </div>
            <div className="grow space-y-3">
              <div>
                <h3 className="font-serif text-2xl font-bold text-deep-forest">
                  {personalDetails?.title} {personalDetails?.firstName}{" "}
                  {personalDetails?.middleName &&
                    `${personalDetails.middleName} `}
                  {personalDetails?.lastName}
                </h3>
                {personalDetails?.nickname && (
                  <p className="text-sm text-gray-600 italic">
                    "{personalDetails.nickname}"
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <p>
                  <span className="font-semibold text-deep-forest">
                    Gender:
                  </span>{" "}
                  {personalDetails?.gender === "male" ? "Male" : "Female"}
                </p>
                {personalDetails?.maidenName && (
                  <p>
                    <span className="font-semibold text-deep-forest">
                      Maiden Name:
                    </span>{" "}
                    {personalDetails.maidenName}
                  </p>
                )}
                <p>
                  <span className="font-semibold text-deep-forest">
                    Branch:
                  </span>{" "}
                  {personalDetails?.branch}
                </p>
                <p>
                  <span className="font-semibold text-deep-forest">Phone:</span>{" "}
                  {personalDetails?.phoneNumber}
                </p>
                {personalDetails?.classSet && (
                  <p>
                    <span className="font-semibold text-deep-forest">
                      Class Set:
                    </span>{" "}
                    {formatDate(personalDetails.classSet, "yyyy")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative rounded-lg bg-white p-6 shadow-lg border border-sage-green">
          <button
            type="button"
            onClick={() => handleEdit(2)}
            className="absolute top-4 right-4 text-institutional-green transition-transform hover:scale-110"
            aria-label="Edit account credentials"
          >
            <Edit className="h-5 w-5" />
          </button>
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-deep-forest">
              Account Security
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <p>
                <span className="font-semibold text-deep-forest">Email:</span>{" "}
                {credentials.email || "Not provided"}
              </p>
              <p>
                <span className="font-semibold text-deep-forest">
                  Password:
                </span>{" "}
                ••••••••
              </p>
            </div>
            <p className="text-sm text-gray-600">
              You can reset your password at any time after completing
              registration.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => handleEdit(2)}
            className="flex items-center gap-2 font-semibold text-deep-forest transition hover:text-institutional-green"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Credentials
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-vibrant-lime py-4 px-8 text-base font-bold uppercase tracking-wider text-deep-forest transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-vibrant-lime/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "SUBMITTING..." : "SUBMIT APPLICATION"}
          </button>
        </div>
      </form>
    </RegistrationLayout>
  );
}

function validatePersonalDetails(form: ReturnType<typeof useRegistrationForm>) {
  const { errors } = form.validate();
  const { options } = personalDetailsSchema.keyof();
  return options.some((field) => field in errors);
}

function validateCredentials(form: ReturnType<typeof useRegistrationForm>) {
  const { errors } = form.validate();
  const { options } = accountCredentialsSchema.keyof();
  return options.some((field) => field in errors);
}
