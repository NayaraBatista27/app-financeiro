import { StatusBar, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { FinancasProvider } from "./context/FinancasContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Auth from "./screens/Auth";
import Home from "./screens/Home";
import Entradas from "./screens/Entradas";
import Despesas from "./screens/Despesas";
import Graficos from "./screens/Graficos";

import colors from "./src/theme/colors";

const Tab = createBottomTabNavigator();

function ConteudoApp() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.fundo,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color={colors.verdeLimao}
        />
      </View>
    );
  }

  if (!usuario) {
    return <Auth />;
  }

  const icones = {
    Inicio: "home-variant-outline",
    Entradas: "trending-up",
    Despesas: "invoice-text-outline",
    Graficos: "chart-bar",
  };

  return (
    <FinancasProvider>
      <NavigationContainer>
        <StatusBar
          backgroundColor={colors.fundo}
          barStyle="light-content"
        />

        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: false,

            tabBarStyle: {
              position: "static",
              height: 66,
              backgroundColor: colors.fundo,
              borderTopWidth: 1,
              borderColor: colors.grafite,
              paddingTop: 10,
            },

            tabBarItemStyle: {
              height: 56,
              justifyContent: "center",
              alignItems: "center",
            },

            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  width: 80,
                  height: 40,
                  borderRadius: 26,
                  backgroundColor: focused
                    ? colors.verdeLimao
                    : "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name={icones[route.name]}
                  size={27}
                  color={
                    focused ? colors.grafite : colors.verdeLimao
                  }
                />
              </View>
            ),
          })}
        >
          <Tab.Screen name="Inicio" component={Home} />
          <Tab.Screen name="Entradas" component={Entradas} />
          <Tab.Screen name="Despesas" component={Despesas} />
          <Tab.Screen name="Graficos" component={Graficos} />
        </Tab.Navigator>
      </NavigationContainer>
    </FinancasProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ConteudoApp />
    </AuthProvider>
  );
}
