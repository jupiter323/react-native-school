import React from 'react';
import { StyleSheet, View, Text, Button, TouchableHighlight, AsyncStorage, TextInput, TouchableOpacity,Alert, ScrollView } from 'react-native';
import Metrics from '../Themes/Metrics';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase';
import {Facebook} from 'expo';
import Modal from "react-native-modal";
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { CreditCardInput } from "react-native-credit-card-input";
import axios from 'axios';
import { globalStyles } from '../Themes/Styles';

// const stripe = Stripe('pk_test_qkgEe4JVlRcszR12vsEMODWU');
// Stripe.setPublishableKey('pk_test_qkgEe4JVlRcszR12vsEMODWU');
// const stripeClient = require('stripe-client')('pk_test_qkgEe4JVlRcszR12vsEMODWU');
// const stripe = require('stripe')('firebase.config().stripe.token');
const stripe_url = 'https://api.stripe.com/v1/'
// const secret_key = firebase.config().stripe.token;
//create token
const stripe = require('stripe-client')('pk_test_qkgEe4JVlRcszR12vsEMODWU');

//push to firebase backend
//payments UI



export default class Blank2 extends React.Component {

constructor(props) {
  super(props);
  this.state = {
    token : 'tok_visa',
    cardNum : '',
    expYear : '',
    expMonth : '',
    name : '',
    postalCode : '',
    cvc : '',
    uid : firebase.auth().currentUser.uid,
    valid : false,
    amount : 0,
    totalPrice : 0,
    destination : '',
    bookingStatus : false,
    consultant_id : 'qzJ7q3nwLsbZ2L9fLHETlXThlGL2',
    chargeId : ''
  };
}


componentWillMount() {
  axios.post('https://us-central1-schoolbudd-ac7fc.cloudfunctions.net/helloWorld').then((response) => {

    console.log("axios");

    //this.getAllHistory();
    //this.getPlatformBalance();

  });
  this.getAllHistory();
  this.getPlatformBalance(); 
  if(this.props.navigation.state.params.totalPrice != undefined){
    this.setState({totalPrice : this.props.navigation.state.params.totalPrice});
    console.log("TotalPrice : " + this.props.navigation.state.params.totalPrice);
  }
    
}

// register new credit card and get token
createToken = async() => {
  if(!this.state.valid){
    Alert.alert('',
    'please insert valid info.',
    [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ],
    { cancelable: false }
    );
    return;
   }
  var cardToken;
  var cardDetails = {
      "card[number]": this.state.cardNum,
      "card[exp_month]": this.state.expMonth,
      "card[exp_year]": this.state.expYear,
      "card[cvc]": this.state.cvc
  };

  var formBody = [];
  for (var property in cardDetails) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(cardDetails[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  var that = this;
  fetch(stripe_url + 'tokens', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Authorization': 'Bearer ' + 'pk_test_qkgEe4JVlRcszR12vsEMODWU',
         'Content-Type': 'application/x-www-form-urlencoded',
       },
       body: formBody
     }).then((response) => {
       response.json().then(solved => {
        cardToken = solved.id;
        this.setState({token: cardToken});
        console.log("card token in fetch " + cardToken);

        
        this.createCharge(Math.ceil(this.state.totalPrice*1.12), solved.id);  
       }); 

     }).catch((error) => {
        console.error(error);
     });
 }

 // create new transfer from platform account to consultant account
 // parameers : transfer amount, firebase id of consultant
 createTransfer =async(amount, consultant_id) => {

  firebase.database().ref('stripe_customers').child(consultant_id).child('account').once('value')
  .then(value=>{
    this.setState({destination : value.val()['id']});
    console.log(this.state.destination);
    var chargeDetails = {
      "amount" : amount,
      "currency" : 'usd',
      "source_transaction" : this.state.chargeId,
      "destination" : value.val()['id']
        };

    var formBody = [];
    for (var property in chargeDetails) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(chargeDetails[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return fetch(stripe_url + 'transfers', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Authorization': 'Bearer ' + 'sk_test_api6b2ZD9ce6IRqwOLqaFbZU',
         'Content-Type': 'application/x-www-form-urlencoded',
       },
       body: formBody
     }).then((response) => {
       response.json().then(solved => {
        console.log("Transfer " + JSON.stringify(solved));
        this.getAllHistory();
        this.getPlatformBalance();
        this.getConsultantBalance(consultant_id);
       });
     }).catch((error) => {
        console.error(error);
      });
  });
 }


