import {
  getCountries,
  getStatesOfCountry,
  type ICountry,
  type IState,
} from "@countrystatecity/countries";
import { useEffect, useState } from "react";

export interface CountryOption {
  value: string;
  label: string;
  iso2: string;
  emoji?: string;
}

export interface StateOption {
  value: string;
  label: string;
}

function createCountryOption(country: ICountry): CountryOption {
  const label = country.emoji
    ? `${country.emoji} ${country.name}`
    : country.name;

  return {
    value: country.name,
    label,
    iso2: country.iso2,
    emoji: country.emoji,
  };
}

function createStateOption(state: IState): StateOption {
  return {
    value: state.name,
    label: state.name,
  };
}

export function useCountryOptions() {
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [countryOptionsLoading, setCountryOptionsLoading] =
    useState<boolean>(true);
  const [countryOptionsError, setCountryOptionsError] = useState<string | null>(
    null
  );

  useEffect(() => {
    getCountries()
      .then((countries) => {
        const options = countries
          .map(createCountryOption)
          .sort((a, b) => a.value.localeCompare(b.value));
        setCountryOptions(options);
      })
      .catch((error) => {
        const message =
          error instanceof Error ? error.message : "Unable to load countries";
        setCountryOptionsError(message);
      })
      .finally(() => {
        setCountryOptionsLoading(false);
      });
  }, []);

  return {
    countryOptions,
    countryOptionsLoading,
    countryOptionsError,
  };
}

export function useStateOptions(countryName?: string) {
  const [stateOptions, setStateOptions] = useState<StateOption[]>([]);
  const [stateOptionsLoading, setStateOptionsLoading] =
    useState<boolean>(false);
  const [stateOptionsError, setStateOptionsError] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!countryName) return;

    getStatesOfCountry(countryName)
      .then((states) => {
        const options = states
          .map(createStateOption)
          .sort((a, b) => a.value.localeCompare(b.value));
        setStateOptions(options);
      })
      .catch((error) => {
        const message =
          error instanceof Error ? error.message : "Unable to load states";
        setStateOptionsError(message);
      })
      .finally(() => {
        setStateOptionsLoading(false);
      });
  }, [countryName]);

  return {
    stateOptions,
    stateOptionsLoading,
    stateOptionsError,
  };
}
