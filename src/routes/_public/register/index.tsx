import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  TextInput,
  Tooltip,
  Select,
  FileInput,
  Button,
  Stack,
  Loader,
} from "@mantine/core";
import { ArrowRight, Info, Upload } from "lucide-react";
import { DateInput, YearPickerInput } from "@mantine/dates";
import {
  PersonalDetailsSchema,
  type PersonalDetailsFormValues,
} from "@/api/registration";
import { upload } from "@/api/upload";
import { useRegistration } from "@/contexts/registration-context";
import { RegistrationLayout } from "@/components/registration-layout";

export const Route = createFileRoute("/_public/register/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { setPersonalDetails, nextStep } = useRegistration();
  const [isUploadingProfilePicture, setIsUploadingProfilePicture] =
    useState(false);

  const form = useForm<PersonalDetailsFormValues>({
    mode: "uncontrolled",
    initialValues: {
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
    },
    validate: zod4Resolver(PersonalDetailsSchema),
  });

  const handlePhotoChange = async (file: File | null) => {
    form.clearFieldError("profilePictureUrl");

    if (!file) {
      form.setFieldValue("profilePictureUrl", "");
      return;
    }

    try {
      setIsUploadingProfilePicture(true);
      const uploadedUrl = await upload.image(file);
      form.setFieldValue("profilePictureUrl", uploadedUrl);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to upload profile picture";
      form.setFieldError("profilePictureUrl", message);
    } finally {
      setIsUploadingProfilePicture(false);
    }
  };

  const handleSubmit = (values: PersonalDetailsFormValues) => {
    setPersonalDetails(values);
    nextStep();
    navigate({ to: "/register/account" });
  };

  return (
    <RegistrationLayout
      sidebarTitle="The Prestige Application"
      sidebarDescription="Begin your journey with the association."
    >
      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-8">
        <div>
          <h2 className="font-serif text-3xl font-bold text-deep-forest mb-2">
            Personal Details
          </h2>
          <p className="text-gray-600">Tell us about yourself</p>
        </div>

        <Stack gap="md">
          {/* Name Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="Title"
              placeholder="e.g. Dr., Eng., Prof."
              key={form.key("title")}
              {...form.getInputProps("title")}
              labelProps={{
                lh: 2,
                fz: "sm",
              }}
              radius="lg"
              size="lg"
            />
            <TextInput
              label="Surname"
              placeholder="e.g. Al-Faruq"
              withAsterisk
              key={form.key("lastName")}
              {...form.getInputProps("lastName")}
              labelProps={{
                lh: 2,
                fz: "sm",
              }}
              radius="lg"
              size="lg"
            />
            <TextInput
              label="First Name"
              placeholder="e.g. Aminah"
              withAsterisk
              key={form.key("firstName")}
              {...form.getInputProps("firstName")}
              labelProps={{
                lh: 2,
                fz: "sm",
              }}
              radius="lg"
              size="lg"
            />
            <TextInput
              label="Middle Name"
              placeholder="Optional"
              key={form.key("middleName")}
              {...form.getInputProps("middleName")}
              labelProps={{
                lh: 2,
                fz: "sm",
              }}
              radius="lg"
              size="lg"
            />
            <TextInput
              label={
                <div className="flex items-center gap-1">
                  Nickname/Kunyah
                  <Tooltip
                    label="Your alias or nickname from school days, e.g., 'Abu Labeeb'"
                    multiline
                    w={220}
                  >
                    <Info className="h-3.5 w-3.5 text-gray-400" />
                  </Tooltip>
                </div>
              }
              placeholder="e.g. Abu Labeeb"
              key={form.key("nickname")}
              {...form.getInputProps("nickname")}
              labelProps={{
                lh: 2,
                fz: "sm",
              }}
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
              key={form.key("gender")}
              {...form.getInputProps("gender")}
              labelProps={{
                lh: 2,
                fz: "sm",
              }}
              radius="lg"
              size="lg"
            />
          </div>

          {/* Gender-specific and Additional Fields */}
          {form.values.gender === "female" && (
            <div className="grid grid-cols-1">
              <TextInput
                label="Maiden Name"
                placeholder="If applicable"
                key={form.key("maidenName")}
                {...form.getInputProps("maidenName")}
                labelProps={{
                  lh: 2,
                  fz: "sm",
                }}
                radius="lg"
                size="lg"
              />
            </div>
          )}

          {/* Bio Data */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DateInput
              label="Date of Birth"
              placeholder="Select date"
              withAsterisk
              maxDate={new Date()}
              valueFormat="YYYY-MM-DD"
              key={form.key("dateOfBirth")}
              {...form.getInputProps("dateOfBirth")}
              labelProps={{
                lh: 2,
                fz: "sm",
              }}
              radius="lg"
              size="lg"
            />
            <TextInput
              label="Phone Number"
              placeholder="080XXXXXXXX"
              type="tel"
              withAsterisk
              key={form.key("phoneNumber")}
              {...form.getInputProps("phoneNumber")}
              labelProps={{
                lh: 2,
                fz: "sm",
              }}
              radius="lg"
              size="lg"
            />
            <FileInput
              label="Profile Picture"
              placeholder="Upload photo"
              accept="image/*"
              leftSection={<Upload className="size-4" />}
              key={form.key("profilePictureUrl")}
              onChange={handlePhotoChange}
              disabled={isUploadingProfilePicture}
              leftSectionPointerEvents="none"
              rightSection={
                isUploadingProfilePicture ? <Loader size="sm" /> : undefined
              }
              labelProps={{
                lh: 2,
                fz: "sm",
              }}
              radius="lg"
              size="lg"
            />
            <YearPickerInput
              label="Class Set"
              withAsterisk
              maxDate={new Date()}
              placeholder="Select year"
              key={form.key("classSet")}
              {...form.getInputProps("classSet")}
              labelProps={{
                lh: 2,
                fz: "sm",
              }}
              radius="lg"
              size="lg"
            />
          </div>
        </Stack>

        {/* Submit Button */}
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
      </form>
    </RegistrationLayout>
  );
}
