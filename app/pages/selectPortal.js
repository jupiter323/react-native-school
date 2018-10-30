import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button } from 'react-native';
import PropTypes from 'prop-types';
import Metrics from '../Themes/Metrics';
import Images from '../Themes/Images';
import Onboarding from 'react-native-onboarding-swiper';

export default class OnboardingScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
  };

  static propTypes = {
      selectPortalStudent: PropTypes.func.isRequired,
      selectPortalConsultant: PropTypes.func.isRequired,
      selectPortalSchool: PropTypes.func.isRequired,
      selectPortalParent: PropTypes.func.isRequired,
  };

  _selectPortalStudent = () => {
    if (this.props.selectPortalStudent) {
      console.log("props " + this.props);
      console.log("select portal working");
      this.props.selectPortalStudent();
      }
  }

  _selectPortalConsultant = () => {
    if (this.props.selectPortalConsultant) {
      console.log("props " + this.props);
      console.log("select portal working");
      this.props.selectPortalConsultant();
      }
  }

  _selectPortalSchool = () => {
    if (this.props.selectPortalSchool) {
      console.log("props " + this.props);
      console.log("select portal working");
      this.props.selectPortalSchool();
      }
  }

  _selectPortalParent = () => {
    if (this.props.selectPortalParent) {
      console.log("props " + this.props);
      console.log("select portal working");
      this.props.selectPortalParent();
      }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
      <View style={styles.feedbackBox}>
      <Text style={styles.textStyles}>Here at MoveItMoveIt, we love to improve. Your input can help us do that. :)</Text>
          <Button
          title="Students"
          onPress={this._selectPortalStudent}
          backgroundColor="#e0a8f7"/>

          <Button
          title="Consultants"
          onPress={this._selectPortalConsultant}
          backgroundColor="#e0a8f7"/>

          <Button
          title="Educators"
          onPress={this._selectPortalSchool}
          backgroundColor="#e0a8f7"/>

          <Button
          title="Parents"
          onPress={this._selectPortalParent}
          backgroundColor="#e0a8f7"/>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    // flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentImage: {
    height: Metrics.screenHeight*.35,
    width: Metrics.screenWidth*.5,
    borderRadius: 15
  },
});
