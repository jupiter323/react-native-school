import React from 'react';
import {
  StyleSheet, Text, View, Image, ActivityIndicator, SectionList,
  SafeAreaView, Dimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Button, AsyncStorage
} from 'react-native';
import { Content } from 'native-base'
import Metrics from '../Themes/Metrics';
import Images from '../Themes/Images';
import Colors from '../Themes/Colors';
import SaleBlock from '../components/saleBlock';
import { Card, ListItem, Slider, Icon, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import LoggedOut from '../components/loggedOutScreen';
import SelectMultiple from 'react-native-select-multiple';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { globalStyles } from '../Themes/Styles';
import Transaction from '../components/transaction';

const { width, height } = Dimensions.get('window');

export default class AccountInfo extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const { navigate } = navigation;
    return {
      headerTitle: 'Account Information',
      title: 'Account Information',
      headerLeft: (
        <Feather style={styles.icon}
          name="menu"
          size={Metrics.icons.medium}
          color={'#c77ce8'}
          onPress={() => navigate('DrawerToggle')}
        />
      )
    }
  };


  constructor(props) {
    super(props);
    this.state = {
      thSectioned: [{ title: 'THs', data: [] }],
      buttonText: 'Show me your ID Card!',
      loading: false,
      refreshing: false,
      price: 140,
      description: '',
      searchText: '',
      isModalVisible: false,
      currentCategory: 'Click Here to Change Categories',
      hasLoggedIn: false,
      selectedItems: [],
      selectedItemsComparisonArray: [],
      selectedConsultantType: false,
      selectedSpecialties: false,
      selectedAvailabilityPreferences: false,
      selectedConsultantTypeArray: [],
      selectedSpecialtiesArray: [],
      selectedAvailabilityPreferencesArray: [],
      emailVerified: false,
      uid: '',
      portal: "",
      balance: "",
      cardInfo: {}
    }
    //see what props App.js is constructed with:
    // console.log(JSON.stringify(props));
  }

  async appendTH(count, start) {


    var filterPass = false;

    var database = firebase.database();
    await database.ref('Transaction_history_platform').on('child_added', async (snapshot) => {
      var childKey = snapshot.key;
      var childData = snapshot.val();
      childData.key = childKey;
      var thList = this.state.thSectioned[0].data.slice();
      if (this.state.portal === "student" && childData.origin === this.state.uid)
        thList.push(childData);
      else if (this.state.portal === "consultant" && childData.target === this.state.uid)
        thList.push(childData);
      console.log("thList data pushed" + JSON.stringify(thList), this.state.uid, this.state.portal);
      await this.setState({ loading: false, refreshing: false, thSectioned: [{ title: 'THs', data: thList }] });

    });



    //do i need a for loop right here to check to see if there are duplicate values
  }

  async componentWillMount() {

    await this.checkIfUserLoggedIn();
    await this.appendTH(3, 1);
    if (this.state.portal === "consultant")
      await this.getBalance()
    if (this.state.portal === "student")
      await this.getCardInfo()
  }
  getCardInfo = async () => {

    var cardInfo = JSON.parse(await AsyncStorage.getItem('cardInfo'));
    await this.setState({ cardInfo });

  }
  getBalance = async () => {
    await firebase.database().ref('stripe_customers').child(this.state.uid).child('balance').on("value", async (snapshot) => {
      var childKey = snapshot.key;
      var childData = snapshot.val();
      childData.key = childKey;
      console.log("balance", JSON.stringify(childData));
      await this.setState({ balance: `Available : $ ${childData.available[0].amount}    Pending : $ ${childData.pending[0].amount}` })
    });

  }
  checkIfUserLoggedIn = async () => {
    const selectedPortal = await AsyncStorage.getItem('portal');
    const loginCheck = await AsyncStorage.getItem("hasLoggedIn");

    if (selectedPortal) {
      await this.setState({ portal: selectedPortal });
    }
    if (loginCheck === "true") {
      await this.setState({ hasLoggedIn: true });
      await this.setState({ uid: firebase.auth().currentUser.uid })
      console.log("hasLoggedIn" + this.state.hasLoggedIn);
      console.log("metroooooooo");
    }
    const emailVerification = firebase.auth().currentUser.emailVerified;
    if (emailVerification == true) {
      await this.setState({ emailVerified: true });
    }
  }

  resetList = async () => {
    await this.setState({ refreshing: true, thSectioned: [{ title: 'THs', data: [] }] });
    this.appendTH(3, 1);
  }

  listItemRenderer(item) {
    const { navigation } = this.props
    return (
      <Transaction navigation={navigation} transaction={item}
        portal={this.state.portal} />
    );
  }
  _keyExtractor = (item, index) => index;
  render() {

    if (!this.state.hasLoggedIn || !this.state.emailVerified) {
      return (<LoggedOut />);
    } else {

      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <SafeAreaView style={styles.container}>
            <Content>
              {this.state.portal === "consultant" &&
                <View>
                  <Text style={{ margin: 30, fontSize: 20, marginBottom: 0 }}>Your Balance</Text>
                  <Text style={{ margin: 30, fontSize: 17, marginBottom: 0, marginLeft: 35 }}>{this.state.balance}</Text>
                </View>
              }

              {this.state.portal === "student" &&
                <View>
                  <Text style={{ margin: 30, fontSize: 20, marginBottom:0 }}>Select your card</Text>
                  <View style={styles.cardView}>
                    <TouchableOpacity>
                      <Card>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column' }}>
                              <Text style={{ fontSize: 15, marginLeft: 20, fontWeight: '200' }}>Card number:  {this.state.cardInfo.cardNum}</Text>
                              <Text style={{ fontSize: 13, marginLeft: 20, color: '#999' }}>Expire day: {this.state.cardInfo.expMonth} / {this.state.cardInfo.expYear}</Text>
                              <Text style={{ fontSize: 13, marginLeft: 20, color: '#999' }}>CVC:  {this.state.cardInfo.cvc}</Text>
                              <Text style={{ fontSize: 15, marginLeft: 20, color: '#999' }}>Name: {this.state.cardInfo.name}</Text>
                              <Text style={{ fontSize: 15, marginLeft: 20, color: '#999' }}>Postal code: {this.state.cardInfo.postalCode}</Text>
                            </View>
                            <View style={{ marginLeft: 30 }}>
                              <Icon
                                name='check'
                                type='evilicon'
                                color='#517fa4'
                              />
                            </View>
                          </View>
                        </View>
                      </Card>
                    </TouchableOpacity>
                  </View>
                </View>
              }
              <Text style={{ margin: 30, fontSize: 20, marginBottom: 0 }}>Transactions History</Text>
              <View style={styles.itemList}>
                <SectionList
                  sections={this.state.thSectioned}
                  // onEndReached={() => this.loadMore(3,this.state.thSectioned[0].data.length+1)}
                  renderItem={({ item }) => this.listItemRenderer(item)}
                  ItemSeparatorComponent={() => (<View style={{ height: 10 }} />)}
                  keyExtractor={this._keyExtractor}
                  contentContainerStyle={{ alignItems: 'center' }}
                  onRefresh={() => this.resetList()}
                  refreshing={this.state.refreshing}
                  removeClippedSubviews={true}
                  ListFooterComponent={this.state.refreshing ? <ActivityIndicator /> : <View />}
                />
                <View style={{margin:20}}></View>
              </View>
            </Content>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      );

    }
  }
}

const styles = StyleSheet.create({
  cardView: {
    width: Metrics.screenWidth,
    borderRadius: Metrics.buttonRadius,
    marginTop: 0
  },
  container: {
    flex: 1,
    backgroundColor: Colors.snow,
  },
  header: {
    height: 60,
    width: width,
    backgroundColor: "#ff8080",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  title: {
    color: 'white',
    fontSize: 24
  },
  purchaseBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Metrics.width * .9,
  },
  textStyles: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemList: {
    height: Metrics.screenHeight * .7,
    width: Metrics.screenWidth,
    paddingTop: 10,
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
  icon: {
    marginLeft: 15,
  }
});
