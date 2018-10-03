import React, { Component} from 'react';
import { StyleSheet, Text, View, Platform, AsyncStorage, SafeAreaView } from 'react-native';
import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation';
import {Facebook} from 'expo';
import * as pages from './app/pages';
import firebase from 'firebase';
import Stripe from 'firebase';

var config1 = {
    apiKey: "AIzaSyBUcTA24OEVHAoOGOUCAJwsG77rOBU-LdQ",
    authDomain: "schoolbudd-ac7fc.firebaseapp.com",
    databaseURL: "https://schoolbudd-ac7fc.firebaseio.com",
    projectId: "schoolbudd-ac7fc",
    storageBucket: "gs://schoolbudd-ac7fc.appspot.com",
    messagingSenderId: "1092951149798"
  };
  firebase.initializeApp(config1);
  // Stripe.setPublishableKey('pk_test_qkgEe4JVlRcszR12vsEMODWU');

 const MessagesNav = StackNavigator({
   MessagesScreen: {screen: pages.Messages},
   MessageTableViewScreen: {screen: pages.MessagesList}
 },{
   initialRouteName: 'MessageTableViewScreen',
   title: 'Messages',
 });

const HomeNav = TabNavigator({
  Feedback: {screen: pages.Feedback},
}, {
  // Default config for all screens
  tabBarPosition: 'top',
  animationEnabled: true,
  swipeEnabled: true,
  initialRouteName: 'Feedback',
});

const ProfileNavStudent = TabNavigator({
  ProfileCard: {screen: pages.StudentProfileCard},
  StudentBasicInfo: {screen: pages.StudentBasicInfo},
  Feedback: {screen: pages.Feedback},
}, {
  // Default config for all screens
  tabBarPosition: 'top',
  animationEnabled: true,
  swipeEnabled: true,
  initialRouteName: 'StudentBasicInfo',
});

const ProfileNavConsultant = TabNavigator({
  Profile: {screen: pages.ConsultantProfileCard},
  BasicInfo: {screen: pages.ProfileConsultantBasicInfo},
  Preferences: {screen: pages.ConsultantProfilePreferences},
}, {
  // Default config for all screens
  tabBarPosition: 'top',
  animationEnabled: true,
  swipeEnabled: true,
  initialRouteName: 'BasicInfo',
});

const HomeStackNav = StackNavigator({
  Home: {screen: HomeNav},
}, {
  title: 'Home',
});

const FindConsultantNav = StackNavigator({
  FindConsultantScreen: {screen: pages.FindConsultant},
  SelectConsultant: {screen: pages.SelectConsultant},
  MessagesScreen: {screen: pages.Messages},
  CalendarOtherScreen: {screen: pages.CalendarOtherScreen},
  MakeAppointmentsScreen: {screen: pages.MakeAppointmentsScreen},
  InsertCardScreen : {screen: pages.Blank2}
});

const ForumNav = StackNavigator({
  ForumScreen: {screen: pages.Forum},
  QuestionResponsesScreen: {screen: pages.QuestionResponses},
});

const SetAvailabilityNav = StackNavigator({
  CalendarConsultant: {screen: pages.CalendarConsultantScreen},
  SetAvailabilityScreen: {screen: pages.SetAvailabilityScreen},
});

const InternshipsNav = StackNavigator({
  Internships: {screen: pages.Internships},
  ResourcesScreen: {screen: pages.Resources},
},{
  headerMode: 'none',
});

const StudyMaterialsNav = StackNavigator({
  StudyMaterials: {screen: pages.StudyMaterial},
  ResourcesScreen: {screen: pages.Resources},
}, {
  headerMode: 'none',
});

const GoalsTimelineNav = StackNavigator({
  GoalsTimeline: {screen: pages.GoalsTimeline},
  ResourcesScreen: {screen: pages.Resources},
  TimelineSheet: {screen: pages.TimelineSheet},
}, {
  headerMode: 'none',
});

const SATACTNav = StackNavigator({
  SATACT: {screen: pages.SATACTPrep},
  ResourcesScreen: {screen: pages.Resources},
}, {
  headerMode: 'none',
});

const CollegPrepNav = StackNavigator({
  CollegePrep: {screen: pages.CollegePrep},
  ResourcesScreen: {screen: pages.Resources},
}, {
  headerMode: 'none',
});

const ResourcesNav = StackNavigator({
  ResourcesScreen: {screen: pages.Resources},
  Internships: {screen: InternshipsNav},
  StudyMaterials: {screen: StudyMaterialsNav},
  GoalsTimeline: {screen: GoalsTimelineNav},
  SATACT: {screen: SATACTNav},
  CollegePrep: {screen: CollegPrepNav},
});

const ConsultantNav = DrawerNavigator({
  Home: { screen: HomeStackNav},
  Login: { screen: pages.Login},
  Profile: {screen: ProfileNavConsultant},
  Messages: {screen: MessagesNav},
  Forum: {screen: ForumNav},
  Logout: {screen: pages.Logout},
  SetAvailability: {screen: SetAvailabilityNav},
}, {
    initialRouteName: 'Home',
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerWidth: 250,
});

const StudentNav = DrawerNavigator({
  Home: { screen: HomeStackNav},
  Login: { screen: pages.Login},
  Profile: { screen: ProfileNavStudent},
  FindConsultant: {screen: FindConsultantNav},
  Forum: {screen: ForumNav},
  Resources: {screen: ResourcesNav},
  Blank: {screen: pages.Blank2},
  Logout: {screen: pages.Logout},
}, {
    initialRouteName: 'Home',
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerWidth: 250,
});

