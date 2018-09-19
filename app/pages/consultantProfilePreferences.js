import React from 'react';
import {
  Button,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  AsyncStorage,
} from 'react-native';
import Metrics from '../Themes/Metrics';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {ImagePicker, Permissions} from 'expo';
import * as _ from 'lodash';
import firebase from 'firebase';
import {CheckBox, Slider} from 'react-native-elements';
import SelectMultiple from 'react-native-select-multiple';
import Modal from 'react-native-modal';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import LoggedOut from '../components/loggedOutScreen';



/*
for scaling, can use sql, or use a backend developer (firebase)
*/

const specialties = [
  { label: 'Extracurriculars in High School', value: 'Extracurriculars in High School' },
  { label: 'Grades in College', value: 'Grades in College' },
  { label: 'Fun in College', value: 'Fun in College' },
  { label: 'Internships', value: 'Internships' },
  { label: 'Transitioning to College', value: 'Transitioning to College' },
]

export default class ProfileConsultantPreferences extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: 'Preferences',
    title: 'Preferences',
    headerLeft: (
      <Feather style={styles.icon}
        name="menu"
        size={Metrics.icons.medium}
        color={'lightblue'}
        onPress={() => navigate('DrawerToggle')}
      />
      )
    }
};

  constructor(props) {
    super(props);

    this.state = {
      availabilityPreferences: 'Set Availability Preferences',
      timesAvailable: 'Select Years as Consultant',
      times: '',
      bio: '',
      isPreferencesModalVisible: false,
      isTimesModalVisible: false,
      isSpecialtyModalVisible: false,
      imageUri: '',
      test: '',
      hasLoggedIn: false,
      selectedSpecialties: [],
      price: 140,
    }
  }

  onSelectionsChange = (selectedSpecialties) => {
    // selectedSpecialties is array of { label, value }
    this.setState({ selectedSpecialties });
  }

  componentWillMount() {
    this.checkIfUserLoggedIn();
  }

  checkIfUserLoggedIn = async() => {
    const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
    if (loginCheck === "true") {
      await this.setState({hasLoggedIn: true});
      console.log("hasLoggedIn" + this.state.hasLoggedIn);
      console.log("metroooooooo");
    }
   }

  onPressSaveObject = async () => {
    if ((this.state.availabilityPreferences !== 'Set Availability Preferences') && (this.state.bio !== '')) {
      await this.storeItem();
      console.log("navigation " + JSON.stringify(this.props.navigation));
      this.props.navigation.navigate("Home");
    } else {
      alert('Please Fill in All Categories');
    }
  };

  onSubmitEditingBio = () => {
    Keyboard.dismiss();
  };

  onSubmitEditingPrice = () => {
    Keyboard.dismiss();
  };

  onSubmitEditingDescription = () => {
    Keyboard.dismiss();
  };

  storeItem = async () => {

    await firebase.database().ref('consultants').child(firebase.auth().currentUser.uid).update({
        specialties: this.state.selectedSpecialties,
        availabilityPreferences: this.state.availabilityPreferences,
        bio: this.state.bio,
        price: this.state.price,
      });

    // const pointsRef = firebase.database().ref('users').child(uid).child('points');
  };

  togglePreferencesModal = () => {
    this.setState({isPreferencesModalVisible: !this.state.isPreferencesModalVisible});
  };

  onPressPreferences() {
    this.togglePreferencesModal();
  }

  toggleTimeModal = () => {
    this.setState({isTimeModalVisible: !this.state.isTimeModalVisible});
  };

  onPressTime() {
    this.toggleTimeModal();
  }

  toggleSpecialtyModal = () => {
    this.setState({isSpecialtyModalVisible: !this.state.isSpecialtyModalVisible});
  };

  onPressSpecialty() {
    this.toggleSpecialtyModal();
  }

  onPressIECA = async () => {
    await this.setState({isTypeModalVisible: false, typeConsultant: 'IECA'});
    console.log(this.state.typeConsultant);
  };

  onPressCurrentStudent = async () => {
    await this.setState({isTypeModalVisible: false, typeConsultant: 'College Student'});
    console.log(this.state.typeConsultant);
  };

  onPressHourly = async () => {
    await this.setState({isPreferencesModalVisible: false, availabilityPreferences: 'Just Hourly'});
    console.log(this.state.availabilityPreferences);
  };

  onPressPackages = async () => {
    await this.setState({isPreferencesModalVisible: false, availabilityPreferences: 'Just Packages'});
    console.log(this.state.availabilityPreferences);
  };

  onPressBoth = async () => {
    await this.setState({isPreferencesModalVisible: false, availabilityPreferences: 'Both Hourly and Packages'});
    console.log(this.state.availabilityPreferences);
  };

  render() {

    let {image} = this.state;

    if (!this.state.hasLoggedIn) {
        return (<LoggedOut/>);
    } else {

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <KeyboardAwareScrollView>
          <SafeAreaView style={styles.container}>

            <View style={styles.itemInformation}>

            <CheckBox
                      center
                      title={'Set Consultant Specialties'}
                      iconRight
                      iconType='material'
                      uncheckedIcon='add'
                      textStyle={{fontWeight: 'normal', color: 'gray'}}
                      containerStyle={{width: Metrics.screenWidth * .85}}
                      onPress={() => this.onPressSpecialty()}
                    />

                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                      <Modal
                        isVisible={this.state.isSpecialtyModalVisible}
                        onBackdropPress={() => this.setState({isSpecialtyModalVisible: false})}
                        backdropColor={'black'}>
                        <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                          Set Specialties!
                        </Text>
                        <Text style={styles.modalText}>

                        </Text>
                          <SelectMultiple
                           items={specialties}
                           selectedItems={this.state.selectedSpecialties}
                           onSelectionsChange={this.onSelectionsChange} />
                        </View>
                      </Modal>
                    </View>

              <CheckBox
                        center
                        title={this.state.availabilityPreferences}
                        iconRight
                        iconType='material'
                        uncheckedIcon='add'
                        textStyle={{fontWeight: 'normal', color: 'gray'}}
                        containerStyle={{width: Metrics.screenWidth * .85}}
                        onPress={() => this.onPressPreferences()}
                      />

                      <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Modal
                          isVisible={this.state.isPreferencesModalVisible}
                          onBackdropPress={() => this.setState({isPreferencesModalVisible: false})}
                          backdropColor={'black'}>
                          <View style={styles.modalView}>
                            <Text style={styles.modalText}>
                              Availability Preferences!
                            </Text>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='Just Hourly or Less'
                              onPress={() => this.onPressHourly()}/>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='Just Packages (10+ hours)'
                              onPress={() => this.onPressPackages()}/>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='Both Hourly and Packages'
                              onPress={() => this.onPressBoth()}/>
                          </View>
                        </Modal>
                      </View>

                      <CheckBox
                                center
                                title={'Set Available Times'}
                                iconRight
                                iconType='material'
                                uncheckedIcon='add'
                                textStyle={{fontWeight: 'normal', color: 'gray'}}
                                containerStyle={{width: Metrics.screenWidth * .85}}
                                onPress={() => this.onPressTime()}
                              />

                              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <Modal
                                  isVisible={this.state.isTimeModalVisible}
                                  onBackdropPress={() => this.setState({isTimeModalVisible: false})}
                                  backdropColor={'black'}>
                                  <View style={styles.modalView}>
                                    <Text style={styles.modalText}>
                                      Set Available Times!
                                    </Text>
                                    <Button
                                      backgroundColor='#03A9F4'
                                      buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                                      title='Just Hourly or Less'
                                      onPress={() => this.onPressZeroToOne()}/>
                                    <Button
                                      backgroundColor='#03A9F4'
                                      buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                                      title='Just Packages (10+ hours)'
                                      onPress={() => this.onPressTwoToThree()}/>
                                    <Button
                                      backgroundColor='#03A9F4'
                                      buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                                      title='Both Hourly and Packages'
                                      onPress={() => this.onPressFourToFive()}/>
                                  </View>
                                </Modal>
                              </View>

                              <Slider
                                value={this.state.price}
                                thumbTintColor= 'lightblue'
                                minimumValue= {5}
                                maximumValue= {250}
                                value = {140}
                                step={1}
                                onValueChange={(price) => this.setState({price})}
                                onSlidingComplete={(price) => this.setState({price})}
                               />
                              <Text>Price Per Hour: ${this.state.price}</Text>

                      <TextInput style={styles.inputText}
                                 placeholder="Bio"
                                 underlineColorAndroid="transparent"
                                 onChangeText={(text) => this.setState({bio: text})}
                                 onSubmitEditing={() => this.onSubmitEditingBio(this.state.searchText)}
                      />



            </View>


            <TouchableOpacity style={styles.postButton}
                              onPress={() => this.onPressSaveObject()}>
              <View>
                <Text style={styles.postButtonText}>
                  Update Profile
                </Text>
              </View>
            </TouchableOpacity>

          </SafeAreaView>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>


    );
  }
}
}

