import { Permissions, Notifications } from 'expo';
import firebase from 'firebase';
const PUSH_ENDPOINT = 'https://your-server.com/users/push-token/';
const EXPO_PUSHNOTI_SERVER = 'https://exp.host/--/api/v2/push/'
const Functions = {

  registerForPushNotificationsAsync: async (uid) => {
    alert(uid);
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    alert(token);
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    await firebase.database().ref('users').child(uid).set({ pushNotificationToken: token });

  },
  deleteUpcomming: async (appointmentId) => {
    console.log(appointmentId);
    await firebase.database().ref('appointments').child(appointmentId).remove();
  },
  sendPushnotification: async (reciepUid) => {

    var bodydata = { from: firebase.auth().currentUser.uid, data: "Request pay" }

    await firebase.database().ref('users').child(reciepUid).once('value', async (snapshot) => {
      var childKey = snapshot.key;
      var childData = snapshot.val();
      childData.key = childKey;
      var reciepToken = childData.pushNotificationToken;
      await fetch(`${EXPO_PUSHNOTI_SERVER}send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          "to": reciepToken,
          "title": "Request",
          "sound": "default",
          "body": JSON.stringify(bodydata),
          "badge": 1
        }
      }).then(() => {
        alert("Sent pushnotificatin successfully")
        console.log("success send pushnotification")
      }).catch((error) => {
        console.error(error);
      });
    })
  },
  createToken: async () => {
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
        this.setState({ token: cardToken });
        console.log("card token in fetch " + cardToken);


        this.createCharge(Math.ceil(this.state.totalPrice * 1.12), solved.id);
      });

    }).catch((error) => {
      console.error(error);
    });
  },

  // create new transfer from platform account to consultant account
  // parameers : transfer amount, firebase id of consultant
  createTransfer: async (amount, consultant_id) => {
    console.log(consultant_id)
    firebase.database().ref('stripe_customers').child(consultant_id).child('account').once('value')
      .then(value => {
        this.setState({ destination: value.val()['id'] });
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
            this.getConsultantBalance(consultant_id);
          });
        }).catch((error) => {
          console.error(error);
        });
      });
  },


  // create new charge from credit card to platform account
  // parameters :  charge amount, source or token
  createCharge: async (amount, token) => {
    alert();

    var chargeDetails = {
      "amount": amount,
      "description": "Example Charge",
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
        Alert.alert("Your money is locked for appointments! If you complete this appointment, it will be released to consultant.");
      });
    }).catch((error) => {
      console.error(error);
    });
  },

  // get current balance of platform account
  getPlatformBalance: async () => {
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
  },

  // book new appointment
  // it will charge 1.2 * appointment's amount from credit card to platform
  createNewBooking: async () => {
    await this.createCharge(Math.ceil(this.state.amount * 1.12), this.state.token);
    await this.setState({ bookingStatus: true });
  },

  // complete this appointment
  // after completion, the 0.95 * appointment's amount will be transfered from platform account to consultant account
  release: async () => {
    console.log("amount : " + this.state.amount + "  custom account id : " + this.state.consultant_id);
    await this.createTransfer(Math.floor(this.state.amount * 0.95), this.state.consultant_id)
    await this.setState({ bookingStatus: false });
  },

  // get the balance of selected consultant.
  // it will be called after completion of appointment, so will update firebase database
  getConsultantBalance: async (consultant_id) => {
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
        firebase.database().ref('stripe_customers').child(consultant_id).child('balance').set(solved);
      });
    }).catch((error) => {
      console.error(error);
    });
  },

  // get all transactino history
  // it will be called after every transaction, so it will update firebase database
  getAllHistory: async () => {

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
  },

  // if student don't want to release, he can report to admin.
  // after admin check all reports from student and consultant, he can refund charge for appointment.
  // parameter :  id of charge, refunding amount.
  refundCharge: async (chargeId, amount) => {
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
}

export default Functions