const ParentNav = DrawerNavigator({
  Home: { screen: HomeStackNav},
  Login: { screen: pages.Login},
  FindConsultant: {screen: FindConsultantNav},
  Forum: {screen: ForumNav},
  Logout: {screen: pages.Logout},
}, {
    initialRouteName: 'Home',
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerWidth: 250,
});

const SchoolNav = DrawerNavigator({
  Home: { screen: HomeStackNav},
  Login: { screen: pages.Login},
  FindConsultant: {screen: FindConsultantNav},
  Logout: {screen: pages.Logout},
}, {
    initialRouteName: 'Home',
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerWidth: 250,
});


export default class App extends React.Component {

  state = {
    hasDoneOnboarding: false,
    hasLoggedIn: true,
    selectedPortalStudent: false,
    selectedPortalParent: false,
    selectedPortalSchool: false,
    selectedPortalConsultant: false,

  }

  componentDidMount() {
    this.rememberOnboarding();
    this.rememberPortal();
    // this.checkIfUserLoggedIn();
    // console.log(JSON.stringify(this.state.hasDoneOnboarding));
  }


  rememberOnboarding = async () => {
    try {
      const completed = await AsyncStorage.getItem('onboarding');
      await this.setState({hasDoneOnboarding: JSON.parse(completed)});
    } catch (error) {
      console.log(error);
    }
  }

  rememberPortal = async () => {
    try {
      const selectedPortal = await AsyncStorage.getItem('portal');
      console.log("selectedPortal test " + JSON.stringify(selectedPortal));
      if (selectedPortal === 'student') {
      await this.setState({selectedPortalStudent: true});
      await this.setState({selectedPortalConsultant: false,
        selectedPortalSchool: false, selectedPortalParent: false});
    } else if (selectedPortal === 'consultant') {
        await this.setState({selectedPortalConsultant: true});
        await this.setState({selectedPortalStudent: false,
          selectedPortalSchool: false, selectedPortalParent: false});
      } else if (selectedPortal === 'school') {
        await this.setState({selectedPortalSchool: true});
        await this.setState({selectedPortalStudent: false,
          selectedPortalConsultant: false, selectedPortalParent: false});
      } else if (selectedPortal === 'parent') {
        await this.setState({selectedPortalParent: true});
        await this.setState({selectedPortalStudent: false,
          selectedPortalSchool: false, selectedPortalConsultant: false});
    }
  }catch (error) {
      console.log(error);
    }
  }

  _onDone = async () => {
    await this.setState({hasDoneOnboarding: true});
    await AsyncStorage.setItem('onboarding', JSON.stringify(true));
    console.log(this.state.hasDoneOnboarding);
  }

  _selectPortalStudent = async () => {
    await this.setState({selectedPortalStudent: true});
    await this.setState({selectedPortalConsultant: false,
      selectedPortalSchool: false, selectedPortalParent: false});
    await AsyncStorage.setItem('portal', 'student');
    console.log(this.state.selectedPortalStudent);
  }

  _selectPortalConsultant = async () => {
    await this.setState({selectedPortalConsultant: true});
    await this.setState({selectedPortalStudent: false,
      selectedPortalSchool: false, selectedPortalParent: false});
    await AsyncStorage.setItem('portal', 'consultant');
    console.log(this.state.selectedPortalConsultant);
  }

  _selectPortalParent = async () => {
    await this.setState({selectedPortalParent: true});
    await this.setState({selectedPortalStudent: false,
      selectedPortalSchool: false, selectedPortalConsultant: false});
    await AsyncStorage.setItem('portal', 'parent');
    console.log(this.state.selectedPortalParent);
  }

  _selectPortalSchool = async () => {
    await this.setState({selectedPortalSchool: true});
    await this.setState({selectedPortalStudent: false,
      selectedPortalConsultant: false, selectedPortalParent: false});
    await AsyncStorage.setItem('portal', 'school');
    console.log(this.state.selectedPortalSchool);
  }



  render() {
    if(this.state.hasDoneOnboarding && this.state.selectedPortalStudent) {
      console.log(this.state.hasDoneOnboarding);
      return (
        <StudentNav />
      );
    } else if(this.state.hasDoneOnboarding && this.state.selectedPortalConsultant) {
          console.log(this.state.hasDoneOnboarding);
          return (
            <ConsultantNav />
          );
        } else if(this.state.hasDoneOnboarding && this.state.selectedPortalSchool) {
              console.log(this.state.hasDoneOnboarding);
              return (
                <SchoolNav />
              );
        } else if(this.state.hasDoneOnboarding && this.state.selectedPortalParent) {
              console.log(this.state.hasDoneOnboarding);
              return (
                <ParentNav />
              );
            } else if (this.state.hasDoneOnboarding === null) {
              console.log("onboarding check " + this.state.hasDoneOnboarding);
        return (
            <pages.Onboarding onDone={this._onDone} />
        );
    } else {
      console.log("onboarding console log " + this.state.hasDoneOnboarding);
          return (
            <pages.SelectPortal
            selectPortalStudent={this._selectPortalStudent}
            selectPortalConsultant={this._selectPortalConsultant}
            selectPortalSchool={this._selectPortalSchool}
            selectPortalParent={this._selectPortalParent}/>
          );
        }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