const styles = StyleSheet.create({
  container: {
    height: Metrics.screenHeight,
    width: Metrics.screenWidth,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: 5,
    // backgroundColor: 'white',
  },
  itemInformation: {
    flex: 1,
    flexDirection: 'column',
    //  alignItems: 'center',
    //  justifyContent: 'space-around',
    margin: 20,
    backgroundColor: 'white',
    //  padding: 15,
  },
  pictureBox: {
    height: Metrics.screenHeight * .3,
    width: Metrics.screenWidth * .6,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 70,
    marginTop: 10,
    borderStyle: 'solid',
    borderWidth: .5,
    backgroundColor: 'white',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    //  padding: 10,
  },
  picture: {
    height: Metrics.screenHeight * .3,
    width: Metrics.screenWidth * .6,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    margin: 20,
    //  padding: 10,
  },
  inputText: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderStyle: 'solid',
    borderWidth: .5,
    margin: 7,
    width: Metrics.screenWidth * .85,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 20,
  },
  bigInputText: {
    flex: 2,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderStyle: 'solid',
    borderWidth: .5,
    margin: 7,
    width: Metrics.screenWidth * .85,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 20,
  },
  postButton: {
    flex: .2,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 55,
    backgroundColor: 'lightblue',
  },
  postButtonText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  keyboardAction: {
    flex: 1,
  },
  modalView: {
    // width: Metrics.screenWidth,
    height: Metrics.screenHeight * .6,
    borderStyle: 'solid',
    borderWidth: .5,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
