import React from 'react';
import PropTypes from 'prop-types';

import { itemProps } from '../propTypes/item';

import Item from './Item';

import {
  Container,
  ItemListItem,
} from './LootTable.styles';

function LootTable({
  lootTable,
  size,
}) {
  return (
    <Container className="LootTable" size={size}>
      <ul className="ItemList">
        {lootTable.sort((a, b) => b.esiValue - a.esiValue).map((item) => (
          <ItemListItem
            className="ItemList-item"
            key={`${item.typeID}`}
          >
            <Item
              itemImageSrc={`https://images.evetech.net/types/${item.typeID}/icon?size=64`}
              itemName={item.name}
              itemText={`${item.esiValue ? `${Math.round(item.esiValue).toLocaleString()} ISK` : '--'}`}
            />
          </ItemListItem>
        ))}
      </ul>
    </Container>
  );
}

LootTable.defaultProps = {
  size: 0.8,
};

LootTable.propTypes = {
  lootTable: PropTypes.arrayOf(itemProps).isRequired,
  size: PropTypes.number,
};

export default LootTable;
