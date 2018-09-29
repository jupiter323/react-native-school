import React, { Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import UploadSale from '../components/uploadSale';
import firebase from 'firebase';
import Metrics from '../Themes/Metrics';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';


//import Main from './app/components/Main';


export default class StudentBasicInfo extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: 'Sell Stuff',
    title: 'Sell Stuff',
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

  purchaseConfirmation= async (price, name) => {
    this.props.navigation.navigate('SellersThankYou', {price:price, itemName: name});
  }

  render() {
    return (
      <View style={styles.container}>
        <UploadSale purchaseConfirmation={this.purchaseConfirmation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginLeft: 15,
  }
});