 // create new charge from credit card to platform account
 // parameters :  charge amount, source or token
createCharge =async(amount,token) => {

    var chargeDetails = {
      "amount": amount,
      "description" : "Example Charge",
      "currency": 'usd',
      "source" : token,
      "statement_descriptor": 'custom descriptor'
    };

    var formBody = [];
    for (var property in chargeDetails) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(chargeDetails[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return fetch(stripe_url + 'charges', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Authorization': 'Bearer ' + 'sk_test_api6b2ZD9ce6IRqwOLqaFbZU',
         'Content-Type': 'application/x-www-form-urlencoded',
       },
       body: formBody
     }).then((response) => {
       response.json().then(solved => {
        this.setState({chargeId : solved.id});
        console.log("charge " + JSON.stringify(solved));
        this.getAllHistory();
        this.getPlatformBalance();
        Alert.alert("Your money is locked for appointments! If you complete this appointment, it will be released to consultant.");
       });
     }).catch((error) => {
        console.error(error);
      });
 }

 // get current balance of platform account
 getPlatformBalance  = async() => {
    return fetch(stripe_url + 'balance', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + 'sk_test_api6b2ZD9ce6IRqwOLqaFbZU',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).then((response) => {
      response.json().then(solved => {
        firebase.database().ref('Platform_Balance').set(solved);
      });
    }).catch((error) => {
      console.error(error);
    });
 }

 // book new appointment
 // it will charge 1.2 * appointment's amount from credit card to platform
 createNewBooking = async() =>{
   await this.createCharge(Math.ceil(this.state.amount*1.12), this.state.token);
   await this.setState({bookingStatus : true});
 }

 // complete this appointment
 // after completion, the 0.95 * appointment's amount will be transfered from platform account to consultant account
 release = async() => {
   console.log("amount : "  + this.state.amount + "  custom account id : " + this.state.consultant_id);
   await this.createTransfer(Math.floor(this.state.amount*0.95), this.state.consultant_id)
   await this.setState({bookingStatus : false});
 }

