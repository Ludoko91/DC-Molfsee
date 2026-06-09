"use client";

import { useReducer, type Dispatch } from "react";
import { createInitialState } from "@/lib/rack/calculations";
import { rackReducer, type RackAction, type RackState } from "@/lib/rack/rackReducer";

type Options = {
  independentMultiRack?: boolean;
};

function createState(options?: Options): RackState {
  return {
    ...createInitialState(),
    independentMultiRack: options?.independentMultiRack,
  };
}

export function useRackConfig(options?: Options) {
  const [state, dispatch] = useReducer(
    rackReducer,
    options,
    (opts) => createState(opts),
  );
  const activeRack = state.racks.find((r) => r.id === state.activeRackId)!;

  return {
    racks: state.racks,
    activeRackId: state.activeRackId,
    activeRack,
    independentMultiRack: state.independentMultiRack ?? false,
    dispatch: dispatch as Dispatch<RackAction>,
  };
}
