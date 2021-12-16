import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Welcome from '../pages/Welcome';
import Login from '../pages/Login'
import Chats from '../pages/Chats';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { View, Image, StatusBar, Touchable, TouchableOpacity, Text } from 'react-native';
import Home from '../pages/Home';
import CustomDrawerContent from './CustomDrawerContent';
import Property from '../pages/Property';
import Clients from '../pages/Clients';
import Visits from '../pages/Visits';
import Profil from '../pages/Profil';
import ChatRoom from '../pages/ChatRoom';
import ChatSetting from '../pages/ChatSetting';
import PropertyDetails from '../pages/PropertyDetails';
import AddProperty from '../pages/AddProperty';
import AddClient from '../pages/AddClient';
import ClientDetails from '../pages/ClientDetails';
import AddVisit from '../pages/AddVisit';
import Tasks from '../pages/Tasks';
import Map from '../pages/Map';
import AddTask from '../pages/AddTask';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function AppNavigator() {
    
    return (
        <>
            <StatusBar backgroundColor="grey" />
            <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="Auth" component={Auth} />
                <Stack.Screen name="Drawer" component={DrawerNavigation} />
                <Stack.Screen name="Chat" component={Chat} />
            </Stack.Navigator>
        </>
    );
}



function Auth() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
    );
}
function Chat() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="AllChats" component={Chats} />
            <Stack.Screen name="ChatRoom" component={ChatRoom} />
            <Stack.Screen name="ChatSetting" component={ChatSetting} />
        </Stack.Navigator>
    );
}
function PropertyStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        //headerMode="none"
        >
            <Stack.Screen name="Property" component={Property} />
            <Stack.Screen name="PropertyDetails" component={PropertyDetails} />
            <Stack.Screen name="AddProperty" component={AddProperty} />
        </Stack.Navigator>
    );
}
function ClientsStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        //headerMode="none"
        >
            <Stack.Screen name="Clients" component={Clients} />
            <Stack.Screen name="ClientDetails" component={ClientDetails} />
            <Stack.Screen name="AddClient" component={AddClient} />
        </Stack.Navigator>
    );
}
function VisitsStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        //headerMode="none"
        >
            <Stack.Screen name="Visits" component={Visits} />
            <Stack.Screen name="VisitDetails" component={Map} />
            <Stack.Screen name="AddVisit" component={AddVisit} />
        </Stack.Navigator>
    );
}
function TasksStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        //headerMode="none"
        >
            <Stack.Screen name="Tasks" component={Tasks} />
            <Stack.Screen name="AddTask" component={AddTask} />
        </Stack.Navigator>
    );
}

function DrawerNavigation() {
    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawerContent {...props} />
            }
            initialRouteName="Home"
            screenOptions={{
                drawerType: "back",
                headerShown: false
            }}
        >
            <Drawer.Screen options name="Home" component={Home} />
            <Drawer.Screen name="PropertyStack" component={PropertyStack} />
            <Drawer.Screen name="ClientsStack" component={ClientsStack} />
            <Drawer.Screen name="VisitsStack" component={VisitsStack} />
            <Drawer.Screen name="Profil" component={Profil} />
            <Drawer.Screen name="TasksStack" component={TasksStack} />
        </Drawer.Navigator>
    );
}


export default AppNavigator;