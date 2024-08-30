import { Button, OvalLoader } from '@ncent-holdings/ux-components';
import React, { useState } from 'react';
import * as userActions from '@src/actions/user';
import { PasswordProps } from './types';

const Password = ({ email }: PasswordProps) => {
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    setIsLoading(true);
    setIsResetPassword(true);

    try {
      await userActions.resetPassword(email);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw Error(`error reseting password: ${error}`);
    }
  };

  return (
    <div className="rounded-lg border border-white-background bg-white p-8">
      <div className="flex flex-col gap-3">
        <span className="text-h3 font-bold text-[#344054]">Reset your password</span>
        <div>
          {isLoading ? (
            <div className="flex justify-center py-5">
              <OvalLoader />
            </div>
          ) : !isResetPassword ? (
            <>
              <p className="py-8">{`We’ll email you instructions to reset it.`}</p>
              <Button variant="primary" size="large" label="RESET PASSWORD" onClick={handleResetPassword} />
            </>
          ) : (
            <div className="flex flex-col gap-5">
              <p className="pt-4 text-black-soft">
                {'You’ll receive an email shortly at the email address'} <span className="font-semibold">{email}</span>.
              </p>
              <p className="text-black-soft">
                {'If you don’t see the email in a few minutes, please check your Spam/Junk folder.'}
              </p>
              <p>
                {'Didn’t receive the email?'}{' '}
                <span
                  onClick={handleResetPassword}
                  className="cursor-pointer text-[16px] font text-blue-brilliant underline"
                >
                  Click to resend
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Password;
