import React from 'react';
import {
  AppRegistry, StyleSheet, Text, View, TouchableOpacity, StatusBar, Button,
  SectionList, ActivityIndicator, FlatList} from 'react-native';
import * as firebase from 'firebase'
import ResourceBlock from '../components/resourceBlock';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Metrics from '../Themes/Metrics';

//image, name, navigationPath
const dataTimes =
[
  {key: 'Goals Timeline', navigationPath: 'GoalsTimeline'},
  {key: 'College Prep', navigationPath: 'CollegePrep'},
  {key: 'SAT/ACT', navigationPath: 'SATACT'},
  {key: 'Study Material', navigationPath: 'StudyMaterials'},
  {key: 'Internships', navigationPath: 'Internships'},
]


export default class Resources extends React.Component {

  static navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  const { navigate } = navigation;
  return {
    headerTitle: 'Resources',
    title: 'Resources',
    headerLeft: (
      <Feather style={styles.icon}
        name="menu"
        size={Metrics.icons.medium}
        color={'#5A3DC9'}
        onPress={() => navigate('DrawerToggle')}
      />
      )
    }
};

  constructor(props) {
     super(props);
     this.state ={
       jedisSectioned: [{title: 'Jedis',data:[]}],
       refreshing: false,
     }
     console.log("resource screen props " + JSON.stringify(props));
   }

   _keyExtractor = (item, index) => item.key;

   componentWillMount() {
     // this.setState({ bookingDate: this.props.navigation.state.params.bookingDate })
   }

   listItemRenderer =(item) => {
     return (
       <ResourceBlock
       jedi={item}
       navigation={this.props.navigation}/>
     );
   }

  // _onPressBack(){
  //   const {goBack} = this.props.navigation
  //   goBack()
  // }
  //
  // _bookSlot(status,key,value) {
  //   const month = this.state.bookingDate.month
  //   const date = this.state.bookingDate.day
  //   const user = firebase.auth().currentUser
  //   const uid = user.uid
  //   let userDataJson = {}
  //   if(status)
  //   userDataJson[key] = uid
  //   else
  //   userDataJson[key] = null
  //
  //   firebase.database().ref('users').child(uid).child("availabilities").child(month).child(date).update(userDataJson)
  // }

  render() {

    return (
      <View style={styles.container}>
        <View>
                      <Text></Text>
        </View>
          <FlatList
            data={dataTimes}
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            renderItem={this.listItemRenderer}
            ItemSeparatorComponent = {() => (<View style={{height: 15}}/>)}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
