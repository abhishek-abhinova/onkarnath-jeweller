import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Splash from './src/screens/Splash';
import Home from './src/screens/Home';
import Rates from './src/screens/Rates';
import Calculator from './src/screens/Calculator';
import Jewellery from './src/screens/Jewellery';
import ProductsList from './src/screens/ProductsList';
import ProductDetail from './src/screens/ProductDetail';
import Gallery from './src/screens/Gallery';
import About from './src/screens/About';
import Contact from './src/screens/Contact';

import { COLORS } from './src/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabBarIcon({ label, focused }) {
  const glyph = {
    'Home': '🏠',
    'Rates': '🪙',
    'Jewellery': '💍',
    'Gallery': '🖼',
    'Contact': '📞',
  }[label];
  return (
    <View style={styles.tabItem}>
      <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.55 }}>{glyph}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.maroon,
        tabBarInactiveTintColor: COLORS.charcoalSoft,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: 'rgba(201,148,44,0.3)',
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarIcon: (p) => <TabBarIcon label="Home" {...p} /> }} />
      <Tab.Screen name="Rates" component={Rates} options={{ tabBarIcon: (p) => <TabBarIcon label="Rates" {...p} /> }} />
      <Tab.Screen name="Jewellery" component={Jewellery} options={{ tabBarIcon: (p) => <TabBarIcon label="Jewellery" {...p} /> }} />
      <Tab.Screen name="Gallery" component={Gallery} options={{ tabBarIcon: (p) => <TabBarIcon label="Gallery" {...p} /> }} />
      <Tab.Screen name="Contact" component={Contact} options={{ tabBarIcon: (p) => <TabBarIcon label="Contact" {...p} /> }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.maroon },
        headerTintColor: COLORS.goldLight,
        headerTitleStyle: { fontSize: 15, fontWeight: '700' },
        contentStyle: { backgroundColor: COLORS.ivory },
      }}
    >
      <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="ProductsList" component={ProductsList} options={({ route }) => ({ title: route.params?.title || 'Jewellery' })} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} options={({ route }) => ({ title: route.params?.product?.name || 'Product' })} />
      <Stack.Screen name="Calculator" component={Calculator} options={{ title: 'Rate Calculator' }} />
      <Stack.Screen name="About" component={About} options={{ title: 'About Us' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={COLORS.maroon} />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center' },
  tabLabel: { fontSize: 9, fontWeight: '600', marginTop: 1, color: COLORS.charcoalSoft },
  tabLabelActive: { color: COLORS.maroon, fontWeight: '800' },
});