import React, { useState, useEffect, memo } from 'react';
import { Alert, Row, Col } from 'antd';
import { formError, getElementLayout } from '../../utils';
import { isString } from '../../../utils';
import { LAYOUT } from '../../constants';
/* 
Alert
  ------Common----
  afterClose: () => void
  banner: boolean
  closable: boolean
  closeText: string|ReactNode
  description: string|ReactNode
  icon:	ReactNode
  message: string|ReactNode
  showIcon: boolean
  type: string
  onClose: (e: MouseEvent) => void
  ------Custom-----
  visible
  duration
*/

const FormAlert = ({ config, layout }) => {
  const [alertVisible, setAlertVisible] = useState(true);
  const { visible, icon, style } = config;
  const afterClose = () => {
    if (visible !== undefined && !visible) {
      setAlertVisible(false);
    }
  };
  const renderIcon = type => {
    // if (type) {
    //   return isString(type) ? <Icon type={type} /> : <Icon {...type} />;
    // }
    return null;
  };

  useEffect(() => {
    let autoDiscard;
    const { visible, closable, duration } = config;
    if (closable && visible) {
      if (duration) {
        autoDiscard = setInterval(() => {
          setAlertVisible(false);
        }, duration);
      } else {
        formError('alert', 0);
      }
    }
    return () => clearInterval(autoDiscard);
  }, [config]);

  let col = getElementLayout(layout);

  return (
    <>
      {alertVisible && visible ? (
        <Row type="flex">
          <Col {...col}>
            <Alert
              {...config}
              style={{ margin: '10px 0', ...style }}
              icon={renderIcon(icon)}
              afterClose={afterClose}
            />
          </Col>
        </Row>
      ) : null}
    </>
  );
};

export default memo(FormAlert);