 // get the balance of selected consultant.
 // it will be called after completion of appointment, so will update firebase database
 getConsultantBalance = async(consultant_id) => {
  return fetch(stripe_url + 'balance', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + 'sk_test_api6b2ZD9ce6IRqwOLqaFbZU',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Account' : this.state.destination
    }
  }).then((response) => {
    response.json().then(solved => {
      firebase.database().ref('stripe_customers').child(consultant_id).child('balance').set(solved);
    });
  }).catch((error) => {
    console.error(error);
  });
 }

 // get all transactino history
 // it will be called after every transaction, so it will update firebase database
 getAllHistory  = async() => {

  return fetch(stripe_url + 'balance/history?limit=100', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + 'sk_test_api6b2ZD9ce6IRqwOLqaFbZU',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }).then((response) => {
    response.json().then(solved => {
      firebase.database().ref('Transaction_History').set(solved);
    });
  }).catch((error) => {
    console.error(error);
  });
 }

 // if student don't want to release, he can report to admin.
 // after admin check all reports from student and consultant, he can refund charge for appointment.
 // parameter :  id of charge, refunding amount.
 refundCharge = async(chargeId, amount) => {
  var refundDetails = {
    "charge": chargeId,
    "amount": amount
  };

  var formBody = [];
  for (var property in refundDetails) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(refundDetails[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return fetch(stripe_url + 'refunds', {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Authorization': 'Bearer ' + 'sk_test_api6b2ZD9ce6IRqwOLqaFbZU',
       'Content-Type': 'application/x-www-form-urlencoded',
     },
     body: formBody
   }).then((response) => {
     response.json().then(solved => {
      console.log("refunds " + JSON.stringify(solved));
      this.getAllHistory();
      this.getPlatformBalance();
     });
   }).catch((error) => {
      console.error(error);
    });
 }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container} >
        <View style = {{flex: 1}}>
        <ScrollView>
          <CreditCardInput
            autoFocus

            requiresName
            requiresCVC
            requiresPostalCode

            labelStyle={styles.label}
            inputStyle={styles.input}
            validColor={"black"}
            invalidColor={"red"}
            placeholderColor={"darkgrey"}

            onFocus={this._onFocus}
            onChange={this._onChange}
          />
          <TouchableOpacity style={styles.buttonContainer} onPress={this.createToken}>

            <Text style={styles.buttonText}>Charge Now!</Text>

            </TouchableOpacity>
          {/* <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: 5,
            }}
          />
          <Text style={{marginLeft : 'auto', marginRight : 'auto', fontSize : 30, fontWeight : 'bold', marginBottom : 30}}>Testing Escrow System</Text>
          <TextInput
            style={styles.chargeText}
            keyboardType='numeric'
            underlineColorAndroid={'transparent'}
            onChangeText={(amount)=>this.setState({amount})}
            placeholder="funding amount for booking">
          </TextInput>
          <TextInput
            style={styles.chargeText}
            underlineColorAndroid={'transparent'}
            value={this.state.consultant_id}
            onChangeText={(consultant_id)=>this.setState({consultant_id})}
            placeholder="consultant's id">
          </TextInput>
          {
            this.state.bookingStatus?
            <TouchableOpacity style={styles.buttonContainer}  onPress={this.release}>
              <Text style={styles.buttonText}>Complete</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity  style={styles.buttonContainer}  onPress={this.createNewBooking}>
              <Text style={styles.buttonText}>Booking</Text>
            </TouchableOpacity>

          } */}

          </ScrollView>
        </View>
     </View>
    );
  }

  _onChange = form => {
    console.log(form);
    this.setState({valid : form.valid});
    if(form.valid){
      this.setState({cardNum : form.values.number.replace(/ /g,'')});
      this.setState({expYear : form.values.expiry.split('/')[1]});
      this.setState({expMonth : form.values.expiry.split('/')[0]});
      this.setState({cvc : form.values.cvc});
      this.setState({name : form.values.name});
      this.setState({postalCode : form.values.postalCode});
    }
  }
  _onFocus = field => console.log("focusing", field);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop : 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  movingView: {
    flex: 1,
    backgroundColor: '#e0a8f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  movingText: {
    color: 'white',
    fontSize: 40,
    alignItems: 'center',
    padding: 26,
  },
  buyingView: {
    flex: 1,
    backgroundColor: '#e0a8f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyingText: {
    color: 'white',
    fontSize: 40,
    //fontFamily: 'lucida grande',
    padding: 26,
  },
  sellingView: {
    flex: 1,
    backgroundColor: 'steelblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellingText: {
    color: 'white',
    fontSize: 40,
    padding: 26,
  },
  label: {
    color: "black",
    fontSize: 12,
  },
  input: {
    fontSize : 16,
    color: "black"
  },
  buttonContainer: {
    marginTop : 30,
    marginBottom : 20,
    padding : 20,
    width : 200,
    borderRadius : 10,
    backgroundColor : '#e0a8f7',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    textAlign : 'center',
    color : 'rgb(250,250,250)',
    fontWeight : 'bold',
    fontSize : 15
  },
  chargeText : {
    width : 300,
    marginTop : 30,
    fontSize : 20,
    marginLeft : 'auto',
    marginRight : 'auto',
    textAlign : 'center',
  },

});
