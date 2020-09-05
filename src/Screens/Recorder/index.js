import React, { Component, createRef } from 'react';
import { Modal, View, TouchableWithoutFeedback, TouchableOpacity, InteractionManager, ImageBackground, PermissionsAndroid, Platform } from 'react-native';
import { RNCamera } from 'react-native-camera';
import CameraRoll from '@react-native-community/cameraroll';
import Video from 'react-native-video';
import PropTypes from 'prop-types';

import CameraPresenter from './CameraPresenter';
import VideoPreView from './PreView/VideoPreView';
import PhotoPreView from './PreView/PhotoPreView';
import styles, { buttonClose, durationText, renderClose } from './style';

class RNrecorder extends Component {
  cameraContentsRef = createRef();
  playerRef = createRef();

  state = {
    isOpen: this.props.isOpen,
    loading: true,
    recorded: false,
    recordedData: null,
    cameraMode: false,
    saved: false,
  };

  requestExternalStoragePermission = async () => {
    try {
      const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
        title: '면접녹화시스템 저장공간 권한',
        message: '면접녹화파일의 저장을 위해 저장공간 권한이 필요합니다.',
        buttonPositive: '확인',
        buttonNegative: '취소',
      });
      return status === 'granted';
    } catch (err) {
      console.error('Failed to request permission ', err);
      return null;
    }
  };

  componentDidMount = async () => {
    // 카메라롤 저장 권한
    await this.requestExternalStoragePermission();
    // InteractionManager.runAfterInteractions :: 촬영후 할 작업 설정
    const doPostMount = () => this.setState({ loading: false });
    if (this.props.runAfterInteractions) {
      InteractionManager.runAfterInteractions(doPostMount);
    } else {
      doPostMount();
    }
  };

  open = (options, callback) => {
    this.callback = callback;
    this.setState(
      {
        maxLength: -1,
        ...options,
        isOpen: true,
        isRecording: false,
        recorded: false,
        recordedData: null,
        converting: false,
        saved: false,
      },
      () => {
        this.cameraContentsRef.current?.resetTime();
      },
    );
  };

  close = () => {
    if (this.state.recordedData && !this.state.saved) {
      this.setState({ recorded: false, recordedData: null });
    } else {
      this.setState({ isOpen: false });
    }
  };

  hasAndroidPermission = async () => {
    const WRITE_EXTERNAL_STORAGE = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(WRITE_EXTERNAL_STORAGE);
    return hasPermission;
  };

  onSave = async () => {
    const { recordedData } = this.state;
    const tag = recordedData.uri;
    try {
      const hasPermission = await this.hasAndroidPermission();
      if (Platform.OS === 'android' && !hasPermission) {
        await this.requestExternalStoragePermission();
        return;
      }
      await CameraRoll.save(tag);
    } catch (err) {
      console.warn(err);
    }
    if (this.callback) {
      this.callback(this.state.recordedData);
    }
    this.setState({ saved: true }, () => {
      this.close();
    });
  };

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.8, base64: true };
      const data = await this.camera.takePictureAsync(options);
      delete data.base64;
      this.setState({ recordedData: { type: 'photo', ...data } });
    }
  };

  startRecord = () => {
    const shouldStartRecord = () => {
      this.camera
        .recordAsync({
          ...this.state.recordOptions,
        })
        .then((data) => {
          this.setState({
            recorded: true,
            recordedData: { type: 'video', ...data },
          });
        })
        .catch((err) => console.error(err));

      setTimeout(() => {
        this.cameraContentsRef.current?.startTimer();
        this.setState(
          {
            isRecording: true,
            recorded: false,
            recordedData: null,
            videoMode: true,
          },
          () => {
            this.cameraContentsRef.current?.resetTime();
          },
        );
      }, 10);
    };

    if (this.state.maxLength > 0 || this.state.maxLength < 0) {
      if (this.props.runAfterInteractions) {
        InteractionManager.runAfterInteractions(shouldStartRecord);
      } else {
        shouldStartRecord();
      }
    }
  };

  // 비디오 촬영 끗
  stopRecord = () => {
    const shouldStopRecord = () => {
      this.cameraContentsRef.current?.stopTimer();
      this.camera.stopRecording();
      this.setState({ isRecording: false });
    };

    if (this.props.runAfterInteractions) {
      InteractionManager.runAfterInteractions(shouldStopRecord);
    } else {
      shouldStopRecord();
    }
  };

  switchCameraMode = () => {
    this.setState({ cameraMode: !this.state.cameraMode });
  };

  renderCamera() {
    const { recordedData, recorded, maxLength, isRecording } = this.state;

    if (recordedData?.type === 'photo') {
      return (
        <View style={styles.preview}>
          <ImageBackground style={{ width: '100%', height: '100%' }} source={{ uri: recordedData.uri }}>
            <PhotoPreView onSave={this.onSave} />
          </ImageBackground>
        </View>
      );
    } else if (recorded) {
      return (
        <View style={styles.preview}>
          <Video
            source={{ uri: recordedData.uri }} // Can be a URL or a local file.
            ref={this.playerRef}
            repeat={true}
            style={styles.backgroundVideo} // Callback when video cannot be loaded
          />
          <VideoPreView onSave={this.onSave} />
        </View>
      );
    }

    return (
      <RNCamera
        ref={(ref) => {
          this.camera = ref;
        }}
        type={this.state.cameraMode ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
        style={styles.preview}
        {...this.props.cameraOptions}
        captureAudio
      >
        <CameraPresenter
          ref={this.cameraContentsRef}
          maxLength={maxLength}
          isRecording={isRecording}
          takePicture={this.takePicture}
          startRecord={this.startRecord}
          stopRecord={this.stopRecord}
          switchCameraMode={this.switchCameraMode}
        />
      </RNCamera>
    );
  }

  render() {
    const { loading, isOpen } = this.state;
    if (loading) {
      return <View />;
    }
    return (
      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={this.close}>
        <View style={styles.modal}>
          <TouchableWithoutFeedback onPress={this.close}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          <View style={styles.container}>
            <View style={styles.content}>{this.renderCamera()}</View>

            <TouchableOpacity onPress={this.close} style={this.props.buttonCloseStyle}>
              {renderClose()}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

RNrecorder.propTypes = {
  isOpen: PropTypes.bool,
  runAfterInteractions: PropTypes.bool,
  cameraOptions: PropTypes.shape({}),
  recordOptions: PropTypes.shape({}),
  buttonCloseStyle: PropTypes.shape({}),
  durationTextStyle: PropTypes.shape({}),
  renderClose: PropTypes.func,
};

RNrecorder.defaultProps = {
  isOpen: false,
  runAfterInteractions: true,
  cameraOptions: {},
  recordOptions: {},
  buttonCloseStyle: buttonClose,
  durationTextStyle: durationText,
  renderClose,
};

export default RNrecorder;

/**
 * recordOptions
 */
// https://react-native-community.github.io/react-native-camera/docs/rncamera
// IOS 코덱설정 선행해야 videoBitrate 설정 가능.
// videoBitrate: 1            // 1분 2.4 MB // 자동으로 최저 세팅. // 최저 videoiBitrate = 50K(50 * 1000)bps
// quality: '480p',              // IOS: 640*480 pixel ,ANDROID: 720*480 pixel
// videoBitrate: 350 * 1000,     // 1분 4.5MB  // #5 면접상황의 움직임 정도는 얼굴 보임, 역동적으로 움직이면 안보임
// codec: "H264"                  // 안드로이드 기본코덱, 가장 보변적인 코덱 https://ko.wikipedia.org/wiki/H.264/MPEG-4_AVC

// TEST videoBitrate
// videoBitrate: 50 * 1000    // 1분 2.4MB  // #1 얼굴이 안보여...
// videoBitrate: 500 * 1000    // 1분 5.6MB  // #2 얼굴이 잘 보여... (유튜브 480P 최저 비트)
// videoBitrate: 250 * 1000    // 1분 3.8MB  // #3 조금만 움직여도 얼굴이 안보여, 가만있으면 보여
// videoBitrate: 350 * 1000    // 1분 4.6MB  // #5 면접상황의 움직임 정도는 얼굴 보임, 역동적으로 움직이면 안보임
// videoBitrate: 400  * 1000    // 1분 4.8MB  // #4 얼굴이 잘 보여...

// TEST quality
// quality: null    // 121MB (1920*1080) Default
// quality: '4:3',   // 27MB (720*480)
// quality: '480p'  // 27MB (720*480)  IOS: 480P 는 (640*480) 더 작을 것 같음.
// quality: '720p'  // 92MB (1280*720)
// quality: '1080p' // 132MB (1920*1080)
// quality: '2160p' // 132MB (1920*1080) 설정옵션 지원 못하면 Default

// orientation: 'landscapeLeft',        // 의미없음

// YOUTUBE STREAMING 기준
// https://support.google.com/youtube/answer/2853702?hl=en
// 최적 옵션
// https://filmora.wondershare.com/video-editing-tips/what-is-video-bitrate.html?gclid=Cj0KCQiAqNPyBRCjARIsAKA-WFzUZsKYboHSUMyzDu3cQtc3zgp9stBYIj01RNMEdBraaGVuHyXv3fYaAnRyEALw_wcB

// 후처리 라이브러리 압축 옵션 react-native-camera 라이브러리에서 이미 제공ㅡ 사용할 필요 X
// [react-native-video-processing]
//   compressVideo() {
//     const options = {
//         width: 720,
//         height: 1280,
//         bitrateMultiplier: 3,
//         saveToCameraRoll: true, // default is false, iOS only
//         saveWithCurrentDate: true, // default is false, iOS only
//         minimumBitrate: 300000,
//         removeAudio: true, // default is false
//     };
//     this.videoPlayerRef.compress(options)
//         .then((newSource) => console.log(newSource))
//         .catch(console.warn);
// }
