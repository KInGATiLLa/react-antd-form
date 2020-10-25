import React, { forwardRef } from 'react';
import { Form } from 'antd';
import { formLabel } from '../../utils';
// import PropTypes from 'prop-types';

const FormInputGroup = (props, ref) => {
  const { form, lang, config, fieldOption } = props;
  const {
    // custom
    name,
    label,
    tooltip,
    // common
  } = config;

  const itemLabel = formLabel(label, tooltip, lang);

  return (
    <Form.Item label={itemLabel} key={name} ref={ref}>
      {form.getFieldDecorator(name, fieldOption)()}
    </Form.Item>
  );
};

export default forwardRef(FormInputGroup);
