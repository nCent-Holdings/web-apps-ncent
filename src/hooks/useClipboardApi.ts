import { useState, useCallback, useEffect } from 'react';

export const useClipboardApi = () => {
  const [content, setContent] = useState<any | null>(null);

  const askPermission = useCallback(async (queryName: any) => {
    try {
      const permissionStatus = await navigator.permissions.query(queryName);
      return permissionStatus.state === 'granted';
    } catch (error) {
      // Browser compatibility / Security error (ONLY HTTPS) ...
      return false;
    }
  }, []);

  const read = useCallback(async () => {
    const hasReadPermission = await askPermission({ name: 'clipboard-read' });
    if (hasReadPermission) {
      const content = await navigator.clipboard.readText();
      setContent(content);
    }
  }, [askPermission]);

  const copy = useCallback(
    async (text: string) => {
      const hasWritePermission = await askPermission({
        name: 'clipboard-write',
      });
      if (hasWritePermission) {
        await navigator.clipboard.writeText(text).then(read);
      }
    },
    [askPermission, read],
  );

  useEffect(() => {
    read();
  }, [read]);

  return { content, copy };
};

export default useClipboardApi;
