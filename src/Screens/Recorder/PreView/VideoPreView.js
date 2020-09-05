import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class VideoPreView extends Component {
  render() {
    const { onSave } = this.props;

    return (
      <View style={{ flex: 1, alignContent: 'space-between' }}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }} />

        <View style={{ flex: 0.4, flexDirection: 'column', justifyContent: 'flex-end' }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
            <View style={{ borderRadius: 40, padding: 2, backgroundColor: 'white' }} />

            <View>
              <TouchableOpacity onPress={onSave}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 20,
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    borderRadius: 25,
                    padding: 10,
                  }}
                >
                  <Text style={{ color: 'black' }}>저장</Text>
                  <Icon name="keyboard-arrow-right" size={22} color="black" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default VideoPreView;
