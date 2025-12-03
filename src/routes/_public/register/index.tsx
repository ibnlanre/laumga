import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/services/firebase";
import {
  PersonalDetailsSchema,
  type PersonalDetailsFormValues,
} from "@/services/registration-schemas";
import { useRegistration } from "@/contexts/registration-context";

export const Route = createFileRoute("/_public/register/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { setPersonalDetails, nextStep } = useRegistration();
  const [selectedGender, setSelectedGender] = useState<
    "male" | "female" | null
  >(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notifications.show({
        title: "File too large",
        message: "Please select a photo smaller than 5MB",
        color: "red",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      notifications.show({
        title: "Invalid file type",
        message: "Please select an image file (JPG, PNG, etc.)",
        color: "red",
      });
      return;
    }

    setUploadingPhoto(true);
    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Firebase Storage
      const storageRef = ref(storage, `passports/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      form.setFieldValue("passportUrl", downloadURL);
      notifications.show({
        title: "Photo uploaded",
        message: "Your passport photo has been uploaded successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      notifications.show({
        title: "Upload failed",
        message: "Failed to upload photo. Please try again.",
        color: "red",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = (values: PersonalDetailsFormValues) => {
    setPersonalDetails(values);
    nextStep();
    navigate({ to: "/register/account" });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display">
      <div className="flex min-h-screen">
        <div
          className="fixed top-0 left-0 flex h-full w-[35%] flex-col bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFPgQiMy1t8UPUYOq8JLndAhaDNR-lRB5MBSDdCdD2922RIG9gUdYkgU9HBoFHWHtCO1E1cKg2DcLvdLuSYsufdzR3wBgxlMnUtAIL2IUJv4nhOH7DUdTaW-16Ls300Z2kiir6mmznxhoJwCkLOxxDJBjrDlsa8Uo3u8LiTwXIpbVDzp7_8X933lOAPJNzWoOr_L6HdcHSpDaQ6O6_JJaGl5wLv7Vd0Zo3lXcyudkg-HWUp7ydIm0NVxq3ZCDZK0_7BZf9sVfmSsM')",
          }}
        >
          <div
            className="absolute inset-0 h-full w-full bg-deep-forest mix-blend-multiply"
            style={{ opacity: 0.9 }}
          />
          <div
            className="absolute bottom-0 left-0 h-1/3 w-full bg-contain bg-bottom bg-no-repeat opacity-20"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqsIk7zGl4JAO1nz5hEePmOHS1c2sO8RS-tJhXvnXsTdt3Wcz7WCuEOCfiAVzHcvDorSXjPsGtu4JE6pwe0jgvYQ7MnidBN8IgI11mTtyB0DxBw7pjqOoXU0iNlUMNhvDJ3NUSnrA4PIzuTu1iDY459MUBiTb8eA5tkhIKHL2m1iwA4rW9DGQqyzwT_mYr_HFEraAP9gi_VyP7vN4wy3EgpyWu8i9792AHgyFBX6ZmCiOEvBUNIjd_UXWhRmrJIroprjrInPEWkzM')",
            }}
          />
          <div className="relative z-10 flex h-full flex-col p-12 text-white">
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <p className="font-serif text-4xl italic leading-relaxed">
                "Joining LAUMGA was the turning point..."
              </p>
            </div>
            <div className="shrink-0 text-center">
              <p className="text-white/80">
                Already a member?
                <a
                  className="font-semibold text-vibrant-lime underline hover:text-white"
                  href="#"
                >
                  Log in here.
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="ml-[35%] w-[65%] bg-mist-green">
          <div className="flex h-full min-h-screen w-full flex-col bg-white">
            <div className="grow p-20 pb-40">
              <div className="mb-10">
                <h1 className="font-serif text-5xl font-bold text-deep-forest">
                  The Prestige Application
                </h1>
                <p className="mt-2 text-lg text-gray-500">
                  Begin your journey with the association.
                </p>
              </div>
              <div className="mb-12 w-full">
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-2 rounded-full bg-deep-forest" />
                  <div className="h-2 rounded-full bg-sage-green" />
                  <div className="h-2 rounded-full bg-sage-green" />
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-deep-forest">
                  01. Personal Details
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
                      className="w-full border-0 border-b-2 border-deep-forest bg-[#F9F9F9] p-3 font-serif text-lg text-deep-forest placeholder-gray-400 focus:outline-none focus:ring-0"
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
                      className="w-full border-0 border-b-2 border-deep-forest bg-[#F9F9F9] p-3 font-serif text-lg text-deep-forest placeholder-gray-400 focus:outline-none focus:ring-0"
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
                      className="w-full border-0 border-b-2 border-deep-forest bg-[#F9F9F9] p-3 font-serif text-lg text-deep-forest placeholder-gray-400 focus:outline-none focus:ring-0"
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
                      <span
                        className={`material-symbols-outlined mb-2 text-4xl transition ${
                          selectedGender === "male"
                            ? "text-vibrant-lime"
                            : "text-gray-400"
                        }`}
                      >
                        person
                      </span>
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
                      <span
                        className={`material-symbols-outlined mb-2 text-4xl transition ${
                          selectedGender === "female"
                            ? "text-vibrant-lime"
                            : "text-gray-400"
                        }`}
                      >
                        person_4
                      </span>
                      <span className="font-semibold">Sister</span>
                    </button>
                  </div>
                  {form.errors.gender && (
                    <p className="mt-1 text-xs text-red-500">
                      {form.errors.gender}
                    </p>
                  )}
                </div>
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-deep-forest">
                    Passport Photograph *
                  </p>
                  <label
                    htmlFor="photo-upload"
                    className="relative flex h-64 w-full max-w-sm cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-300 bg-gray-50 p-6 text-center transition hover:bg-gray-100"
                  >
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Passport preview"
                        className="h-full w-full object-cover rounded-xl"
                      />
                    ) : (
                      <>
                        <div className="absolute top-4 left-4">
                          <img
                            alt="LAUMGA Logo"
                            className="h-8 w-auto opacity-10"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-mCaudotKAUQREWvhnGfDZIu0UTM83BRs4q00AyXlIpqAB5CqLQaIrbIaY4sCugdbE2YauthApAwSVCqg9peXis1Y0b-FWu3FmjtvpVM_2LHHkp5K2qJQbgmuZJjHHiupK0YUdcOLrtQzWXWzxr9JwahszTveAJCxHUR2BLSP7LGlstUVFJBopmOd7LPSZ7PhZz6PV7gyeo3cHPQhnUTBIDW5yBgvV1DxwsCmU6Wo53eZxImD9LEssQ6jzxX4fOh1-TMiDJT8q_Q"
                          />
                        </div>
                        <div className="flex flex-col items-center text-institutional-green">
                          <span className="material-symbols-outlined text-5xl">
                            {uploadingPhoto
                              ? "hourglass_empty"
                              : "add_photo_alternate"}
                          </span>
                          <p className="mt-2 text-sm font-semibold">
                            {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                          </p>
                        </div>
                        <p className="mt-4 text-xs text-gray-500">
                          This photo will be printed on your membership card.
                          Please use a formal background.
                        </p>
                      </>
                    )}
                    <input
                      id="photo-upload"
                      className="hidden"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                    />
                  </label>
                  {form.errors.passportUrl && (
                    <p className="mt-1 text-xs text-red-500" role="alert">
                      {form.errors.passportUrl}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="fixed bottom-0 right-0 w-[65%] bg-linear-to-t from-white to-white/0 p-8 pt-16">
            <button
              type="button"
              onClick={() => form.onSubmit(handleSubmit)()}
              disabled={uploadingPhoto}
              className="group flex w-full items-center justify-center rounded-lg bg-vibrant-lime py-5 px-6 text-lg font-bold uppercase tracking-wider text-deep-forest transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-vibrant-lime/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingPhoto
                ? "UPLOADING PHOTO..."
                : "PROCEED TO ACCOUNT SETUP"}
              <span className="material-symbols-outlined ml-3 transition-transform group-hover:translate-x-2">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
