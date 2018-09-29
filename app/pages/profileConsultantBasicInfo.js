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
import {CheckBox} from 'react-native-elements'
import Modal from 'react-native-modal';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import LoggedOut from '../components/loggedOutScreen';



/*
for scaling, can use sql, or use a backend developer (firebase)
*/


export default class ProfileConsultantBasicInfo extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: 'Basic Info',
    title: 'Basic Info',
    headerLeft: (
      <Feather style={styles.icon}
        name="menu"
        size={Metrics.icons.medium}
        color={'#9B59B6'}
        onPress={() => navigate('DrawerToggle')}
      />
      )
    }
};

  constructor(props) {
    super(props);

    this.state = {
      image: '',
      schoolName: '',
      cityState: '',
      typeConsultant: 'Select Type of Consultant',
      yearsConsultant: 'Select Years as Consultant',
      isTypeModalVisible: false,
      isYearsModalVisible: false,
      imageUri: '',
      test: '',
      hasLoggedIn: false,
    }
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

  onPressUploadPicture = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (!_.isEqual(status, 'granted')) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    console.log(result);

    if (!result.cancelled) {
      this.setState({image: result.uri});
    }
  };

  onPressTakePicture = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    if (!_.isEqual(status, 'granted')) return;
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({image: result.uri});
    }
  };


  onPressSaveObject = async () => {
    if ((this.state.schoolName !== '') && (this.state.cityState !== '') && (this.state.yearsConsultant !== 'Select Years as Consultant')
      && (this.state.image !== '') && (this.state.typeConsultant !== 'Select Type of Consultant')) {
      await this.storeItem();
      console.log(this.props.navigation);
      this.props.navigation.navigate("Home");
    } else {
      alert('Please Fill in All Categories');
    }
  };

  onSubmitEditingItem = () => {
    Keyboard.dismiss();
  };

  onSubmitEditingPrice = () => {
    Keyboard.dismiss();
  };

  onSubmitEditingDescription = () => {
    Keyboard.dismiss();
  };

  storeItem = async () => {
    const ref = firebase.storage().ref('users').child(firebase.auth().currentUser.uid).child("profilePicture");
    const response = await fetch(this.state.image);
    const blob = await response.blob();


    await ref.put(blob).then((snapshot) => {
      console.log('puts blob');

      console.log('Uploaded a data_url string!');
      const downloadURL = snapshot.downloadURL;
      console.log('downloadUrl: ' + downloadURL);
      {
        this.setState({image: downloadURL, test: 'testSuccessful'})
      }
    });

    await firebase.database().ref('users').child(firebase.auth().currentUser.uid).update({
        schoolName: this.state.schoolName,
        years: this.state.yearsConsultant,
        type: this.state.typeConsultant,
        cityState: this.state.cityState,
        profilePicture: this.state.image,
      });

    console.log(JSON.stringify(this.state.image));
    console.log(JSON.stringify(this.state.test));

    // const pointsRef = firebase.database().ref('users').child(uid).child('points');
  };

  toggleYearsModal = () => {
    this.setState({isYearsModalVisible: !this.state.isYearsModalVisible});
  };

  onPressYears() {
    this.toggleYearsModal();
  }

  toggleTypeModal = () => {
    this.setState({isTypeModalVisible: !this.state.isTypeModalVisible});
  };

  onPressType() {
    this.toggleTypeModal();
  }

  onPressIECA = async () => {
    await this.setState({isTypeModalVisible: false, typeConsultant: 'IECA'});
    console.log(this.state.typeConsultant);
  };

  onPressCurrentStudent = async () => {
    await this.setState({isTypeModalVisible: false, typeConsultant: 'College Student'});
    console.log(this.state.typeConsultant);
  };

  onPressZeroToOne = async () => {
    await this.setState({isYearsModalVisible: false, yearsConsultant: '0-1'});
    console.log(this.state.yearsConsultant);
  };

  onPressTwoToThree = async () => {
    await this.setState({isYearsModalVisible: false, yearsConsultant: '2-3'});
    console.log(this.state.yearsConsultant);
  };

  onPressFourToFive = async () => {
    await this.setState({isYearsModalVisible: false, yearsConsultant: '4-5'});
    console.log(this.state.yearsConsultant);
  };

  onPressGreaterThanFive = async () => {
    await this.setState({isYearsModalVisible: false, yearsConsultant: '< 5'});
    console.log(this.state.yearsConsultant);
  };

  render() {

    let {image} = this.state;


    let contentView = null;
    if (this.state.image === '') {
      contentView =
        (<View>
          <Button
            onPress={() => this.onPressUploadPicture()}
            title="Upload Profile Pic"
            color="#9B59B6"
          />
          <Button
            onPress={() => this.onPressTakePicture()}
            title="Take Profile Pic"
            color="#9B59B6"/>
        </View>)

    } else {
      contentView = (
        <Image source={{uri: image}} style={styles.picture}/>
      );
    }

    if (!this.state.hasLoggedIn) {
        return (<LoggedOut/>);
    } else {

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <KeyboardAwareScrollView>
          <SafeAreaView style={styles.container}>

            <View style={styles.pictureBox}>
              {contentView}
            </View>

            <View style={styles.itemInformation}>

              <TextInput style={styles.inputText}
                         placeholder="City, State (ex: Atlanta, GA)"
                         underlineColorAndroid="transparent"
                         onChangeText={(text) => this.setState({cityState: text})}
                         onSubmitEditing={() => this.onSubmitEditingItem(this.state.searchText)}
              />

              <CheckBox
              center
              title={this.state.typeConsultant}
              iconRight
              iconType='material'
              uncheckedIcon='add'
              textStyle={{fontWeight: 'normal', color: 'gray'}}
              containerStyle={{width: Metrics.screenWidth * .85}}
              onPress={() => this.onPressType()}
            />

            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Modal
                isVisible={this.state.isTypeModalVisible}
                onBackdropPress={() => this.setState({isTypeModalVisible: false})}
                backdropColor={'black'}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>
                    Pick a Category!
                  </Text>
                  <Button
                    backgroundColor='#03A9F4'
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                    title='IECA Consultant'
                    onPress={() => this.onPressIECA()}/>
                  <Button
                    backgroundColor='#03A9F4'
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                    title='Current College Student'
                    onPress={() => this.onPressCurrentStudent()}/>
                </View>
              </Modal>
            </View>

              <TextInput style={styles.inputText}
                         placeholder="School Name (if current student) or Company Name"
                         underlineColorAndroid="transparent"
                         onChangeText={(text) => this.setState({schoolName: text})}
                         onSubmitEditing={() => this.onSubmitEditingPrice(this.state.searchText)}
              />

              <CheckBox
                        center
                        title={this.state.yearsConsultant}
                        iconRight
                        iconType='material'
                        uncheckedIcon='add'
                        textStyle={{fontWeight: 'normal', color: 'gray'}}
                        containerStyle={{width: Metrics.screenWidth * .85}}
                        onPress={() => this.onPressYears()}
                      />

                      <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Modal
                          isVisible={this.state.isYearsModalVisible}
                          onBackdropPress={() => this.setState({isYearsModalVisible: false})}
                          backdropColor={'black'}>
                          <View style={styles.modalView}>
                            <Text style={styles.modalText}>
                              Years as Consultant!
                            </Text>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='0 - 1 Years'
                              onPress={() => this.onPressZeroToOne()}/>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='2 - 3 Years'
                              onPress={() => this.onPressTwoToThree()}/>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='4 - 5 Years'
                              onPress={() => this.onPressFourToFive()}/>
                            <Button
                              backgroundColor='#03A9F4'
                              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                              title='> 5 Years'
                              onPress={() => this.onPressGreaterThanFive()}/>
                          </View>
                        </Modal>
                      </View>

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
    justifyContent: 'center',
    padding: 20,
    marginTop: 5,
    // backgroundColor: 'white',
  },
  itemInformation: {
    flex: 1.5,
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
    flex: .7,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 55,
    backgroundColor: '#9B59B6',
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
