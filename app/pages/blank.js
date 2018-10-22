import React from 'react';
import { StyleSheet, View, Text, Button, TouchableHighlight, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase';
import {Facebook} from 'expo';
import Modal from "react-native-modal";
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import axios from 'axios';

// const stripe = Stripe('pk_test_qkgEe4JVlRcszR12vsEMODWU');
// Stripe.setPublishableKey('pk_test_qkgEe4JVlRcszR12vsEMODWU');
const stripeClient = require('stripe-client')('pk_test_qkgEe4JVlRcszR12vsEMODWU');
// const stripe = require('stripe')('firebase.config().stripe.token');
const stripe_url = 'https://api.stripe.com/v1/'
// const secret_key = firebase.config().stripe.token;
//create token
//push to firebase backend
//payments UI

// const dataTimes =
// [
//   {key: 'High School Internships - Chegg', link: 'http://www.internships.com/high-school', summary: '6:30 am', category:'Internships'},
//   {key: 'High School Internships - Indeed', link: 'https://www.indeed.com/jobs?q=High+School+Intern&l=', summary: '6:30 am', category: 'ACT'},
//   {key: 'Reason Prep SAT', link: 'https://members.reasonprep.com/courses/category/SAT', summary: '6:30 am', category: 'SAT'},
//   {key: 'Reason Prep ACT', link: 'https://members.reasonprep.com/courses/category/ACT', summary: '6:30 am', category:'ACT'},
// ]

export default class Blank extends React.Component {

static navigationOptions = {
  title: 'Blank2',
  creditCardNumber: 1,
  cvc: 1,
  expMonth: 1,
  expYear: 1,
  zipCode: 1,
  token: '',
  // uid: firebase.auth().currentUser.uid,
};

componentWillMount() {
  axios.post('https://us-central1-schoolbudd-ac7fc.cloudfunctions.net/helloWorld').then((response) => {
    console.log("axios");
    // console.log("response " + JSON.stringify(response));
    // console.log("response data " + response.data);
  // Stripe.setPublishableKey('pk_test_qkgEe4JVlRcszR12vsEMODWU');
  });
}

createToken = async() => {
  var cardToken;
  var cardDetails = {
      "card[number]": '4242424242424242',
      "card[exp_month]": '02',
      "card[exp_year]": '21',
      "card[cvc]": '999'
    };

    var formBody = [];
    for (var property in cardDetails) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(cardDetails[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
  var that = this;
  await fetch(stripe_url + 'tokens', {
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
        console.log("card token in fetch " + cardToken);
        customerID = this.obtainCustomerID(cardToken);
        return customerID;
       });
     }).catch((error) => {
        console.error(error);
      });
}

obtainCustomerID = async(token) => {
  var customerDetails = {
      "source": token,
      "email": 'jimothy1541@gmail.com'
    };

    var formBody = [];
    for (var property in customerDetails) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(customerDetails[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
  // console.log("secret token " + firebase.config().stripe.token);

  // firebase.database().ref('stripe_customers').child(this.state.uid).child('sources').push({token: token}).then(() => {
  //   console.log("testing push stripe database");
  //   });
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
         return solved.id;
       });
     }).catch((error) => {
        console.error(error);
      });
}

createCustomer =async() => {
  var token;
  var customerID;
  // token = await this.createToken();
  // console.log("returned token " + JSON.stringify(token));
  this.createToken();
  // customerID = this.obtainCustomerID(token);
  // firebase.database().ref(`/stripe_customers/${firebase.auth().currentUser.uid}/sources`).push({token: token}).then(() => {
  //     this.newCreditCard = {
  //       number: '4242424242424242',
  //       cvc: '999',
  //       exp_month: 1,
  //       exp_year: 2017,
  //       address_zip: '11111'
  //     };
  //   });

//   Stripe.card.createToken({
//     number: 4242424242424242,
//     cvc: 111,
//     exp_month: this.newCreditCard.exp_month,
//     exp_year: this.newCreditCard.exp_year,
//     address_zip: this.newCreditCard.address_zip
//   }, (status, response) => {
//     if (response.error) {
//       this.newCreditCard.error = response.error.message;
//     } else {
//       firebase.database().ref(`/stripe_customers/${this.currentUser.uid}/sources`).push({token: response.id}).then(() => {
//         this.newCreditCard = {
//           number: '',
//           cvc: '',
//           exp_month: 1,
//           exp_year: 2017,
//           address_zip: ''
//         };
//       });
//     }
//   });
}

releasePayment = async() => {

}
//
submitNewCharge =async() => {

  var token = this.createToken();
  // firebase.database().ref(`/stripe_customers/${this.currentUser.uid}/charges`).push({
  //   source: this.newCharge.source,
  //   amount: parseInt(this.newCharge.amount)
  // });
  //create a token, create a customer/id with that token, charge customer id
  //create new customer
  //charge customerid
  //if customer exists, use customerId, else, insert card info, create customer, use customer id
  var chargeDetails = {
      "amount": 100,
      "customerId": '',
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
  // console.log("secret token " + firebase.config().stripe.token);

  // firebase.database().ref('stripe_customers').child(this.state.uid).child('sources').push({token: token}).then(() => {
  //   console.log("testing push stripe database");
  //   });
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
         cardToken = solved.id;
         console.log("card token " + cardToken);
       });
     }).catch((error) => {
        console.error(error);
      });
}

  onPressMoving() {
    console.log("Moving");
  }
  onPressSelling() {
    console.log("selling");
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container} >

        <View style = {{flex: 1}}>

          <TouchableHighlight
            style= {styles.movingView}
            onPress={() => this.createToken()}>
              <View>
              <Text style = {styles.movingText}>Moving</Text>
              </View>
            </TouchableHighlight>

          <TouchableHighlight
            style={styles.buyingView}
            onPress={() => this.createCustomer()}>
              <View>
              <Text style = {styles.buyingText}>Buying</Text>
              </View>
          </TouchableHighlight>

          <TouchableHighlight
            style= {styles.sellingView}
            onPress={() => this.submitNewCharge()}>
              <View>
              <Text style = {styles.sellingText}>Selling</Text>
              </View>
          </TouchableHighlight>


          </View>
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  movingView: {
    flex: 1,
    backgroundColor: '#9B59B6',
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
    backgroundColor: '#9B59B6',
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
});
