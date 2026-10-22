import { useState, useEffect } from "react";
import { View, Text, Modal, TextInput, Pressable, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";

export default function ModalEntrada({visivel, aoFechar, aoAdicionar, mes, ano, entradaParaEditar}) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  const modoEdicao = Boolean(entradaParaEditar);

  useEffect( ()=>{
    if(visivel && entradaParaEditar){
      setDescricao(entradaParaEditar.descricao)
      setValor(String(entradaParaEditar.valor).replace(".", ","))
    }else if(visivel){
      setDescricao("")
      setValor("")
    }
  },[visivel, entradaParaEditar] )

  function limparCampos() {
    setDescricao("");
    setValor("");
  }

  function salvarEntrada() {
    const valorNumerico = Number(valor.replace(",", "."));

    if (!descricao.trim()) {
      Alert.alert("Atenção", "Informe a descrição da entrada.");
      return;
    }
    if (!valor.trim() || !Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      Alert.alert("Atenção", "Informe um valor válido.");
      return;
    }

    const dadosEntrada = {
      id: entradaParaEditar?.id ?? String(Date.now()),
      descricao: descricao.trim(),
      valor: valorNumerico,
      mes: entradaParaEditar?.mes ?? mes,
      ano: entradaParaEditar?.ano ?? ano,
    };

    aoAdicionar(dadosEntrada);
    limparCampos();
    aoFechar();
  }

  function fecharModal() {
    limparCampos();
    aoFechar();
  }

  return (
    <Modal
      visible={visivel}
      transparent={true}
      animationType="fade"
      onRequestClose={fecharModal}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <View style={styles.fundo}>
          <TouchableWithoutFeedback>

            <View style={styles.modal}>
              <Text style={styles.titulo}>{modoEdicao ? "Editar entrada" : "Adicione uma entrada"}</Text>
              <Text style={styles.mes}>Referente a:{" "}{
                String((entradaParaEditar?.mes ?? mes) + 1).padStart(2, "0")}/{entradaParaEditar?.ano ?? ano}
              </Text>

              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex.: Salário"
                value={descricao}
                onChangeText={setDescricao}
                maxLength={60}
              />

              <Text style={styles.label}>Valor (R$)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex.: 2500,00"
                value={valor}
                onChangeText={setValor}
                keyboardType="decimal-pad"
              />

              <View style={styles.botoes}>
                <Pressable style={[styles.botao, styles.botaoCancelar]} onPress={fecharModal}>
                  <Text style={styles.textoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable style={[styles.botao, styles.botaoSalvar]} onPress={salvarEntrada}>
                  <Text style={styles.textoSalvar}>{modoEdicao ? "  Salvar  " : "Adicionar"}</Text>
                </Pressable>
              </View>

            </View>
          </TouchableWithoutFeedback>

        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },
  titulo: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#222222",
  },
  mes: {
    fontSize: 13,
    color: "#777777",
    marginTop: 6,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 16,
    marginBottom: 16,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  botao: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  botaoCancelar: {
    backgroundColor: "#EEEEEE",
  },
  botaoSalvar: {
    backgroundColor: "#4778D0",
  },
  textoCancelar: {
    color: "#333333",
    fontWeight: "600",
  },
  textoSalvar: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
