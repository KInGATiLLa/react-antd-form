import React, { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  formLabel,
  fieldHasValue,
  fieldHasError,
  fieldHasFeedback,
  fieldValidateStatus,
} from '../../utils';
import { Form } from 'antd';

/* 
Mention
  autoFocus: boolean(false)
  defaultValue: string
  filterOption: false | (input: string, option: OptionProps) => boolean
  notFoundContent: ReactNode('Not Found')
  placement: 'top' | 'bottom'('bottom')
  prefix: string | string[]('@')
  split: string(' ')
  validateSearch: (text: string, props: MentionsProps) => void
  value: string
  onChange: (text: string) => void
  onSelect: (option: OptionProps, prefix: string) => void
  onSearch: (text: string, prefix: string) => void
  onFocus: () => void
  onBlur: () => void
  getPopupContainer: () => HTMLElement

Option
  children: ReactNode
  value: string
*/

const FormMention = (props, ref) => {
  const { form, lang, config, fieldOption } = props;
  const {
    // custom
    name,
    rules,
    label,
    extra,
    tooltip,
    // common
  } = config;
  const itemLabel = formLabel(label, tooltip, lang);
  let element = null;

  const hasValue = fieldHasValue(form, name),
    error = fieldHasError(form, name),
    hasFeedback = fieldHasFeedback(error, hasValue, rules),
    validateStatus = fieldValidateStatus(error, hasValue, rules);

  return (
    <Form.Item
      ref={ref}
      key={name}
      extra={extra}
      label={itemLabel}
      hasFeedback={hasFeedback}
      validateStatus={validateStatus}
    >
      {form.getFieldDecorator(name, fieldOption)(element)}
    </Form.Item>
  );
};

export default memo(forwardRef(FormMention));
