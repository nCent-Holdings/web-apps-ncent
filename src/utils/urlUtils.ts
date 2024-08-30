export const getLastPathnameSegment = (url: string) => {
  try {
    const segments = url.split('/').filter((segment) => segment !== '');
    return segments.length > 0 ? segments[segments.length - 1] : null;
  } catch {
    console.log('Invalid URL:', url);
  }
};
