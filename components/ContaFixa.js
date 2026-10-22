import { View, Text, Pressable, StyleSheet } from "react-native";

//o componente não sabe onde está os dados dessas props, ele apenas recebe essas informações
//vamos buscar da página DespesasFixas.js, lá importamos o ContaFixa

export default function ContaFixa({conta, estaPaga, alternarPagamento}){
  return(
    <View style={styles.conta}>
      <View>
        <Text style={[styles.nome, estaPaga && styles.nomePago]}> {conta.nome} </Text>
        <Text style={estaPaga ? styles.statusPago : styles.vencimento}> {estaPaga ? 'Pago' : `Vence em ${conta.vencimento}`} </Text>
      </View>

      <Text style={[styles.valor, estaPaga && styles.valorPago]}>R$ { conta.valor.toFixed(2) }</Text>

      <Pressable style={styles.checkbox} onPress={ ()=> alternarPagamento(conta.id) }>
        <Text>  {estaPaga ? '✓' : ''} </Text>
      </Pressable>

    </View>
  )
}

const styles = StyleSheet.create({
  conta: {
    backgroundColor: '#fff',
    padding: 18,
    marginBottom: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  nomePago: {
  textDecorationLine: 'line-through',
  opacity: 0.5,
  },
  valor: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  valorPago: {
    opacity: 0.5,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPago: {
    color: '#2e7d32',
  fontWeight: 'bold',
  },
  vencimento: {
    color: '#666',
  },
});