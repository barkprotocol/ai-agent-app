import { useEffect, useRef, useCallback } from "react"

type UsePollingOptions<T> = {
  url: string
  id: string
  onUpdate: (newData: T) => void
  interval?: number
  enabled?: boolean
}

const usePolling = <T>({
  url,
  id,
  onUpdate,
  interval = 60000,
  enabled = true,
}: UsePollingOptions<T>) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const poll = useCallback(async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      onUpdate(data as T);
    } catch (error) {
      console.error('Polling error:', error);
      // You might want to add some error handling logic here
    }
  }, [url, onUpdate]);

  useEffect(() => {
    if (!enabled) return;

    const runPoll = () => {
      poll();
      timeoutRef.current = setTimeout(runPoll, interval);
    };

    runPoll();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [id, poll, interval, enabled]);

  const forceUpdate = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    poll();
  }, [poll]);

  return { forceUpdate };
};

export default usePolling;

