import { useEffect } from "react";

export default function useThrowError(error) {
  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);
}
