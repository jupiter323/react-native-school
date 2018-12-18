import React from 'react';
import { StyleSheet, TouchableOpacity, AsyncStorage, Button, TextInput, Alert } from 'react-native';
import Metrics from '../Themes/Metrics';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Facebook } from 'expo';
import Modal from "react-native-modal";
// import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { WebBrowser } from 'expo';
import GenerateForm from 'react-native-form-builder';
import { View, Text } from 'native-base';
import { globalStyles } from '../Themes/Styles';
import { Input } from "native-base";

const stripe_url = 'https://api.stripe.com/v1/'
// const secret_key = firebase.config().stripe.token;
//create token
const stripe = require('stripe-client')('pk_test_qkgEe4JVlRcszR12vsEMODWU');


// // These Fields will create a login form with three fields
// const fieldsLogin = [
//   {
//     type: 'text',
//     name: 'emailAddress',
//     required: true,
//     icon: 'ios-person',
//     label: 'Email Address',
//   },
//   {
//     type: 'password',
//     name: 'password',
//     icon: 'ios-lock',
//     required: true,
//     label: 'Password',
//   },
// ];

// These Fields will create a login form with three fields
const fieldsSignUp = [
  {
    type: 'text',
    name: 'firstName',
    required: true,
    icon: 'ios-person',
    label: 'First Name',
  },
  {
    type: 'text',
    name: 'lastName',
    icon: 'ios-lock',
    required: true,
    label: 'Last Name',
  },
  {
    type: 'text',
    name: 'skypeName',
    icon: 'ios-lock',
    required: false,
    label: 'Skype Username (if you have one)',
  },
  {
    type: 'text',
    name: 'emailAddress',
    required: true,
    icon: 'ios-person',
    label: 'Email Address',
  },
  {
    type: 'password',
    name: 'password',
    icon: 'ios-lock',
    required: true,
    label: 'Password',
  },
];

export default class Login extends React.Component {

  static navigationOptions = {
    title: 'Login',
  };

  constructor(props) {
    super(props);
    this.state = {
      isQuestionModalVisible: true,
      isTopicModalVisible: false,
      postQuestionTopic : 'Select a Question Topic',
      signUpName: '',
      signUpEmail: '',
      signUpPassword: '',
      loginEmail: '',
      loginPassword: '',
      errorMessageSignUp: null,
      errorMessageLogin: '',
      skypeNameValid: false,
      skypeName: '',
      skypeAlertClear: false,
    }
    //see what props App.js is constructed with:
    // console.log(JSON.stringify(props));
  }

  componentDidMount() {
    this.checkIfUserLoggedIn();
  }

  toggleLoginModal = () => {
    this.setState({ isQuestionModalVisible: !this.state.isQuestionModalVisible });
  }

  toggleSignUpModal = () => {
    this.setState({ isTopicModalVisible: !this.state.isTopicModalVisible });
  }

  checkSkype = async () => {
    await this.toggleSignUpModal();
    WebBrowser.openBrowserAsync('https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=13&ct=1533498381&rver=7.0.6730.0&wp=MBI_SSL&wreply=https%3A%2F%2Flw.skype.com%2Flogin%2Foauth%2Fproxy%3Fclient_id%3D360605%26redirect_uri%3Dhttps%253A%252F%252Fsecure.skype.com%252Fportal%252Flogin%253Freturn_url%253Dhttps%25253A%25252F%25252Fsecure.skype.com%25252Fportal%25252Foverview%26response_type%3Dpostgrant%26state%3DNECRz3UFw8Yx%26site_name%3Dlw.skype.com&lc=1033&id=293290&mkt=en-US&psi=skype&lw=1&cobrandid=2befc4b5-19e3-46e8-8347-77317a16a5a5&client_flight=hsu%2CReservedFlight33%2CReservedFlight67');
  }

