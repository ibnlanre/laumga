---
applyTo: "**"
---

# use-form | Mantine

Mantine Form is a powerful and flexible form state management library for React applications. It provides an easy way to handle form state, validation, and submission.

## Installation

`@mantine/form` package does not depend on any other libraries, you can use it with or without `@mantine/core` inputs:

```bash
pnpm add @mantine/form
```

## Usage

```tsx
import { Button, Checkbox, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <TextInput
        withAsterisk
        label="Email"
        placeholder="your@email.com"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />

      <Checkbox
        mt="md"
        label="I agree to sell my privacy"
        key={form.key('termsOfService')}
        {...form.getInputProps('termsOfService', { type: 'checkbox' })}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}
```

## API overview

All examples below use the following example use-form hook.

```tsx
import { useForm } from "@mantine/form";

const form = useForm({
  mode: "uncontrolled",
  initialValues: {
    path: "",
    path2: "",
    user: {
      firstName: "John",
      lastName: "Doe",
    },
    fruits: [
      { name: "Banana", available: true },
      { name: "Orange", available: false },
    ],
    accepted: false,
  },
});
```

### Values

```tsx
// get current form values
form.getValues();

// Set all form values
form.setValues(values);

// Set all form values using the previous state
form.setValues((prev) => ({ ...prev, ...values }));

// Set value of single field
form.setFieldValue("path", value);

// Set value of nested field
form.setFieldValue("user.firstName", "Jane");

// Resets form values to `initialValues`,
// clears all validation errors,
// resets touched and dirty state
form.reset();

// Reset field at `path` to its initial value
form.resetField("path");

// Sets initial values, used when form is reset
form.setInitialValues({ values: "object" });
```

### List items

```tsx
// Inserts given list item at the specified path
form.insertListItem("fruits", { name: "Apple", available: true });

// An optional index may be provided to specify the position in a nested field.
// If the index is provided, item will be inserted at the given position.
// If the index is larger than the current list, the element is inserted at the last position.
form.insertListItem("fruits", { name: "Orange", available: true }, 1);

// Removes the list item at the specified path and index.
form.removeListItem("fruits", 1);

// Replaces the list item at the specified path and index with the given item.
form.replaceListItem("fruits", 1, { name: "Apple", available: true });

// Swaps two items of the list at the specified path.
// You should make sure that there are elements at at the `from` and `to` index.
form.reorderListItem("fruits", { from: 1, to: 0 });
```

### Validation

```tsx
import { useForm } from "@mantine/form";

const form = useForm({
  mode: "uncontrolled",
  initialValues: {
    email: "",
    user: {
      firstName: "",
      lastName: "",
    },
  },
  validate: {
    email: (value) => (value.length < 2 ? "Invalid email" : null),
    user: {
      firstName: (value) =>
        value.length < 2 ? "First name must have at least 2 letters" : null,
    },
  },
});

// Validates all fields with specified `validate` function or schema, sets form.errors
form.validate();

// Validates single field at specified path, sets form.errors
form.validateField("user.firstName");

// Works the same way as form.validate but does not set form.errors
form.isValid();
form.isValid("user.firstName");
```

### Errors

Validation errors occur when defined validation rules were violated, `initialErrors` were specified in useForm properties or validation errors were set manually.

```tsx
// get current errors state
form.errors;

// Set all errors
form.setErrors({ path: "Error message", path2: "Another error" });

// Set error message at specified path
form.setFieldError("user.lastName", "No special characters allowed");

// Clears all errors
form.clearErrors();

// Clears error of field at specified path
form.clearFieldError("path");
```

### onReset and onSubmit

Wrapper function for form `onSubmit` and `onReset` event handler. `onSubmit` handler accepts as second argument a function that will be called with errors object when validation fails.

