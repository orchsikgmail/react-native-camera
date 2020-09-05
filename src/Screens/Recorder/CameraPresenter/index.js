import React, { Component, createRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import RecorderButton from '../RecorderButton';
import HTimer from '../HTimer';
import styles from '../style';

class CameraPresenter extends Component {
  timerRef = createRef();

  resetTime = () => {
    this.timerRef.current?.resetTime();
  };

  startTimer = () => {
    this.timerRef.current?.startTimer();
  };

  stopTimer = () => {
    this.timerRef.current?.stopTimer();
  };

  render() {
    const { maxLength, isRecording, takePicture, startRecord, stopRecord, switchCameraMode } = this.props;
    return (
      <View style={{ flex: 1, alignContent: 'space-between' }}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
          <HTimer ref={this.timerRef} maxLength={maxLength} isRecording={isRecording} stopRecord={stopRecord} />
        </View>

        <View style={{ flex: 0.4, flexDirection: 'column', justifyContent: 'flex-end' }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 0.3, height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }} />

            <RecorderButton
              style={[styles.recodingButton]}
              isRecording={isRecording}
              takePicture={takePicture}
              startRecord={startRecord}
              stopRecord={stopRecord}
            />

            <View style={{ flex: 0.3, height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={switchCameraMode}>
                <Icon style={{ backgroundColor: 'transparent' }} name="switch-camera" size={42} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default CameraPresenter;
