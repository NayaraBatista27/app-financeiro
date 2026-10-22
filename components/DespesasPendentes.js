// lista de contas ainda não pagas e botão Ver todas.
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../src/theme/colors";

export default function DespesasPendentes( {despesas, valorDaDespesa, aoVerTodas} ){

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {style: 'currency', currency: 'BRL'})
  }

  function renderizarDespesa( {item} ){
    return(
      <View style={styles.item}>
        <View style={styles.icone}>
  <MaterialCommunityIcons
    name="account-cash-outline"
    size={24}
    color={colors.verdeLimao}
  />
</View>

        <View style={styles.informacoes}>
          <Text style={styles.nome}> {item.nome} </Text>
          <Text style={styles.vencimento}>Vencimento dia {item.diaVencimento}</Text>
        </View>

        <Text style={styles.valor}> {formatarMoeda(valorDaDespesa(item))} </Text>
      </View>
    )
  }

  return(
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Despesas pendentes</Text>

        <Pressable onPress={aoVerTodas}>
          <Text style={styles.verTodas}>Ver todas →</Text>
        </Pressable>
      </View>

      {(despesas || []).length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.mensagemVazia}>Nenhuma despesa pendente nesse mês.</Text>
        </View>
      ): (
        <FlatList
          data={despesas || []}
          keyExtractor={(item)=> String(item.id)}
          renderItem={renderizarDespesa}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderColor: colors.grafite,

  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.texto,
    marginBottom: 16,
  },
  verTodas: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.verdeLimao,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.fundo,
    gap: 10,
  },
  icone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grafite,
    alignItems: "center",
    justifyContent: "center",
  },
/*   iconeTexto: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.texto,
  }, */
  informacoes: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.texto,
  },
  vencimento: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },
  valor: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.texto,
  },
  vazio: {
    paddingVertical: 24,
    alignItems: "center",
  },
  mensagemVazia: {
    fontSize: 16,
    color: colors.textoSecundario,
    textAlign: "center",
    marginTop: 20,
  },
});