```tsx
import { useForm } from "@mantine/form";

function Demo() {
  const form = useForm({ mode: "uncontrolled" });

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
  };

  return (
    <>
      {/* Supply handle submit as a single argument to receive validated values */}
      <form onSubmit={form.onSubmit(handleSubmit)} />

      {/* Supply second argument to handle errors */}
      <form
        onSubmit={form.onSubmit(
          (values, event) => {
            console.log(
              values, // <- form.getValues() at the moment of submit
              event // <- form element submit event
            );
          },
          (validationErrors, values, event) => {
            console.log(
              validationErrors, // <- form.errors at the moment of submit
              values, // <- form.getValues() at the moment of submit
              event // <- form element submit event
            );
          }
        )}
      />

      {/* form.onReset calls form.reset */}
      <form onReset={form.onReset}></form>
    </>
  );
}
```

### onSubmitPreventDefault option

By default, `event.preventDefault()` is called on the form `onSubmit` handler. If you want to change this behavior, you can pass `onSubmitPreventDefault` option to `useForm` hook. It can have the following values:

- `always` (default) - always call `event.preventDefault()`
- `never` - never call `event.preventDefault()`
- `validation-failed` - call `event.preventDefault()` only if validation failed

```tsx
import { useForm } from "@mantine/form";

const form = useForm({
  mode: "uncontrolled",
  onSubmitPreventDefault: "never",
});
```

### Touched and dirty

```tsx
// Returns true if user interacted with any field inside form in any way
form.isTouched();

// Returns true if user interacted with field at specified path
form.isTouched("path");

// Set all touched values
form.setTouched({ "user.firstName": true, "user.lastName": false });

// Clears touched status of all fields
form.resetTouched();

// Returns true if form values are not deep equal to initialValues
form.isDirty();

// Returns true if field value is not deep equal to initialValues
form.isDirty("path");

// Sets dirty status of all fields
form.setDirty({ "user.firstName": true, "user.lastName": false });

// Clears dirty status of all fields, saves form.values snapshot
// After form.resetDirty is called, form.isDirty will compare
// form.getValues() to snapshot instead of initialValues
form.resetDirty();
```

## UseFormReturnType

`UseFormReturnType` can be used when you want to pass `form` as a prop to another component:

```tsx
import { TextInput } from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";

interface FormValues {
  name: string;
  occupation: string;
}

interface NameInputProps {
  form: UseFormReturnType<FormValues>;
}

function NameInput({ form }: NameInputProps) {
  return <TextInput key={form.key("name")} {...form.getInputProps("name")} />;
}

interface OccupationInputProps {
  form: UseFormReturnType<FormValues>;
}

function OccupationInput({ form }: OccupationInputProps) {
  return (
    <TextInput
      key={form.key("occupation")}
      {...form.getInputProps("occupation")}
    />
  );
}

function Demo() {
  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: { name: "", occupation: "" },
  });

  return (
    <>
      <NameInput form={form} />
      <OccupationInput form={form} />
    </>
  );
}
```

## use-field | Mantine

`use-field` hook is a simpler alternative to use-form, it can be used to manage state of a single input without the need to create a form:

```tsx
import { Button, TextInput } from "@mantine/core";
import { useField } from "@mantine/form";

function Demo() {
  const field = useField({
    initialValue: "",
    validate: (value) =>
      value.trim().length < 2 ? "Value is too short" : null,
  });

  return (
    <>
      <TextInput
        {...field.getInputProps()}
        label="Name"
        placeholder="Enter your name"
        mb="md"
      />
      <Button onClick={field.validate}>Validate</Button>
    </>
  );
}
```

## Use-field API

`use-field` hook accepts the following options object as a single argument:

```tsx
interface UseFieldInput<T> {
  /** Field mode, controlled by default */
  mode?: "controlled" | "uncontrolled";

  /** Initial field value */
  initialValue: T;

  /** Initial touched value */
  initialTouched?: boolean;

  /** Initial field error message */
  initialError?: React.ReactNode;

  /** Called with updated value when the field value changes */
  onValueChange?: (value: T) => void;

  /** Determines whether the field should be validated when value changes, false by default */
  validateOnChange?: boolean;

  /** Determines whether the field should be validated when it loses focus, false by default */
  validateOnBlur?: boolean;

  /** Determines whether the field should clear error message when value changes, true by default */
  clearErrorOnChange?: boolean;

  /** A function to validate field value, can be sync or async */
  validate?: (value: T) => React.ReactNode | Promise<React.ReactNode>;

  /** Field type, input by default */
  type?: "input" | "checkbox";

  /** A function to resolve validation error from the result returned from validate function, should return react node */
  resolveValidationError?: (error: unknown) => React.ReactNode;
}
```

