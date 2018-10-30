import React from 'react';
import {
  StyleSheet, Text, View, Image, ActivityIndicator, SectionList,
  SafeAreaView, Dimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Button, AsyncStorage
} from 'react-native';
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

const { width, height } = Dimensions.get('window');

const items = [
  {
    name: "Consultant Type",
    id: 0,
    children: [{
      name: "IECA",
      id: "IECA",
    }, {
      name: "Current College Student",
      id: "College Student",
    }]
  },
  {
    name: "Specialties",
    id: 1,
    children: [{
      name: "Extracurriculars in High School",
      id: "Extracurriculars in High School",
    }, {
      name: "Grades in College",
      id: "Grades in College",
    }, {
      name: "Fun in College",
      id: "Fun in College",
    }, {
      name: "Transitioning to College",
      id: "Transitioning to College",
    }, {
      name: "Internships",
      id: "Internships",
    }]
  },
  {
    name: "Hourly or Packages",
    id: 2,
    children: [{
      name: "Just Hourly",
      id: "Just Hourly",
    }, {
      name: "Just Packages",
      id: "Just Packages",
    }, {
      name: "Both",
      id: "Both",
    }]
  },
]
/*
  Displays information about Jedi
*/
export default class FindConsultant extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const { navigate } = navigation;
    return {
      headerTitle: 'Find A Consultant',
      title: 'Find A Consultant',
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


  constructor(props) {
    super(props);
    this.state = {
      jedisSectioned: [{ title: 'Jedis', data: [] }],
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
    }
    //see what props App.js is constructed with:
    // console.log(JSON.stringify(props));
  }

  async appendJedis(count, start) {

    var jedisList = this.state.jedisSectioned[0].data.slice();
    var filterPass = false;
    console.log("testing append jedis");


    var database = firebase.database();
    database.ref('consultants').on('child_added', (snapshot) => {
      console.log("testing enter firebase ref");
      var childKey = snapshot.key;
      console.log("key " + childKey);
      var childData = snapshot.val();
      childData.key = childKey;
      console.log("child data pulled" + JSON.stringify(childData));
      //   console.log("portal " + childData.portal);
      //   console.log("portal " + typeof childData.portal);
      //   if (childData.name !== undefined) {
      //   name = childData.name.toLowerCase();
      // } else {
      //   name = 'Placeholder';
      // }
      //   searchTextLowercase = this.state.searchText.toLowerCase();
      //   var specialties1 = childData.specialties;
      //   var typeConsultant = childData.type;
      //   console.log("specialties yippee kiyay " + specialties1);
      //   console.log("selectedItems " + this.state.selectedItems);
      //   //the next block of code checks for if the consultant fulfills all of the applied filters
      //   if ((this.state.selectedItems != "") && (childData.portal == "consultant")) {
      //     // if (this.state.selectedSpecialtiesArray == true) {
      //     //   await this.setState({ selectedConsultantTypeArray: false });
      //     // }
      //     // if (this.state.selectedAvailabilityPreferences == true) {
      //     //
      //     // }
      //     // if (this.state.selectedConsultantType == true) {
      //     //
      //     // }
      //     var comparisonArray = this.state.selectedItemsComparisonArray;
      //       comparisonArray.push(childData.type);
      //     if (this.state.selectedSpecialties == true) {
      //       childData.specialties.forEach(function(element) {
      //       comparisonArray.push(element.value);
      //     });
      //   }
      //     comparisonArray.push(childData.availabilityPreferences);
      //     console.log("comparisonArray " + comparisonArray);
      //     console.log("comparisonArray string" + JSON.stringify(comparisonArray));
      //     var stringSelections = JSON.stringify(this.state.selectedItems);
      //             var yes = 0;
      //             var total = 0;
      //           this.state.selectedItems.forEach(function(element) {
      //             total ++;
      //             console.log("inner if statement selectedItems " + stringSelections);
      //             console.log("value " + element);
      //             if (comparisonArray.includes(element)) {
      //               yes++;
      //             };
      //           });
      //           if (yes == total) {
      //             filterPass = true;
      //           }
      //
      // } else {
      //   filterPass = true;
      // }
      //   // if ((childData.portal === 'consultant') & itemName.includes(searchTextLowercase)) {
      //   // console.log("array check " + this.state.selectedConsultantType.includes(childData.type));
      //   // console.log("select consultant type " + this.state.selectedConsultantType);
      //   // console.log("childData type" + childData.type);
      //   //  (this.state.selectedConsultantType.includes(childData.type);
      //     // specialties1.forEach(function(element) {
      //     //   console.log(element);
      //     // });
      // if ((childData.portal == "consultant") && (name.includes(searchTextLowercase)) && (filterPass == true)) {
      // console.log("firebase specialties " + specialties);
      jedisList.push(childData);
      console.log("jedis " + JSON.stringify(jedisList));
      // } else {
      // console.log(childData.portal);
      // }
      this.setState({ loading: false, refreshing: false, jedisSectioned: [{ title: 'Jedis', data: jedisList }] });
      console.log(childData);
    });

    // var jedisList = this.state.jedisSectioned[0].data.slice();
    // this.setState({loading: true});
    // for(i=start; i < count+start; i++) {
    //   await this.getJedi(i, jedisList);
    // }
    // this.setState({loading: false, refreshing: false, jedisSectioned: [{title: 'Jedis', data:jedisList}]});
    //do i need a for loop right here to check to see if there are duplicate values
  }

  onSelectionsChangeSpecialties = (selectedSpecialties) => {
    // selectedSpecialties is array of { label, value }
    this.setState({ selectedSpecialties });
  }

  onSelectionsChangeConsultantType = (selectedConsultantType) => {
    // selectedSpecialties is array of { label, value }
    this.setState({ selectedConsultantType });
  }

  componentWillMount() {
    this.checkIfUserLoggedIn();
    this.appendJedis(3, 1);
    // console.log(this.state.jedis);
  }

  checkIfUserLoggedIn = async () => {
    const loginCheck = await AsyncStorage.getItem("hasLoggedIn");
    if (loginCheck === "true") {
      await this.setState({ hasLoggedIn: true });
      console.log("hasLoggedIn" + this.state.hasLoggedIn);
      console.log("metroooooooo");
    }
    const emailVerification = firebase.auth().currentUser.emailVerified;
    if (emailVerification == true) {
      await this.setState({ emailVerified: true});
    }
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  onPressCategory() {
    this.toggleModal();
  }

  listItemRenderer(item) {
    return (
      <SaleBlock
        jedi={item}
        bookAppointment={this.bookAppointment}
        selectConsultant={this.selectConsultant} />
    );
  }

  async loadMore(count, start) {
    if (start > 1 && !this.state.refreshing && !this.state.loading) {
      this.setState({ loading: true });
      await this.appendJedis(count, start);
    }
  }

  _keyExtractor = (item, index) => index;


  resetList = async () => {
    await this.setState({ refreshing: true, jedisSectioned: [{ title: 'Jedis', data: [] }] });
    this.appendJedis(3, 1);
    console.log("selectedItems " + JSON.stringify(this.state.selectedItems));
  }

  onPressMiscellaneous = async () => {
    await this.setState({ isModalVisible: false, currentCategory: 'Miscellaneous' });
    console.log(this.state.currentCategory);

    this.resetList();
  }

  onSelectedItemsChange = async (selectedItems) => {
    this.setState({ selectedItems });
    console.log("typeof " + typeof this.state.selectedItems);
    var selectedItemsString = JSON.stringify(selectedItems);
    console.log("selectedItemsString " + selectedItemsString);
    console.log("typeof string" + typeof selectedItemsString);
    if (selectedItemsString.includes("IECA") || selectedItemsString.includes("Current College Student")) {
      await this.setState({ selectedConsultantType: true });
    } else {
      await this.setState({ selectedConsultantType: false });
    }
    if (selectedItemsString.includes("Just Hourly") || selectedItemsString.includes("Just Packages") || selectedItemsString.includes("Both")) {
      await this.setState({ selectedAvailabilityPreferences: true });
    } else {
      await this.setState({ selectedAvailabilityPreferences: false });
    }
    if (selectedItemsString.includes("Extracurriculars in High School") || selectedItemsString.includes("Grades in College") || selectedItemsString.includes("Internships")
      || selectedItemsString.includes("Transitioning to College") || selectedItemsString.includes("Fun in College")) {
      await this.setState({ selectedSpecialties: true });
    } else {
      await this.setState({ selectedSpecialties: false });
    }
    console.log("type " + this.state.selectedConsultantType);
    console.log("availabilityPreferences " + this.state.selectedAvailabilityPreferences);
    console.log("specialties " + this.state.selectedSpecialties);
  }

  bookAppointment = async (item) => {
    this.props.navigation.navigate('CalendarOtherScreen', { item: item });
  }

  selectConsultant = async (key) => {
    this.props.navigation.navigate('SelectConsultant', { key: key });
  }

  render() {

    if (!this.state.hasLoggedIn || !this.state.emailVerified) {
      return (<LoggedOut />);
    } else {

      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <SafeAreaView style={styles.container}>

            <View style={styles.purchaseBox}>

              <SearchBar
                lightTheme
                round
                onChangeText={(searchText) => this.setState({ searchText })}
                onClearText={console.log('')}
                onSubmitEditing={() => this.resetList()}
                icon={{ type: 'font-awesome', name: 'search' }}
                containerStyle={{ width: Metrics.screenWidth * .95, marginTop: 20, marginBottom: 10 }}
                placeholder='Search For Consultant...'
              />

              <View style={{ height: 200, width: Metrics.screenWidth * .9, justifyContent: 'center', marginBottom: 10 }}>
                <Slider
                  value={this.state.price}
                  thumbTintColor='#9B59B6'
                  minimumValue={5}
                  maximumValue={250}
                  value={140}
                  step={1}
                  onValueChange={(price) => this.setState({ price })}
                  onSlidingComplete={() => this.resetList()}
                />
                <Text>Maximum Price: ${this.state.price}</Text>

                <SectionedMultiSelect
                  ref={SectionedMultiSelect => { this.SectionedMultiSelect = SectionedMultiSelect }}
                  items={items}
                  uniqueKey='id'
                  subKey='children'
                  selectText='Choose some things...'
                  style={{ backgroundColor: 'red' }}
                  styles={{
                    selectToggle: [{ flex: 1, marginTop: 15, }, globalStyles.btn],
                    selectToggleText: globalStyles.btnText,
                  }}
                  showDropDowns={true}
                  readOnlyHeadings={true}
                  onSelectedItemsChange={this.onSelectedItemsChange}
                  selectedItems={this.state.selectedItems}
                  showCancelButton={true}
                  showChips={false}
                  onConfirm={() => this.resetList()}
                  selectToggleIconComponent={
                    <Icon type="material" name="add" color="white" />
                    // <CheckBox
                    //   center
                    //   // title={"Filter Consultants"}
                    //   iconRight
                    //   iconType='material'
                    //   uncheckedIcon='add'
                    //   containerStyle={{width: '100%', height: 40, alignSelf: 'center'}}
                    //   onPress={() => this.SectionedMultiSelect._toggleSelector()}
                    // />
                  }
                />
              </View>

              <View style={{ alignItems: 'center', justifyContent: 'center' }}>

              </View>

            </View>

            <View style={styles.itemList}>
              <SectionList
                sections={this.state.jedisSectioned}
                // onEndReached={() => this.loadMore(3,this.state.jedisSectioned[0].data.length+1)}
                renderItem={({ item }) => this.listItemRenderer(item)}
                ItemSeparatorComponent={() => (<View style={{ height: 10 }} />)}
                keyExtractor={this._keyExtractor}
                contentContainerStyle={{ alignItems: 'center' }}
                onRefresh={() => this.resetList()}
                refreshing={this.state.refreshing}
                removeClippedSubviews={true}
                ListFooterComponent={this.state.refreshing ? <ActivityIndicator /> : <View />}
              />
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      );

    }
  }
}

const styles = StyleSheet.create({
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
    height: Metrics.screenHeight * .6,
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
