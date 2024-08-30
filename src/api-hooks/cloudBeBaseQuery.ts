import { cloudAPI } from '@src/apiSingleton';

type cloudBeBaseQueryProps = {
  query: string;
  params?: object;
};
const cloudBeBaseQuery = async ({ query, params }: cloudBeBaseQueryProps) => {
  try {
    const data = await cloudAPI.apiClient.get(query, params);

    return { data };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const error = {
      code: e.code || 'UNKNOWN_ERROR',
      reason: e.reason || e.message,
      message: e.message,
    };

    return { error };
  }
};

export default cloudBeBaseQuery;
