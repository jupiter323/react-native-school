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
  Alert,
} from 'react-native';
import Metrics from '../Themes/Metrics';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {ImagePicker, Permissions} from 'expo';
import * as _ from 'lodash';
import firebase from 'firebase';
import {CheckBox} from 'react-native-elements'
import Modal from 'react-native-modal';
import LoggedOut from '../components/loggedOutScreen';
import {WebBrowser} from 'expo';



/*
for scaling, can use sql, or use a backend developer (firebase)
*/


export default class UploadSale extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      image: '',
      schoolName: '',
      cityState: '',
      grade: '',
      isModalVisible: false,
      currentCategory: 'Click Here to Change Categories',
      imageUri: '',
      test: '',
      hasLoggedIn: false,
      skypeUsername: '',
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
    if ((this.state.schoolName !== '') && (this.state.cityState !== '') && (this.state.grade !== '')
      && (this.state.image !== '')) {
      await this.storeItem();
      console.log(this.props.navigation);
      this.props.navigation.navigate('Home');
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

  makeSkype =async() => {
  await this.toggleSignUpModal();
    WebBrowser.openBrowserAsync('https://signup.live.com/signup?lcid=1033&wa=wsignin1.0&rpsnv=13&ct=1533497773&rver=7.0.6730.0&wp=MBI_SSL&wreply=https%3a%2f%2flw.skype.com%2flogin%2foauth%2fproxy%3fclient_id%3d578134%26redirect_uri%3dhttps%253A%252F%252Fweb.skype.com%26source%3dscomnav%26form%3dmicrosoft_registration%26site_name%3dlw.skype.com%26fl%3dphone2&lc=1033&id=293290&mkt=en-US&psi=skype&lw=1&cobrandid=2befc4b5-19e3-46e8-8347-77317a16a5a5&client_flight=hsu%2CReservedFlight33%2CReservedF&fl=phone2&uaid=b20753c004f74358a6b9f4925476f546&lic=1');
  }

  checkSkype =async() => {
  await this.toggleSignUpModal();
    WebBrowser.openBrowserAsync('https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=13&ct=1533498381&rver=7.0.6730.0&wp=MBI_SSL&wreply=https%3A%2F%2Flw.skype.com%2Flogin%2Foauth%2Fproxy%3Fclient_id%3D360605%26redirect_uri%3Dhttps%253A%252F%252Fsecure.skype.com%252Fportal%252Flogin%253Freturn_url%253Dhttps%25253A%25252F%25252Fsecure.skype.com%25252Fportal%25252Foverview%26response_type%3Dpostgrant%26state%3DNECRz3UFw8Yx%26site_name%3Dlw.skype.com&lc=1033&id=293290&mkt=en-US&psi=skype&lw=1&cobrandid=2befc4b5-19e3-46e8-8347-77317a16a5a5&client_flight=hsu%2CReservedFlight33%2CReservedFlight67');
  }

  storeItem = async () => {
    const ref = firebase.storage().ref('users').child(firebase.auth().currentUser.uid).child("profilePicture");
    const response = await fetch(this.state.image);
    const blob = await response.blob();

    if (this.state.skypeUsername == "") {
      await Alert.alert(
     'Skype',
     'You Will Need a Skype Username for Messaging',
     [
       {text: 'Make One Now', onPress: () => this.makeSkype()},
       {text: 'Check If I Have One', onPress: () => this.checkSkype()},
       {text: 'Make One Later', onPress: () => this.setState({skypeAlertClear: true}), style: 'cancel'},
     ],
     { cancelable: false }
   )
    }

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
        grade: this.state.grade,
        cityState: this.state.cityState,
        profilePicture: this.state.image,
        isCounselor: false,
        skypeUsername: this.state.skypeUsername,
      });

   // await firebase.database().ref('student').child(firebase.auth().currentUser.uid).update({
   //
   // });

    console.log(JSON.stringify(this.state.image));
    console.log(JSON.stringify(this.state.test));

    // const pointsRef = firebase.database().ref('users').child(uid).child('points');
  };

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  onPressCategory() {
    this.toggleModal();
  }

  render() {

    let {image} = this.state;


    let contentView = null;
    if (this.state.image === '') {
      contentView =
        (<View>
          <Button
            onPress={() => this.onPressUploadPicture()}
            title="Upload Profile Pic"
            color="#e0a8f7"
          />
          <Button
            onPress={() => this.onPressTakePicture()}
            title="Take Profile Pic"
            color="#e0a8f7"/>
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

              <TextInput style={styles.inputText}
                         placeholder="School Name"
                         underlineColorAndroid="transparent"
                         onChangeText={(text) => this.setState({schoolName: text})}
                         onSubmitEditing={() => this.onSubmitEditingPrice(this.state.searchText)}
              />

              <TextInput style={styles.inputText}
                         placeholder="Grade/Year in School"
                         underlineColorAndroid="transparent"
                         onChangeText={(text) => this.setState({grade: text})}
                         onSubmitEditing={() => this.onSubmitEditingDescription(this.state.searchText)}
              />

              <TextInput style={styles.inputText}
                         placeholder="Skype Username"
                         underlineColorAndroid="transparent"
                         onChangeText={(text) => this.setState({skypeUsername: text})}
                         onSubmitEditing={() => this.onSubmitEditingDescription(this.state.searchText)}
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
    backgroundColor: '#e0a8f7',
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
