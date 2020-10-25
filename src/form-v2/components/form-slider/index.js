import React, { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Slider, Form } from 'antd';
import { formLabel } from '../../utils';

/* 
Slider
  autoFocus: boolean(false)
  defaultValue: number|number[](0 or [0, 0])
  disabled: boolean(false)
  dots: boolean(false)
  included: boolean(true)
  marks: object({ number: string|ReactNode } or { number: { style: object, label: string|ReactNode } })
  max: number(100)
  min: number(0)
  range: boolean(false)
  reverse: boolean(false)
  step: number|null(1)
  tipFormatter: Function|null(IDENTITY)
  value: number|number[]
  vertical: Boolean(false)
  onAfterChange: Function(value)(NOOP)
  onChange: Function(value)(NOOP)
  tooltipPlacement: string
  tooltipVisible: Boolean
  getTooltipPopupContainer: Function(() => document.body)
*/

const FormSlider = (props, ref) => {
  const { form, lang, config, fieldOption } = props;
  const { name, label, extra, format, tooltip } = config;

  const itemLabel = formLabel(label, tooltip, lang);

  // value -> 'value|l' l-left, r-right
  const formatter = value => {
    if (format) {
      const val = format.split('|');
      const f = { l: value + val[0], r: val[0] + value };
      return val.length === 2 ? f[val[1]] : value + val[0];
    }
    return value;
  };

  // hasFeedback={hasFeedBack}
  // validateStatus={validateStatus}

  return (
    <Form.Item ref={ref} key={name} extra={extra} label={itemLabel}>
      {form.getFieldDecorator(name, fieldOption)(<Slider {...config} tipFormatter={formatter} />)}
    </Form.Item>
  );
};

export default memo(forwardRef(FormSlider));
