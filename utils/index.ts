// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateForm = (values: any) => {
  const errors: string[] = [];

  if (!values.billing_first_name?.toString().trim())
    errors.push("First name is required.");

  if (!values.billing_last_name?.toString().trim())
    errors.push("Last name is required.");

  if (!values.billing_phone?.toString().trim())
    errors.push("Phone number is required.");

  if (!values.billing_address_1?.toString().trim())
    errors.push("Address is required.");

  if (!values.billing_city?.toString().trim())
    errors.push("City is required.");

  if (!values.billing_state?.toString().trim())
    errors.push("Province is required.");

  if (!values.billing_postcode?.toString().trim())
    errors.push("Postal code is required.");

  const email = values.billing_email?.toString().trim();

  if (!email) {
    errors.push("Email is required.");
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.push("Enter a valid email.");
  }

  return errors;
};

export const validatePhone = (phone: string): boolean => {
  const trimmedPhone = phone?.toString().trim();
  return /^(\+92|0)?3\d{9}$/.test(trimmedPhone);
};