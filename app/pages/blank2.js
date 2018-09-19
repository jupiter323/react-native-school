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
    token : '',
    cardNum : '',
    expYear : '',
    expMonth : '',
    name : '',
    postalCode : '',
    cvc : '',
    uid : firebase.auth().currentUser.uid,
    valid : false,
    customerId : '',
    amount : 0,
    payouts : 0,
    email : firebase.auth().currentUser.email,
    destination : '',
    trans_amount : 0,
  };
}


componentWillMount() {
  axios.post('https://us-central1-schoolbudd-ac7fc.cloudfunctions.net/helloWorld').then((response) => {
    console.log("axios");
    // console.log("response " + JSON.stringify(response));
    // console.log("response data " + response.data);
  // Stripe.setPublishableKey('pk_test_qkgEe4JVlRcszR12vsEMODWU');
  });
  firebase.database().ref('stripe_customers').child(this.state.uid).child('sources').once('value')
  .then(value=>{
    this.setState({customerId : value.val()['customerId']});
    this.setState({token : value.val()['token']});
    console.log(value);
  });
  this.showAllAccount();
}

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
        this.obtainCustomerID(cardToken);
       }); 
     }).catch((error) => {
        console.error(error);
     });
}

obtainCustomerID = async(token) => {
  var customerDetails = {
      "source": token,
      "email": firebase.auth().currentUser.email
    };

  var formBody = [];
  for (var property in customerDetails) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(customerDetails[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  // console.log("secret token " + firebase.config().stripe.token);

 
  var that = this;
     await fetch(stripe_url + 'customers', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Authorization': 'Bearer ' + 'sk_test_api6b2ZD9ce6IRqwOLqaFbZU',
         'Content-Type': 'application/x-www-form-urlencoded',
       },
       body: formBody
     }).then((response) => {
       console.log("customer " + JSON.stringify(response));
       response.json().then(solved => {
         console.log("solved " + JSON.stringify(solved));
         firebase.database().ref('stripe_customers').child(this.state.uid).child('sources').set({
          token : token,
          fullName : this.state.name,
          postalCode : this.state.postalCode,
          customerId : solved.id,
          currency : solved.currency,
          created : solved.created
        });
        this.setState({customerId : solved.id});
        this.getCurrentBalance();
        Alert.alert('Congratulations!',
        'Stripe account is created successfully.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
        );
       });
     }).catch((error) => {
        console.error(error);
      });
}

createAccount =async() => {


  //create a token, create a customer/id with that token, charge customer id
  //create new customer
  //charge customerid
  //if customer exists, use customerId, else, insert card info, create customer, use customer id
  
  var chargeDetails = {
      "type" : 'custom',
      "email" : this.state.email
        };

    var formBody = [];
    for (var property in chargeDetails) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(chargeDetails[property]);
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
        firebase.database().ref('stripe_customers').child(this.state.uid).child('account').set({
          id : solved.id,
          email : solved.email,
          type : solved.type,
          created : solved.created
        });
       });
     }).catch((error) => {
        console.error(error);
      });
 }
 createTransfer =async() => {


  //create a token, create a customer/id with that token, charge customer id
  //create new customer
  //charge customerid
  //if customer exists, use customerId, else, insert card info, create customer, use customer id
  
  var chargeDetails = {
      "amount" : this.state.trans_amount,
      "currency" : 'usd',
      "destination" : this.state.destination,
      "transfer_group" : "ORDER_1"
        };

    var formBody = [];
    for (var property in chargeDetails) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(chargeDetails[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
  var that = this;
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
        this.getCurrentBalance();
        // firebase.database().ref('stripe_customers').child(this.state.uid).child('account').set({
        //   id : solved.id,
        //   email : solved.email,
        //   type : solved.type,
        //   created : solved.created
        // });
       });
     }).catch((error) => {
        console.error(error);
      });
 }

 
 showAllAccount = async() => {
  return fetch(stripe_url + 'accounts?limit=100', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + 'sk_test_api6b2ZD9ce6IRqwOLqaFbZU',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }).then((response) => {
    response.json().then(solved => {
      console.log("accounts " + JSON.stringify(solved));      
    });
  }).catch((error) => {
    console.error(error);
  });
 }
