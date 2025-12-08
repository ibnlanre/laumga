import { useEffect, useRef, useState } from "react";
import {
  useCombobox,
  Combobox,
  Group,
  CheckIcon,
  ScrollArea,
  InputBase,
  ActionIcon,
  type InputBaseProps,
  type PolymorphicComponentProps,
  type ComboboxProps,
} from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";
import { ChevronDown } from "lucide-react";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import {
  getExampleNumber,
  type CountryCode,
  parsePhoneNumberFromString,
  getCountries,
  AsYouType,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";
import { IMaskInput } from "react-imask";

countries.registerLocale(en);

interface CountryOption {
  code: CountryCode;
  name: string;
  emoji: string;
}

interface PhoneFormat {
  example: string;
  mask: string;
}

const isoCountryNames = countries.getNames("en", { select: "official" });
const supportedCountryCodes = getCountries();

const countryOptions: CountryOption[] = supportedCountryCodes
  .map<CountryOption | null>((code) => {
    const name = isoCountryNames[code];
    if (!name) {
      return null;
    }
    return {
      code,
      name,
      emoji: getFlagEmoji(code),
    };
  })
  .filter((option): option is CountryOption => option !== null);

if (countryOptions.length === 0) {
  throw new Error("PhoneInput requires at least one supported country option.");
}

const countryOptionsMap = new Map<string, CountryOption>(
  countryOptions.map((option) => [option.code, option])
);

const countryCodeSet = new Set<string>(
  countryOptions.map((option) => option.code)
);

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function getFormat(countryCode: CountryCode): PhoneFormat {
  const exampleNumber = getExampleNumber(countryCode, examples);
  if (!exampleNumber) {
    return { example: "", mask: "0000000000" };
  }
  const example = exampleNumber.formatNational();
  const mask = example.replace(/\d/g, "0");
  return { example, mask };
}

function isCountryCodeValue(value: string): value is CountryCode {
  return countryCodeSet.has(value);
}

function resolveCountryOption(code?: CountryCode): CountryOption {
  if (code) {
    const option = countryOptionsMap.get(code);
    if (option) {
      return option;
    }
  }
  return countryOptions[0];
}

function getInitialDataFromValue(
  value: string | undefined,
  fallbackCountry: CountryOption
): {
  country: CountryOption;
  format: PhoneFormat;
  localValue: string;
} {
  const fallbackFormat = getFormat(fallbackCountry.code);
  if (!value) {
    return {
      country: fallbackCountry,
      format: fallbackFormat,
      localValue: "",
    };
  }

  const phoneNumber = parsePhoneNumberFromString(value);
  if (!phoneNumber) {
    return {
      country: fallbackCountry,
      format: fallbackFormat,
      localValue: "",
    };
  }

  const detectedCountry = phoneNumber.country
    ? resolveCountryOption(phoneNumber.country)
    : fallbackCountry;

  return {
    country: detectedCountry,
    format: getFormat(detectedCountry.code),
    localValue: phoneNumber.formatNational(),
  };
}

export interface PhoneInputProps
  extends Omit<
    PolymorphicComponentProps<typeof IMaskInput, InputBaseProps>,
    "onChange" | "defaultValue"
  > {
  initialCountryCode?: CountryCode;
  defaultValue?: string;
  onChange: (value: string | null) => void;
}

export function PhoneInput({
  initialCountryCode = "NG",
  value: _value,
  onChange: _onChange,
  defaultValue,
  autoComplete = "tel-national",
  ...props
}: PhoneInputProps) {
  const [value, onChange] = useUncontrolled({
    value: _value,
    defaultValue,
    onChange: _onChange,
  });
  const initialData = useRef(
    getInitialDataFromValue(value, resolveCountryOption(initialCountryCode))
  );
  const [country, setCountry] = useState(initialData.current.country);
  const [format, setFormat] = useState(initialData.current.format);
  const [localValue, setLocalValue] = useState(initialData.current.localValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const lastNotifiedValue = useRef<string | null>(value ?? "");

  useEffect(() => {
    let value = "";

    if (localValue.trim().length) {
      const asYouType = new AsYouType(country.code);
      asYouType.input(localValue);
      value = asYouType.getNumber()?.number ?? "";
    }

    if (value !== lastNotifiedValue.current) {
      lastNotifiedValue.current = value;
      onChange(value);
    }
  }, [country.code, localValue]);

  useEffect(() => {
    if (typeof value !== "undefined" && value !== lastNotifiedValue.current) {
      const initialData = getInitialDataFromValue(
        value,
        resolveCountryOption(initialCountryCode)
      );
      lastNotifiedValue.current = value;
      setCountry(initialData.country);
      setFormat(initialData.format);
      setLocalValue(initialData.localValue);
    }
  }, [value]);

  const { readOnly, disabled } = props;

  const leftSectionWidth = 54;
  const [dropdownWidth, setDropdownWidth] = useState<number | "target">(
    "target"
  );

  useEffect(() => {
    if (!inputRef.current) return;

    const updateWidth = () => {
      const width = inputRef.current?.offsetWidth;
      setDropdownWidth(width || "target");
    };

    updateWidth();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updateWidth);
    observer.observe(inputRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <InputBase
      {...props}
      type="tel"
      autoComplete={autoComplete}
      component={IMaskInput}
      inputRef={inputRef}
      leftSection={
        <CountrySelect
          size={props.size}
          disabled={disabled || readOnly}
          country={country}
          dropdownWidth={dropdownWidth}
          setCountry={(nextCountry) => {
            setCountry(nextCountry);
            setFormat(getFormat(nextCountry.code));
            setLocalValue("");
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
          leftSectionWidth={leftSectionWidth}
        />
      }
      leftSectionWidth={leftSectionWidth}
      styles={{
        input: {
          paddingLeft: `calc(${leftSectionWidth}px + var(--mantine-spacing-${props.size}))`,
        },
        section: {
          borderRight: "1px solid var(--mantine-color-default-border)",
        },
      }}
      inputMode="numeric"
      mask={format.mask}
      unmask={true}
      value={localValue}
      onAccept={(incomingValue) => setLocalValue(incomingValue ?? "")}
    />
  );
}

interface CountrySelectProps extends ComboboxProps {
  country: CountryOption;
  setCountry: (country: CountryOption) => void;
  disabled: boolean | undefined;
  leftSectionWidth: number;
  dropdownWidth: number | "target";
}

function CountrySelect({
  country,
  setCountry,
  disabled,
  leftSectionWidth,
  dropdownWidth,
  ...props
}: CountrySelectProps) {
  const [search, setSearch] = useState("");

  const selectedRef = useRef<HTMLDivElement>(null);

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      setSearch("");
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
      setTimeout(() => {
        selectedRef.current?.scrollIntoView({
          behavior: "instant",
          block: "center",
        });
      }, 0);
    },
  });

  const options = countryOptions
    .filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase().trim())
    )
    .map((item) => (
      <Combobox.Option
        ref={item.code === country.code ? selectedRef : undefined}
        value={item.code}
        key={item.code}
      >
        <Group gap="xs">
          {item.code === country.code && <CheckIcon size={12} />}
          <span>
            {item.emoji} {item.name}
          </span>
        </Group>
      </Combobox.Option>
    ));

  useEffect(() => {
    if (search) {
      combobox.selectFirstOption();
    }
  }, [search]);

  return (
    <Combobox
      {...props}
      store={combobox}
      width={dropdownWidth}
      position="bottom-start"
      withinPortal={false}
      withArrow
      preventPositionChangeWhenVisible
      onOptionSubmit={(val) => {
        if (!isCountryCodeValue(val)) {
          return;
        }
        const nextCountry = countryOptionsMap.get(val);
        if (!nextCountry) {
          return;
        }
        setCountry(nextCountry);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target
        autoComplete="tel-country-code"
        withAriaAttributes={false}
      >
        <ActionIcon
          variant="transparent"
          onClick={() => combobox.toggleDropdown()}
          size="lg"
          tabIndex={-1}
          disabled={disabled}
          w={leftSectionWidth}
          c="dimmed"
        >
          <Group gap={2}>
            {country.emoji}
            <ChevronDown size={14} />
          </Group>
        </ActionIcon>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search country"
        />
        <Combobox.Options>
          <ScrollArea.Autosize mah={200} type="scroll">
            {options.length ? (
              options
            ) : (
              <Combobox.Empty>No country found</Combobox.Empty>
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
