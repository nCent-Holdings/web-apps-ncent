import useSession from './useSession';
import { CloudUser } from '@src/api/CloudAPI/models';

export const useUseCloudData = () => {
  const [, sessionAPI] = useSession();
  const { getAuthorizedUserData } = sessionAPI ?? {};
  let userData: CloudUser | undefined = undefined;

  // When users log out, this was throwing is throwing an error b/c
  // it tries to decode a JWT token that doesn't exist
  try {
    userData = getAuthorizedUserData();
  } catch (err) {
    // Do nothing
  }

  return userData;
};

export default useUseCloudData;
