import { Country, State, type ICountry, type IState } from "country-state-city";
import { useEffect, useState } from "react";

export interface CountryOption {
  value: string;
  label: string;
  isoCode: string;
  emoji?: string;
}

export interface StateOption {
  value: string;
  label: string;
}

function createCountryOption(country: ICountry): CountryOption {
  const emoji = country.flag || undefined;
  const label = country.name;

  return {
    value: country.name,
    label,
    isoCode: country.isoCode,
    emoji,
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
    try {
      const countries = Country.getAllCountries();
      const options = countries
        .map(createCountryOption)
        .sort((a, b) => a.value.localeCompare(b.value));
      setCountryOptions(options);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load countries";
      setCountryOptionsError(message);
    } finally {
      setCountryOptionsLoading(false);
    }
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
    if (!countryName) {
      setStateOptions([]);
      setStateOptionsError(null);
      setStateOptionsLoading(false);
      return;
    }

    setStateOptionsLoading(true);
    setStateOptionsError(null);

    try {
      const isoCode = Country.getAllCountries().find(
        (country) => country.name === countryName
      )?.isoCode;

      if (!isoCode) {
        setStateOptions([]);
        setStateOptionsError("Unknown country selection");
        return;
      }

      const states = State.getStatesOfCountry(isoCode) ?? [];
      const options = states
        .map(createStateOption)
        .sort((a, b) => a.value.localeCompare(b.value));
      setStateOptions(options);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load states";
      setStateOptionsError(message);
      setStateOptions([]);
    } finally {
      setStateOptionsLoading(false);
    }
  }, [countryName]);

  return {
    stateOptions,
    stateOptionsLoading,
    stateOptionsError,
  };
}
