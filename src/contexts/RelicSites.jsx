import React, {
  createContext,
  useReducer,
  useMemo,
  useContext,
} from 'react';
import { childrenProps, childrenDefaults } from '../propTypes/children';
import RELIC_LOOT from '../data/relic-loot.json';
import RELIC_LOOT_TABLES from '../data/relic-loot-tables.json';
import RELIC_SITES from '../data/relic-sites.json';
import RELIC_CANS from '../data/relic-cans.json';

// STATE
const INITIAL_STATE = {
  itemsByFaction: RELIC_LOOT_TABLES,
  items: RELIC_LOOT,
  cans: RELIC_CANS,
  sites: RELIC_SITES,
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
export function loadMarketEvepraisal() {
  // const url = `${getKillmailSimUrl(payload)}`;
  // return [ACTIONS.LOAD, {
  //   ...payload,
  //   url,
  // }];
  return [ACTIONS.LOAD_EVEPRAISAL, {}];
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
    case ACTIONS.LOAD_EVEPRAISAL:
      return {
        ...state,
        shipInfo: payload.shipInfo,
      };
    default:
      return { ...state };
  }
}

// GETTERS
export function getFactionRelicItems(state, factionName) {
  return state.itemsByFaction[factionName].map((itemName) => ({
    ...state.items.find((l) => l.name === itemName),
  }));
}
export function getFactionRelicItemsByTier(state, factionName) {
  const factionLoot = getFactionRelicItems(state, factionName);
  return factionLoot.reduce((all, item) => {
    const newAll = { ...all };
    newAll[item.tier] = newAll[item.tier] || [];
    newAll[item.tier].push(item);
    return newAll;
  }, {});
}
export function getFactionCanAvg(state, factionName, canType) {
  const itemsByTier = getFactionRelicItemsByTier(state, factionName);
  const tiers = Object.keys(itemsByTier);
  const tierAverages = tiers.reduce((all, tier) => {
    const vals = itemsByTier[tier];
    const sum = vals.reduce((s, item) => s + item.esiValue, 0);
    return {
      ...all,
      [tier]: sum / vals.length,
    };
  }, {});
  const can = state.cans[canType];
  const canQtys = tiers.reduce((all, tier) => {
    const canTier = can[tier];
    return {
      ...all,
      [tier]: ((canTier.qtyCeiling - canTier.qtyFloor) / 2) + canTier.qtyFloor,
    };
  }, {});
  return tiers.reduce((all, tier) => {
    const canTier = can[tier];
    const canQty = canQtys[tier];
    const cansVal = tierAverages[tier] * canQty;
    const tierVal = canTier.probability * cansVal;
    return all + tierVal;
  }, 0);
}

export function getFactionCanMax(state, factionName, canType) {
  const itemsByTier = getFactionRelicItemsByTier(state, factionName);
  const tiers = Object.keys(itemsByTier);
  const tierMax = tiers.reduce((all, tier) => {
    const vals = itemsByTier[tier].map((item) => item.esiValue);
    return {
      ...all,
      [tier]: Math.max(...vals),
    };
  }, {});
  const can = state.cans[canType];
  const canQtys = tiers.reduce((all, tier) => {
    const canTier = can[tier];
    return {
      ...all,
      [tier]: canTier.qtyCeiling,
    };
  }, {});
  return tiers.reduce((all, tier) => {
    const canQty = canQtys[tier];
    const cansVal = tierMax[tier] * canQty;
    return all + cansVal;
  }, 0);
}

const RelicSitesContext = createContext({
  relicSitesState: INITIAL_STATE,
  relicSitesDispatch: () => {},
});

export function RelicSitesProvider({
  children,
}) {
  const [relicSitesState, relicSitesDispatch] = useReducer(REDUCER, INITIAL_STATE);

  React.useEffect(() => {
    (async () => {
      const action = await loadEsiMarketData();
      relicSitesDispatch(action);
    })();
  }, []);

  // wrap value in memo so we only re-render when necessary
  const providerValue = useMemo(() => ({
    relicSitesState,
    relicSitesDispatch,
  }), [relicSitesState, relicSitesDispatch]);

  return (
    <RelicSitesContext.Provider value={providerValue}>
      {children}
    </RelicSitesContext.Provider>
  );
}
RelicSitesProvider.defaultProps = {
  children: childrenDefaults,
};

RelicSitesProvider.propTypes = {
  children: childrenProps,
};

export function useRelicSitesContext() {
  return useContext(RelicSitesContext);
}
