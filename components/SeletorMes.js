import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

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

export default function SeletorMes({
  mes,
  mesAtual,
  ano,
  voltarMes,
  avancarMes,
  selecionarMes,
}) {
  const [mostrarMeses, setMostrarMeses] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Pressable onPress={voltarMes}>
          <Text style={styles.seta}> ‹ </Text>
        </Pressable>

        <Pressable onPress={() => setMostrarMeses(!mostrarMeses)}>
          <Text style={styles.mes}>
            {" "}
            {mes} {ano}{" "}
          </Text>
        </Pressable>

        <Pressable onPress={avancarMes}>
          <Text style={styles.seta}> › </Text>
        </Pressable>
      </View>

      {mostrarMeses && ( //vai ser exibido quando mostraMes for verdadeiro
        <View style={styles.listaMeses}>
          {meses.map(
            (
              nomeMes,
              indice, //o .map percorre os meses e passa para a propriedade 'selecionarMes' o mes selecionado
            ) => (
              <Pressable
                style={styles.botaoMes}
                key={nomeMes}
                onPress={() => {
                  selecionarMes(indice);
                  setMostrarMeses(false);
                }}
              >
                <Text
                  style={[
                    styles.itemMes,
                    indice === mesAtual && styles.mesSelecionado,
                  ]}
                >
                  {" "}
                  {nomeMes}{" "}
                </Text>
              </Pressable>
            ),
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seta: {
    fontSize: 35,
    paddingHorizontal: 15,
  },
  mes: {
    fontSize: 20,
    fontWeight: "600",
  },
  mesSelecionado: {
    fontWeight: "bold",
    color: '#000',
  },
  listaMeses: {
    backgroundColor: "#6e6e6e", //"#ab4646"
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  itemMes: {
    padding: 12,
    textAlign: "center",
    color: '#fff',
  },
  botaoMes: {
    width: "50%",
  },
});
