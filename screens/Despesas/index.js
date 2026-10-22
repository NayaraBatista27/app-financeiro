import { useState } from "react";
import {View, Text, FlatList, Pressable, StyleSheet, Modal, Alert} from "react-native";

import { useFinancas } from "../../context/FinancasContext";

//import SeletorMes from "../../components/SeletorMes";
import SeletorMesInicio from "../../components/SeletorMesInicio";
import ModalDespesa from "../../components/ModalDespesa";
import ItemDespesa from "../../components/ItemDespesa";
import colors from "../../src/theme/colors";

import { criarChaveMes, despesaPertenceAoMes, numeroDaParcela, valorDaParcela } from "../../utils/despesas";

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

export default function Despesas() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const {
    despesas,
    setDespesas,
    despesasPagas,
    setDespesasPagas,
    mes,
    setMes,
    ano,
    setAno,
    salvarDespesaNoFirestore,
    excluirDespesaNoFirestore,
    salvarPagamentosNoFirestore
  } = useFinancas();
  const [despesaSelecionada, setDespesaSelecionada] = useState(null);

  function voltarMes()  {
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

  /* function selecionarMes(indice) {
    setMes(indice);
  } */

  const chaveMes = criarChaveMes(mes, ano);

  const despesasDoMes = despesas.filter((despesa) =>
    despesaPertenceAoMes(despesa, mes, ano)
  );

  const total = despesasDoMes.reduce((soma, despesa) => soma + valorDaParcela(despesa, chaveMes),0);

  const pagamentosDoMes = despesasPagas[chaveMes] || [];

  const totalPago = despesasDoMes
    .filter((despesa) => pagamentosDoMes.includes(despesa.id))
    .reduce((soma, despesa) => soma + valorDaParcela(despesa, chaveMes),0);

  const totalFalta = total - totalPago;

  // controla o cadastro e edição das despesas comuns, recorrentes e parceladas
  
  async function receberDespesa(dados) {
    try {
      // Caso 1: cadastrar uma nova despesa
      if (!despesaSelecionada) {
        const {
          modoEdicao,
          mesSelecionado,
          valorParcelaEditada,
          ...novaDespesa
        } = dados;

        // Salvar no Firestore e receber o ID gerado
        const novoId = await salvarDespesaNoFirestore(novaDespesa);

        // Atualizar a lista local somente após salvar
        setDespesas((estadoAtual) => [
          ...estadoAtual,
          { ...novaDespesa, id: novoId },
        ]);

        setDespesaSelecionada(null);
        setMostrarModal(false);
        return;
      }

      // Encontrar a despesa que está sendo editada
      const despesaAtual = despesas.find(
        (despesa) => despesa.id === despesaSelecionada.id,
      );

      if (!despesaAtual) {
        throw new Error("Despesa não encontrada.");
      }

      let despesaAtualizada;

      // Caso 2: editar somente a parcela do mês selecionado
      if (dados.modoEdicao === "parcela") {
        despesaAtualizada = {
          ...despesaAtual,
          nome: dados.nome,
          diaVencimento: dados.diaVencimento,
          parcelas: despesaAtual.parcelas.map((parcela) =>
            parcela.mes === dados.mesSelecionado
              ? {
                  ...parcela,
                  valor: dados.valorParcelaEditada,
                }
              : parcela,
          ),
        };
      }

      // Caso 3: editar a compra parcelada inteira
      else if (
        dados.modoEdicao === "compra" &&
        despesaAtual.tipo === "parcelada"
      ) {
        const {
          modoEdicao,
          mesSelecionado,
          valorParcelaEditada,
          ...dadosSalvos
        } = dados;

        const parcelasAnteriores = despesaAtual.parcelas.filter(
          (parcela) => parcela.mes < dados.mesSelecionado,
        );

        const parcelasFuturas = dados.parcelas.filter(
          (parcela) => parcela.mes >= dados.mesSelecionado,
        );

        despesaAtualizada = {
          ...despesaAtual,
          ...dadosSalvos,
          id: despesaAtual.id,
          parcelas: [...parcelasAnteriores, ...parcelasFuturas],
        };
      }

      // Caso 4: editar uma despesa recorrente ou outra despesa
      else {
        const {
          modoEdicao,
          mesSelecionado,
          valorParcelaEditada,
          ...dadosSalvos
        } = dados;

        if (despesaAtual.tipo === "recorrente") {
          const historico = {
            ...(despesaAtual.historicoValores || {}),
          };

          const inicio =
            despesaAtual.anoInicio * 12 + despesaAtual.mesInicio;

          const selecionado =
            Number(dados.mesSelecionado.slice(0, 4)) * 12 +
            Number(dados.mesSelecionado.slice(5, 7)) -
            1;

          // Preservar o valor antigo nos meses anteriores
          for (let indice = inicio; indice < selecionado; indice++) {
            const data = new Date(
              Math.floor(indice / 12),
              indice % 12,
              1,
            );

            const chave = `${data.getFullYear()}-${String(
              data.getMonth() + 1,
            ).padStart(2, "0")}`;

            if (historico[chave] === undefined) {
              historico[chave] = despesaAtual.valor;
            }
          }

          despesaAtualizada = {
            ...despesaAtual,
            ...dadosSalvos,
            id: despesaAtual.id,
            historicoValores: historico,
          };
        } else {
          despesaAtualizada = {
            ...despesaAtual,
            ...dadosSalvos,
            id: despesaAtual.id,
          };
        }
      }

      // Salvar a edição no Firestore
      await salvarDespesaNoFirestore(despesaAtualizada);

      // Atualizar a lista local após o salvamento
      setDespesas((estadoAtual) =>
        estadoAtual.map((despesa) =>
          despesa.id === despesaAtualizada.id
            ? despesaAtualizada
            : despesa,
        ),
      );

      setDespesaSelecionada(null);
      setMostrarModal(false);
    } catch (erro) {
      console.error("Erro ao salvar despesa:", erro);

      Alert.alert(
        "Erro",
        "Não foi possível salvar a despesa. Verifique sua conexão e tente novamente.",
      );
    }
  }


  // responsável por marcar ou desmarcar uma despesa como paga
  
  async function alternarPagamento(id) {
    // Calcular o novo estado dos pagamentos
    const pagamentosAtuais = despesasPagas[chaveMes] || [];

    const novoEstado = pagamentosAtuais.includes(id)
      ? {
          ...despesasPagas,
          [chaveMes]: pagamentosAtuais.filter((item) => item !== id),
        }
      : {
          ...despesasPagas,
          [chaveMes]: [...pagamentosAtuais, id],
        };

    try {
      // Salvar no Firestore
      await salvarPagamentosNoFirestore(novoEstado);

      // Atualizar a interface após salvar
      setDespesasPagas(novoEstado);
    } catch (erro) {
      console.error("Erro ao salvar pagamento:", erro);

      Alert.alert(
        "Erro",
        "Não foi possível atualizar o pagamento. Tente novamente.",
      );
    }
  }


  // responsável por excluir uma despesa do aplicativo
  
  async function excluirDespesa(id) {
    try {
      // 1. Excluir a despesa do Firestore
      await excluirDespesaNoFirestore(id);

      // 2. Remover a despesa da lista local
      setDespesas((estadoAtual) =>
        estadoAtual.filter((despesa) => despesa.id !== id),
      );

      // 3. Remover os pagamentos associados à despesa
      const novoEstado = {};

      Object.keys(despesasPagas).forEach((mes) => {
        novoEstado[mes] = despesasPagas[mes].filter(
          (despesaId) => despesaId !== id,
        );
      });

      setDespesasPagas(novoEstado);

      // 4. Salvar os pagamentos atualizados no Firestore
      await salvarPagamentosNoFirestore(novoEstado);

      setDespesaSelecionada(null);
    } catch (erro) {
      console.error("Erro ao excluir despesa:", erro);

      Alert.alert(
        "Erro",
        "Não foi possível excluir a despesa. Tente novamente.",
      );
    }
  }


  // mostra o menu para editar ou excluir ao pressionar uma despesa por alguns instantes
  function abrirMenuDespesa(despesa) {
    function editarDespesa(modo) {
      setDespesaSelecionada({ ...despesa, modoEdicao: modo });
      setMostrarModal(true);
    }

    const opcoes = [
      {
        text: "Excluir despesa",
        style: "destructive",
        onPress: () => {
          Alert.alert(
            "Excluir despesa",
            `Deseja excluir a despesa "${despesa.nome}"?`,
            [
              { text: "Não", style: "cancel" },
              {
                text: "Sim",
                style: "destructive",
                onPress: () => excluirDespesa(despesa.id),
              },
            ],
          );
        },
      },
    ];

    if (despesa.tipo === "parcelada") {
      opcoes.push(
        {
          text: "Editar compra inteira",
          onPress: () => editarDespesa("compra"),
        },
        {
          text: "Editar esta parcela",
          onPress: () => editarDespesa("parcela"),
        },
      );
    } else {
      opcoes.push({ text: "Editar", onPress: () => editarDespesa("compra") });
    }
    Alert.alert(despesa.nome, "O que deseja fazer?", opcoes, {
      cancelable: true,
      onDismiss: () => {
        console.log("Menu fechado");
      },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Despesas</Text>

      <View style={styles.resumo}>
        <Text style={styles.resumoTitulo}>Resumo do mês</Text>

        <Text style={styles.valorTotalResumo}>{total.toLocaleString("pt-BR", {style: "currency",currency: "BRL"})}</Text>

        <Text style={styles.valorPagoResumo}>Pagas: {totalPago.toLocaleString("pt-BR", {style: "currency",currency: "BRL"})}</Text>

        <Text style={styles.valorFaltaResumo}>Restante: {totalFalta.toLocaleString("pt-BR", {style: "currency",currency: "BRL"})}</Text>
      </View>

      {/* <SeletorMes
        mes={meses[mes]}
        mesAtual={mes}
        ano={ano}
        voltarMes={voltarMes}
        avancarMes={avancarMes}
        selecionarMes={selecionarMes}
      /> */}

      <View style={styles.margin} />
      <SeletorMesInicio mes={mes} ano={ano} voltarMes={voltarMes} avancarMes={avancarMes} />

      <FlatList
        data={despesasDoMes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {const estaPaga = pagamentosDoMes.includes(item.id);
          

          return (
            <ItemDespesa
              despesa={item}
              estaPaga={estaPaga}
              alternarPagamento={alternarPagamento}
              abrirMenuDespesa={abrirMenuDespesa}
              numeroParcela={numeroDaParcela(item, mes, ano)}
              valorExibido={valorDaParcela(item, chaveMes)}
            />
          );
        }}
        ListEmptyComponent={<Text style={styles.mensagemVazia}>Nenhuma despesa cadastrada nesse mês.</Text>}
      />

      <Modal visible={mostrarModal} transparent={true} animationType="slide">
        <ModalDespesa
          fecharModal={() => setMostrarModal(false)}
          adicionarDespesa={receberDespesa}
          despesaParaEditar={despesaSelecionada}
          mesInicio={mes}
          anoInicio={ano}
          mesSelecionado={`${ano}-${String(mes + 1).padStart(2, "0")}`}
        />
      </Modal>

      <Pressable
        style={styles.botaoAdicionar}
        onPress={() => setMostrarModal(true)}
      >
        <Text style={styles.textoBotao}>+ Adicionar despesa</Text>
      </Pressable>
    </View>
  );
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
  resumoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.texto,
    marginBottom: 20,
  },
  valorTotalResumo: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.laranja,
    marginBottom: 10,
  },
  valorPagoResumo: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.verdeLimao,
    marginBottom: 5,
  },
  valorFaltaResumo: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.texto,
  },
  margin: {
    marginTop: 18,
  },
  mensagemVazia: {
    fontSize: 16,
    color: colors.textoSecundario,
    textAlign: "center",
    marginTop: 20,
  },
  botaoAdicionar: {
    backgroundColor: colors.laranja,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
  },
  textoBotao: {
    color: colors.fundo,
    fontSize: 16,
    fontWeight: "bold",
  },
});