  skypeAlert = async (formValues) => {
    if ((formValues.skypeName == "") || (this.state.skypeNameValid == false)) {
      await Alert.alert(
        'Skype',
        'You Will Need a Skype Username for Messaging',
        [
          { text: 'Make One Now', onPress: () => this.makeSkype() },
          { text: 'Check If I Have One', onPress: () => this.checkSkype() },
          { text: 'Make One Later', onPress: () => this.setState({ skypeAlertClear: true }, this.completeSignUp), style: 'cancel' },
        ],
        { cancelable: false }
      )
    }
  }

  makeSkype = async () => {
    await this.toggleSignUpModal();
    WebBrowser.openBrowserAsync('https://signup.live.com/signup?lcid=1033&wa=wsignin1.0&rpsnv=13&ct=1533497773&rver=7.0.6730.0&wp=MBI_SSL&wreply=https%3a%2f%2flw.skype.com%2flogin%2foauth%2fproxy%3fclient_id%3d578134%26redirect_uri%3dhttps%253A%252F%252Fweb.skype.com%26source%3dscomnav%26form%3dmicrosoft_registration%26site_name%3dlw.skype.com%26fl%3dphone2&lc=1033&id=293290&mkt=en-US&psi=skype&lw=1&cobrandid=2befc4b5-19e3-46e8-8347-77317a16a5a5&client_flight=hsu%2CReservedFlight33%2CReservedF&fl=phone2&uaid=b20753c004f74358a6b9f4925476f546&lic=1');
  }

  verifyEmail = () => {
    firebase.auth().currentUser.sendEmailVerification()
      .then(() => {
        // Verification email sent.
        console.log("email Verification sent");
        Alert.alert(
          'Email Verification',
          "We've sent a user verification email. Please click the link in your email inbox to be verified as a user",
          [
            { text: 'OK', onPress: () => this.setState({ skypeAlertClear: true }), style: 'cancel' },
          ],
          { cancelable: false }
        )
      })
      .catch(function (error) {
        // Error occurred. Inspect error.code.
      });
  }

