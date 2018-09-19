import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import Metrics from '../Themes/Metrics';
import Images from '../Themes/Images';
import Onboarding from 'react-native-onboarding-swiper';

export default class OnboardingScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
  };

  static propTypes = {
      onDone: PropTypes.func.isRequired
  };

  _onDone = () => {
    if (this.props.onDone) {
      this.props.onDone();
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Onboarding
          showSkip={false}
          onDone= {this._onDone}
          pages={[
            {
              backgroundColor: '#fff',
              image: <Image style={styles.contentImage} source={Images.movingCompanyImage} />,
              title: '  SchoolBudd',
              subtitle: 'Welcome to SchoolBudd, Your One Stop Shop College Readiness App!',
            },
            {
              backgroundColor: '#fff',
              image: <Image style={styles.contentImage} source={Images.storageUnitImage} />,
              title: 'Consultants',
              subtitle: 'Book Appointments with Top Rated IECA Consultants and Elite College Students!',
            },
            {
              backgroundColor: '#fff',
              image: <Image style={styles.contentImage} source={Images.vehicleImage} />,
              title: 'Admissions Officers',
              subtitle: 'Access Monthly Live Streams with Elite University Admissions Officers!',
            },
            {
              backgroundColor: '#fff',
              image: <Image style={styles.contentImage} source={Images.buyStuffImage} />,
              title: 'Resources',
              subtitle: 'Access Forums, Blogs, Educational Resources, etc!',
            },
            {
              backgroundColor: '#fff',
              image: <Image style={styles.contentImage} source={Images.freelancerImage} />,
              title: 'Sign Up',
              subtitle: 'If You are a Student, Consultant, Educator, or Parent SchoolBudd Has Something for You!',
            },
            {
              backgroundColor: '#fff',
              image: <Image style={styles.contentImage} source={Images.login} />,
              title: 'Login',
              subtitle: 'For full app functionality, it is best to login. However, you can still use the app without logging in and can login at any time.',
            },
          ]}
        />
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