//
submitNewCharge =async() => {


  //create a token, create a customer/id with that token, charge customer id
  //create new customer
  //charge customerid
  //if customer exists, use customerId, else, insert card info, create customer, use customer id
  
  console.log('amount : ' + this.state.amount + ' customerId :' + this.state.customerId + ' token :' + this.state.token);
  var chargeDetails = {
      "amount": this.state.amount,
      "customer": this.state.customerId,
      "currency": 'usd',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
      "description": 'Example charge',
    };

    var formBody = [];
    for (var property in chargeDetails) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(chargeDetails[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
  var that = this;
    return fetch(stripe_url + 'charges', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Authorization': 'Bearer ' + 'sk_test_api6b2ZD9ce6IRqwOLqaFbZU',
         'Content-Type': 'application/x-www-form-urlencoded',
       },
       body: formBody
     }).then((response) => {
       console.log("charge " + JSON.stringify(response));
       response.json().then(solved => {
        this.getAllHistory();
        this.getCurrentBalance();
       });
     }).catch((error) => {
        console.error(error);
      });
 }
 submitNewPayout =async() => {


  //create a token, create a customer/id with that token, charge customer id
  //create new customer
  //charge customerid
  //if customer exists, use customerId, else, insert card info, create customer, use customer id
  console.log("payouts : " + this.state.payouts);
  var chargeDetails = {
      "amount": this.state.payouts,
      "currency": 'usd',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
      "description": 'Example payout',
    };

    var formBody = [];
    for (var property in chargeDetails) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(chargeDetails[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
  var that = this;
    return fetch(stripe_url + 'payouts', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Authorization': 'Bearer ' + 'sk_test_api6b2ZD9ce6IRqwOLqaFbZU',
         'Content-Type': 'application/x-www-form-urlencoded',
       },
       body: formBody
     }).then((response) => {
       response.json().then(solved => {
        console.log("payouts " + JSON.stringify(solved));
        firebase.database().ref('stripe_customers').child(this.state.uid).child('payouts').push({
          id : solved.id,
          balance_transaction : solved.balance_transaction,
          amount : solved.amount,
          created : solved.created,
          currency : solved.currency
        });
        this.getAllHistory();
        this.getCurrentBalance();
       });
     }).catch((error) => {
        console.error(error);
      });
 }

 getCurrentBalance  =async() => {
    return fetch(stripe_url + 'balance', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + 'sk_test_api6b2ZD9ce6IRqwOLqaFbZU',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).then((response) => {
      console.log("balance " + JSON.stringify(response));
      response.json().then(solved => {
        firebase.database().ref('stripe_customers').child(this.state.uid).child('balance').set(solved);
        console.log("customers : " + JSON.stringify(solved));
        
      });
    }).catch((error) => {
      console.error(error);
    });
 }

 getAllHistory  = async() => {

  return fetch(stripe_url + 'balance/history?limit=100', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + 'sk_test_api6b2ZD9ce6IRqwOLqaFbZU',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }).then((response) => {
    console.log("balance " + JSON.stringify(response));
    response.json().then(solved => {
      firebase.database().ref('stripe_customers').child(this.state.uid).child('history').set(solved);      
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
            <Text style={styles.buttonText}>Register Credit Card</Text>
            </TouchableOpacity>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: 3,
            }}
          />
            <TextInput style={styles.chargeText}
            placeholder="Please insert your email."
            keyboardType='email-address'        
            value={this.state.email}    
            underlineColorAndroid={'transparent'} 
            onChangeText={(email)=>this.setState({email})}
            />
             <TouchableOpacity style={styles.buttonContainer} onPress={this.createAccount}>
               <Text style={styles.buttonText}>Create account</Text>
            </TouchableOpacity>  
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: 3,
            }}
          />
            <TextInput style={styles.chargeText}
            placeholder="Please insert charging amount."
            keyboardType='numeric'
            underlineColorAndroid={'transparent'} 
            onChangeText={(amount)=>this.setState({amount})}
            />
             <TouchableOpacity style={styles.buttonContainer} onPress={this.submitNewCharge}>
               <Text style={styles.buttonText}>Charge</Text>
            </TouchableOpacity>
          <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 3,
          }}
          />
            <TextInput style={styles.chargeText}
            placeholder="Please insert destination account."
            underlineColorAndroid={'transparent'} 
            onChangeText={(destination)=>this.setState({destination})}
            />
             <TextInput style={styles.chargeText}
            placeholder="Please insert transfer account."
            underlineColorAndroid={'transparent'} 
            onChangeText={(trans_amount)=>this.setState({trans_amount})}
            />
             <TouchableOpacity style={styles.buttonContainer} onPress={this.createTransfer}>
               <Text style={styles.buttonText}>Transfer</Text>
            </TouchableOpacity>  
          <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 3,
          }}
          />
            <TextInput style={styles.chargeText}
            placeholder="Please insert payout amount."
            keyboardType='numeric'
            underlineColorAndroid={'transparent'} 
            onChangeText={(payouts)=>this.setState({payouts})}
            />
             <TouchableOpacity style={styles.buttonContainer} onPress={this.submitNewPayout}>
               <Text style={styles.buttonText}>Payout</Text>
            </TouchableOpacity>
          {/* <TouchableHighlight
            style= {styles.sellingView}
            onPress={() => this.getCurrentBalance()}>
              <View>
              <Text style = {styles.sellingText}>Balance</Text>
              </View>
          </TouchableHighlight> */}

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
    backgroundColor: 'powderblue',
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
    backgroundColor: 'skyblue',
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
    backgroundColor : 'rgba(0,0,0,0.8)',
    marginLeft : 'auto',
    marginRight : 'auto'
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
  }
});
