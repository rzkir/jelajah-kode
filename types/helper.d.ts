//=================== Form Signup ===================//
interface FormSignupValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

//=================== Email Config ===================//
interface EmailConfig {
  service?: string;
  auth: {
    user: string;
    pass: string;
  };
}
