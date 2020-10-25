import React, { memo, forwardRef, useState, Fragment, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Form, Tag, Tooltip, Icon, Input } from 'antd';
import { formLabel, formError } from '../../utils';

/* 
Tag
  afterClose: () => void
  closable: boolean(false)
  color: string
  onClose: (e) => void
  visible: boolean(true)
CheckableTag
  checked: boolean(false)
  onChange: (checked) => void
*/

const { CheckableTag } = Tag;
const TagCheckable = forwardRef((props, ref) => {
  const { config, value, onChange } = props;
  const { options } = config;
  const [data, setData] = useState(value || []); // [{label: 'Label1', value: 1}]

  if (!options) {
    formError('tag', 1);
  }

  const checkableChange = (checked, option) => {
    let checkedData = data;
    if (checked) {
      checkedData = [...checkedData, option];
    } else {
      checkedData = checkedData.filter(data => data !== option);
    }
    setData(checkedData);
    onChange(checkedData);
  };

  const renderCheckableTags = () => {};

  return (
    <>
      {options.map((option, i) => {
        return (
          <CheckableTag
            key={i}
            checked={data.indexOf(option) > -1}
            onChange={e => checkableChange(e, option)}
          >
            {option}
          </CheckableTag>
        );
      })}
    </>
  );
});

const TagGroup = forwardRef((props, ref) => {
  const { config, value, onChange } = props;
  const [data, setData] = useState({
    tags: value || [],
    inputVisible: false,
    inputValue: '',
  });

  const handleClose = removedTag => {
    const tags = data.tags.filter(tag => tag !== removedTag);
    setData({ ...data, tags });
  };

  const showInput = () => {
    setData({ ...data, inputVisible: true });
  };

  const inputChange = e => {
    setData({ ...data, inputValue: e.target.value });
  };

  const inputConfirm = () => {
    const { inputValue } = data;
    let { tags } = data;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    setData({
      tags,
      inputVisible: false,
      inputValue: '',
    });
    onChange(data.tags);
  };

  const { tags, inputVisible, inputValue } = data;
  return (
    <div>
      {tags.map((tag, index) => {
        const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag key={tag} closable={index !== 0} onClose={() => handleClose(tag)}>
            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible && (
        <Input
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={inputChange}
          onBlur={inputConfirm}
          onPressEnter={inputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag onClick={showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
          <Icon type="plus" /> New Tag
        </Tag>
      )}
    </div>
  );
});
const type = {
  checkable: TagCheckable,
  group: TagGroup,
};

const FormTag = (props, ref) => {
  const { form, lang, config, fieldOption } = props;
  const { name, label, extra, tooltip, specificType } = config;
  const itemLabel = formLabel(label, tooltip, lang);
  let element;
  if (specificType) {
    let Component = type[specificType];
    element = <Component config={config} />;
  } else {
    formError('tag', 0);
  }
  return (
    <Form.Item ref={ref} key={name} extra={extra} label={itemLabel}>
      {form.getFieldDecorator(name, fieldOption)(element)}
    </Form.Item>
  );
};

export default memo(forwardRef(FormTag));