And returns the following object:

```tsx
export interface UseFieldReturnType<ValueType> {
  /** Returns props to pass to the input element */
  getInputProps: () => {
    /* props for input component */
  };

  /** Returns current input value */
  getValue: () => ValueType;

  /** Sets input value to the given value */
  setValue: (value: ValueType) => void;

  /** Resets field value to initial state, sets touched state to false, sets error to null */
  reset: () => void;

  /** Validates current input value when called */
  validate: () => Promise<React.ReactNode | void>;

  /** Set to true when async validate function is called, stays true until the returned promise resolves */
  isValidating: boolean;

  /** Current error message */
  error: React.ReactNode;

  /** Sets error message to the given react node */
  setError: (error: React.ReactNode) => void;

  /** Returns true if the input has been focused at least once */
  isTouched: () => boolean;

  /** Returns true if input value is different from the initial value */
  isDirty: () => boolean;

  /** Resets touched state to false */
  resetTouched: () => void;

  /** key that should be added to the input when mode is uncontrolled */
  key: number;
}
```

## Validate on blur

To validate the field on blur, set `validateOnBlur` option to `true`:

```tsx
import { TextInput } from "@mantine/core";
import { useField } from "@mantine/form";

function Demo() {
  const field = useField({
    initialValue: "",
    validateOnBlur: true,
    validate: (value) =>
      value.trim().length < 2 ? "Value is too short" : null,
  });

  return (
    <TextInput
      {...field.getInputProps()}
      label="Name"
      placeholder="Enter your name"
    />
  );
}
```

## Validate on change

To validate the field on change, set `validateOnChange` option to `true`:

```tsx
import { TextInput } from "@mantine/core";
import { useField, isEmail } from "@mantine/form";

function Demo() {
  const field = useField({
    initialValue: "",
    validateOnChange: true,
    validate: isEmail("Invalid email"),
  });

  return (
    <TextInput
      {...field.getInputProps()}
      label="Email"
      placeholder="Enter your email"
    />
  );
}
```

## Async validation

`validate` option accepts both async and sync functions, in both cases the function must return an error message that will be displayed to the user or `null` if the value is valid. To keep track of async validation state, use `isValidating` property:

```tsx
import { Button, Loader, TextInput } from "@mantine/core";
import { useField } from "@mantine/form";

function validateAsync(value: string): Promise<string | null> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(value === "mantine" ? null : 'Value must be "mantine"');
    }, 800);
  });
}

function Demo() {
  const field = useField({
    initialValue: "",
    validate: validateAsync,
  });

  return (
    <>
      <TextInput
        {...field.getInputProps()}
        label="Enter 'mantine'"
        placeholder="Enter 'mantine'"
        rightSection={field.isValidating ? <Loader size={18} /> : null}
        mb="md"
      />
      <Button onClick={field.validate}>Validate async</Button>
    </>
  );
}
```

Async validation can be used with `validateOnBlur` option, but not recommended with `validateOnChange` because it will trigger validation on every key press which may lead to race conditions:

```tsx
import { Loader, TextInput } from "@mantine/core";
import { useField } from "@mantine/form";

function validateAsync(value: string): Promise<string | null> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(value === "mantine" ? null : 'Value must be "mantine"');
    }, 800);
  });
}

function Demo() {
  const field = useField({
    initialValue: "",
    validateOnBlur: true,
    validate: validateAsync,
  });

  return (
    <TextInput
      {...field.getInputProps()}
      label="Enter 'mantine'"
      placeholder="Enter 'mantine'"
      rightSection={field.isValidating ? <Loader size={18} /> : null}
    />
  );
}
```

## Touched and dirty

To get information about whether the field has been focused at least once, use `isTouched` method and to check if the value has been changed from the initial value, use `isDirty` method:

