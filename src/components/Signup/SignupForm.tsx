import React, { useState, FormEvent } from 'react';
import { Button, Heading, Field, Input } from '@ncent-holdings/ux-components';
import * as brandActions from '../../actions/brand';

type SignupData = {
  email: string;
  password: string;
  name: string;
  title: string;
  companyName: string;
  domain: string;
};

interface SignupFormProps {
  onSubmit: (data: SignupData) => Promise<void>;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [domain, setDomain] = useState('');

  const [error, setError] = useState('');

  const isDuplicateEmail = async (emailParam: string) => {
    const userExists = await brandActions.userExists(emailParam);

    return userExists;
  };

  const isDuplicateCompany = async (compName: string, compDomain: string) => {
    const brandExists = await brandActions.brandExists(compName, compDomain);

    return brandExists;
  };

  /**
   * Simple function to check if an email is in a valid format.
   * This is a basic Regex and might not cover all complex email edge-cases,
   * but works for typical usage.
   */
  const isValidEmailFormat = (testEmail: string) => {
    // Basic RFC 5322 standard email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(testEmail);
  };

  /**
   * Quick check for a "strong" password:
   * Must have uppercase, lowercase, digit, and symbol.
   */
  const isStrongPassword = (pwd: string) => {
    // At least 1 uppercase, 1 lowercase, 1 digit, 1 symbol
    // You can adjust the pattern if you want more specific complexity rules
    const pwdRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;
    return pwdRegex.test(pwd);
  };

