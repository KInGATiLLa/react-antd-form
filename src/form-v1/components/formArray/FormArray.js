import React, { Component, memo, forwardRef } from 'react';
import { Form, Input, Row, Col, Button, Tooltip } from 'antd';
import {
  formLabel,
  fieldHasValue,
  fieldHasError,
  fieldHasFeedback,
  fieldValidateStatus,
} from '../../utils';
import { VALIDATE } from '../../constants';
// import PropTypes from 'prop-types';

class ArrayInput extends Component {
  state = {
    arrValues: this.props.value || [{ label: null, value: null }],
  };
  componentDidUpdate(prevProps, prevState) {
    const { submitted } = this.props;
    if (submitted !== prevProps.submitted) {
      if (submitted) {
        this.resetInput();
      }
    }
  }
  resetInput = () => {
    this.setState({ arrValues: [{ label: null, value: null }] });
  };

  addInput = () => {
    this.setState(
      state => ({ arrValues: [...state.arrValues, { label: null, value: null }] }),
      () => this.handleChange(this.state.arrValues),
    );
  };
  removeInput = (e, index) => {
    if (this.state.arrValues.length === 1) return;
    this.setState(
      state => ({ arrValues: state.arrValues.filter((value, i) => i !== index) }),
      () => this.handleChange(this.state.arrValues),
    );
  };
  inputOnChange = (e, key, index) => {
    const value = e.target.value;
    this.setState(
      state => ({
        arrValues: state.arrValues.map((values, i) =>
          index === i ? { ...values, [key]: value } : values,
        ),
      }),
      () => this.handleChange(this.state.arrValues),
    );
  };

  handleChange = values => this.props.onChange(values);

  render() {
    const { arrValues } = this.state;
    return (
      <>
        {arrValues.map((values, index) => {
          return (
            <Row type="flex" key={index} gutter={8}>
              <Col span={11}>
                <Input
                  value={values.label}
                  style={{ margin: '10px 10px 0 0' }}
                  placeholder="Нэр"
                  onChange={e => this.inputOnChange(e, 'label', index)}
                />
              </Col>
              <Col span={11}>
                <Input
                  value={values.value}
                  style={{ margin: '10px 10px 0 0' }}
                  placeholder="Утга"
                  onChange={e => this.inputOnChange(e, 'value', index)}
                />
              </Col>
              <Col span={2}>
                {arrValues.length > 1 ? (
                  <Tooltip title="Хасах" placement="right">
                    {/* <Icon
                      className="dynamic-delete-button"
                      type="minus-circle-o"
                      onClick={e => this.removeInput(e, index)}
                    /> */}
                  </Tooltip>
                ) : null}
              </Col>
            </Row>
          );
        })}
        <Row type="flex" gutter={8}>
          <Col span={12}>
            <Button type="dashed" style={{ margin: '10px 10px 0 0' }} onClick={this.addInput}>
              Нэмэх
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}

const FormArray = (props, ref) => {
  const { form, lang, config, fieldOption, layout, submitted } = props;
  const { name, label, tooltip, rules } = config;

  let itemLabel = formLabel(label, tooltip, lang);

  const hasValue = fieldHasValue(form, name),
    error = fieldHasError(form, name),
    hasFeedback = fieldHasFeedback(error, hasValue, rules),
    validateStatus = fieldValidateStatus(error, hasValue, rules);

  return (
    <Form.Item ref={ref} key={name} label={itemLabel}>
      {form.getFieldDecorator(
        name,
        fieldOption,
      )(<ArrayInput submitted={submitted} config={config} form={form} layout={layout} />)}
    </Form.Item>
  );
};

export default memo(forwardRef(FormArray));
