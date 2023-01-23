// See:
// https://github.com/omerman/jotai-nexus/blob/master/src/JotaiNexus.tsx

import { useAtomCallback } from "jotai/utils";
import { useCallback, useEffect } from "react";

export let readAtom;
export let writeAtom;

const JotaiNexus = () => {
  const init = useAtomCallback(
    useCallback((get, set) => {
      readAtom = get
      writeAtom = set
    }, [])
  )

  useEffect(() => {
    init();
  }, [init])

  return null
}

export default JotaiNexus