  completeSignUp = async () => {
    const formValues = this.formGenerator.getValues();
    if (!this.state.skypeAlertClear) {
      this.skypeAlert(formValues);
      return
    }
    this.verifyEmail();
    var user = firebase.auth().currentUser;
    //   // console.log("email " + this.state.signUpEmail);
    //   // console.log("password " + this.state.signUpPassword);
    //   console.log("user " + user);
    //   // console.log("currentUser" + firebase.auth().currentUser);
    const portalType = await AsyncStorage.getItem('portal');
    firebase.database().ref('users').child(user.uid).child('firstName').set(formValues.firstName);
    firebase.database().ref('users').child(user.uid).child('lastName').set(formValues.lastName);
    firebase.database().ref('users').child(user.uid).child('portal').set(portalType);
    firebase.database().ref('users').child(user.uid).child('email').set(this.state.signUpEmail);
    firebase.database().ref('users').child(user.uid).child('skypeName').set(this.state.skypeName);
    await AsyncStorage.setItem("hasLoggedIn", "true");
    this.toggleSignUpModal();


    //create stripe account if he is a consultant
    const selectedPortal = await AsyncStorage.getItem('portal');
    if (selectedPortal === 'consultant') {
      var consultantDetails = {
        "type": 'custom',
        "email": formValues.emailAddress,
        "business_name": formValues.firstName + " " + formValues.lastName
      };

      var formBody = [];
      for (var property in consultantDetails) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(consultantDetails[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      var that = this;
      return fetch(stripe_url + 'accounts', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + 'sk_test_api6b2ZD9ce6IRqwOLqaFbZU',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody
      }).then((response) => {
        response.json().then(solved => {
          console.log("Account " + JSON.stringify(solved));
          Alert.alert("Your custom stripe account is registered to this platform correctly.");
          firebase.database().ref('stripe_customers').child(firebase.auth().currentUser.uid).child('account').set({
            id: solved.id,
            email: solved.email,
            type: solved.type,
            created: solved.created
          });
        });
      }).catch((error) => {
        console.error(error);
      });
    }
  }


  onPressSaveNewUser = async () => {
    // console.log("email pre creating user" + this.state.signUpEmail);
    // console.log("password " + this.state.signUpPassword);
    const formValues = this.formGenerator.getValues();
    console.log('FORM VALUES', formValues);
    // if ((formValues.emailAddress == "") || (formValues.password == "") || (formValues.firstName == "") || (formValues.lastName == "")) {
    //   alert("Please fill in all required categories");
    // }
    //check skype name
    //maybe having a skype dropdown, where we can 1)try out skype names for them 2)create a skype for them
    // await this.skypeAlert(formValues);
    // console.log("skype alert " + this.state.skypeAlertClear);
    // if(this.state.skypeAlertClear == true) {
    await this.setState({ signUpEmail: formValues.emailAddress, signUpPassword: formValues.password });
    console.log("email " + this.state.signUpEmail);
    console.log("password " + this.state.signUpPassword);
    await firebase.auth().createUserWithEmailAndPassword(this.state.signUpEmail, this.state.signUpPassword)
      .then(this.completeSignUp)
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else if (errorCode == 'auth/email-already-in-use') {
          alert('This email already has an account');
        } else if (errorCode == 'auth/invalid-email') {
          alert('Please enter a valid email');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  }

  onPressSaveLogin = async () => {
    await firebase.auth().signInWithEmailAndPassword(this.state.loginEmail, this.state.loginPassword)
      .catch(error => this.setState({ errorMessageLogin: error.message }));

    if (this.state.errorMessageLogin == "") {
      // var user = await firebase.auth().currentUser;
      console.log("email " + this.state.loginEmail);
      console.log("password " + this.state.loginPassword);
      // firebase.database().ref('users').child(user.uid).child('name');
      await AsyncStorage.setItem("hasLoggedIn", "true");
      this.toggleLoginModal();
    } else {
      alert(this.state.errorMessageLogin);
    }
  }

  onPressTopic = async () => {
    await this.setState({ isQuestionModalVisible: false });
    console.log("question modal " + this.state.isQuestionModalVisible);
    await this.setState({ isTopicModalVisible: true });
    console.log("topic modal " + this.state.isTopicModalVisible);
  }

  checkIfUserLoggedIn = async () => {
    var _this = this;
    var user = firebase.auth().currentUser;
    if (user) {
      // console.warn('user already logged in');
      await AsyncStorage.setItem("hasLoggedIn", "true");
    } else {
      // console.warn('Prompt log in');
      // _this.logInWithFacebook(); //Change this line to log in with email or use Facebook Login
    }
  }

  async logInWithFacebook() {
    //This line obtains a token. A good guide on how to set up Facebook login
    // could be found on Expo website https://docs.expo.io/versions/latest/sdk/facebook.html
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('344994569331151', { permissions: ['public_profile', 'email'], });
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
      const name = (await response.json()).name;
      //Signs up the user in Firebase authentication. Before being able to use
      //this make sure that you have Facebook enabled in the sign-in methods
      // in Firebase
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      var result = await firebase.auth().signInWithCredential(credential);

      //After signing in/up, we add some additional user info to the database
      //so that we can use it for other things, e.g. users needing to know
      //names of each other
      firebase.database().ref('users').child(result.uid).child('name').set(name);
      await AsyncStorage.setItem("hasLoggedIn", "true");
    } else {
      // this.logInWithFacebook();
    }
  }


  render() {
    const { navigate } = this.props.navigation;

    if (this.state.isTopicModalVisible === true) {
      return (
        <View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Modal
                isVisible={this.state.isTopicModalVisible}
                onBackdropPress={() => this.setState({ isTopicModalVisible: false })}
                backdropColor={'black'}>
                <View style={styles.modalViewTopic}>
                    <Text style={styles.modalText}>
                    Pick a Category!
                    </Text>
                    <Button
                        titleStyle={{color : 'white', fontWeight: '700', fontSize: 20}}
                        buttonStyle={{width : 200, borderRadius: 5, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#03A9F4'}}
                        title='College Life'
                        onPress={() => this.onPressCollegeLife()}/>
                    <Button
                        titleStyle={{color : 'white', fontWeight: '700', fontSize: 20}}
                        buttonStyle={{width : 200, borderRadius: 5, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#03A9F4'}}
                        title='College Applications'
                        onPress={() => this.onPressCollegeApplications()}/>
                    <Button
                        titleStyle={{color : 'white', fontWeight: '700', fontSize: 20}}
                        buttonStyle={{width : 200, borderRadius: 5, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#03A9F4'}}
                        title='Resources'
                        onPress={() => this.onPressResources()}/>
                    <Button
                        titleStyle={{color : 'white', fontWeight: '700', fontSize: 20}}
                        buttonStyle={{width : 200, borderRadius: 5, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#03A9F4'}}
                        title='All Topics'
                        onPress={() => this.onPressAllTopics()}/>
                </View>
            </Modal>
            </View>

        </View>
      );
    } else {

      return (
        <View style={styles.container}>
                <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Modal
                            isVisible={this.state.isQuestionModalVisible}
                            onBackdropPress={() => this.setState({ isQuestionModalVisible: false })}
                            backdropColor={'black'}>   
                            <View
                              style={styles.modalViewQuestion}
                            >    
                              <View style={{flexDirection : 'row', marginTop : 10}}>
                                <Ionicons style={{ marginLeft: 15, fontWeight : 'bold'}}
                                  name="ios-close-circle-outline"
                                  size={Metrics.icons.medium}
                                  color={'#c77ce8'}
                                  onPress={() => this.setState({ isQuestionModalVisible: false })}
                                />
                                <View style={{flex : 1, alignItems: 'center', width : '100%'}}>
                                  <Text style={styles.modalText}>
                                  Ask a Question!
                                  </Text>
                                </View>
                                <FontAwesome style={{ marginRight: 15, fontWeight : 'bold'}}
                                  name="send"
                                  size={Metrics.icons.medium}
                                  color={'#c77ce8'}
                                  onPress={() => this.onPressPostQuestion()}
                                />
                              </View>
                              <View 
                              // style={styles.modalViewQuestion}
                                style={{
                                  flex: 1,
                                  justifyContent: "flex-start",
                                  alignItems: "flex-start",
                                  width: "100%"
                                }}
                              >
                              <Input style={{
                                  flex: 1,
                                  width: "100%",
                                  fontSize: 20,
                                  alignContent: "flex-start",
                                  justifyContent: "flex-start",
                                  textAlignVertical: "top",
                                  margin: 12
                                  }}
                                placeholder="Ex: When are the common app essays released?"
                                underlineColorAndroid="transparent"
                                multiline={true}
                                selectTextOnFocus={true}
                                spellCheck={true}
                                onChangeText={(text) => this.setState({question: text})}
                                onSubmitEditing={(text) => this.setState({question: text})}
                                />
                            </View> 
                            <View style={{flexDirection: "row", margin : 10}}>
                              <Button
                                titleStyle={{color : 'white', fontWeight: '700', fontSize: 25}}
                                buttonStyle={{borderRadius: 20, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#c77ce8'}}
                                title={this.state.postQuestionTopic}
                                onPress={() => this.onPressTopic()}/>
                            </View>
                        </View>                         
                          
                    </Modal>
                    </View>
            </View>


      );
    }
  }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding : 20,
      backgroundColor : 'white'
      // alignItems: 'center',
    },

    textStyles: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 15,
    },
    buttonPressed: {
    color: '#999999'
    },
    buttonNotPressed: {
    color: '#c77ce8'
    },
    modalViewQuestion: {
        width: Metrics.screenWidth*0.9,
        height: Metrics.screenHeight * .6,
        borderStyle: 'solid',
        borderWidth: .5,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      },
      modalText: {
        fontSize: 25,
        fontWeight: 'bold',
      },
});