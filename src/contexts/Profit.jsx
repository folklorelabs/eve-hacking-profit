import React, {
  createContext,
  useReducer,
  useMemo,
  useContext,
} from 'react';
import { childrenProps, childrenDefaults } from '../propTypes/children';
import ITEMS from '../data/items.json';
import ITEM_TYPES from '../data/itemTypes.json';
import SITES from '../data/sites.json';
import CANS from '../data/cans.json';
import FACTIONS from '../data/factions.json';

// STATE
const INITIAL_STATE = {
  factions: FACTIONS,
  items: ITEMS,
  itemTypes: ITEM_TYPES,
  cans: CANS,
  sites: SITES,
};

// ACTIONS
export const ACTIONS = {
  RESET: 'RESET',
  LOAD_ESI_MARKET_DATA: 'LOAD_ESI_MARKET_DATA',
  LOAD_EVEPRAISAL: 'LOAD_EVEPRAISAL',
};
export function resetMarketData() {
  return [ACTIONS.RESET];
}
export async function loadEsiMarketData() {
  const url = 'https://esi.evetech.net/latest/markets/prices/';
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} - ${url}`);
  }
  const prices = await res.json();
  return [ACTIONS.LOAD_ESI_MARKET_DATA, prices];
}

// REDUCER
function REDUCER(state, [type, payload]) {
  switch (type) {
    case ACTIONS.RESET:
      return {
        ...state,
        ...INITIAL_STATE,
      };
    case ACTIONS.LOAD_ESI_MARKET_DATA:
      return {
        ...state,
        items: state.items.map((item) => ({
          ...item,
          esiValue: (payload.find((price) => price.type_id === item.typeID) || {}).average_price,
        })),
      };
    default:
      return { ...state };
  }
}

// GETTERS
export function getFactionItems(state, factionName) {
  return state.items.filter((item) => item.factions.includes(factionName));
}
export function getFactionItemsByType(state, factionName, itemType) {
  return getFactionItems(state, factionName)
    .filter((item) => item.type === itemType);
}
export function getFactionCanAvg(state, factionName, canType) {
  const can = state.cans.find((c) => c.id === canType);
  if (!can) return 0;
  return can.contents.reduce((sum, canContents) => {
    const itemsAvailable = getFactionItemsByType(state, factionName, canContents.type);
    const itemQty = ((canContents.qtyCeiling - canContents.qtyFloor) / 2) + canContents.qtyFloor;
    const itemSum = itemsAvailable
      .reduce((iSum, item) => iSum + (item.esiValue * itemQty), 0);
    return sum + (itemSum * canContents.probability);
  }, 0);
}

export function getFactionCanMax(state, factionName, canType) {
  const can = state.cans.find((c) => c.id === canType);
  if (!can) return 0;
  return can.contents.reduce((sum, canContents) => {
    const itemsAvailable = getFactionItemsByType(state, factionName, canContents.type);
    const itemQty = canContents.qtyCeiling;
    const itemSum = itemsAvailable
      .reduce((iSum, item) => iSum + (item.esiValue * itemQty), 0);
    return sum + itemSum;
  }, 0);
}

const ProfitContext = createContext({
  profitState: INITIAL_STATE,
  profitDispatch: () => {},
});

export function ProfitProvider({
  children,
}) {
  const [profitState, profitDispatch] = useReducer(REDUCER, INITIAL_STATE);

  React.useEffect(() => {
    (async () => {
      const action = await loadEsiMarketData();
      profitDispatch(action);
    })();
  }, []);

  // wrap value in memo so we only re-render when necessary
  const providerValue = useMemo(() => ({
    profitState,
    profitDispatch,
  }), [profitState, profitDispatch]);

  return (
    <ProfitContext.Provider value={providerValue}>
      {children}
    </ProfitContext.Provider>
  );
}
ProfitProvider.defaultProps = {
  children: childrenDefaults,
};

ProfitProvider.propTypes = {
  children: childrenProps,
};

export function useProfitContext() {
  return useContext(ProfitContext);
}