```tsx
import { Text, TextInput } from "@mantine/core";
import { useField } from "@mantine/form";

function Demo() {
  const field = useField({ initialValue: "" });

  return (
    <>
      <TextInput
        {...field.getInputProps()}
        label="Name"
        placeholder="Enter your name"
        mb="md"
      />

      <Text fz="sm">
        Dirty:{" "}
        <Text span inherit c={field.isDirty() ? "red" : "teal"}>
          {field.isDirty() ? "dirty" : "not dirty"}
        </Text>
      </Text>
      <Text fz="sm">
        Touched:{" "}
        <Text span inherit c={field.isTouched() ? "red" : "teal"}>
          {field.isTouched() ? "touched" : "not touched"}
        </Text>
      </Text>
    </>
  );
}
```

## Clear error on change

By default, the error message is cleared when the value changes, to disable this behavior set `clearErrorOnChange` option to `false`:

```tsx
import { Button, TextInput } from "@mantine/core";
import { useField } from "@mantine/form";

function Demo() {
  const field = useField({
    initialValue: "",
    clearErrorOnChange: false,
    validate: (value) =>
      value.trim().length < 2 ? "Value is too short" : null,
  });

  return (
    <>
      <TextInput
        {...field.getInputProps()}
        label="Name"
        placeholder="Enter your name"
        mb="md"
      />
      <Button onClick={field.validate}>Validate</Button>
    </>
  );
}
```

## Uncontrolled mode

Uncontrolled mode of `use-field` hook works similar to uncontrolled mode of use-form. In uncontrolled mode, rerenders are minimized and the input value is managed by the input itself. It is useful if you experience performance issues with controlled mode, but in most cases controlled mode is recommended as it always provides up to date field information as React state.

```tsx
import { Button, TextInput } from "@mantine/core";
import { useField } from "@mantine/form";

function Demo() {
  const field = useField({
    mode: "uncontrolled",
    initialValue: "",
    validate: (value) =>
      value.trim().length < 2 ? "Value is too short" : null,
  });

  return (
    <>
      <TextInput
        {...field.getInputProps()}
        key={field.key}
        label="Name"
        placeholder="Enter your name"
        mb="md"
      />
      <Button onClick={field.validate}>Validate</Button>
    </>
  );
}
```

## Form context

`createFormContext` function creates context provider and hook to get form object from context:

```tsx
import { TextInput } from "@mantine/core";
import { createFormContext } from "@mantine/form";

// Definition of form values is required
interface FormValues {
  age: number;
  name: string;
}

// createFormContext returns a tuple with 3 items:
// FormProvider is a component that sets form context
// useFormContext hook return form object that was previously set in FormProvider
// useForm hook works the same way as useForm exported from the package but has predefined type
const [FormProvider, useFormContext, useForm] = createFormContext<FormValues>();

function ContextField() {
  const form = useFormContext();
  return (
    <TextInput
      label="Your name"
      key={form.key("name")}
      {...form.getInputProps("name")}
    />
  );
}

export function Context() {
  // Create form as described in use-form documentation
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      age: 0,
      name: "",
    },
  });

  // Wrap your form with FormProvider
  return (
    <FormProvider form={form}>
      <form onSubmit={form.onSubmit(() => {})}>
        <ContextField />
      </form>
    </FormProvider>
  );
}
```

## Store context in separate file

Usually it is a good idea to store form context in separate file to avoid dependencies cycle:

```tsx
// form-context.ts file
import { createFormContext } from "@mantine/form";

interface UserFormValues {
  age: number;
  name: string;
}

// You can give context variables any name
export const [UserFormProvider, useUserFormContext, useUserForm] =
  createFormContext<UserFormValues>();
```

Then you can import context variables from anywhere:

```tsx
// NameInput.tsx
import { TextInput } from "@mantine/core";
import { useUserFormContext } from "./form-context";

export function NameInput() {
  const form = useUserFormContext();
  return (
    <TextInput
      label="Name"
      key={form.key("name")}
      {...form.getInputProps("name")}
    />
  );
}
```

