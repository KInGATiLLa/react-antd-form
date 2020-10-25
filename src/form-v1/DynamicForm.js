import React, { Component, Fragment, PureComponent, useContext, forwardRef } from 'react';
import { Spin, Row, Col, Form, message, Radio, Button } from 'antd';
import '../styles/App.less';
import FormValidation from './validation';
import { isObject, isHasProp, isEmptyObject } from '../utils';
import FormService from './service';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { LAYOUT } from './constants';
import { FormElement, formError } from './utils';
import { FormContext } from '../index';

/* 
DynamicForm properties
  lang: 
  config:
  readonly:
  valuesChange [onValuesChange]: Function(changedValues, allValues)
  fieldsChange [onFieldsChange]: Function(changedFields, allFields)	
  submit [onFinish]: Function(values)
  submitFailed [onFinishFailed]: Function({ values, errorFields, outOfDate })

config:
  name: string
  size: small | middle | large ()
  colon: boolean (true)
  component: ComponentType | false (form)
  hideRequired: boolean (false)
  scrollToError: boolean (false)
  initialValues: object
  validateMessages: ValidateMessages
  layout: horizontal | vertical | inline (horizontal)
  data: [{label, name}]

Form
  component:	ComponentType | false	(form)
  colon:	boolean	(true)
  fields: FieldData[]
  form: FormInstance
  hideRequiredMark:	boolean	(false)
  initialValues:	object
  labelAlign: left | right	(right)
  labelCol: object
  layout: horizontal | vertical | inline	(horizontal)
  name: string
  scrollToFirstError: false
  size: small | middle | large
  validateMessages: ValidateMessages
  wrapperCol: object
  onFinish: Function(values)
  onFinishFailed: Function({ values, errorFields, outOfDate })
  onFieldsChange: Function(changedFields, allFields)
  onValuesChange: Function(changedValues, allValues)


*/
/* 
DynamicForm Props
  -config
  -id
  -data(form data)
  -readOnly(form field make readonly)
  -onSubmit()
  -onChange()
  -onFocus()
  -buttonClick()
  - and more props
Config
  -class
  -prefix
  -debounceTime
  -submitOnEnter
  if config array
  -groups
    =layout
    =toggle
    =toggled
    =legend
    =rows
  if config not array
  -data
    name: {
      field configs
    }
  -button
  -alert

/* const alert = {
  field: 'alert',
  type: 'info',
  message: 'Info',
  visible: true,
  // closable: true,
  showIcon: true,
  duration: 3000,
  description: 'desc',
};

const anchor = {
  field: 'button',
  label: 'Link',
  link: 'https://www.google.mn',
  target: '_blank',
  button: {
    type: 'danger',
    size: 'large',
    icon: 'search',
  },
};
};*/
/* class FormInit extends PureComponent {
  static defaultProps = {};
  static propTypes = {
    config: PropTypes.object.isRequired,
    data: PropTypes.object,
    change: PropTypes.func,
    submit: PropTypes.func,
    readonly: PropTypes.bool,
    valueChange: PropTypes.func,
    fieldsChange: PropTypes.func,
    serviceConfig: PropTypes.object,
    wrappedComponentRef: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      readonly: false,
      submitted: false,
    };

    this.reSubmitDuration = 2000;

    this.lang = 'mn';
    this.checkFields = ['checkbox', 'radio', 'toggle'];
    this.nonFormFields = ['alert', 'anchor', 'paragraph'];
    this.transformFields = ['input'];
    this.editorFields = ['editor'];
    this.fieldValidateTrigger = ['onChange'];
    this.fieldTrigger = 'onChange';

    this.form = React.createRef();

    this.initiate(props);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual(nextProps.data, prevState.data) || nextProps.lang !== prevState.lang) {
      const state = {
        ...prevState,
        lang: nextProps.lang,
        data: nextProps.data,
      };
      return state;
    }
    return null;
  }

  initiate(props) {
    const config = props.formConfig;
    if (!this.formValidation) {
      this.formValidation = new FormValidation(props.form);
    }
    if (!this.formService) {
      if (config && !isEmptyObject(config)) {
        this.formService = new FormService(config);
      } else {
        const msg = 'Can\'t initialize FormService without "serviceConfig" in your form!!!';
        message.error(msg, 4);
        console.error(msg);
      }
    }
  }

  getFormValue(values) {
    return JSON.parse(JSON.stringify(values, (key, value) => (value === undefined ? null : value)));
  }
  onSubmit = e => {
    e.preventDefault();
    const { form, readonly } = this.props;
    this.setState({ loading: true });
    if (!readonly && !this.state.submitted) {
      form.validateFields((err, values) => {
        if (!err) {
          this.setState({ submitted: true, loading: false }, () => {
            const value = this.getFormValue(values);
            this.props.submit(value);
          });
        } else {
          this.setState({ submitted: false, loading: false });
        }
      });
    } else {
      this.setState({ loading: false, submitted: false });
      message.info('Форм зөвхөн унших төлөвт байна!', 3);
    }
  };

  initForm = data => {
    this.initFormData(data);
  };

  initFormData = data => {
    const { form, config } = this.props;
    if (data && !isEmptyObject(data)) {
      const initialData = Object.keys(data);
      const configData = config.data.map(item => item.name).slice(0, config.data.length - 1);
      const areEqual = _.isEqual(initialData, configData);
      if (areEqual) {
        form.setFieldsValue(data);
      } else {
        formError('form', 0);
      }
    }
  };

  updateFormData(prevState) {
    const { form } = this.props;
    const { data, lang } = this.state;
    if (!_.isEqual(data, prevState.data) || lang !== prevState.lang) {
      form.setFieldsValue(data);
    }
  }

  resetForm(prevState) {
    if (prevState.submitted !== this.state.submitted) {
      setTimeout(() => {
        if (this.state.submitted && !this.state.loading) {
          this.setState({ submitted: false }, () => {
            this.props.form.resetFields();
          });
        }
      }, this.reSubmitDuration);
    }
  }

  formUnMount() {
    if (this.formService) {
      this.formService = null;
    }
    if (this.formValidation) {
      this.formValidation = null;
    }
  }

  componentDidMount = () => {
    this.initForm(this.state.data);
  };

  componentDidUpdate = (prevProps, prevState) => {
    this.updateFormData(prevState);
    this.resetForm(prevState);
  };

  componenDidCatch = (error, errorInfo) => {
    console.error(error);
    console.error(errorInfo);
  };

  componentWillUnmount = () => {
    this.formUnMount();
  };

  initFieldDecoratorOption(config, lang) {
    return {
      rules: this.getRules(config, lang),
      trigger: this.getFieldTrigger(),
      valuePropName: this.getFieldValuePropName(config),
      getValueProps: v => this.getFieldValueProps(v, config),
      getValueFromEvent: e => this.getFieldValueFromEvent(e, config),
      validateTrigger: this.getFieldValidateTrigger(),
      validateFirst: config.validateFirst || false,
    };
  }

  getFieldDecoratorOption(config, lang) {
    const { field, rules, initialValue } = config;
    const { data } = this.state;
    let option = this.initFieldDecoratorOption(config, lang);
    option = this.checkFieldNormalize(field, rules, option);
    if (this.checkFields.indexOf(field) > -1) {
      option = { ...option, initialValue: false };
    }
    if (!data && initialValue !== undefined) {
      option = { ...option, initialValue };
    }
    return option;
  }

  checkFieldNormalize(field, rules, option) {
    const { transforms } = this.formValidation;
    if (this.transformFields.indexOf(field) > -1 && rules) {
      const transform = Object.keys(rules).find(rule => transforms.includes(rule));
      if (transform) {
        option = {
          ...option,
          normalize: (value, prevValue) => this.getFieldNormalize(value, prevValue, transform),
        };
      }
    }
    return option;
  }

  getFieldValuePropName(config) {
    const { field, options, valueProp } = config;
    if (this.checkFields.indexOf(field) > -1) {
      return options ? 'value' : 'checked';
    } else {
      return valueProp ? valueProp : 'value';
    }
  }

  getFieldInitialValue(data, name) {
    if (isHasProp(data, name)) {
      return data[name];
    } else {
      formError('form', 1, name, '{name}');
    }
  }

  getFieldTrigger = () => this.fieldTrigger;

  getFieldValueProps = (value, config) => {
    const { field, options } = config;
    let name = 'value';
    if (this.checkFields.indexOf(field) > -1) {
      name = options ? 'value' : 'checked';
    }
    return { [name]: value };
  };

  getFieldValueFromEvent = (e, config) => {
    const { field, options } = config;
    if (Array.isArray(e) || !e || !e.target) {
      return e;
    } else if (e && e.target) {
      const { target } = e;
      if (this.checkFields.indexOf(field) > -1) {
        return options ? target.value : target.checked;
      } else if (this.editorFields.indexOf(field) > -1) {
        return target.getContent();
      } else {
        return target.value;
      }
    }
  };

  getFieldValidateTrigger = () => this.fieldValidateTrigger;

  getFieldNormalize = (value, prevValue, transform) => {
    const { transformValue } = this.formValidation;
    if (value === prevValue) {
      return value;
    }
    return transformValue(transform, value);
  };

  getRules = (config, lang) => {
    const { data } = this.props.config;
    const { rules } = config;
    if (rules) {
      if (isObject(rules)) {
        const propsConfig = data.map(cfg => ({ name: cfg.name, label: cfg.label }));
        return this.formValidation.getFormRules(propsConfig, config, lang);
      } else {
        formError('form', 2);
      }
    }
    return [];
  };

  getFormLayout = layout => {
    let col = {
      labelCol: { span: 6, offset: 0 },
      wrapperCol: { span: 12, offset: 0 },
    };
    if (isObject(layout) && layout) {
      const { labelCol, wrapperCol } = layout;
      col = { labelCol, wrapperCol };
    }
    const formLayout = { layout: LAYOUT.h, ...col };
    return layout === LAYOUT.h ? formLayout : { layout };
  };

  getFormButtonLayout = (layout, block) => {
    let buttonLayout = null;
    if (layout === LAYOUT.h) {
      const formLayout = this.getFormLayout(layout);
      const { span } = formLayout.labelCol;
      const { wrapperCol } = formLayout;
      buttonLayout = { span: block ? wrapperCol.span : 8, offset: span };
    }
    return buttonLayout;
  };

  getLayout(config) {
    const {
      config: { layout },
    } = this.props;
    const { field, block } = config;
    const btnLayout = this.getFormButtonLayout(layout, block);
    const formLayout = this.getFormLayout(layout);
    return field !== 'button' ? formLayout : btnLayout;
  }

  checkLang(label, lang) {
    if (label[lang] && !lang) {
      formError('form', 3);
    }
  }

  checkConfigButton() {
    const { data } = this.props.config;
    const lastConfig = data[data.length - 1];
    return lastConfig.field === 'button';
  }

  renderFormItem = (config, lang) => {
    const { form, readonly, data } = this.props;
    const { field, label, hidden, rules } = config;
    const { submitted } = this.state;
    const layout = this.getLayout(config);
    const props = { form, lang, config, layout, submitted, rules };
    if (this.nonFormFields.indexOf(field) === -1) {
      this.checkLang(label, lang);
    }
    if (field === 'button') {
      return <FormElement {...props} />;
    } else {
      if (readonly && data) {
        config = { ...config, disabled: true };
      }
      if (!hidden) {
        const option = this.getFieldDecoratorOption(config, lang);
        return <FormElement {...props} fieldOption={option} />;
      }
    }
  };

  render = () => {
    const { layout, data, hideRequired } = this.props.config;
    const { loading, lang } = this.state;
    const formLayout = this.getFormLayout(layout);
    return (
      <Spin spinning={loading}>
        <Form
          {...formLayout}
          hideRequiredMark={hideRequired}
          ref={form => (this.form = form)}
          onSubmit={e => this.onSubmit(e)}
        >
          {data.map((config, i) => (
            <Fragment key={i}>{this.renderFormItem(config, lang)}</Fragment>
          ))}
        </Form>
      </Spin>
    );
  };
} */

