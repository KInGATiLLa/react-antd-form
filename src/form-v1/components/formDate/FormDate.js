import React, { memo, forwardRef, Component } from 'react';
import moment from 'moment';
import { Form, DatePicker, TimePicker } from 'antd';
import * as localeMn from 'antd/es/date-picker/locale/mn_MN';
import * as localeEn from 'antd/es/date-picker/locale/en_US';
import {
  formLabel,
  formError,
  fieldHasValue,
  fieldHasError,
  fieldHasFeedback,
  fieldValidateStatus,
} from '../../utils';
import { VALIDATE } from '../../constants';
import { isBoolean, isString } from '../../../utils';

/* 
Common
  allowClear : boolean | true
  autoFocus : boolean | false
  className : string | ''
  dateRender : function(currentDate: moment, today: moment)|ReactNode
  disabled :	boolean | false
  disabledDate :	(currentDate: moment) | boolean
  dropdownClassName : string
  getCalendarContainer : function(trigger)
  locale : object
  mode : time|date|month|year|decade | 'date'
  open : boolean
  placeholder : string|RangePicker[]
  popupStyle : object | {}
  size : string
  suffixIcon : ReactNode
  style : object | {}
  onOpenChange :	function(status)
  onPanelChange : function(value, mode)

DatePicker
  defaultValue : moment
  defaultPickerValue : moment
  disabledTime : function(date)
  format : string|string[] | "YYYY-MM-DD"
  renderExtraFooter : (mode) => React.ReactNode
  showTime :	object|boolean | TimePicker Options
  showTime.defaultValue : moment | moment()
  showToday : boolean | true
  value : moment
  onChange : function(date: moment, dateString: string)
  onOk : function()
  onPanelChange : function(value, mode)

MonthPicker
  defaultValue : moment
  defaultPickerValue : moment
  format : string | "YYYY-MM"
  monthCellContentRender : function(date, locale): ReactNode
  renderExtraFooter : 	() => React.ReactNode
  value : 	moment
  onChange : function(date: moment, dateString: string)

WeekPicker
  defaultValue : moment
  defaultPickerValue : moment
  format : string | "YYYY-wo"
  value : moment
  onChange : function(date: moment, dateString: string)
  renderExtraFooter : (mode) => React.ReactNode

RangePicker
  defaultValue : 	[moment, moment]
  defaultPickerValue : [moment, moment]
  disabledTime : function(dates: [moment, moment], partial: 'start'|'end')
  format : string|string[] | "YYYY-MM-DD HH:mm:ss"	
  ranges : { [range: string]: moment[] }|{ [range: string]: () => moment[] }
  renderExtraFooter : () => React.ReactNode
  separator : 	string | '~'
  showTime : object|boolean | 	TimePicker Options
  showTime : moment[] | [moment(), moment()]
  value : [moment, moment]
  onCalendarChange : function(dates: [moment, moment], dateStrings: [string, string])
  onChange : function(dates: [moment, moment], dateStrings: [string, string])
  onOk : function(dates: moment[])

TimePicker
  addon: function
  allowClear: boolean(true)
  autoFocus: boolean(false)
  className: string('')
  clearText: string('clear')
  defaultOpenValue:	moment
  defaultValue: moment(moment())
  disabled: boolean(false)
  disabledHours: function()
  disabledMinutes: function(selectedHour)
  disabledSeconds: function(selectedHour, selectedMinute)
  format: string("HH:mm:ss")
  getPopupContainer: function(trigger)
  hideDisabledOptions: boolean(false)
  hourStep: number(1)
  inputReadOnly: boolean(false)
  minuteStep: number(1)
  open: boolean(false)
  placeholder: string("Select a time")
  popupClassName: string('')
  popupStyle: object
  secondStep: number(1)
  suffixIcon: ReactNode
  clearIcon: ReactNode
  use12Hours: boolean(false)
  value: moment
  onChange: function(time: moment, timeString: string): void
  onOpenChange: (open: boolean): void
*/

/* 
-------Common----------
dateRender: function(currentDate: moment, today: moment)|ReactNode
disabledDate:	(currentDate: moment) | boolean
mode: time|date|month|year|decade | 'date'
placeholder: string|RangePicker[]
onOpenChange:	function(status)
onPanelChange: function(value, mode)
-------Date common----------
disabledTime : function(date)
onOk: function()
onPanelChange: function(value, mode)
-------Month common----------
monthCellContentRender : function(date, locale): ReactNode
-------Range common----------
disabledTime : function(dates: [moment, moment], partial: 'start'|'end')
ranges : { [range: string]: moment[] }|{ [range: string]: () => moment[] }
showTime : moment[] | [moment(), moment()]
onCalendarChange : function(dates: [moment, moment], dateStrings: [string, string])
onOk : function(dates: moment[])
-------Time common----------
addon: function
disabledHours: function()
disabledMinutes: function(selectedHour)
disabledSeconds: function(selectedHour, selectedMinute)
onOpenChange: (open: boolean): void
*/