```tsx
// UserForm.tsx
import { NumberInput } from "@mantine/core";
import { UserFormProvider, useUserForm } from "./form-context";
import { NameInput } from "./NameInput";

function UserForm() {
  const form = useUserForm({
    mode: "uncontrolled",
    initialValues: {
      age: 0,
      name: "",
    },
  });

  return (
    <UserFormProvider form={form}>
      <form onSubmit={form.onSubmit(() => {})}>
        <NumberInput
          label="Age"
          key={form.key("age")}
          {...form.getInputProps("age")}
        />
        <NameInput />
      </form>
    </UserFormProvider>
  );
}
```

## Controlled mode

Controlled mode is the default mode of the form. In this mode, the form data is stored in React state and all components are rerendered when form data changes. Controlled mode is not recommended for large forms.

Example of a form with controlled mode:

```tsx
import { useState } from 'react';
import { Button, Code, Text, TextInput } from '@mantine/core';
import { hasLength, isEmail, useForm } from '@mantine/form';

function Demo() {
  const form = useForm({
    mode: 'controlled',
    initialValues: { name: '', email: '' },
    validate: {
      name: hasLength({ min: 3 }, 'Must be at least 3 characters'),
      email: isEmail('Invalid email'),
    },
  });

  const [submittedValues, setSubmittedValues] = useState<typeof form.values | null>(null);

  return (
    <form onSubmit={form.onSubmit(setSubmittedValues)}>
      <TextInput {...form.getInputProps('name')} label="Name" placeholder="Name" />
      <TextInput {...form.getInputProps('email')} mt="md" label="Email" placeholder="Email" />
      <Button type="submit" mt="md">
        Submit
      </Button>

      <Text mt="md">Form values:</Text>
      <Code block>{JSON.stringify(form.values, null, 2)}</Code>

      <Text mt="md">Submitted values:</Text>
      <Code block>{submittedValues ? JSON.stringify(submittedValues, null, 2) : '–'}</Code>
    </form>
  );
}
```

As you can see in the example above, `form.values` update on every change. This means that every component that uses `form.values` will rerender on every change.

## Uncontrolled mode

Uncontrolled mode is an alternative mode of the form introduced in 7.8.0 release. It is now the recommended mode for all forms. Uncontrolled mode provides significant performance improvements for large forms.

With uncontrolled mode, the form data is stored in a ref instead of React state and `form.values` are not updated on every change.

Example of a form with uncontrolled mode:

```tsx
import { useState } from 'react';
import { Button, Code, Text, TextInput } from '@mantine/core';
import { hasLength, isEmail, useForm } from '@mantine/form';

function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { name: '', email: '' },
    validate: {
      name: hasLength({ min: 3 }, 'Must be at least 3 characters'),
      email: isEmail('Invalid email'),
    },
  });

  const [submittedValues, setSubmittedValues] = useState<typeof form.values | null>(null);

  return (
    <form onSubmit={form.onSubmit(setSubmittedValues)}>
      <TextInput
        {...form.getInputProps('name')}
        key={form.key('name')}
        label="Name"
        placeholder="Name"
      />
      <TextInput
        {...form.getInputProps('email')}
        key={form.key('email')}
        mt="md"
        label="Email"
        placeholder="Email"
      />
      <Button type="submit" mt="md">
        Submit
      </Button>

      <Text mt="md">Form values:</Text>
      <Code block>{JSON.stringify(form.values, null, 2)}</Code>

      <Text mt="md">Submitted values:</Text>
      <Code block>{submittedValues ? JSON.stringify(submittedValues, null, 2) : '–'}</Code>
    </form>
  );
}
```

As you can see in the example above, `form.values` do not update at all.

## form.getValues

`form.getValues` function returns current form values. It can be used anywhere in the component to get the current form values. It can be used in both controlled and uncontrolled modes.

```tsx
import { useForm } from '@mantine/form';

const form = useForm({
  mode: 'uncontrolled',
  initialValues: { name: 'John Doe' },
});

form.getValues(); // { name: 'John Doe' }

form.setValues({ name: 'John Smith' });
form.getValues(); // { name: 'John Smith' }
```

