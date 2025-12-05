import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import { User, Users, ArrowRight } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";
import {
  PersonalDetailsSchema,
  type PersonalDetailsFormValues,
} from "@/services/registration-schemas";
import { useRegistration } from "@/contexts/registration-context";
import { RegistrationLayout } from "@/components/registration-layout";

export const Route = createFileRoute("/_public/register/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { setPersonalDetails, nextStep } = useRegistration();
  const [selectedGender, setSelectedGender] = useState<
    "male" | "female" | null
  >(null);

  const form = useForm<PersonalDetailsFormValues>({
    initialValues: {
      title: "",
      firstName: "",
      lastName: "",
      middleName: "",
      gender: "male",
      passportUrl: "",
      dateOfBirth: "",
      nationality: "Nigerian",
    },
    validate: zod4Resolver(PersonalDetailsSchema),
  });

  const handleGenderSelect = (gender: "male" | "female") => {
    setSelectedGender(gender);
    form.setFieldValue("gender", gender);
  };

  const handlePhotoChange = async (file: File | null) => {
    if (file) {
      // In a real app, upload to Firebase here and get URL
      // For now, create a temporary URL for the preview
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setFieldValue("passportUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (values: PersonalDetailsFormValues) => {
    setPersonalDetails(values);
    nextStep();
    navigate({ to: "/register/account" });
  };

  return (
    <RegistrationLayout>
      <div className="bg-white p-8 md:p-12">
        <div className="mb-10">
          <h1 className="font-serif text-5xl font-bold text-deep-forest">
            The Prestige Application
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Begin your journey with the association.
          </p>
        </div>
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wide text-deep-forest"
                htmlFor="title"
              >
                Title
              </label>
              <input
                className="w-full border-0 border-b-2 border-deep-forest bg-gray-50 p-3 font-serif text-lg text-deep-forest placeholder-gray-400 focus:outline-none focus:ring-0"
                id="title"
                placeholder="e.g. Dr."
                type="text"
                {...form.getInputProps("title")}
              />
            </div>
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wide text-deep-forest"
                htmlFor="surname"
              >
                Surname *
              </label>
              <input
                className="w-full border-0 border-b-2 border-deep-forest bg-gray-50 p-3 font-serif text-lg text-deep-forest placeholder-gray-400 focus:outline-none focus:ring-0"
                id="surname"
                placeholder="e.g. Al-Faruq"
                type="text"
                required
                {...form.getInputProps("lastName")}
              />
              {form.errors.lastName && (
                <p className="mt-1 text-xs text-red-500">
                  {form.errors.lastName}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wide text-deep-forest"
                htmlFor="firstName"
              >
                First Name *
              </label>
              <input
                className="w-full border-0 border-b-2 border-deep-forest bg-gray-50 p-3 font-serif text-lg text-deep-forest placeholder-gray-400 focus:outline-none focus:ring-0"
                id="firstName"
                placeholder="e.g. Aminah"
                type="text"
                required
                {...form.getInputProps("firstName")}
              />
              {form.errors.firstName && (
                <p className="mt-1 text-xs text-red-500">
                  {form.errors.firstName}
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-deep-forest">
              Gender *
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleGenderSelect("male")}
                className={`group flex flex-col items-center justify-center rounded-lg border-2 p-6 text-center transition hover:border-deep-forest focus:outline-none ${
                  selectedGender === "male"
                    ? "border-deep-forest bg-deep-forest text-vibrant-lime"
                    : "border-gray-200 bg-white text-deep-forest"
                }`}
              >
                <User
                  className={`mb-2 h-10 w-10 transition ${
                    selectedGender === "male"
                      ? "text-vibrant-lime"
                      : "text-gray-400"
                  }`}
                />
                <span className="font-semibold">Brother</span>
              </button>
              <button
                type="button"
                onClick={() => handleGenderSelect("female")}
                className={`group flex flex-col items-center justify-center rounded-lg border-2 p-6 text-center transition hover:border-deep-forest focus:outline-none ${
                  selectedGender === "female"
                    ? "border-deep-forest bg-deep-forest text-vibrant-lime"
                    : "border-gray-200 bg-white text-deep-forest"
                }`}
              >
                <Users
                  className={`mb-2 h-10 w-10 transition ${
                    selectedGender === "female"
                      ? "text-vibrant-lime"
                      : "text-gray-400"
                  }`}
                />
                <span className="font-semibold">Sister</span>
              </button>
            </div>
            {form.errors.gender && (
              <p className="mt-1 text-xs text-red-500">{form.errors.gender}</p>
            )}
          </div>
          <div>
            <ImageUpload
              label="Passport Photograph *"
              value={form.values.passportUrl}
              onChange={handlePhotoChange}
              maxSize={5 * 1024 * 1024}
            />
            {form.errors.passportUrl && (
              <p className="mt-1 text-xs text-red-500" role="alert">
                {form.errors.passportUrl}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => form.onSubmit(handleSubmit)()}
          className="mt-8 group flex w-full items-center justify-center rounded-lg bg-vibrant-lime py-5 px-6 text-lg font-bold uppercase tracking-wider text-deep-forest transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-vibrant-lime/50"
        >
          {false ? "UPLOADING PHOTO..." : "PROCEED TO ACCOUNT SETUP"}
          <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
        </button>
      </div>
    </RegistrationLayout>
  );
}