/* const DynamicForm = Form.create({
  name: 'dynamic_form',
  mapPropsToFields: props => {
    //
  },
  onValuesChange: (props, changedValues, allValues) => {
    props.valueChange(changedValues);
    props.change(allValues);
  },
  onFieldsChange: (props, fields, allFields) => {
    props.fieldsChange(fields);
  },
})(
  forwardRef((props, ref) => {
    const config = useContext(FormContext);
    return <FormInit ref={ref} {...props} formConfig={config} />;
  }),
); */

class DynamicFormApp extends Component {
  state = {
    data: {
      field1: 'first',
      field2: 'last',
      field3: 'fat',
      field4: `lasjdlfsjaf`,
      field5: '1',
    },
    formData: null,
    lang: 'mn',
  };

  formRef = React.createRef();

  formValuesChange(values) {
    // console.log(values);
  }

  formValueChange(value) {
    // console.log(value);
  }

  formFieldsChange(fields) {
    // console.log(fields);
  }

  formSubmit(values) {
    this.setState({ formData: values });
  }

  handle() {
    // const { form } = this.formRef.formRef;
    // form.submit((err, values) => {
    //   if (!err) return;
    //   console.log(values);
    // });
    // console.log('asd');
  }

  componentDidMount() {
    //
  }

  componentDidUpdate(prevProps, prevState) {}