Although `form.values` can be used to get the current form values in controlled mode, it is recommended to use `form.getValues` instead as it always returns the latest values while `form.values` is outdated in uncontrolled mode and before state update in controlled mode.

```tsx
import { useForm } from '@mantine/form';

const form = useForm({
  mode: 'uncontrolled',
  initialValues: { name: 'John Doe' },
});

const handleNameChange = () => {
  form.setFieldValue('name', 'Test Name');

  // ❌ Do not use form.values to get the current form values
  // form.values has stale name value until next rerender in controlled mode
  // and is always outdated in uncontrolled mode
  console.log(form.values); // { name: 'John Doe' }

  // ✅ Use form.getValues to get the current form values
  // form.getValues always returns the latest form values
  console.log(form.getValues()); // { name: 'Test Name' }
};
```

`form.getValues()` returns a ref value of the current form values. This means that you cannot pass it to `useEffect` dependencies array as it will always be the same reference.

```tsx
import { useEffect } from 'react';
import { useForm } from '@mantine/form';

const form = useForm({ mode: 'uncontrolled' });

useEffect(() => {
  // ❌ This will not work as form.getValues() is a ref value
  // and will always be the same reference
}, [form.getValues()]);
```

Instead of observing form values with `useEffect`, use `onValuesChange` callback to listen to form values changes:

```tsx
import { useForm } from '@mantine/form';

const form = useForm({
  mode: 'uncontrolled',
  initialValues: { name: 'John Doe' },
  onValuesChange: (values) => {
    // ✅ This will be called on every form values change
    console.log(values);
  },
});
```

## Uncontrolled mode in custom components

form.getInputProps returns different props for controlled and uncontrolled modes. In controlled mode, the returned object has `value` prop, while in uncontrolled mode it has `defaultValue` prop.

Uncontrolled mode relies on `key` returned from `form.key()` to update components when `form.setFieldValue` or `form.setValues` are called. You should set `key` supplied by `form.key()` to the input component to ensure that it has updated value:

```tsx
import { useForm } from '@mantine/form';

function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { text: '' },
  });

  return (
    <input {...form.getInputProps('text')} key={form.key('text')} />
  );
}
```

In case you need to have a list of fields, do not pass `key` to the input component directly, instead add a wrapper element and pass `key` to it:

```tsx
import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';

// ❌ Incorrect: Do not override key prop, even in lists
function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      jobs: [{ company: 'Google' }, { company: 'Facebook' }],
    },
  });

  const fields = form.getValues().jobs.map((_, index) => (
      <input
        {...form.getInputProps(`jobs.${index}.company`)}
        key={index}
      />
    ));

  return <form>{fields}</form>;
}

// ✅ Correct: Add wrapper element and pass key to it
function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      jobs: [
        { company: 'Google', key: randomId() },
        { company: 'Facebook', key: randomId() },
      ],
    },
  });

  const fields = form.getValues().jobs.map((item, index) => (
      <div key={item.key}>
        <input
          {...form.getInputProps(`jobs.${index}.company`)}
          key={form.key(`jobs.${index}.company`)}
        />
      </div>
    ));

  return <form>{fields}</form>;
}
```

## Uncontrolled mode in custom components

If you want to build a custom component that supports uncontrolled form mode, you must add support for `defaultValue` prop. The best way to add support for `defaultValue` is to use use-uncontrolled hook:

```tsx
import { useUncontrolled } from '@mantine/hooks';

interface CustomInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

// ✅ CustomInput supports both controlled and uncontrolled modes
function CustomInput({
  value,
  defaultValue,
  onChange,
}: CustomInputProps) {
  const [_value, handleChange] = useUncontrolled({
    value,
    defaultValue,
    finalValue: 'Final',
    onChange,
  });

  return (
    <input
      type="text"
      value={_value}
      onChange={(event) => handleChange(event.currentTarget.value)}
    />
  );
}

function Demo() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { text: 'Initial' },
  });

  // ✅ CustomInput supports `defaultValue` prop,
  // it can be used in uncontrolled mode
  return (
    <CustomInput
      {...form.getInputProps('text')}
      key={form.key('text')}
    />
  );
}
```
