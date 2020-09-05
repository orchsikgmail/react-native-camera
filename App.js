import React, { createRef, Component } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, TouchableOpacity } from 'react-native';

import RNrecorder from './src/Screens/Recorder';

class App extends Component {
  recorderRef = createRef();

  startRecorder = () => {
    this.recorderRef.current?.open(
      {
        maxLength: 3 + 2,
        recordOptions: {
          quality: '480p',
          videoBitrate: 400 * 1000, // YOUTUBE: Video Bitrate Range: 500-2,000 Kbps
          codec: 'H264',
        },
      },
      (data) => console.log('recordedData:', data),
    );
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />

        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}
            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <TouchableOpacity onPress={this.startRecorder} style={{ marginBottom: 30 }}>
                  <Text style={{ ...styles.sectionTitle, textAlign: 'center' }}>START RECODE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>

        <RNrecorder ref={this.recorderRef} compressQuality={'medium'} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: 'black',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
