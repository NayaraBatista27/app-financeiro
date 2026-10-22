import { View, Text, Pressable, StyleSheet } from "react-native";
import colors from "../src/theme/colors";

export default function ItemDespesa({
  despesa,
  estaPaga,
  alternarPagamento,
  abrirMenuDespesa,
  numeroParcela,
  valorExibido,
}) {

  return (
    <Pressable
      style={styles.despesa}
      onLongPress={() => abrirMenuDespesa(despesa)}
    >
      <View>
        <Text style={styles.nomeDespesa}>{despesa.nome}
        </Text>

        {numeroParcela && (
          <Text style={styles.parcela}>Parcela {numeroParcela} / {despesa.quantidadeParcelas}</Text>
        )}

        <Text style={styles.vencimento}>Vencimento dia: {despesa.diaVencimento}
        </Text>
      </View>

      <View style={styles.ladoDireito}>
        <Text style={styles.valorDespesa}>{Number(valorExibido).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}</Text>

        <Pressable
          style={styles.checkbox}
          onPress={() => alternarPagamento(despesa.id)}
        >
          <Text style={styles.checkboxTexto}>
            {estaPaga ? "✓" : ""}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  ); 
}

const styles = StyleSheet.create({
  despesa: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nomeDespesa: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.texto,
  },
  parcela: {
    fontSize: 15,
    color: colors.textoSecundario,
  },
  vencimento: {
    marginTop: 6,
    fontSize: 15,
    color: colors.textoSecundario,
  },
  valorDespesa: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.laranja,
  },
  ladoDireito: {
    width: 100,
    alignItems: "flex-end",
    gap: 8,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: colors.laranja,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.texto,
  },
});