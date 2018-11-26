import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar, Avatar } from 'react-native-elements'
import firebase from 'firebase';
import Modal from 'react-native-modal';

/*

  start at
  load more
*/
export default class UpcomingBlock extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            profileId : '',
            profileImage: '',
            startTime : '',
            endTime : '',
            profileName : '',
            summary : '',
            userId : '',
            portal : ''
        }

        console.log(JSON.stringify("questionblock props " + JSON.stringify(props)));
    }

    componentWillMount = async() => {
//get consultant price with id
        await this.setState({portal : this.props.portal});
        console.log("portal3 : " + this.state.portal);
        if(this.state.portal == 'student') {
            await this.setState({profileId : this.props.upcoming.consultantID})
        } else await this.setState({profileId : this.props.upcoming.studentID});

        var that = this;
        firebase.database().ref('users').child(this.state.profileId).on('value', function(snapshot) {
            var childKey = snapshot.key;
            var childData = snapshot.val();
            childData.key = childKey;
            if(childData.profilePicture) that.setState({profileImage: childData.profilePicture});
            that.setState({profileName : childData.name});
          });

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
     createTransfer = async(amount, consultant_id) => {

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
    createCharge = async(amount,token) => {

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
     createNewBooking = async() => {
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


    imageButton() {
        if(this.state.profileImage){
          return(
            <Avatar
            size="large"
            source={{uri : this.state.profileImage}}
            activeOpacity={0.7}
            rounded
          />
          );
        } else {
          return(
            <Avatar
            size="large"
            source={Images.profile}
            activeOpacity={0.7}
            rounded
          />
          )
        }
    }

    payout() {
      this.state.release();
      console.log("payout done.");
    }
    requestFund() {
      //push notification for the release
      console.log("payout done.");
    }
    paymentButton(){
        if(this.state.portal=='student'){
            return(
                <Button
                titleStyle={{color : 'white', fontWeight: '700', fontSize: 25}}
                buttonStyle={{width : 70,borderRadius: 20, margin: 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#c77ce8'}}
                title={"Pay"}
                onPress={() => this.payout()}
                />

            );
        } else {
            return(
                <Button
                titleStyle={{color : 'white', fontWeight: '700', fontSize: 25}}
                buttonStyle={{width : 70,borderRadius: 20, margin: 5, marginBottom : 5, borderWidth : 1, borderColor : '#FFF', backgroundColor :'#c77ce8'}}
                title={"Request"}
                onPress={() => this.requestFund()}
                ></Button>
            );
        }
    }

    render()  {

        return(
            <View style={styles.cardView}>
                <Card>
                    <View style={{flexDirection : 'row', justifyContent: 'space-between'}}>
                        <View style={{flexDirection : 'row'}}>
                            {this.imageButton()}
                            <View style={{flexDirection : 'column'}}>
                                <Text style={{fontSize : 15, marginLeft :20, fontWeight : '200'}}>{this.state.profileName}</Text>
                                <Text style={{fontSize : 13, marginLeft :20, color : '#999'}}>{this.props.upcoming.startTime} -</Text>
                                <Text style={{fontSize : 13, marginLeft :20, color : '#999'}}>{this.props.upcoming.endTime}</Text>
                                <Text style={{fontSize: 15, marginLeft :20, color : '#999'}}>{this.props.upcoming.price}</Text>
                            </View>
                        </View>
                        {this.paymentButton()}

                    </View>
                </Card>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardView: {
      width: Metrics.screenWidth,
      borderRadius: Metrics.buttonRadius,
    },
})
