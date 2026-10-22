import { View, Text, StyleSheet } from "react-native";
import colors from "../src/theme/colors";
import { LinearGradient } from "expo-linear-gradient";

// card tela inicio Saldo do mês, Entradas e Gastos
export default function ResumoFinanceiro( {totalEntradas, totalGastos} ) {
  function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {style: 'currency', currency: 'BRL'})
  }
  const saldo = totalEntradas - totalGastos
  const saldoPositivo = saldo >= 0

  return(
    <View style={styles.container}>
      <LinearGradient style={styles.cartaoSaldo}
        colors={ saldoPositivo  ? [colors.card, colors.verdeLimaoGrad] : [colors.card, colors.laranjaGrad] }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.rotulo}>Saldo do mês</Text>

        <Text style={[styles.valorSaldo, {color: saldoPositivo? colors.verdeLimao : colors.laranja} ]}> 
          {formatarMoeda(saldo)} 
        </Text>

        <Text style={styles.descricao}>Entradas menos gastos</Text>
      </LinearGradient >

      <View style={styles.linhaCartoes}>
        <View style={styles.cartao}>
          <Text style={styles.rotulo}>Entradas</Text>
          <Text style={[styles.valor, styles.entrada]}> {formatarMoeda(totalEntradas)} </Text>
        </View>

        <View style={styles.cartao}>
          <Text style={styles.rotulo}>Gastos</Text>
          <Text style={[styles.valor, styles.gasto]}> {formatarMoeda(totalGastos)} </Text>
        </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingTop: 16,
  },
  cartaoSaldo: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  rotulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.texto,
    marginBottom: 20,
  },
  valorSaldo: {
    fontSize: 28,
    fontWeight: "bold",
  },
  descricao: {
    color: colors.textoSecundario,
    fontSize: 15,
  },
  linhaCartoes: {
    flexDirection: "row",
    gap: 12,
  },
  cartao: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.grafite,
  },
  valor: {
    fontSize: 18,
    fontWeight: "bold",
  },
  entrada: {
    color: colors.verdeLimao,
  },
  gasto: {
    color: colors.laranja,
  },
});