import * as act from "src/actions";
import { useAction } from "src/redux";

export default function useRecordTimestamps() {
  const onFetchRecordTimestamps = useAction(act.onFetchRecordTimestamps);
  return { onFetchRecordTimestamps };
}
