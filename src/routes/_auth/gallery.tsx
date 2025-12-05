import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_auth/gallery")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex flex-1 justify-center pt-24">
      <div className="layout-content-container flex flex-col w-full max-w-7xl px-4 md:px-10 lg:px-20">
        <section className="@container py-16 md:py-24">
          <div className="flex flex-col gap-10 @[864px]:flex-row @[864px]:items-center @[864px]:gap-20">
            <div className="flex flex-col gap-4 text-left @[864px]:w-1/2">
              <h1 className="text-deep-forest font-display text-6xl font-black leading-tight tracking-[-0.033em] @[480px]:text-7xl lg:text-8xl">
                The Archive.
              </h1>
              <p className="text-deep-forest text-base font-normal leading-relaxed @[480px]:text-lg max-w-md">
                Exploring our history through the lens, one moment at a time.
                This is a visual journey through our shared experiences.
              </p>
            </div>
            <div className="w-full @[864px]:w-1/2">
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                data-alt="A candid group photo of association members at an outdoor event."
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsMfDr9P-5gCsSEeOSpYgmgxNNdV2h11Jx4uqsZ0KOZKQCifTBDcXV0zhbcH9YXTnYl8h6y73ZqcNUcwZKT9rUp6MvSnr8XyazMzdrlsEe1JKVKNslEv_Xp-hQn--LXHZrXI449uIs4WwfMm4Zp5ITW6ExC-QfaD0WIuhHaUwCZwm9kuyQfRjNRW39yHK1NcxckeSsvoQLcYKMBsCi9XynQ8wKLV_2DNH4texytu974LdMkQrA5l8--8P4oeVi7tiM1Km0sKwXoQM')",
                }}
              />
            </div>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            <a
              className="flex flex-col items-center justify-center gap-2 text-deep-forest"
              href="#"
            >
              <p className="text-deep-forest text-base font-bold leading-normal tracking-[0.015em]">
                All
              </p>
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </a>
            <a
              className="flex flex-col items-center justify-center gap-2 text-deep-forest/70"
              href="#"
            >
              <p className="text-base font-bold leading-normal tracking-[0.015em]">
                Humanitarian
              </p>
              <div className="w-1.5 h-1.5 rounded-full bg-transparent" />
            </a>
            <a
              className="flex flex-col items-center justify-center gap-2 text-deep-forest/70"
              href="#"
            >
              <p className="text-base font-bold leading-normal tracking-[0.015em]">
                Conventions
              </p>
              <div className="w-1.5 h-1.5 rounded-full bg-transparent" />
            </a>
            <a
              className="flex flex-col items-center justify-center gap-2 text-deep-forest/70"
              href="#"
            >
              <p className="text-base font-bold leading-normal tracking-[0.015em]">
                Campus Life
              </p>
              <div className="w-1.5 h-1.5 rounded-full bg-transparent" />
            </a>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-x-10 md:gap-y-16 lg:gap-x-16 lg:gap-y-20">
            <div className="flex flex-col gap-3">
              <div
                className="w-full bg-center bg-no-repeat aspect-4/3 bg-cover"
                data-alt="Association members attending the annual convention in 2023."
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCoWI-59BaJppAoKg5BAclIa09nCf-wWBTMspLDWm8HnSoCylVfn9bKzrqGQPAmru7536-h9jExVwb-XBbIG5YvdI0x6uxo-a2Gx7dAF-70N9nUdcNTTaMI4n1A09RbKX0rvwLSKAY6zP062yB_iv1w8WiUVYSUt2G0_x3VPOfHscpNoKQA7MKBV4U3ARklqUgdYIehz6MyGLfYAfUeIpqS0wT9iCom4bNbrXRVEuPF6LzIfHXEmVwkIDRVR42UAwvCi6StZ8eAbVc')",
                }}
              />
              <div>
                <p className="text-deep-forest text-base font-bold leading-normal">
                  Annual Convention 2023
                </p>
                <p className="text-gray-500 text-sm font-normal leading-normal">
                  2023
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div
                className="w-full bg-center bg-no-repeat aspect-4/3 bg-cover"
                data-alt="Students organizing donations during a campus charity drive."
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuASeaw3DxZIWNPAfihhfLG7Cld1NmNuI_YkO2hoSV2WMF0Y_ZjLZgb6mCv_StihauE0WGmr-_0phS6rhgO39YwGHFgFglEXFwqNwKO9kGO8Ny2We2QUCPViY3nPGjOFsbG-76u2_YTdGnHzi-Q8PW3WjOXt14vwaOrUaREIIgjyA59Bf3RWTq8Lkd2d7QoyNz2SCdyXEjUQC4ZLjRDf_kPacZo8tSTNphzKvT3TLbi9eFp9rilEA0KwP2uZLNUubzlAHzhoBRM1otU')",
                }}
              />
              <div>
                <p className="text-deep-forest text-base font-bold leading-normal">
                  Campus Charity Drive
                </p>
                <p className="text-gray-500 text-sm font-normal leading-normal">
                  2023
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div
                className="w-full bg-center bg-no-repeat aspect-4/3 bg-cover"
                data-alt="Graduates in caps and gowns celebrating at their ceremony."
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCBPpyMhUIFk_dRmvTo91zd0B6aD9gQ1YZHA1UCu2w-mYkj9iA13gE5V87V_64Wf8uOK9BIlz_fPbNL5bJ7wJjC_98HZ8l93LVpVVINUXBuO86odEBMTQ6sawmDp0jfAj9MNKd9RGxA1I5wb7mtjuBKSRs2mM5dwTSXTDiT-lPP8ydYKLGQ_SfXnTQYrxxWN-G1jshr3lBvTNxUAqbsfLRO-2qKKcbkNPXlapD3nJ-4_8gI7yWxfONEGPFm8z1iwEnBiNY6HRhmRD0')",
                }}
              />
              <div>
                <p className="text-deep-forest text-base font-bold leading-normal">
                  Graduation Ceremony
                </p>
                <p className="text-gray-500 text-sm font-normal leading-normal">
                  2022
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="my-16 md:my-24 -mx-4 md:-mx-10 lg:-mx-20">
          <div className="bg-mist-green py-16 px-4 md:px-10 lg:px-20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
              <div className="flex flex-col gap-4 flex-[1_1_0px] max-w-lg">
                <h3 className="text-deep-forest font-display text-4xl md:text-5xl font-bold leading-tight">
                  The 2019 Convention Story
                </h3>
                <p className="text-deep-forest text-base leading-relaxed">
                  A look back at our most memorable convention, filled with
                  insightful talks, community bonding, and shared moments of
                  inspiration that continue to resonate with our members.
                </p>
              </div>
              <div className="flex-[1.5_1.5_0px] w-full overflow-hidden">
                <div className="flex items-center gap-4">
                  <button className="text-deep-forest/50 hover:text-deep-forest">
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover"
                      data-alt="Convention attendees in a lecture hall."
                      style={{
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuByUhkKik0wPnD8sECRyGEizX_sd6tLEBoIx_JzetE6xH_6JLlleHltMeUyHFHA0E_O3oCpT-LDm4lAyUnXwCibwCoZ1OdC0URkbYfXZJ25hNKrFXMrnXtg6lRvEv4sZCLbIlImSshmXYg8Lv70wqI3aMHepltKP_eduqyqc3psSPcuer_julgt6xyawey5vvsBNkTxg7JfDYpqEou3_OHHOC2RPJbBUYdzp0CgxoUuxWlPmZKDLEcOvRmt73NJZDAUDplFdzM8DCk')",
                      }}
                    />
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover"
                      data-alt="Candid shot of members networking."
                      style={{
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBvFqu0xqWhacO3nmvFUU6ZBOlT_cnYYwcePL9Wsvz42-Lg9_y0ed9efq7Pzpgn1gOy_UyBeDoquRFpqbrGyaOuMYlZVB4mh4j7_NzY_8OS4ZwGWhP8NxH_1Jm6U6XjAUFKKG9Uauv7lL4XxFk9JvOOWY_G8tYGweQCEmFRVtKfQwmyWfV7BsGJMjr6rCEtF9MjTAH6psjHgAcz5OIfhxKM3CPLmjLGV3qC5XcDmCE5MxorGYO7aLYNRhpTbmDsTZ6xxwqJ9zXrFuk')",
                      }}
                    />
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover hidden sm:block"
                      data-alt="Close-up of a speaker at the podium."
                      style={{
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA9ZVztAyjoOtJYz_22_-wmoNB13gLp-9s5-fl1vYm-mpCXXfh-nrLx21xQnkWKRsoSDNFsRpzDips9BtSiIk1fhZ5MWULlwq7OgWqSmwOd-N85_RZE3fqK1hmtVxPm-D9W-RX0Qxr7PvNfVfPAT4_4ISvN6AiMwtx2kYM-CkXFSEW6F_Q8hl-PEmWbuuG94bYoEBwelKfSdxCmgUtDVTZe1VuYe24sZEY3P6CXVXSh9F5Hyy85lo5lvfgOQyVbJq2XqHp12pmFpnE')",
                      }}
                    />
                  </div>
                  <button className="text-deep-forest/50 hover:text-deep-forest">
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-x-10 md:gap-y-16 lg:gap-x-16 lg:gap-y-20">
            <div className="flex flex-col gap-3">
              <div
                className="w-full bg-center bg-no-repeat aspect-4/3 bg-cover"
                data-alt="Community iftar gathering during Ramadan."
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDuFhwMfW5LoegdD4CZxO1QLhiSxpNvES1qdx6Qlz4PsKK90UN-QJWAVrc4T_75ySBJTH44DE5-cK3eV2GLhJ5P6j0Iyhv3TtKqnQGRSc2WfUtsQ-ZYvaMP_f0ytgrdD3EQNaF35CA41O17UD6NXAz7wlR2S3tfNvY2iE5KT70S-x2PXneawtS2GObMSf1h_YIMwU7pLZn1CL2jYwoPD2ZFPeg-yc5ALDt6WRnbPXSlwdYYW4wh3q9HvoPcM8cRRRA1GrO8oxAMgLA')",
                }}
              />
              <div>
                <p className="text-deep-forest text-base font-bold leading-normal">
                  Community Iftar
                </p>
                <p className="text-gray-500 text-sm font-normal leading-normal">
                  2022
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div
                className="w-full bg-center bg-no-repeat aspect-4/3 bg-cover"
                data-alt="Leaders from different faiths in a panel discussion."
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAf6SK2ZgmXVFg4Jnj01-TV325HavmmWXvi77SEZ7mMKO4xGmQMANAglv1D879Zde7OfrC48fduI5XleoeG64d9-WiQ97vVvZNl3EWjmv6syfNJ3apfBO82XGpOAPOQxFQyh9aiCAfiO149W32q-6eGm5UAGoZOKGCW0t3UlWqwcy67MbbCOU5-T3t8MqQ8RbGA_uBply1WIdJkxjxnyV5vtp5SHBEZi7aIRVChnC-mXt5KsFXMl7u9ZIvPKOjq60P4W9dhDhx49FY')",
                }}
              />
              <div>
                <p className="text-deep-forest text-base font-bold leading-normal">
                  Interfaith Dialogue
                </p>
                <p className="text-gray-500 text-sm font-normal leading-normal">
                  2021
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div
                className="w-full bg-center bg-no-repeat aspect-4/3 bg-cover"
                data-alt="Members participating in a university sports gala."
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBYY3-lsvGKx2n7hnIa-ILmmK4_ObF3CTBObWnmiFtpNWOvSXy7L1gScBs5flmLj88psFIljfRxGLMxhgYwvW48ynXFoqdHhlN85M72diiNR6I6jGpImcBXYclkI6hC-kwz2aL9-ZewlGOVJf3-Gbf-_fP-jkhXZEJcHQwdz7n-VDzsN_4rdjs4nMVS8-7fyr8u5zNkFTm8JaQBDaUVO4NkZYCJ6fVet04QX_U6Vko9z9TOXMxV2PX0NTEVJYMlk0KRqUZj_8cTDH8')",
                }}
              />
              <div>
                <p className="text-deep-forest text-base font-bold leading-normal">
                  Sports Gala
                </p>
                <p className="text-gray-500 text-sm font-normal leading-normal">
                  2021
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center py-24 md:py-32">
          <div className="flex flex-col items-center gap-6">
            <p className="font-display text-2xl md:text-3xl font-medium text-deep-forest max-w-md">
              Were you there? Help us grow our collection and preserve our
              shared memories.
            </p>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden h-12 px-6 bg-white text-deep-forest text-base font-bold leading-normal tracking-[0.015em] border-2 border-deep-forest hover:bg-deep-forest hover:text-white transition-colors duration-300">
              <span className="truncate">Upload Media</span>
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
