import React, { memo, forwardRef, useState, Component, PureComponent, useContext } from 'react';
import { Form, Upload, Button, message, Modal } from 'antd';
import { isBoolean } from '../../../utils';
import FormService from '../../service';
import { VALIDATE, VALIDATION_MSG } from '../../constants';
import {
  withLang,
  getServePath,
  generateId,
  getFileName,
  formLabel,
  formError,
  fieldHasValue,
  fieldHasError,
  fieldHasFeedback,
} from '../../utils';
import { ConfigProvider } from 'antd';
import { FormContext } from '../../..';
/* 
Upload
  accept: string
  action: string|(file) => Promise
  directory: boolean(false)
  beforeUpload: (file, fileList) => boolean | Promise
  customRequest: Function
  data: object|function(file)
  defaultFileList: object[]
  disabled: boolean(false)
  fileList: object[]
  headers: 	object
  listType: string{text, picture or picture-card}('text')
  multiple: boolean(false)
  name: string('file')
  previewFile: (file: File | Blob) => Promise<dataURL: string>
  showUploadList: Boolean or { showPreviewIcon?: boolean, showDownloadIcon?: boolean, showRemoveIcon?: boolean}(true)
  supportServerRender: boolean(false)
  withCredentials: boolean(false)
  openFileDialogOnClick: boolean(true)
  onChange: Function
    {
      file: {
        uid: 'uid',      // unique identifier, negative is recommend, to prevent interference with internal generated id
        name: 'xx.png'   // file name
        status: 'done', // options：uploading, done, error, removed
        response: '{"status": "success"}', // response from server
        linkProps: '{"download": "image"}', // additional html props of file link
      }
      fileList: // current list of files
      event: // response from server, including uploading progress, supported by advanced browsers.
    }
  onPreview: Function(file)
  onRemove: Function(file): boolean | Promise
  onDownload: Function(file): void(Jump to new TAB)
  transformFile: Function(file): string | Blob | File | Promise<string | Blob | File>
*/

/*

public createFormData() {
  const data = new FormData();
  data.append('uploadType', this.config.fileOptions.uploadType || 'LIBRARY');
  data.append('file', this.config.fileOptions.file);
  this.config.fileOptions['data'] = data;
}

public ngOnInit() {
  this.subscription = this.group.get(this.config.name).valueChanges.pipe(
    debounceTime(200),
    distinctUntilChanged()
  ).subscribe(
    (change) => {
      this.config.value = change;
      this.initFiles();
    }
  );
  if (this.config.fileOptions && this.config.specificType) {
    this.config.fileOptions['data'] = null;
    if (this.config.maxSize) {
      this.MAX_FILE_SIZE = this.config.maxSize;
    }
    this.LIST_TYPE = this.config.specificType || 'text';
    if (this.config.specificType === 'picture') {
      this.EXTS = ['jpeg', 'jpg', 'png'];
    } else if (this.config.specificType === 'text') {
      this.EXTS = ['pdf'];
      // , 'doc', 'docx'
    }
    this.initFiles();
  } else {
    this.toastMessage.error('Файлын тодорхой төрөл сонгоно уу!');
  }
} */

const { Dragger } = Upload;

const EXTS = {
    image: ['image/jpeg', 'image/jpg', 'image/png'],
    file: ['application/pdf'],
  },
  LIST_TYPE = {
    image: 'picture',
    file: 'text',
  },
  HEADERS = {
    A: 'Authorization',
    X: 'X-Auth-Token',
  },
  DRAGGER = {
    title: 'Оруулах файлаа энд зөөж тавина уу!',
    hint: 'Оруулах файлынхаа хэмжээ болон өргөтгөлийг шалгаж үнэн зөв файлаа сонгож оруулаарай',
  };

const MAX_FILE_SIZE = 10,
  MAX_FILE_NAME = 20;

const styles = {
  modal: { top: '2%', height: '90%', textAlign: 'center' },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    height: '80vh',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
  },
};

class FileUpload extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
    };
    this.onChange = this.onChange.bind(this);
    this.service = props.service;
  }

  onChange = ({ file, fileList, event }) => {
    console.log(file);
    console.log(fileList);
    console.log(event);
    if (file && file.response) {
      const { url } = file.response;
      const res = url ? url : file.response;
      this.props.onChange(res);
    }
  };

  setFileObject(path) {
    const filePath = getServePath(path, this.service.config.CDN_TOKEN);
    return {
      uid: generateId(5),
      name: getFileName(path),
      status: 'done',
      url: filePath,
      thumbUrl: filePath,
    };
  }

  componentDidMount() {
    this.initFiles();
  }

  initFiles() {
    const { value } = this.props;
    if (!this.service && !this.service.getToken('cdn')) {
      formError('file', 0);
    }
    if (value) {
      if (Array.isArray(value) && value.length !== 0) {
        const list = [];
        value.forEach(filePath => {
          list.push(this.setFileObject(filePath));
        });
        this.setState({ fileList: list });
      } else {
        this.setState({ fileList: [this.setFileObject(value)] });
      }
    } else {
      this.setState({ fileList: [] });
    }
  }

  render() {
    const { fileList } = this.state;
    const { data } = this.props;
    if (fileList.length > 0) {
      return (
        <Upload
          data={data || { uploadType: 'SERVICE' }}
          fileList={fileList || []}
          defaultFileList={fileList}
          onChange={this.onChange}
          {...this.props}
        >
          {this.props.children}
        </Upload>
      );
    }
    return null;
  }
}

