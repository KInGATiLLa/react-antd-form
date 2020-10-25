import React, { Component } from 'react';
import PropTypes from 'prop-types';

/* 
Transfer
  className: string(['', ''])
  dataSource: TransferItem[]([])
    key: string;
    title: string;
    description?: string;
    disabled?: boolean;
  disabled: boolean(false)
  filterOption: (inputValue, option): boolean
  footer: (props) => ReactNode
  lazy: object|boolean(	{ height: 32, offset: 32 })
  listStyle: object
  locale: { itemUnit: string; itemsUnit: string; searchPlaceholder: string; notFoundContent: ReactNode; }
    ({ itemUnit: 'item', itemsUnit: 'items', notFoundContent: 'The list is empty', searchPlaceholder: 'Search here' })
  operations: string[](	['>', '<'])
  operationStyle: object
  render: (record) => ReactNode
  selectedKeys: string[]([])
  showSearch: boolean(false)
  showSelectAll: boolean(true)
  style: object
  targetKeys: string[]([])
  titles: ReactNode[] 
  onChange: (targetKeys, direction, moveKeys): void
  onScroll: (direction, event): void
  onSearch: (direction: 'left'|'right', value: string): void
  onSelectChange: (sourceSelectedKeys, targetSelectedKeys): void
Render Props
  direction: 'left' | 'right'
  disabled: boolean
  filteredItems: TransferItem[]
  onItemSelect: (key: string, selected: boolean)
  onItemSelectAll: (keys: string[], selected: boolean)
  selectedKeys: string[]

If there's no key in your data, you should use rowKey to specify the key that will be used for uniquely identify each element.
  // eg. your primary key is `uid`
  return <Transfer rowKey={record => record.uid} />;
*/

class FormTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div></div>;
  }
}

FormTransfer.propTypes = {
  form: PropTypes.object,
  config: PropTypes.object.isRequired,
};
export default FormTransfer;
