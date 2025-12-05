import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { formatDate } from "@/utils/date";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { Checkbox, Button, Text } from "@mantine/core";
import { Edit, MapPin, CheckCircle, ArrowLeft } from "lucide-react";
import { useRegistration } from "@/contexts/registration-context";
import { useFetchChapterByState, useCreateUser } from "@/services/hooks";
import { RegistrationLayout } from "@/components/registration-layout";
import type { UserData } from "@/api/user";

export const Route = createFileRoute("/_public/register/review")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { personalDetails, locationAccount, previousStep, reset } =
    useRegistration();
  const [membershipPledge, setMembershipPledge] = useState(false);

  const createUserMutation = useCreateUser();

  const { data: chapter } = useFetchChapterByState(
    locationAccount?.stateOfResidence || ""
  );

  const handleBack = () => {
    previousStep();
    navigate({ to: "/register/account" });
  };

  const handleSubmit = async () => {
    if (!personalDetails || !locationAccount) {
      notifications.show({
        title: "Missing information",
        message: "Please complete all registration steps",
        color: "red",
      });
      navigate({ to: "/register" });
      return;
    }

    if (!membershipPledge) {
      notifications.show({
        title: "Pledge required",
        message: "Please acknowledge the membership pledge to continue",
        color: "orange",
      });
      return;
    }

    const year = new Date().getFullYear().toString().slice(-2);
    const randomId = Math.floor(Math.random() * 999)
      .toString()
      .padStart(3, "0");
    const membershipId = `LAU/${year}/${randomId}`;

    // Prepare user data
    const userData = {
      email: locationAccount.email,
      title: personalDetails.title || null,
      firstName: personalDetails.firstName,
      lastName: personalDetails.lastName,
      middleName: personalDetails.middleName || null,
      maidenName: personalDetails.maidenName || null,
      nickname: personalDetails.nickname || null,
      gender: personalDetails.gender,
      dateOfBirth: personalDetails.dateOfBirth,
      phoneNumber: personalDetails.phoneNumber,
      address: locationAccount.address,
      membershipId,
      profilePictureUrl: personalDetails.profilePictureUrl || null,
      countryOfOrigin: locationAccount.countryOfOrigin,
      stateOfOrigin: locationAccount.stateOfOrigin,
      countryOfResidence: locationAccount.countryOfResidence,
      stateOfResidence: locationAccount.stateOfResidence,
      chapterId: chapter?.id || "",
      classSet: personalDetails.classSet,
      status: "pending",
      role: "member",
      fcmToken: null,
      created: null,
      modified: null,
    } satisfies UserData;

    // Create user with Firebase Auth + Firestore
    await createUserMutation.mutateAsync({
      data: userData,
      password: locationAccount.password,
    });

    // Show success modal
    modals.open({
      title: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-vibrant-lime" />
          <Text size="xl" fw={700} c="deep-forest">
            Welcome Home,{" "}
            {personalDetails.title || personalDetails.gender === "male"
              ? "Bro. "
              : "Sis. "}
            {personalDetails.firstName}!
          </Text>
        </div>
      ),
      children: (
        <div className="text-center py-4">
          <Text size="md" c="dimmed" mb="xl">
            Your application is under review. Check your email for the
            verification link.
          </Text>
          <Button
            fullWidth
            variant="outline"
            color="deep-forest"
            size="lg"
            onClick={() => {
              modals.closeAll();
              reset();
              navigate({ to: "/login" });
            }}
          >
            Go to Login
          </Button>
        </div>
      ),
      centered: true,
      withCloseButton: false,
      closeOnClickOutside: false,
      closeOnEscape: false,
    });

    // Mutation meta will display the success notification via the global
    // mutation cache in `src/routing/query-client.ts` — no component-level
    // notifications here so the API layer controls messaging consistently.
  };
  return (
    <RegistrationLayout
      sidebarTitle="Seal Your Legacy."
      sidebarDescription="You're one step away from becoming part of something greater."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        <div>
          <h2 className="font-serif text-3xl font-bold text-deep-forest mb-2">
            Review &amp; Submit
          </h2>
          <p className="text-gray-600">
            Please verify your details to ensure your membership card and
            records are accurate.
          </p>
        </div>

        {/* Profile Summary */}
        <div className="relative rounded-lg bg-white p-6 shadow-lg border border-sage-green">
          <button
            type="button"
            onClick={() => navigate({ to: "/register" })}
            className="absolute top-4 right-4 text-institutional-green transition-transform hover:scale-110"
            aria-label="Edit personal details"
          >
            <Edit className="h-5 w-5" />
          </button>
          <div className="flex items-start gap-6">
            <div className="shrink-0">
              <img
                alt="Profile Picture"
                className="h-24 w-24 rounded-full border-4 border-institutional-green object-cover"
                src={
                  personalDetails?.profilePictureUrl ||
                  "https://via.placeholder.com/96"
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
                  <span className="font-semibold text-deep-forest">DOB:</span>{" "}
                  {personalDetails?.dateOfBirth
                    ? formatDate(personalDetails.dateOfBirth, "MMM d, yyyy")
                    : "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-deep-forest">
                    Nationality:
                  </span>{" "}
                  {locationAccount?.countryOfOrigin}
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
                    {personalDetails.classSet}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Location & Account Summary */}
        <div className="relative rounded-lg bg-mist-green p-6">
          <button
            type="button"
            onClick={() => navigate({ to: "/register/account" })}
            className="absolute top-4 right-4 text-institutional-green transition-transform hover:scale-110"
            aria-label="Edit location and account"
          >
            <Edit className="h-5 w-5" />
          </button>
          <div className="flex items-start gap-4">
            <MapPin className="h-5 w-5 text-institutional-green shrink-0 mt-1" />
            <div className="grow space-y-4">
              <div>
                {locationAccount?.countryOfResidence === "Nigeria" ? (
                  <>
                    <p className="font-semibold text-deep-forest">
                      Registered under the {chapter?.name || "Chapter"}.
                    </p>
                    <p className="text-sm text-gray-600">
                      Based on residence in {locationAccount?.stateOfResidence},
                      Nigeria.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-deep-forest">
                      International Member
                    </p>
                    <p className="text-sm text-gray-600">
                      Based in {locationAccount?.stateOfResidence},{" "}
                      {locationAccount?.countryOfResidence}.
                    </p>
                  </>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-sage-green pt-4 text-sm">
                <p>
                  <span className="font-semibold text-deep-forest">
                    Country of Origin:
                  </span>{" "}
                  {locationAccount?.countryOfOrigin}
                </p>
                <p>
                  <span className="font-semibold text-deep-forest">
                    State/Region of Origin:
                  </span>{" "}
                  {locationAccount?.stateOfOrigin}
                </p>
                <p>
                  <span className="font-semibold text-deep-forest">
                    Country of Residence:
                  </span>{" "}
                  {locationAccount?.countryOfResidence}
                </p>
                <p>
                  <span className="font-semibold text-deep-forest">
                    State/Region of Residence:
                  </span>{" "}
                  {locationAccount?.stateOfResidence}
                </p>
                <p>
                  <span className="font-semibold text-deep-forest">Email:</span>{" "}
                  {locationAccount?.email}
                </p>
                <p>
                  <span className="font-semibold text-deep-forest">
                    Password:
                  </span>{" "}
                  ••••••••
                </p>
                <p className="sm:col-span-2">
                  <span className="font-semibold text-deep-forest">
                    Address:
                  </span>{" "}
                  {locationAccount?.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Membership Pledge */}
        <div className="rounded-lg border border-sage-green p-6 bg-mist-green">
          <h4 className="font-semibold text-deep-forest mb-4">
            Membership Pledge
          </h4>
          <p className="text-sm text-deep-forest/80 mb-6">
            I hereby confirm that the information provided is accurate and
            complete. I pledge to abide by the constitution of LAUMGA, uphold
            the values of the brotherhood, and actively support the mission and
            vision of the association.
          </p>
          <Checkbox
            label="I acknowledge and accept the membership pledge"
            checked={membershipPledge}
            onChange={(e) => setMembershipPledge(e.currentTarget.checked)}
            size="lg"
            classNames={{
              label: "text-sm font-semibold text-deep-forest cursor-pointer",
            }}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 font-semibold text-deep-forest transition hover:text-institutional-green"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Account Details
          </button>
          <button
            type="submit"
            disabled={createUserMutation.isPending || !membershipPledge}
            className="rounded-lg bg-vibrant-lime py-4 px-8 text-base font-bold uppercase tracking-wider text-deep-forest transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-vibrant-lime/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createUserMutation.isPending
              ? "SUBMITTING..."
              : "SUBMIT APPLICATION"}
          </button>
        </div>
      </form>
    </RegistrationLayout>
  );
}
