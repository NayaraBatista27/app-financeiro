import { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from "react-native";

import { useFinancas } from "../../context/FinancasContext";
import SeletorMesInicio from "../../components/SeletorMesInicio";
import ModalEntrada from "../../components/ModalEntrada";
import colors from "../../src/theme/colors";

export default function Entradas() {
  const { entradas, setEntradas, salvarEntradaNoFirestore, excluirEntradaNoFirestore, mes, setMes, ano, setAno } = useFinancas();

  const [mostrarModal, setMostrarModal] = useState(false)
  const [entradaSelecionada, setEntradaSelecionada] = useState(null)

  const entradasDoMes = entradas.filter((entrada) => entrada.mes === mes && entrada.ano === ano);
  const totalEntradas = entradasDoMes
  .reduce((total, entrada) => total + Number(entrada.valor), 0);
  
  function voltarMes() {
    if (mes === 0) {
      setMes(11);
      setAno(ano - 1);
    } else {
      setMes(mes - 1);
    }
  }

  function avancarMes() {
    if (mes === 11) {
      setMes(0);
      setAno(ano + 1);
    } else {
      setMes(mes + 1);
    }
  }

  function abrirMenuEntrada(entrada) {
    Alert.alert(
      entrada.descricao,
      "O que deseja fazer?",
      [
        {
          text: "Editar",
          onPress: function () {
            setEntradaSelecionada(entrada);
            setMostrarModal(true);
          },
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: function () {
            Alert.alert(
              "Excluir entrada",
              "Deseja realmente excluir esta entrada?",
              [
                {
                  text: "Cancelar",
                  style: "cancel",
                },
                {
                  text: "Excluir",
                  style: "destructive",
                  
                  onPress: async function () {
                    try {
                      await excluirEntradaNoFirestore(entrada.id);

                      setEntradas((entradasAtuais) =>
                        entradasAtuais.filter(
                          (item) => item.id !== entrada.id
                        )
                      );
                    } catch (erro) {
                      console.error("Erro ao excluir entrada:", erro);

                      Alert.alert(
                        "Erro",
                        "Não foi possível excluir a entrada. Tente novamente."
                      );
                    }
                  },

                },
              ]
            );
          },
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ]
    );
  }

  async function salvarEntrada(dadosEntrada) {
    try {
      if (entradaSelecionada) {
        const entradaAtualizada = {
          ...dadosEntrada,
          id: entradaSelecionada.id,
        };

        // Salvar a edição no Firestore
        await salvarEntradaNoFirestore(entradaAtualizada);

        // Atualizar a lista local
        setEntradas((entradasAtuais) =>
          entradasAtuais.map((entrada) =>
            entrada.id === entradaSelecionada.id
              ? entradaAtualizada
              : entrada
          )
        );
      } else {
        // Criar a entrada no Firestore e obter o ID
        const novoId = await salvarEntradaNoFirestore(dadosEntrada);

        // Adicionar à lista local com o ID correto
        setEntradas((entradasAtuais) => [
          ...entradasAtuais,
          { ...dadosEntrada, id: novoId },
        ]);
      }

      setEntradaSelecionada(null);
      setMostrarModal(false);
    } catch (erro) {
      console.error("Erro ao salvar entrada:", erro);

      Alert.alert(
        "Erro",
        "Não foi possível salvar a entrada. Verifique sua conexão e tente novamente."
      );
    }
  }

  function fecharModal() {
    setMostrarModal(false);
    setEntradaSelecionada(null);
  }

  function renderEntrada( {item} ){
    return (
      <Pressable
        style={styles.itemEntrada}
        onLongPress={() => abrirMenuEntrada(item)}
        delayLongPress={500}
      >
        <Text style={styles.descricao}>{item.descricao}</Text>

        <Text style={styles.valor}>
          {Number(item.valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
      </Pressable>
    );
  } 

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Entradas</Text>

      <View style={styles.resumo}>
        <Text style={styles.textoResumo}>Total de entradas esse mês</Text>
        <Text style={styles.valorResumo}>{totalEntradas.toLocaleString("pt-BR", {style: "currency",currency: "BRL"})} </Text>
      </View>

      <View style={styles.margin}></View>

      <SeletorMesInicio mes={mes} ano={ano} voltarMes={voltarMes} avancarMes={avancarMes} />

      <Text style={styles.subtitulo}>Lista de entradas</Text>

      <FlatList
        data={entradasDoMes}
        keyExtractor={(item)=> item.id.toString()}
        renderItem={renderEntrada}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text style={styles.mensagemVazia}>Nenhuma entrada cadastrada nesse mês.</Text>}
      />

      <Pressable
        style={styles.botaoAdicionar}
        onPress={() => {
          setEntradaSelecionada(null);
          setMostrarModal(true);
        }}
      >
        <Text style={styles.textoBotao}>+ Adicionar entrada</Text>
      </Pressable>

      <ModalEntrada
        visivel={mostrarModal}
        aoFechar={fecharModal}
        aoAdicionar={salvarEntrada}
        mes={mes}
        ano={ano}
        entradaParaEditar={entradaSelecionada}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fundo,
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 7,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 10,
    color: colors.texto,
  },
  resumo: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  textoResumo: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.texto,
    marginBottom: 20,
  },
  valorResumo: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.verdeLimao,
  },
  margin: {
    marginTop: 18,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.texto,
    marginVertical: 23,
  },
  lista: {
    paddingBottom: 12,
    flexGrow: 1,
  },
  itemEntrada: {
    backgroundColor: colors.card,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  descricao: {
    flex: 1,
    fontSize: 18,
    color: colors.texto,
  },
  valor: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.verdeLimao,
  },
  mensagemVazia: {
    fontSize: 16,
    color: colors.textoSecundario,
    textAlign: "center",
    marginTop: 20,
  },
  botaoAdicionar: {
    backgroundColor: colors.verdeLimao,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
  },
  textoBotao: {
    color: colors.fundo,
    fontSize: 16,
    fontWeight: "bold",
  }
});