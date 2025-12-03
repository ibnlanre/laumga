import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { notifications } from "@mantine/notifications";
import { useRegistration } from "@/contexts/registration-context";
import { useFetchChapterByState, useCreateUser } from "@/services/hooks";
import type { User } from "@/api/user";

export const Route = createFileRoute("/_public/register/review")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { personalDetails, locationAccount, previousStep, reset } =
    useRegistration();
  const [signature, setSignature] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

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

      notifications.show({
        title: "Registration successful!",
        message: `Welcome to LAUMGA, ${personalDetails.firstName}! Your account is pending approval.`,
        color: "green",
        autoClose: 5000,
      });

      // Show success screen
      setShowSuccess(true);

      // Reset registration context
      setTimeout(() => {
        reset();
        navigate({ to: "/login" });
      }, 5000);
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
          ></div>
          <div
            className="absolute bottom-0 left-0 h-1/3 w-full bg-contain bg-bottom bg-no-repeat opacity-20"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqsIk7zGl4JAO1nz5hEePmOHS1c2sO8RS-tJhXvnXsTdt3Wcz7WCuEOCfiAVzHcvDorSXjPsGtu4JE6pwe0jgvYQ7MnidBN8IgI11mTtyB0DxBw7pjqOoXU0iNlUMNhvDJ3NUSnrA4PIzuTu1iDY459MUBiTb8eA5tkhIKHL2m1iwA4rW9DGQqyzwT_mYr_HFEraAP9gi_VyP7vN4wy3EgpyWu8i9792AHgyFBX6ZmCiOEvBUNIjd_UXWhRmrJIroprjrInPEWkzM')",
            }}
          ></div>
          <div className="relative z-10 flex h-full flex-col p-12 text-white">
            <div className="relative flex flex-1 flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined absolute text-[250px] text-vibrant-lime/10">
                check_circle
              </span>
              <div className="relative z-10">
                <h2 className="font-serif text-4xl leading-relaxed">
                  Confirm Your Legacy.
                </h2>
                <p className="mt-4 text-lg text-white/80">
                  Please verify your details to ensure your membership card and
                  records are accurate.
                </p>
              </div>
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
        <div className="ml-[35%] w-[65%] bg-white">
          <div className="flex h-full min-h-screen w-full flex-col">
            <div className="grow p-12 md:p-20 pb-48">
              <div className="mb-12 w-full">
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex h-2 items-center justify-center rounded-full bg-sage-green">
                    <span className="material-symbols-outlined text-sm text-white">
                      check
                    </span>
                  </div>
                  <div className="flex h-2 items-center justify-center rounded-full bg-sage-green">
                    <span className="material-symbols-outlined text-sm text-white">
                      check
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-deep-forest"></div>
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-deep-forest">
                  03. REVIEW &amp; CONFIRM
                </p>
              </div>
              <div className="space-y-8">
                <div className="relative rounded-lg bg-white p-6 shadow-lg">
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/register" })}
                    className="absolute top-4 right-4 text-vibrant-lime transition-transform hover:scale-110"
                  >
                    <span className="material-symbols-outlined">edit</span>
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
                          {personalDetails?.gender === "male"
                            ? "Male"
                            : "Female"}
                        </p>
                        <p className="md:border-l md:pl-4">
                          <span className="font-semibold text-deep-forest">
                            Phone:
                          </span>{" "}
                          {locationAccount?.phoneNumber}
                        </p>
                        <p className="md:border-l md:pl-4">
                          <span className="font-semibold text-deep-forest">
                            DOB:
                          </span>{" "}
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
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <div className="flex items-start space-x-4">
                    <span className="material-symbols-outlined text-xl text-institutional-green">
                      location_on
                    </span>
                    <div className="grow">
                      <p className="font-semibold text-deep-forest">
                        Registered under the {chapter?.name || "Chapter"}.
                      </p>
                      <p className="text-sm text-gray-600">
                        Based on residence in{" "}
                        {locationAccount?.stateOfResidence}.
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
                    I hereby confirm that the information provided is accurate.
                    I pledge to honor the brotherhood and support the mission of
                    LAUMGA.
                  </p>
                  <div className="mt-6">
                    <label
                      className="block text-center text-xs font-semibold uppercase tracking-wide text-deep-forest"
                      htmlFor="signature"
                    >
                      Type your full name to sign electronically
                    </label>
                    <input
                      className="mt-2 w-full border-0 border-b border-institutional-green bg-transparent p-3 text-center font-signature text-3xl text-institutional-green placeholder-gray-400 focus:outline-none focus:ring-0"
                      id="signature"
                      placeholder="Your Full Name"
                      type="text"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="fixed bottom-0 right-0 w-[65%] bg-linear-to-t from-white via-white/90 to-white/0 p-8 pt-16">
              <div className="flex items-center justify-between">
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
                  <span className="material-symbols-outlined text-white">
                    lock
                  </span>
                  {createUserMutation.isPending
                    ? "SUBMITTING..."
                    : "SUBMIT APPLICATION"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-500 ${showSuccess ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div className="ml-[17.5%] text-center">
          <svg
            className="mx-auto h-24 w-24 text-vibrant-lime"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              className="path"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: "100",
                strokeDashoffset: showSuccess ? "0" : "100",
                animation: showSuccess
                  ? "draw 1.5s ease-in-out forwards"
                  : "none",
              }}
            ></path>
          </svg>
          <h2 className="mt-4 font-serif text-3xl text-deep-forest">
            Welcome Home,{" "}
            {personalDetails?.gender === "male" ? "Bro. " : "Sis. "}
            {personalDetails?.firstName}.
          </h2>
          <p className="mt-2 text-gray-600">
            Your application is under review. Check your email for the
            verification link.
          </p>
          <button
            onClick={() => navigate({ to: "/login" })}
            className="mt-8 inline-block rounded-lg border border-deep-forest px-8 py-3 font-bold text-deep-forest transition hover:bg-deep-forest hover:text-white"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
