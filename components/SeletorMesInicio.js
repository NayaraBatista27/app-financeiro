// seleção do mês e do ano exibidos no painel.
import { View, Text, Pressable, StyleSheet } from "react-native";
import colors from "../src/theme/colors";

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function SeletorMesInicio( {mes, ano, voltarMes, avancarMes} ) {
  return(
    <View style={styles.container}>
      <Pressable style={styles.botao} onPress={voltarMes}>
        <Text style={styles.seta}> ‹ </Text>
      </Pressable>

      <View style={styles.periodo}>
        <Text style={styles.mes}> {meses[mes]} {ano} </Text>
        <Text style={styles.subtitulo}>Período selecionado</Text>
      </View>

      <Pressable style={styles.botao} onPress={avancarMes}>
        <Text style={styles.seta}> › </Text>
      </Pressable>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    //alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.grafite,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  botao: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  seta: {
    fontSize: 36,
    color: colors.texto,
  },
  periodo: {
//flex: 1,
    alignItems: "center",
  },
  mes: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.texto,
  },
  subtitulo: {
    color: colors.textoSecundario,
    fontSize: 15,
    marginTop: 6,
  },
})