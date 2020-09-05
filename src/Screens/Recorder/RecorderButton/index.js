import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';

class RecorderButton extends Component {
  render() {
    const { style, isRecording, takePicture, startRecord, stopRecord } = this.props;
    return (
      <TouchableOpacity
        style={[styles.buttonContainer, style]}
        onPress={isRecording ? stopRecord : takePicture}
        onLongPress={startRecord}

        // onPressOut={onStopPress}
      >
        <View style={styles.circleInside} />
      </TouchableOpacity>
    );
  }
}

RecorderButton.propTypes = {
  isRecording: PropTypes.bool,
  onStartPress: PropTypes.func,
  onStopPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
};

export default RecorderButton;
