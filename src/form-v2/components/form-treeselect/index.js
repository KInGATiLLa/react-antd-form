import React, { Component } from 'react';
import PropTypes from 'prop-types';

/* 
TreeSelect
  allowClear: boolean(false)
  autoClearSearchValue: boolean(true)
  bordered: boolean(true)
  defaultValue: string|string[]
  disabled: boolean(false)
  dropdownClassName: string
  dropdownMatchSelectWidth: boolean(true)
  dropdownStyle: object
  filterTreeNode: boolean|Function(inputValue: string, treeNode: TreeNode)(should return boolean)-(Function)
  getPopupContainer: Function(triggerNode)-(() => document.body)
  labelInValue: boolean(false)
  loadData: function(node)
  maxTagCount: number
  maxTagPlaceholder: ReactNode/function(omittedValues)
  multiple: boolean(false)
  placeholder: string
  // searchPlaceholder: string
  searchValue: string
  treeIcon: boolean(false)
  showCheckedStrategy: enum { TreeSelect.SHOW_ALL, TreeSelect.SHOW_PARENT, TreeSelect.SHOW_CHILD }-(TreeSelect.SHOW_CHILD)
  showSearch: boolean(single: false | multiple: true)
  size: string(large | middle | small)
  showArrow: boolean
  suffixIcon: ReactNode
  treeCheckable: boolean(false)
  treeCheckStrictly: boolean(false)
  treeData: array\<{ value, title, children, [disabled, disableCheckbox, selectable] }>-([])
  treeDataSimpleMode: false|object\<{ id: string, pId: string, rootPId: string }>(false)
  treeDefaultExpandAll: boolean(false)
  treeDefaultExpandedKeys: string[]
  treeExpandedKeys: string[]
  treeNodeFilterProp: string('value')
  treeNodeLabelProp: string('title')
  value: string|string[]
  onChange: function(value, label, extra)
  onSearch: function(value: string)
  onSelect: function(value, node, extra)
  onTreeExpand: function(expandedKeys)
TreeNode props
  selectable: boolean(true)
  checkable: boolean
  disableCheckbox: boolean(false)
  disabled: boolean(false)
  isLeaf: boolean(false)
  key: string
  title: string|ReactNode ('---')
  value: string
*/

class FormTreeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div></div>;
  }
}

FormTreeSelect.propTypes = {
  form: PropTypes.object,
  config: PropTypes.object.isRequired,
};

export default FormTreeSelect;
