import React from 'react';
import { StyleSheet, View, Text, Button, TouchableHighlight, AsyncStorage, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Metrics from '../Themes/Metrics';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from 'firebase';
import { Facebook } from 'expo';
import Modal from "react-native-modal";
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import { CreditCardInput } from "react-native-credit-card-input";
import axios from 'axios';
import Functions from '../Themes/Functions';

// const stripe = Stripe('pk_test_qkgEe4JVlRcszR12vsEMODWU');
// Stripe.setPublishableKey('pk_test_qkgEe4JVlRcszR12vsEMODWU');
// const stripeClient = require('stripe-client')('pk_test_qkgEe4JVlRcszR12vsEMODWU');
// const stripe = require('stripe')('firebase.config().stripe.token');
const stripe_url = 'https://api.stripe.com/v1/'
// const secret_key = firebase.config().stripe.token;
//create token
const stripe = require('stripe-client')('pk_test_qkgEe4JVlRcszR12vsEMODWU');


export default class InputCreditCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: 'tok_visa',
      cardNum: '',
      expYear: '',
      expMonth: '',
      name: '',
      postalCode: '',
      cvc: '',
      uid: firebase.auth().currentUser.uid,
      valid: false,
      consultantId: '',
      totalPrice: 0,
      bookingStatus: false,
      destination: '',
      chargeId: '',
      cardFormData: { number: "4242 4242 4242 4242", expiry: "09/22", cvc: "234" }
    };
  }


  componentWillMount() {

    this.getAllHistory();
    this.getPlatformBalance();
    this.setState({ totalPrice: this.props.navigation.state.params.totalPrice });
    this.setState({ consultantId: this.props.navigation.state.params.consultantId });
    console.log("TotalPrice : " + this.props.navigation.state.params.totalPrice);

  }

  // register new credit card and get token
  createToken = async () => {
    if (!this.state.valid) {
      Alert.alert('',
        'please insert valid info.',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
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
        this.setState({ token: cardToken });
        console.log("card token in fetch " + cardToken);


        var cardInfo = {
          cardNum: this.state.cardNum,
          expYear: this.state.expYear,
          expMonth: this.state.expYear,
          cvc: this.state.cvc,
          name: this.state.name,
          postalCode: this.state.postalCode,
          cardToken: cardToken
        }
        AsyncStorage.setItem('cardInfo', JSON.stringify(cardInfo));
        this.createCharge(Math.ceil(this.state.totalPrice * 1.12), solved.id);
      });
    }).catch((error) => {
      console.error(error);
    });
  }


  // create new charge from credit card to platform account
  // parameters :  charge amount, source or token
  createCharge = async (amount, token) => {
    await this.setState({ bookingStatus: true });
    var chargeDetails = {
      "amount": amount,
      "description": "Charge for appointment",
      "currency": 'usd',
      "source": token,
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
        this.setState({ chargeId: solved.id });
        console.log("charge " + JSON.stringify(solved));
        this.getAllHistory();
        this.getPlatformBalance();

        this.pushTransactionHistory(solved.balance_transaction, "charge", solved.amount);

        // Alert.alert("Your money is locked for appointments! If you complete this appointment, it will be released to consultant.");
        Alert.alert("Your money was charged in our platform. you can complete your transfer to your consultant");
      });
    }).catch((error) => {
      console.error(error);
    });
  }
  // create new transfer from platform account to consultant account
  // parameers : transfer amount, firebase id of consultant
  createTransfer = async (amount, consultantId) => {

    firebase.database().ref('stripe_customers').child(consultantId).child('account').once('value')
      .then(value => {
        this.setState({ destination: value.val()['id'] });
        console.log(this.state.destination);
        var chargeDetails = {
          "amount": amount,
          "currency": 'usd',
          "source_transaction": this.state.chargeId,
          "destination": value.val()['id']
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
            this.getConsultantBalance(consultantId);
            this.pushTransactionHistory(solved.balance_transaction, "transfer", solved.amount);
          });
        }).catch((error) => {
          console.error(error);
        });
      });
  }


  // get current balance of platform account
  getPlatformBalance = async () => {
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

  // get all transactino history
  // it will be called after every transaction, so it will update firebase database
  getAllHistory = async () => {

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

  //set transaction history into firebase
  pushTransactionHistory = async (transactionId, paymentWay, amount) => {
    var transaction = {
      origin: this.state.uid,
      target: this.state.consultantId,
      txn: transactionId,
      way: paymentWay,
      amount: amount
    }
    await firebase.database().ref('Transaction_history_platform').push(transaction);

  }
  // get the balance of selected consultant.
  // it will be called after completion of appointment, so will update firebase database
  getConsultantBalance = async (consultantId) => {
    return fetch(stripe_url + 'balance', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + 'sk_test_api6b2ZD9ce6IRqwOLqaFbZU',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Account': this.state.destination
      }
    }).then((response) => {
      response.json().then(solved => {
        firebase.database().ref('stripe_customers').child(consultantId).child('balance').set(solved);
      });
    }).catch((error) => {
      console.error(error);
    });
  }

  appointmentComplete = async () => {
    const { navigate } = this.props.navigation;
    const { appointmentId } = this.props.navigation.state.params
    await this.createTransfer(Math.floor(this.state.totalPrice * 0.95), this.state.consultantId)
    await this.setState({ bookingStatus: false });    
    await Functions.deleteUpcomming(appointmentId);
    alert("Your payment succeed!");
    navigate('AccountInfo');

  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container} >
        <View style={{ flex: 1 }}>
          <ScrollView>
            <CreditCardInput
              autoFocus

              requiresName
              requiresCVC
              // requiresPostalCode

              labelStyle={styles.label}
              inputStyle={styles.input}
              validColor={"black"}
              invalidColor={"red"}
              placeholderColor={"darkgrey"}
              onFocus={this._onFocus}
              onChange={this._onChange}

              placeholders={this.state.cardFormData}
            />
            <Text style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: 15, fontWeight: 'bold', marginTop: 20 }}>Cost : ${this.state.totalPrice}</Text>
            <Text style={{ marginLeft: 'auto', marginRight: 'auto', fontSize: 15, fontWeight: 'bold', marginVertical: 20 }}>Processing Fees : ${Math.ceil(this.state.totalPrice * 0.12)}</Text>


            {
              this.state.bookingStatus ?
                <TouchableOpacity style={styles.buttonContainer} onPress={this.appointmentComplete}>
                  <Text style={styles.buttonText}>Complete</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.buttonContainer} onPress={this.createToken}>
                  <Text style={styles.buttonText}>Charge Now!</Text>
                </TouchableOpacity>
            }
          </ScrollView>
        </View>
      </View>
    );
  }

  _onChange = form => {
    console.log(form);
    this.setState({ valid: form.valid });
    if (form.valid) {
      this.setState({ cardNum: form.values.number.replace(/ /g, '') });
      this.setState({ expYear: form.values.expiry.split('/')[1] });
      this.setState({ expMonth: form.values.expiry.split('/')[0] });
      this.setState({ cvc: form.values.cvc });
      this.setState({ name: form.values.name });
      this.setState({ postalCode: form.values.postalCode });
    }
  }
  _onFocus = field => console.log("focusing", field);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
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
    fontSize: 16,
    color: "black"
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
    padding: 20,
    width: 200,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  buttonText: {
    textAlign: 'center',
    color: 'rgb(250,250,250)',
    fontWeight: 'bold',
    fontSize: 15
  },
  chargeText: {
    width: 300,
    marginTop: 30,
    fontSize: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
  },

});
