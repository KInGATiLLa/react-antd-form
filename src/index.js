import React from 'react';
import ReactDOM from 'react-dom';
import DynamicFormApp from './form-v1';
import * as serviceWorker from './serviceWorker';
import {
  DatePicker,
  TimePicker,
  ConfigProvider,
  Button,
  Icon,
  Slider,
  Col,
  Row,
  Input,
} from 'antd';

import moment from 'moment';
// import locale from 'antd/es/date-picker/locale/mn_MN';
import * as localeEn from 'antd/es/date-picker/locale/en_US';
import enUS from 'antd/es/locale/en_US';
import mnMN from 'antd/es/locale/mn_MN';
import { IntlMN } from './locale/mn';

import './form-v1/utils/translation';
import { useTranslation } from 'react-i18next';

/* function MyComponent() {
  const { t, i18n } = useTranslation();
  return <h1>{t('Welcome to React')}</h1>;
} */

const formConfig = {
  API_URL: 'http://localhost:8085/livestock-admin/',
  CDN_URL: 'http://localhost:8086/livestock-cdn/file/',
  // API_TOKEN: '',
  CDN_TOKEN:
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNTc0MDk4MzYxLCJpYXQiOjE1NzQwNjk1NjEsImF1dGhvcml0aWVzIjpbIlJPTEVfQkFDS09GRklDRSJdfQ.JsZGPRSkWDXU0v4x6ahmyxKu7US7Q9j2S35uhvi1USygpkPAl5aiAUecCpzLFLKqfmd6EwLstyw30lV8nVug4A',
  HEADER_PREFIX: 'Bearer ',
};
export const FormContext = React.createContext({});

const Hello = ({ name }) => (
  <div>
    <h1>Hello {name}</h1>
  </div>
);

ReactDOM.render(<Button type="primary">Button</Button>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
