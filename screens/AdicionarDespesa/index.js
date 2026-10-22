import { View, Text, Pressable, StyleSheet } from "react-native";

export default function AdicionarDespesa() {
  return(
    <View style={styles.container}>
      <Text style={styles.titulo}>Nova despesa</Text>
      <Text>Aqui vamos criar o cadastro da despesa</Text>
    </View>
  )
}

const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#f7f9fc", 
  },
  titulo: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 20, 
  }, 
});