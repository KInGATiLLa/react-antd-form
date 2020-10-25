import React, { useState, useEffect, memo } from 'react';
import { Alert, Row, Col } from 'antd';
import { formError, getElementLayout, renderIcon } from '../../utils';
import { isString } from '../../../utils';
import { LAYOUT } from '../../constants';
/* 
Alert
  afterClose: () => void
  banner: boolean (false)
  closable: boolean
  closeText: string|ReactNode
  description: string|ReactNode
  icon:	ReactNode
  message: string|ReactNode
  showIcon: boolean (false, in banner mode default is true)
  type: string (info, in banner mode default is warning)
  onClose: (e: MouseEvent) => void
Alert.ErrorBoundary
  message: ReactNode ({{ error }})
  description: ReactNode ({{ error stack }})
  
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

export default FormAlert;
