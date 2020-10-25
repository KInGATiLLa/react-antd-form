import React, { memo, forwardRef } from 'react';
import { Switch, Form } from 'antd';
// import { VALIDATE } from '../../constants';
import { formLabel } from '../../utils';
import { ICONS } from '../../constants';

/* 
Switch(Toggle)
  autoFocus: boolean(false)
  checked: boolean(false)
  checkedChildren: string|ReactNode
  defaultChecked: boolean(false)
  disabled: boolean(false)
  loading: boolean(false)
  size: string(default)
  unCheckedChildren: string|ReactNode
  onChange: Function(checked: boolean, event: Event)
  onClick: Function(checked: boolean, event: Event)
  className: string
*/

const FormToggle = (props, ref) => {
  const { form, lang, config, fieldOption } = props;
  const {
    // custom------------>
    name,
    label,
    extra,
    style,
    tooltip,
    // common------------>
    size,
    onText,
    offText,
    loading,
    disabled,
    autoFocus,
    className,
  } = config;

  const renderChild = type => {
    if (type && type.length === 1) {
      return type;
    }
    // return type && ICONS.includes(type) ? <Icon type={type} /> : type;
  };

  const itemLabel = formLabel(label, tooltip, lang);
  // hasFeedback={hasFeedBack}
  // validateStatus={validateStatus}
  return (
    <Form.Item ref={ref} key={name} extra={extra} label={itemLabel}>
      {form.getFieldDecorator(
        name,
        fieldOption,
      )(
        <Switch
          ref={ref}
          size={size}
          style={style}
          loading={loading}
          disabled={disabled}
          autoFocus={autoFocus}
          className={className}
          checkedChildren={onText ? renderChild(onText) : 'Тийм'}
          unCheckedChildren={offText ? renderChild(offText) : 'Үгүй'}
        />,
      )}
    </Form.Item>
  );
};

export default memo(forwardRef(FormToggle));
