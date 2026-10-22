// gráfico dos últimos meses.
import { View, Text, StyleSheet } from "react-native";

export default function GraficoGastosMensais( {dados = []} ){
  function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {style: "currency",currency: "BRL",maximumFractionDigits: 0,});
  }

  const maiorGasto = Math.max(
    ...dados.map((item) => Number(item.total) || 0),1
  )

  return(
    <View style={styles.container}>
      <Text style={styles.titulo}>Gastos mensais</Text>

      {dados.length === 0 ? (
        <Text style={styles.vazio}>Ainda não há dados para exibir</Text>
      ): (
        <View style={styles.grafico}>
          {dados.map((item, index)=> {
            const total = Number(item.total) || 0
            const altura = Math.max((total / maiorGasto) * 130, 4)

            return(
              <View style={styles.coluna} key={`${item.mes}-${index}`} >
                <Text style={styles.valor}> {formatarMoeda(total)} </Text>

                <View style={styles.areaBarra}>
                  <View style={[styles.barra,{ height: altura },]}></View>
                </View>

                <Text style={styles.mes}> {item.mes} </Text>
              </View>
            )
          })}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222222",
    marginBottom: 20,
  },
  grafico: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  coluna: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 2,
  },
  valor: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 6,
  },
  areaBarra: {
    height: 130,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  barra: {
    width: 22,
    backgroundColor: "#4778D0",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  mes: {
    fontSize: 11,
    color: "#444444",
    marginTop: 8,
  },
  vazio: {
    color: "#777777",
    paddingVertical: 15,
  },
});