  /**
   * Check if domain is in a valid format:
   * Basic approach: only letters, numbers, dashes, dots, no spaces, must have at least one dot.
   * e.g. mycompany.com, products.mycompany.com
   */
  const isValidDomainFormat = (dmn: string) => {
    // This regex requires at least one dot and doesn't allow trailing dots or spaces
    const domainRegex = /^(?!-)(?!.*-$)(?!.*\.\.)[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return domainRegex.test(dmn);
  };

  /**
   * Check if the domain portion of the email matches the "top two levels" of the company domain.
   * e.g. joe.smith@mail.mycompany.com vs. mycompany.com => match
   * We'll do a simple approach:
   *   - Extract the last 2 domain parts from "company domain"
   *   - Check if email domain ends with those parts
   */
  const doesDomainMatch = (userEmail: string, compDomain: string) => {
    const emailDomain = userEmail.split('@')[1]; // everything after "@"
    const compParts = compDomain.split('.');
    if (compParts.length < 2) return false;

    // "top two levels" of company domain => e.g. mycompany.com => last 2 parts
    const lastTwo = compParts.slice(-2).join('.');
    // check if email domain ends with lastTwo
    return emailDomain.endsWith(lastTwo);
  };

  /**
   * Check if email is on a "public" email server (like gmail, outlook, etc.).
   * We'll define a small list of common public domains for this example.
   */
  const publicEmailDomains = [
    'gmail.com',
    'outlook.com',
    'hotmail.com',
    'aol.com',
    'yahoo.com',
    'icloud.com',
    // etc...
  ];
  const isPublicEmailDomain = (userEmail: string) => {
    const edomain = userEmail.split('@')[1]?.toLowerCase() || '';
    return publicEmailDomains.includes(edomain);
  };

  /**
   * Clean up domain by removing protocol (http/https) and "www." prefix,
   * then lowercasing it all.
   */
  const cleanupDomain = (dmn: string): string => {
    let result = dmn.trim().toLowerCase();
    // remove "http://" or "https://"
    result = result.replace(/^https?:\/\//i, '');
    // remove "www."
    result = result.replace(/^www\./i, '');
    return result;
  };

  /**
   * handleSubmit - main form submission logic
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1) Do the auto-changes to fields (lowercasing, removing prefixes)
    const fixedEmail = email.trim().toLowerCase();
    const fixedDomain = cleanupDomain(domain);

    // Overwrite the user inputs with these corrected values.
    // So the user doesn't see an error from validations about e.g. uppercase letters
    // or "http://" in the domain.
    setEmail(fixedEmail);
    setDomain(fixedDomain);

    // 2) Validate everything
    // - fields are not empty
    // - password strong, etc.

    // Basic required checks:
    if (!fixedEmail || !password || !password2 || !name.trim() || !companyName.trim() || !fixedDomain) {
      setError('Please fill in all required fields (Email, Password, Full Name, Company Name, Domain).');
      return;
    }

    // Check password length >= 8
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    // Check password match
    if (password !== password2) {
      setError('Passwords do not match.');
      return;
    }

    // Check strong password (uppercase, lower, digits, symbols)
    if (!isStrongPassword(password)) {
      setError('Password must contain uppercase, lowercase, digits, and symbols.');
      return;
    }

    // Check valid email
    if (!isValidEmailFormat(fixedEmail)) {
      setError('Email address is not in a valid format.');
      return;
    }

    // Check if email domain is a public email domain
    if (isPublicEmailDomain(fixedEmail)) {
      setError('Please use a non-public email address (company email) to sign up.');
      return;
    }

    // Check domain format
    if (!isValidDomainFormat(fixedDomain)) {
      setError('Company domain name is not valid.');
      return;
    }

    // Check if domain matches the top-level domain of the email
    if (!doesDomainMatch(fixedEmail, fixedDomain)) {
      setError('Email domain does not match the Company Domain Name.');
      return;
    }

    // Email Duplicate checks
    const emailDupe = await isDuplicateEmail(fixedEmail);
    if (emailDupe) {
      setError('Email address already exists in the system.');
      return;
    }

    // Company Duplicate checks
    const companyDupe = await isDuplicateCompany(companyName, fixedDomain);
    if (companyDupe) {
      setError('Company already exists in the system.  Please contact your company admin to create your login.');
      return;
    }

    // 4) If all validations pass, call onSubmit
    try {
      await onSubmit({
        email: fixedEmail,
        password,
        name: name.trim(),
        title: title.trim(),
        companyName: companyName.trim(),
        domain: fixedDomain,
      });
    } catch (err: any) {
      setError(err.message || 'Sign-up failed');
    }
  };

  return (
    <div className="flex flex-col max-sm:gap-4 max-sm:px-4 sm:gap-9 md:w-[458px]">
      <Heading heading="Sign Up" subheading="Create a new account" size="h1" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(evt: FormEvent<HTMLInputElement>) => setEmail(evt.currentTarget.value)}
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Password" htmlFor="password">
          <Input.Password
            id="password"
            type="text"
            name="password"
            value={password}
            onChange={(evt: FormEvent<HTMLInputElement>) => setPassword(evt.currentTarget.value)}
            placeholder="Enter a password"
          />
        </Field>

        <Field label="Confirm Password" htmlFor="password2">
          <Input.Password
            id="password2"
            type="text"
            name="password2"
            value={password2}
            onChange={(evt: FormEvent<HTMLInputElement>) => setPassword2(evt.currentTarget.value)}
            placeholder="Re-enter your password"
          />
        </Field>

        <Field label="Full Name" htmlFor="name">
          <Input
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={(evt: FormEvent<HTMLInputElement>) => setName(evt.currentTarget.value)}
            placeholder="Your full name"
          />
        </Field>

        <Field label="Title" htmlFor="title">
          <Input
            id="title"
            type="text"
            name="title"
            value={title}
            onChange={(evt: FormEvent<HTMLInputElement>) => setTitle(evt.currentTarget.value)}
            placeholder="Your position/title"
          />
        </Field>

        <Field label="Company Name" htmlFor="company">
          <Input
            id="company"
            type="text"
            name="companyName"
            value={companyName}
            onChange={(evt: FormEvent<HTMLInputElement>) => setCompanyName(evt.currentTarget.value)}
            placeholder="Company name"
          />
        </Field>

        <Field label="Company Domain Name" htmlFor="domain">
          <Input
            id="domain"
            type="text"
            name="domain"
            value={domain}
            onChange={(evt: FormEvent<HTMLInputElement>) => setDomain(evt.currentTarget.value)}
            placeholder="Company domain name"
          />
        </Field>

        {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}

        <Button type="submit" variant="primary" label="Sign Up" />
      </form>
    </div>
  );
};

export default SignupForm;
