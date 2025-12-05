import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { TextInput, Button, Text } from "@mantine/core";
import { Edit, MapPin, Lock, CheckCircle } from "lucide-react";
import { useRegistration } from "@/contexts/registration-context";
import { useFetchChapterByState, useCreateUser } from "@/services/hooks";
import { RegistrationLayout } from "@/components/registration-layout";
import type { User } from "@/api/user";

export const Route = createFileRoute("/_public/register/review")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { personalDetails, locationAccount, previousStep, reset } =
    useRegistration();
  const [signature, setSignature] = useState("");

  const createUserMutation = useCreateUser();

  // Fetch chapter based on state of residence
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

    if (!signature.trim()) {
      notifications.show({
        title: "Signature required",
        message: "Please provide your signature to complete registration",
        color: "orange",
      });
      return;
    }

    try {
      // Generate nickname from first name
      const nickname = personalDetails.firstName.toLowerCase();

      // Generate membership ID (simplified - in production, use a counter)
      const year = new Date().getFullYear().toString().slice(-2);
      const randomId = Math.floor(Math.random() * 999)
        .toString()
        .padStart(3, "0");
      const membershipId = `LAU/${year}/${randomId}`;

      // Prepare user data
      const userData: User = {
        email: locationAccount.email,
        title: personalDetails.title || null,
        firstName: personalDetails.firstName,
        lastName: personalDetails.lastName,
        middleName: personalDetails.middleName || null,
        maidenName: null,
        nickname,
        gender: personalDetails.gender,
        dateOfBirth: personalDetails.dateOfBirth,
        nationality: personalDetails.nationality || "Nigerian",
        phoneNumber: locationAccount.phoneNumber,
        address: locationAccount.address,
        membershipId,
        passportUrl: personalDetails.passportUrl,
        stateOfOrigin: locationAccount.stateOfOrigin,
        stateOfResidence: locationAccount.stateOfResidence,
        chapterId: chapter?.id || "",
        status: "pending",
        isAdmin: false,
        fcmToken: null,
        created: null,
        modified: null,
      };

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
              {personalDetails.gender === "male" ? "Bro. " : "Sis. "}
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

      notifications.show({
        title: "Registration successful!",
        message: `Welcome to LAUMGA, ${personalDetails.firstName}! Your account is pending approval.`,
        color: "green",
        autoClose: 5000,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      notifications.show({
        title: "Registration failed",
        message: error?.message || "Registration failed. Please try again.",
        color: "red",
        autoClose: 7000,
      });
    }
  };
  return (
    <RegistrationLayout>
      <div className="bg-white p-8 md:p-12">
        <div className="mb-10">
          <h2 className="font-serif text-4xl font-bold text-deep-forest">
            Review &amp; Submit
          </h2>
          <p className="mt-2 text-gray-600">
            Please verify your details to ensure your membership card and
            records are accurate.
          </p>
        </div>
        <div className="space-y-8">
          <div className="relative rounded-lg bg-white p-6 shadow-lg">
            <button
              type="button"
              onClick={() => navigate({ to: "/register" })}
              className="absolute top-4 right-4 text-vibrant-lime transition-transform hover:scale-110"
            >
              <Edit className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-6">
              <div className="shrink-0">
                <img
                  alt="Passport Photo"
                  className="h-24 w-24 rounded-full border-4 border-institutional-green object-cover"
                  src={
                    personalDetails?.passportUrl ||
                    "https://via.placeholder.com/96"
                  }
                />
              </div>
              <div className="grow">
                <h3 className="font-serif text-3xl text-deep-forest">
                  {personalDetails?.gender === "male" ? "Bro. " : "Sis. "}
                  {personalDetails?.firstName} {personalDetails?.lastName}
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600 md:flex md:space-x-4">
                  <p>
                    <span className="font-semibold text-deep-forest">
                      Gender:
                    </span>{" "}
                    {personalDetails?.gender === "male" ? "Male" : "Female"}
                  </p>
                  <p className="md:border-l md:pl-4">
                    <span className="font-semibold text-deep-forest">
                      Phone:
                    </span>{" "}
                    {locationAccount?.phoneNumber}
                  </p>
                  <p className="md:border-l md:pl-4">
                    <span className="font-semibold text-deep-forest">DOB:</span>{" "}
                    {personalDetails?.dateOfBirth
                      ? format(
                          new Date(personalDetails.dateOfBirth),
                          "MMM d, yyyy"
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative rounded-lg bg-mist-green p-6">
            <button
              type="button"
              onClick={() => navigate({ to: "/register/account" })}
              className="absolute top-4 right-4 text-vibrant-lime transition-transform hover:scale-110"
            >
              <Edit className="h-5 w-5" />
            </button>
            <div className="flex items-start space-x-4">
              <MapPin className="h-5 w-5 text-institutional-green" />
              <div className="grow">
                <p className="font-semibold text-deep-forest">
                  Registered under the {chapter?.name || "Chapter"}.
                </p>
                <p className="text-sm text-gray-600">
                  Based on residence in {locationAccount?.stateOfResidence}.
                </p>
                <div className="mt-4 border-t border-sage-green pt-4">
                  <p>
                    <span className="font-semibold text-deep-forest">
                      Email:
                    </span>{" "}
                    {locationAccount?.email}
                  </p>
                  <p>
                    <span className="font-semibold text-deep-forest">
                      Password:
                    </span>{" "}
                    ••••••••
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="rounded-lg border border-sage-green p-6"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg width=&quot;100&quot; height=&quot;100&quot; viewBox=&quot;0 0 100 100&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cfilter id=&quot;noise&quot;%3E%3CfeTurbulence type=&quot;fractalNoise&quot; baseFrequency=&quot;0.8&quot; numOctaves=&quot;4&quot; stitchTiles=&quot;stitch&quot;/%3E%3CfeColorMatrix type=&quot;matrix&quot; values=&quot;0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0&quot;/%3E%3C/filter%3E%3Crect width=&quot;100%25&quot; height=&quot;100%25&quot; filter=&quot;url(%23noise)&quot;/%3E%3C/svg%3E')",
            }}
          >
            <h4 className="font-small-caps text-center font-bold tracking-widest text-deep-forest">
              Membership Declaration
            </h4>
            <p className="mt-4 text-center text-deep-forest/80">
              I hereby confirm that the information provided is accurate. I
              pledge to honor the brotherhood and support the mission of LAUMGA.
            </p>
            <div className="mt-6">
              <TextInput
                label="Type your full name to sign electronically"
                placeholder="Your Full Name"
                value={signature}
                onChange={(e) => setSignature(e.currentTarget.value)}
                classNames={{
                  label:
                    "block text-center text-xs font-semibold uppercase tracking-wide text-deep-forest",
                  input:
                    "mt-2 border-0 border-b border-institutional-green bg-transparent p-3 text-center font-signature text-3xl text-institutional-green placeholder-gray-400",
                }}
                styles={{
                  input: {
                    borderRadius: 0,
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                  },
                }}
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="font-semibold text-deep-forest transition hover:underline"
            >
              ← Back to Account Details
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={createUserMutation.isPending || !signature.trim()}
              className="group flex items-center justify-center gap-3 rounded-lg bg-deep-forest py-5 px-12 text-lg font-bold uppercase tracking-wider text-white transition hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-deep-forest/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock className="h-5 w-5 text-white" />
              {createUserMutation.isPending
                ? "SUBMITTING..."
                : "SUBMIT APPLICATION"}
            </button>
          </div>
        </div>
      </div>
    </RegistrationLayout>
  );
}
