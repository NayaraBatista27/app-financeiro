import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useFinancas } from "../../context/FinancasContext";

import ResumoFinanceiro from "../../components/ResumoFinanceiro";
import SeletorMesInicio from "../../components/SeletorMesInicio";
import DespesasPendentes from "../../components/DespesasPendentes";
import ModalUsuario from "../../components/ModalUsuario";
import { Feather } from "@expo/vector-icons";
import colors from "../../src/theme/colors";

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

export default function Home( {navigation} ) {
  const {mes, setMes, ano, setAno} = useFinancas()
  const {despesas, despesasPagas, entradas, setEntradas} = useFinancas();
  const [modalUsuario, setModalUsuario] = useState(false);

  const chaveMes = `${ano}-${String(mes + 1).padStart(2, "0")}`

  function despesaPertenceAoMes(despesa) {
    const inicio = despesa.anoInicio * 12 + despesa.mesInicio
    const atual = ano * 12 + mes;
    const diferenca = atual - inicio;

    if (diferenca < 0) return false;
    if (despesa.tipo === "unica") return diferenca === 0
    if (despesa.tipo === "recorrente") return true

    if (despesa.tipo === "parcelada") {
      return diferenca < Number(despesa.quantidadeParcelas)
    }

    return false;
  }

  function valorDaDespesa(despesa) {
    if (despesa.tipo === "recorrente") {
      return Number(despesa.historicoValores?.[chaveMes] ?? despesa.valor)
    }
    if (despesa.tipo === "parcelada") {
      if (despesa.parcelas) {
        const parcela = despesa.parcelas.find((item) => item.mes === chaveMes)
        return parcela ? Number(parcela.valor) : 0
      }
      return Number(despesa.valor) / Number(despesa.quantidadeParcelas)
    }
    return Number(despesa.valor)
  }

  const despesasDoMes = despesas.filter(despesaPertenceAoMes)
  const pagamentosDoMes = despesasPagas[chaveMes] || []

  const despesasPendentes = despesasDoMes.filter((despesa)=> !pagamentosDoMes.includes(despesa.id))

  const totalGastos = despesasDoMes.reduce((total, despesa) => total + valorDaDespesa(despesa),0)
  const totalEntradas = entradas
    .filter((entrada) => entrada.mes === mes && entrada.ano === ano)
    .reduce((total, entrada) => total + Number(entrada.valor), 0)

  function voltarMes() {
    if(mes === 0) {
      setMes(11)
      setAno(ano -1)
    }else{
      setMes(mes -1)
    }
  }

  function avancarMes(){
    if(mes === 11){
      setMes(0)
      setAno(ano + 1)
    }else{
      setMes(mes + 1)
    }
  }

  return(
    <View style={styles.container}>

      <View style={styles.cabecalho}>
        <View style={styles.linhaTitulo}>
          <Text style={styles.titulo}>Minhas Finanças</Text>

          <Pressable onPress={() => setModalUsuario(true)}>
            <Feather name="user" size={26} color={colors.verdeLimao} />
          </Pressable>
        </View>

        <ResumoFinanceiro
          totalEntradas={totalEntradas}
          totalGastos={totalGastos}
        />

        {/* <Text style={styles.subtitulo}>Resumo de {meses[mes]} de {ano}</Text> */}
        <SeletorMesInicio mes={mes} ano={ano} voltarMes={voltarMes} avancarMes={avancarMes} />
      </View> 

      <ModalUsuario visivel={modalUsuario} fechar={()=>setModalUsuario(false)}  />

      <View style={styles.areaDespesas}>
        <DespesasPendentes despesas={despesasPendentes} valorDaDespesa={valorDaDespesa} aoVerTodas={()=> navigation.navigate("Despesas")} />
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fundo,
    paddingHorizontal: 16,
    paddingVertical: 30,
  },
  areaDespesas: {
    flex: 1,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 10,
    color: colors.texto,
  },
  linhaTitulo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
},
  /* subtitulo: {
    fontSize: 18,
    color: "#666666",
    marginTop: 20,
  }, */
});