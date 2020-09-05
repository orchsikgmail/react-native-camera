import React, { Component } from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';

import styles from '../style';

class HTimer extends Component {
  state = {
    time: 0,
  };

  convertTimeString = (time) => {
    return moment().startOf('day').seconds(time).format('mm:ss');
  };

  resetTime = () => {
    this.setState({ time: 0 });
  };

  startTimer = () => {
    const { maxLength, stopRecord } = this.props;
    this.timer = setInterval(() => {
      const time = this.state.time + 1;
      this.setState({ time });
      if (maxLength > 0 && time >= maxLength) {
        stopRecord();
      }
    }, 1000);
  };

  stopTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
  };

  render() {
    const { isRecording } = this.props;
    const { time } = this.state;

    if (!isRecording) {
      return <View />;
    }
    return (
      <View>
        <Text style={this.props.durationTextStyle}>
          <Text style={styles.dotText}>●</Text> {this.convertTimeString(time)}
        </Text>
      </View>
    );
  }
}

export default HTimer;
