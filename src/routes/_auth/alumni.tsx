import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { createFileRoute } from "@tanstack/react-router";

import { SearchCheckIcon } from "lucide-react";

export const Route = createFileRoute("/_auth/alumni")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useForm({
    initialValues: {
      search: "",
    },
  });

  return (
    <main className="flex-1">
      <div className="relative flex min-h-[480px] flex-col items-center justify-center gap-8 bg-deep-forest p-4 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCPDU_i4H_2CliyxSqDv6nzjlqCc2yvzz9DxDqagyAMNREC5W9j2SqMkM5XHfxYgO44vgmLHL3lpmSD3NLeuS4OMUARL3TvNIkuufys2CJKUnHASqdcfvbG6FV-luG0-Jm9Y4FHqkQe-JUmxrtojpqavVwwjfVIQxDz9SZ20UahTm-WrdofWvaGwixhcm7IaH8PKw-rP1r0d_N-leeQhv_gLI8TuhvpIZDelvIvHdAScp97OQ6GFCvc3653Hmb_fg3-heVqaBnLk54')",
          }}
        ></div>
        <div className="relative z-10 flex flex-col gap-4">
          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
            Stewards of the Vision
          </h1>
          <h2 className="max-w-2xl text-base font-normal leading-normal text-stone-300">
            Meet the dedicated men and women serving the association, past and
            present.
          </h2>
        </div>

        <TextInput
          {...form.getInputProps("search")}
          radius="lg"
          c="white"
          classNames={{
            input: "bg-white/20 backdrop-blur-sm text-white",
          }}
          className="mt-8 max-w-lg w-full shadow-lg"
          placeholder="Search the alumni directory..."
          size="xl"
          rightSection={<SearchCheckIcon className="text-white/70" />}
        />
      </div>

      <div className="bg-white dark:bg-stone-900/80 backdrop-blur-sm shadow-md">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-2 sm:gap-4 p-3 overflow-x-auto whitespace-nowrap justify-center">
            <div className="flex h-10 cursor-pointer shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              <p className="text-sm font-medium leading-normal text-stone-600 dark:text-stone-400">
                2018
              </p>
            </div>
            <div className="flex h-10 cursor-pointer shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              <p className="text-sm font-medium leading-normal text-stone-600 dark:text-stone-400">
                2019
              </p>
            </div>
            <div className="flex h-10 cursor-pointer shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              <p className="text-sm font-medium leading-normal text-stone-600 dark:text-stone-400">
                2020
              </p>
            </div>
            <div className="flex h-10 cursor-pointer shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              <p className="text-sm font-medium leading-normal text-stone-600 dark:text-stone-400">
                2021
              </p>
            </div>
            <div className="flex h-10 cursor-pointer shrink-0 items-center justify-center gap-x-2 rounded-lg bg-vibrant-lime/20 border-b-2 border-vibrant-lime px-4 transition-colors">
              <p className="text-lg font-bold leading-normal text-deep-forest dark:text-vibrant-lime">
                2022
              </p>
            </div>
            <div className="flex h-10 cursor-pointer shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              <p className="text-sm font-medium leading-normal text-stone-600 dark:text-stone-400">
                2023
              </p>
            </div>
            <div className="flex h-10 cursor-pointer shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              <p className="text-sm font-medium leading-normal text-stone-600 dark:text-stone-400">
                2024
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <section>
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 rounded-xl bg-white dark:bg-deep-forest p-6 sm:p-8 border-l-8 border-deep-forest dark:border-l-vibrant-lime shadow-lg">
            <div className="w-48 h-48 md:w-56 md:h-56 shrink-0">
              <img
                className="w-full h-full object-cover rounded-full"
                data-alt="Portrait of Prof. Taofiq Adedosu"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-MPLc6vThaxQeaD8qXI1UJ3bW9wWSLEm-clMt3ojav3r-Dd5RF-AMMpQZMUETEVR31qlYhW4qVou5Tcm8u1h4iuvhtYTpOIf9GZcF_93HcI-QBBBhczmOqoxMMcYJBHx_atNghF3immMqGwvqE-gOZ6tSTm23BxrO7dgq2sC8LCaXfnFZ7joXhaP9vx4nZ4xlwHsiNzKIY4oKGM7xFcBHCnGVDcHT7wAEefBSSgV_sDonZqEQM8Vi5eeGUR4Se-SKjIzdb7zH9oE"
              />
            </div>
            <div className="flex flex-col gap-3 text-center md:text-left">
              <p className="text-vibrant-lime text-sm font-bold uppercase tracking-wider">
                PRESIDENT (AMIR)
              </p>
              <h2 className="font-display text-4xl font-bold text-deep-forest dark:text-white">
                Prof. Taofiq Adedosu
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-2 text-stone-500 dark:text-stone-400">
                <span className="material-symbols-outlined text-lg">
                  location_on
                </span>
                <p className="text-base">Lagos Chapter</p>
              </div>
              <p className="text-stone-600 dark:text-stone-300 italic text-lg mt-2 font-display">
                "A small quote about leadership, service, and community impact
                goes here."
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <h3 className="font-display text-3xl font-bold text-deep-forest dark:text-white pb-6 px-4">
            The Executive Council
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center bg-white dark:bg-stone-900 rounded-xl shadow-md overflow-hidden border-t-8 border-institutional-green hover:shadow-xl transition-shadow">
              <div className="w-32 h-32 mt-8">
                <img
                  className="w-full h-full object-cover rounded-full ring-4 ring-sage-green dark:ring-vibrant-lime/50"
                  data-alt="Portrait of an executive council member"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF0myDF5nSHi9zZFs1xeqbhSeAfUdW8oyy6ekfLgXZ7rptBWM2wfTwBxc59Sru3gTOYFEizak1amDQq-EYw5Ppfh3Np2Io65_r03eTeU1NGrdYJHiZkFTX42lqPTK5eQ7uaTF2qfeqr9e_5wQ7jOCjnTCdwAFi5lnyRoyzLHXHjFHtuhpZkYjJ2u7-Kqxf9Pd_Kg0uCYShe920X443NiQhfD_sglZ7UMdMjHOMGBhnC9mNuAtIX9hf_BlXWgy94GaOT6MqAvPer9I"
                />
              </div>
              <div className="p-6">
                <p className="text-xl font-bold text-deep-forest dark:text-white">
                  Dr. Adam Bello
                </p>
                <p className="text-institutional-green dark:text-sage-green font-semibold mt-1">
                  Vice President (North)
                </p>
                <p className="text-stone-500 dark:text-stone-400 text-sm mt-3">
                  Abuja Branch
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center bg-white dark:bg-stone-900 rounded-xl shadow-md overflow-hidden border-t-8 border-institutional-green hover:shadow-xl transition-shadow">
              <div className="w-32 h-32 mt-8 flex items-center justify-center bg-sage-green dark:bg-vibrant-lime/30 rounded-full ring-4 ring-sage-green dark:ring-vibrant-lime/50">
                <span className="text-4xl font-bold text-institutional-green dark:text-vibrant-lime">
                  FA
                </span>
              </div>
              <div className="p-6">
                <p className="text-xl font-bold text-deep-forest dark:text-white">
                  Fatima Aliyu
                </p>
                <p className="text-institutional-green dark:text-sage-green font-semibold mt-1">
                  General Secretary
                </p>
                <p className="text-stone-500 dark:text-stone-400 text-sm mt-3">
                  Kano Branch
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center bg-white dark:bg-stone-900 rounded-xl shadow-md overflow-hidden border-t-8 border-institutional-green hover:shadow-xl transition-shadow">
              <div className="w-32 h-32 mt-8">
                <img
                  className="w-full h-full object-cover rounded-full ring-4 ring-sage-green dark:ring-vibrant-lime/50"
                  data-alt="Portrait of an executive council member"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZNJt5UOXr57_CIA4ygU0m8j_Vmv1KUVy-kSdSuYjJKdk0goPAK2vAbu6dTyAeGGSgv64dq-NW_C3qV1mtl12EwvZEC3O3Vd37mmCbqho5fWsOVcDsId-75HMJsTK7XtAsHjAJ3qXpyf2lvCTCOA9fclatgUjrWJNWnfep_GI5-uTfrBSJWXbBoHjpgCv82PyFHPht3his1R7PA4efDgiCzORlIl04iKy8Vuf0si9i6n1ZOIm9EeQUHy1GDQXsIfVUmE9gs6fvWRk"
                />
              </div>
              <div className="p-6">
                <p className="text-xl font-bold text-deep-forest dark:text-white">
                  Aisha Sanusi
                </p>
                <p className="text-institutional-green dark:text-sage-green font-semibold mt-1">
                  Financial Secretary
                </p>
                <p className="text-stone-500 dark:text-stone-400 text-sm mt-3">
                  Lagos Branch
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <h3 className="font-display text-3xl font-bold text-deep-forest dark:text-white pb-6 px-4">
            The Directorate
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="group flex items-center gap-4 rounded-lg bg-white dark:bg-stone-900 p-4 border border-transparent hover:border-vibrant-lime transition-colors shadow-sm hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-green dark:bg-vibrant-lime/30 text-institutional-green dark:text-vibrant-lime">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="font-bold text-deep-forest dark:text-white">
                  Ibrahim Musa
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  Welfare II
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Lagos
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4 rounded-lg bg-white dark:bg-stone-900 p-4 border border-transparent hover:border-vibrant-lime transition-colors shadow-sm hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-green dark:bg-vibrant-lime/30 text-institutional-green dark:text-vibrant-lime">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="font-bold text-deep-forest dark:text-white">
                  Zainab Haruna
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  Education Director
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Abuja
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4 rounded-lg bg-white dark:bg-stone-900 p-4 border border-transparent hover:border-vibrant-lime transition-colors shadow-sm hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-green dark:bg-vibrant-lime/30 text-institutional-green dark:text-vibrant-lime">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="font-bold text-deep-forest dark:text-white">
                  Yusuf Aminu
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  PRO
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Kaduna
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4 rounded-lg bg-white dark:bg-stone-900 p-4 border border-transparent hover:border-vibrant-lime transition-colors shadow-sm hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-green dark:bg-vibrant-lime/30 text-institutional-green dark:text-vibrant-lime">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="font-bold text-deep-forest dark:text-white">
                  Maryam Bakare
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  Sisters' Coordinator
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Lagos
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4 rounded-lg bg-white dark:bg-stone-900 p-4 border border-transparent hover:border-vibrant-lime transition-colors shadow-sm hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-green dark:bg-vibrant-lime/30 text-institutional-green dark:text-vibrant-lime">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="font-bold text-deep-forest dark:text-white">
                  Aliyu Sani
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  Membership Sec.
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Kano
                </p>
              </div>
            </div>
            <div className="group flex items-center gap-4 rounded-lg bg-white dark:bg-stone-900 p-4 border border-transparent hover:border-vibrant-lime transition-colors shadow-sm hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-green dark:bg-vibrant-lime/30 text-institutional-green dark:text-vibrant-lime">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="font-bold text-deep-forest dark:text-white">
                  Khadija Bello
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  Asst. Gen. Sec.
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Abuja
                </p>
              </div>
            </div>
            <div className="group flex items-center gap-4 rounded-lg bg-white dark:bg-stone-900 p-4 border border-transparent hover:border-vibrant-lime transition-colors shadow-sm hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-green dark:bg-vibrant-lime/30 text-institutional-green dark:text-vibrant-lime">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="font-bold text-deep-forest dark:text-white">
                  Umar Farouk
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  Welfare I
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Lagos
                </p>
              </div>
            </div>
            <div className="group flex items-center gap-4 rounded-lg bg-white dark:bg-stone-900 p-4 border border-transparent hover:border-vibrant-lime transition-colors shadow-sm hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-green dark:bg-vibrant-lime/30 text-institutional-green dark:text-vibrant-lime">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="font-bold text-deep-forest dark:text-white">
                  Nafisa Idris
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  Treasurer
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Ibadan
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-20 text-center">
          <p className="text-stone-600 dark:text-stone-400">
            Looking for data prior to 2010?
            <a
              className="font-semibold text-vibrant-lime hover:underline"
              href="#"
            >
              Visit the Historical Archives.
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
