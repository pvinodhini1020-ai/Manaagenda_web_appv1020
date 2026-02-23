export interface FormErrors {
  [key: string]: string | undefined;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  if (password.length > 128) {
    return 'Password must be less than 128 characters';
  }
  return undefined;
};

export const validateLoginForm = (data: LoginFormData): FormErrors => {
  const errors: FormErrors = {};
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};

export const hasFormErrors = (errors: FormErrors): boolean => {
  return Object.values(errors).some(error => error !== undefined);
};