const { RangePicker, MonthPicker, WeekPicker } = DatePicker;

const components = {
  date: DatePicker,
  week: WeekPicker,
  time: TimePicker,
  year: DatePicker,
  range: RangePicker,
  month: MonthPicker,
  datetime: DatePicker,
};
const dateFormat = {
  date: 'YYYY-MM-DD',
  year: 'YYYY',
  week: 'YYYY-wo',
  time: 'HH:mm:ss',
  month: 'YYYY-MM',
  range: 'YYYY-MM-DD HH:mm:ss',
  datetime: 'YYYY-MM-DD HH:mm:ss',
};

class BaseDate extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.lang !== prevState.lang || nextProps.submitted !== prevState.submitted) {
      const state = {
        ...prevState,
        lang: nextProps.lang,
        submitted: nextProps.submitted,
      };
      return state;
    }
    return null;
  }

  state = {
    lang: 'mn',
  };

  onChange = (val, valString) => {
    this.props.onChange(val ? moment(val).format() : val);
  };

  rangeOnChange = (dates, dateStrings) => {
    const value =
      dates && dates.length > 0 ? [moment(dates[0]).format(), moment(dates[1]).format()] : dates;
    this.props.onChange(value);
  };

  componentDidMount() {
    this.setLocale(this.state.lang);
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateLang(prevState);
  }

  updateLang = prevState => {
    if (this.state.lang !== prevState.lang) {
      this.setLocale(this.state.lang);
    }
  };
  setLocale = lang => this.setState({ lang });

  renderIcon(type) {
    if (type) {
      // return isString(type) ? <Icon type={type} /> : <Icon {...type} />;
    }
    return null;
  }

  getProps(config) {
    const {
      format,
      mode,
      showTime,
      extraFooter,
      initialValue,
      suffixIcon,
      clearIcon,
      specificType,
    } = config;
    const { submitted, lang } = this.state;
    if (mode) {
      formError('date', 0);
    }
    let hasTime = null,
      customFormat = dateFormat[specificType];
    if (showTime !== undefined) {
      hasTime = isBoolean(showTime) ? showTime : { ...showTime };
    }
    const locale = { mn: localeMn.default, en: localeEn.default };
    let props = {
      ...config,
      format: format || customFormat,
      onChange: this.onChange,
      suffixIcon: this.renderIcon(suffixIcon),
      locale: locale[lang],
      renderExtraFooter: mode => extraFooter,
    };
    if (initialValue) {
      const defaultValue =
        specificType === 'range'
          ? [moment(initialValue[0]), moment(initialValue[1])]
          : moment(initialValue);
      props = { ...props, defaultValue };
    }
    if (submitted && submitted !== undefined) {
      props = { ...props, value: null, defaultValue: null };
    }
    switch (specificType) {
      case 'datetime':
        props = { ...props, showTime: hasTime || true };
        break;
      case 'range':
        props = { ...props, onChange: this.rangeOnChange, showTime: hasTime || false };
        break;
      case 'year':
        props = { ...props, mode: 'year' };
        break;
      case 'month':
      case 'week':
        props = { ...props };
        break;
      case 'time':
        props = {
          ...props,
          clearIcon: this.renderIcon(clearIcon),
        };
        break;
      default:
        props = { ...props };
        break;
    }
    return props;
  }

  onOpenChange = status => {};
  onPanelChange = (value, mode) => {};
  dateRender = (currentDate, today) => {};
  disabledDate = currentDate => {};
  getCalendarContainer = trigger => {};

  renderElement() {
    const {
      config,
      config: { specificType },
    } = this.props;
    const types = Object.keys(components);
    if (!specificType) {
      formError('date', 1);
    }
    if (specificType && types.includes(specificType)) {
      const DateComponent = components[specificType],
        props = this.getProps(config);
      return <DateComponent {...props} />;
    } else {
      formError('date', 2, specificType, '{specificType}');
    }
  }
  render = () => this.renderElement();
}

const FormDate = (props, ref) => {
  const { form, lang, config, fieldOption, submitted } = props;
  const { name, label, extra, tooltip, rules } = config;

  const hasValue = fieldHasValue(form, name),
    error = fieldHasError(form, name),
    hasFeedback = fieldHasFeedback(error, hasValue, rules),
    validateStatus = fieldValidateStatus(error, hasValue, rules);

  let itemLabel = formLabel(label, tooltip, lang);

  return (
    <Form.Item
      ref={ref}
      key={name}
      extra={extra}
      label={itemLabel}
      hasFeedback={hasFeedback}
      validateStatus={validateStatus}
    >
      {form.getFieldDecorator(
        name,
        fieldOption,
      )(<BaseDate lang={lang} submitted={submitted} config={config} />)}
    </Form.Item>
  );
};

export default memo(forwardRef(FormDate));