  render() {
    const config = {
      layout: LAYOUT.h,
      data: [
        {
          field: 'array',
          name: 'field0',
          label: {
            en: 'Field0',
            mn: 'Талбар0',
          },
          // initialValue: [
          //   { label: 'Label1', value: '1' },
          //   { label: 'Label2', value: '2' },
          // ],
          tooltip: {
            en: 'Please enter field0!',
            mn: 'Талбар0 оруулна уу',
          },
          rules: {
            required: true,
          },
        },
        {
          field: 'input',
          name: 'field1',
          label: {
            en: 'Field1',
            mn: 'Талбар1',
          },
          specificType: 'text',
          // hidden: true,
          // initialValue: 'value',
          // disabled: true,
          tooltip: {
            en: 'Please enter field1!',
            mn: 'Талбар1 оруулна уу',
          },
          placeholder: {
            en: 'Field1...',
            mn: 'Талбар1...',
          },
          prefix: {
            icon: { type: 'user' },
          },
          rules: {
            // required: true,
          },
          // extra: 'First',
          // tooltip,
          // percent,
          // currency,
          // common-------->
          // min,
          // max,
          // size,
          // step,
          // style,
          // value,
          // prefix,
          // suffix,
          // hidden,
          // loading,
          // disabled,
          // autoSize,
          // className,
          // autoFocus,
          // precision,
          // allowClear,
          // visibility,
          // enterButton,
          // placeholder,
          // initialValue,
          // addOnBefore,
          // addOnAfter,
          // separator,
        },
        {
          field: 'input',
          name: 'field2',
          label: {
            en: 'Field2',
            mn: 'Талбар2',
          },
          tooltip: {
            en: 'Please enter Field2!',
            mn: 'Талбар2 оруулна уу',
          },
          placeholder: {
            en: 'Field2 Name...',
            mn: 'Талбар2...',
          },
          // initialValue: 'asd',
          // disabled: true,
          specificType: 'number',
          rules: {
            // required: true,
          },
        },
        {
          field: 'input',
          name: 'field3',
          label: {
            en: 'Field3',
            mn: 'Талбар3',
          },
          tooltip: {
            en: 'Please enter Field3!',
            mn: 'Талбар3 оруулна уу',
          },
          placeholder: {
            en: 'Field3 Name...',
            mn: 'Талбар3...',
          },
          // initialValue: 'asd',
          // disabled: true,
          specificType: 'password',
          rules: {
            // required: true,
          },
        },
        {
          field: 'input',
          name: 'field4',
          specificType: 'textarea',
          label: {
            en: 'Field4',
            mn: 'Талбар4',
          },
          tooltip: {
            en: 'Please enter Field4!',
            mn: 'Талбар4 оруулна уу',
          },
          placeholder: {
            en: 'Field4 Name...',
            mn: 'Талбар4...',
          },
          allowClear: true,
          rules: {
            // required: true,
          },
        },
        {
          field: 'select',
          name: 'field5',
          label: {
            en: 'Field5',
            mn: 'Талбар5',
          },
          tooltip: {
            en: 'Please enter Field5!',
            mn: 'Талбар5 оруулна уу',
          },
          showSearch: true,
          options: [
            { label: 'React', value: '1' },
            { label: 'Angular', value: '2' },
            { label: 'Vue', value: '3' },
            { label: 'Svelte', value: '4' },
          ],
          // mode: 'tags',
          placeholder: {
            en: 'Field5 Name...',
            mn: 'Талбар5...',
          },
          rules: {
            // required: true,
          },
        },
        {
          field: 'checkbox',
          name: 'field6',
          label: {
            en: 'Field6',
            mn: 'Талбар6',
          },
          tooltip: {
            en: 'Please enter Field6!',
            mn: 'Талбар6 оруулна уу',
          },
          content: {
            en: 'Field6 Name',
            mn: 'Талбар6',
          },
          rules: {
            // required: true,
          },
        },
        {
          field: 'radio',
          name: 'field7',
          label: {
            en: 'Field7',
            mn: 'Талбар7',
          },
          tooltip: {
            en: 'Please enter Field7!',
            mn: 'Талбар7 оруулна уу',
          },
          specificType: 'button',
          options: [
            { label: 'Radio1', value: '1' },
            { label: 'Radio2', value: '2' },
          ],
          buttonStyle: 'outline',
          rules: {
            // required: true,
          },
        },
        {
          field: 'rate',
          name: 'field8',
          label: {
            en: 'Field8',
            mn: 'Талбар8',
          },
          tooltip: {
            en: 'Please enter Field8!',
            mn: 'Талбар8 оруулна уу',
          },
          tooltipTxt: true,
          // initialValue: 2,
          rules: {
            // required: true,
          },
        },
        {
          field: 'slider',
          name: 'field9',
          label: {
            en: 'Field9',
            mn: 'Талбар9',
          },
          tooltip: {
            en: 'Please enter Field9!',
            mn: 'Талбар9 оруулна уу',
          },
          min: 0,
          max: 100,
          initialValue: 0,
          rules: {
            // required: true,
          },
        },
        {
          field: 'toggle',
          name: 'field10',
          label: {
            en: 'Field10',
            mn: 'Талбар10',
          },
          tooltip: {
            en: 'Please enter Field10!',
            mn: 'Талбар10 оруулна уу',
          },
          onTxt: 'Тийм',
          offTxt: 'Үгүй',
          rules: {
            // required: true,
          },
        },
        {
          field: 'date',
          name: 'field11',
          label: {
            en: 'Field11',
            mn: 'Талбар11',
          },
          specificType: 'datetime',
          tooltip: {
            en: 'Please enter Field11!',
            mn: 'Талбар11 оруулна уу',
          },
          rules: {
            // required: true,
          },
        },
        {
          field: 'file',
          name: 'file',
          label: {
            en: 'Field12',
            mn: 'Талбар12',
          },
          tooltip: {
            en: 'Please enter Field12!',
            mn: 'Талбар12 оруулна уу',
          },
          icon: 'inbox',
          specificType: 'image',
          initialValue:
            'http://localhost:8086/livestock-cdn/files/authorized/1571133772975_084 ogotor har angus.JPG',
          apiOptions: {
            context: 'upload',
            bearer: true,
          },
          rules: {
            // required: true,
          },
        },
        {
          field: 'tag',
          name: 'field13',
          label: {
            en: 'Field13',
            mn: 'Талбар13',
          },
          specificType: 'group',
          tooltip: {
            en: 'Please enter Field13!',
            mn: 'Талбар13 оруулна уу',
          },
          initialValue: ['Tag1', 'Tag2', 'Tag3'],
          rules: {
            // required: true,
          },
        },
        {
          field: 'button',
          name: 'submit',
          htmlType: 'submit',
          label: {
            en: 'Save',
            mn: 'Хадгалах',
          },
          icon: 'save',
          type: 'primary',
        },
      ],
    };
    const config1 = {
      layout: LAYOUT.h,
      data: [
        {
          field: 'anchor',
          name: 'field1',
          button: {
            type: 'primary',
          },
          label: 'Goto google',
          link: 'https://www.google.com',
        },
        {
          field: 'array',
          name: 'field0',
          label: {
            en: 'Field0',
            mn: 'Талбар0',
          },
          // initialValue: [
          //   { label: 'Label1', value: '1' },
          //   { label: 'Label2', value: '2' },
          // ],
          tooltip: {
            en: 'Please enter field0!',
            mn: 'Талбар0 оруулна уу',
          },
          rules: {
            // required: true,
            arrayInput: true,
          },
        },
        {
          field: 'toggle',
          name: 'field10',
          label: {
            en: 'Field10',
            mn: 'Талбар10',
          },
          tooltip: {
            en: 'Please enter Field10!',
            mn: 'Талбар10 оруулна уу',
          },
          onTxt: 'Тийм',
          offTxt: 'Үгүй',
          rules: {
            required: true,
          },
        },
        {
          field: 'date',
          name: 'field11',
          label: {
            en: 'Field11',
            mn: 'Талбар11',
          },
          specificType: 'date',
          tooltip: {
            en: 'Please enter Field11!',
            mn: 'Талбар11 оруулна уу',
          },
          rules: {
            required: true,
          },
        },
        {
          field: 'input',
          name: 'field2',
          label: {
            en: 'Field2',
            mn: 'Талбар2',
          },
          tooltip: {
            en: 'Please enter Field2!',
            mn: 'Талбар2 оруулна уу',
          },
          placeholder: {
            en: 'Field2 Name...',
            mn: 'Талбар2...',
          },
          // initialValue: 'asd',
          // disabled: true,
          specificType: 'text',
          rules: {
            // required: true,
          },
        },
        {
          field: 'input',
          name: 'field3',
          label: {
            en: 'Field3',
            mn: 'Талбар3',
          },
          tooltip: {
            en: 'Please enter Field3!',
            mn: 'Талбар3 оруулна уу',
          },
          placeholder: {
            en: 'Field3 Name...',
            mn: 'Талбар3...',
          },
          // initialValue: 'asd',
          // disabled: true,
          specificType: 'text',
          rules: {
            // required: true,
          },
        },
        {
          field: 'button',
          name: 'submit',
          htmlType: 'submit',
          label: {
            en: 'Save',
            mn: 'Хадгалах',
          },
          icon: 'save',
          type: 'primary',
        },
      ],
    };
    return (
      <div style={{ marginTop: '20px' }}>
        <Row type="flex" justify="center">
          <Col span={20}>
            <Button
              type="danger"
              onClick={() =>
                this.setState({
                  data: {
                    first: Math.floor(Math.random() * 100).toString(),
                    last: Math.floor(Math.random() * 50).toString(),
                    fat: Math.floor(Math.random() * 70).toString(),
                    thin: Math.floor(Math.random() * 150).toString(),
                  },
                })
              }
            >
              Update data
            </Button>
            <br />
            <Radio.Group
              onChange={e => this.setState({ lang: e.target.value })}
              defaultValue={this.state.lang}
            >
              <Radio.Button value="en">Eng</Radio.Button>
              <Radio.Button value="mn">Mng</Radio.Button>
            </Radio.Group>
            {/* <DynamicForm
              lang={this.state.lang}
              // data={this.state.data}
              config={config}
              readonly={false}
              wrappedComponentRef={inst => (this.formRef = inst)}
              change={values => this.formValuesChange(values)}
              valueChange={value => this.formValueChange(value)}
              fieldsChange={fields => this.formFieldsChange(fields)}
              submit={values => this.formSubmit(values)}
            /> */}
            <Button type="primary" htmlType="submit" onClick={() => this.handle()}>
              Custom submit
            </Button>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div style={{ width: '50%' }}>
                <pre style={{ whiteSpace: 'normal' }}>
                  <code>{JSON.stringify(this.state.formData, undefined, 2)}</code>
                </pre>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DynamicFormApp;
