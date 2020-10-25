import React, { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Form, Radio } from 'antd';
import { isHasProp } from '../../../utils';
import { withLang, formLabel } from '../../utils';

/* 
Radio
  autoFocus: boolean(false)
  checked: boolean
  defaultChecked: boolean(false)
  disabled: boolean(false)
  value: any

RadioGroup
  defaultValue: any
  disabled: boolean(false)
  name: string
  options: string[] | Array<{ label: string value: string disabled?: boolean }>
  size: large | default | small(default)
  value: any
  onChange: Function(e:Event)
  buttonStyle: outline | solid(outline)
*/

const { Button } = Radio;

const FormRadio = (props, ref) => {
  const { form, lang, config, fieldOption } = props;

  const {
    // custom------------>
    name,
    label,
    extra,
    specificType,
    content,
    tooltip,
    options,
    // groupName,
    // common------------>
    disabled,
    autoFocus,
    buttonStyle,
  } = config;

  let element = null;

  const renderRadioGroup = () => {
    let props = { name, disabled };
    if (specificType) {
      props = specificType === 'button' ? { ...props, buttonStyle } : props;
      let Component = specificType === 'button' ? Button : Radio;
      return (
        <Radio.Group ref={ref} {...props}>
          {options.map(o => (
            <Component key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </Component>
          ))}
        </Radio.Group>
      );
    }
    return <Radio.Group ref={ref} name={name} {...config} />;
  };

  if (options) {
    element = renderRadioGroup();
  } else {
    element = (
      <Radio ref={ref} autoFocus={autoFocus} disabled={disabled}>
        {withLang(content, lang)}
      </Radio>
    );
  }

  const itemLabel = formLabel(label, tooltip, lang);

  return (
    <Form.Item ref={ref} key={name} extra={extra} label={itemLabel}>
      {form.getFieldDecorator(name, fieldOption)(element)}
    </Form.Item>
  );
};

export default memo(forwardRef(FormRadio));