const FormFile = (props, ref) => {
  const { form, config, lang, fieldOption, rules } = props;
  const {
    // custom
    name,
    icon,
    label,
    extra,
    button,
    tooltip,
    fileName,
    apiOptions,
    specificType, // draggerIcon, // draggerTitle, // draggerHint,
    // common
    action,
    listType,
    showUploadList,
  } = config;
  const formConfig = useContext(FormContext);
  let formService = new FormService(formConfig);
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: null,
    url: null,
  });
  const [uploading, setUploading] = useState(false);

  const onChange = value => {
    console.log(value);
  };

  const beforeUpload = file => {
    console.log(file);
    if (file && file.name && (!file.status || file.status !== 'done')) {
      const invalidExtention = isValidExtension(file.type);
      const sizeExceeded = file.size > MAX_FILE_SIZE * 1024 * 1024;
      const errType = invalidExtention ? 'invalidExtention' : sizeExceeded ? 'sizeExceeded' : null;
      if (errType) {
        file.status = 'error';
        form.setFields({
          [config.name]: { value: null, errors: [new Error(VALIDATION_MSG[errType][lang])] },
        });
        return false;
      } else {
        // file.name =
        //   file.name.length > MAX_FILE_NAME
        //     ? file.name.substring(0, MAX_FILE_NAME) + '...'
        //     : file.name;
        return true;
      }
    }
    return false;
  };

  const isValidExtension = type => EXTS[specificType].indexOf(type.toLowerCase()) === -1;

  const onPreview = file => {
    console.log(file);
    if (file && file.status && file.status === 'done') {
      setModalConfig({
        visible: true,
        title: file.name,
        url: file.thumbUrl,
        thumbUrl: file.thumbUrl,
      });
    }
  };

  const onRemove = file => {
    console.log(file);
    if (!config.disabled) {
      form.setFieldsValue({ [config.name]: null });
      return true;
    } else {
      return false;
    }
  };

  const customRequest = () => {};

  const previewFile = file => {
    console.log(file);
  };

  const onDownload = file => {
    console.log(file);
  };

  const transformFile = file => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const canvas = document.createElement('canvas');
        const img = document.createElement('img');
        img.src = reader.result;
        img.onload = () => {
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          ctx.fillStyle = 'red';
          ctx.textBaseline = 'middle';
          ctx.fillText('Zurag', 20, 20);
          canvas.toBlob(resolve);
        };
      };
    });
  };

  const uploadList = () => {
    if (
      Array.isArray(showUploadList) &&
      showUploadList.length === 3 &&
      showUploadList !== undefined
    ) {
      return {
        showPreviewIcon: showUploadList[0],
        showDownloadIcon: showUploadList[1],
        showRemoveIcon: showUploadList[2],
      };
    }
    return showUploadList !== undefined ? showUploadList : true;
  };

  const renderUpload = () => {
    if (!apiOptions.context && !action) {
      formError('file', 1);
    }
    if (!formService && !formService.getToken('cdn')) {
      formError('file', 2);
    }
    const listtype = LIST_TYPE[specificType];
    const head = apiOptions.bearer ? HEADERS.A : HEADERS.X;
    const extra = apiOptions.bearer ? formService.getHeaderPrefix() : null;
    // const token = formService.getToken('cdn');
    const token = formService.config.CDN_TOKEN || apiOptions.token;
    // const headers = { [head]: extra ? extra + token : token };
    const headers = { [head]: token };
    const cdnUrl = formService.getRequestUrl('cdn');
    const context = cdnUrl + apiOptions.context;
    return (
      <FileUpload
        ref={ref}
        name={fileName || 'file'}
        action={context || action}
        listType={listType || listtype}
        headers={headers}
        onChange={onChange}
        onRemove={onRemove}
        service={formService}
        onPreview={onPreview}
        // onDownload={onDownload}
        // previewFile={previewFile}
        beforeUpload={beforeUpload}
        // customRequest={customRequest}
        showUploadList={uploadList()}
        // transformFile={transformFile}
        {...config}
      >
        <Button {...button}>
          {/* <Icon type={icon || 'upload'} /> {withLang(label, lang)} */}
        </Button>
      </FileUpload>
    );
  };

  /*  const renderDragger = () => {
    return (
      <Dragger>
        <p className="ant-upload-drag-icon">
          <Icon type={draggerIcon || 'inbox'} />
        </p>
        <p className="ant-upload-text">{draggerTitle || DRAGGER.title}</p>
        <p className="ant-upload-hint">{draggerHint || DRAGGER.hint}</p>
      </Dragger>
    );
  }; */

  const modalClose = e => {
    setModalConfig({
      visible: false,
      thumbUrl: null,
      title: null,
      url: null,
    });
  };
  const hasValue = fieldHasValue(form, name),
    error = fieldHasError(form, name),
    hasFeedback = fieldHasFeedback(error, hasValue, rules),
    validateStatus = fieldHasFeedback(error, hasValue, rules);

  const itemLabel = formLabel(label, tooltip, lang);

  const modal = (
    <Modal
      width="90%"
      footer={null}
      style={styles.modal}
      destroyOnClose={true}
      onCancel={modalClose}
      title={modalConfig.title}
      visible={modalConfig.visible}
    >
      {specificType === 'file' && (
        <embed src={modalConfig.url} width="100%" height="100%" type="application/pdf" />
      )}
      {specificType === 'image' && (
        <div style={styles.container}>
          <div style={{ ...styles.content, backgroundImage: `url(${modalConfig.url})` }}></div>
        </div>
      )}
    </Modal>
  );

  return (
    <Form.Item key={name} ref={ref} extra={extra} label={itemLabel}>
      {form.getFieldDecorator(name, fieldOption)(renderUpload())}
      {modal}
    </Form.Item>
  );
};

export default memo(forwardRef(FormFile));
