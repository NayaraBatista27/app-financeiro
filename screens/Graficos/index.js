import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import SeletorMesInicio from "../../components/SeletorMesInicio";
import { LineChart } from "react-native-chart-kit";
import { useFinancas } from "../../context/FinancasContext";
import colors from "../../src/theme/colors";

import { criarChaveMes, despesaPertenceAoMes, valorDaParcela } from "../../utils/despesas";

const larguraTela = Dimensions.get("window").width;

const meses = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export default function Graficos() {
  const { despesas, entradas, setEntradas, mes, setMes, ano, setAno } = useFinancas();

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

  function calcularGastos(mesReferencia, anoReferencia) {
    const chaveMes = criarChaveMes(mesReferencia, anoReferencia);

    const despesasDoMes = despesas.filter((despesa) =>
      despesaPertenceAoMes(despesa, mesReferencia, anoReferencia),
    );

    return despesasDoMes.reduce(
      (total, despesa) => total + valorDaParcela(despesa, chaveMes),0,
    );
  }

  function calcularEntradas(mesReferencia, anoReferencia) {
    return entradas.filter((entrada) =>
      entrada.mes === mesReferencia && entrada.ano === anoReferencia,
    ).reduce((total, entrada) => total + Number(entrada.valor), 0);
  }

  function calcularSaldo(mesReferencia, anoReferencia) {
    return (
      calcularEntradas(mesReferencia, anoReferencia) -
      calcularGastos(mesReferencia, anoReferencia)
    );
  }

  const dadosGrafico = [];
  const dadosComparacao = [];

  for (let i = 5; i >= 0; i--) {
    const data = new Date(ano, mes - i, 1);
    const mesReferencia = data.getMonth();
    const anoReferencia = data.getFullYear();

    dadosComparacao.push({
      nome: meses[mesReferencia],
      entradas: calcularEntradas(mesReferencia, anoReferencia),
      despesas: calcularGastos(mesReferencia, anoReferencia),
    });

    dadosGrafico.push({
      nome: meses[mesReferencia],
      valor: calcularGastos(mesReferencia, anoReferencia),
    });
  }

  const totalAtual = calcularGastos(mes, ano);
  const entradasAtual = calcularEntradas(mes, ano);
  const saldoAtual = calcularSaldo(mes, ano);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gráficos</Text>
      
      <ScrollView>
        <View style={styles.cartao}>
          <Text style={styles.subtitulo}>Despesas por mês</Text>
          <Text style={styles.total}>
            {totalAtual.toLocaleString("pt-BR", {style: "currency",currency: "BRL",})}
          </Text>

          <Text style={styles.descricao}>Total gastos esse mês</Text>

          {/* <Text style={styles.subtitulo}>Saldo do mês</Text>

          <Text style={[styles.total,{ color: saldoAtual < 0 ? "#D32F2F" :"#2E7D32" },]}>
            {saldoAtual.toLocaleString("pt-BR", {style: "currency",currency: "BRL",})}
          </Text> */} 

          <LineChart
            data={{
              labels: dadosGrafico.map((item) => item.nome),
              datasets: [{data: dadosGrafico.map((item) => item.valor),},],
            }}
            width={larguraTela - 48}
            height={240}
            yAxisLabel="R$ "
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: colors.grafite,
              backgroundGradientFrom: colors.card,
              backgroundGradientTo:colors.grafite,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
              labelColor: (opacity = 1) => colors.textoSecundario,
              propsForDots: {
                r: "4",
                strokeWidth: "3",
                stroke: colors.verdeLimao,
              },
            }}
            bezier
            style={styles.grafico}
          />
        </View>

        <View style={styles.margin} />

        <SeletorMesInicio mes={mes} ano={ano} voltarMes={voltarMes} avancarMes={avancarMes} />

        <View style={styles.cartao}>
          <Text style={styles.subtitulo}>Entradas × Despesas</Text>
          <Text style={styles.descricao}>Comparativo dos últimos seis meses</Text>

          <View style={styles.graficoBarras}>
            {dadosComparacao.map((item, index) => {
              const maiorValor = Math.max(...dadosComparacao.map((mes) => Math.max(mes.entradas, mes.despesas)),1);

              return (
                <View key={`${item.nome}-${index}`} style={styles.grupoBarras}>
                  <View style={styles.barras}>

                    <View style={styles.colunaComValor}>
                      <Text style={styles.valorBarra}>
                        {item.entradas.toLocaleString("pt-BR", {notation: "compact", maximumFractionDigits: 1,})}
                      </Text>

                      <View style={[styles.barra,
                        {height: (item.entradas / maiorValor) * 170, backgroundColor:colors.verdeLimao,},]}
                      />
                    </View>


                    <View style={styles.colunaComValor}>
                      <Text style={styles.valorBarra}>
                        {item.despesas.toLocaleString("pt-BR", {notation: "compact", maximumFractionDigits: 1,})}
                      </Text>

                      <View style={[styles.barra,
                        {height: (item.despesas / maiorValor) * 170,backgroundColor: colors.laranja,},]}
                      />
                    </View>

                  </View>
                  <Text style={styles.mesBarra}>{item.nome}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.legenda}>
            <View style={styles.itemLegenda}>
              <View style={[styles.corLegenda, { backgroundColor: colors.verdeLimao }]} />
              <Text style={styles.legendaTexto}>Entradas</Text>
            </View>

            <View style={styles.itemLegenda}>
              <View style={[styles.corLegenda, { backgroundColor: colors.laranja }]} />
              <Text style={styles.legendaTexto}>Despesas</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fundo,
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 8,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 10,
    color: colors.texto,
  },
  cartao: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.texto,
    marginBottom: 20,
  },
  total: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.texto,
  },
  descricao: {
    color: colors.textoSecundario,
    fontSize: 15,
    marginBottom: 20,
  },
  grafico: {
    borderRadius: 12,
    marginLeft: -8,
    borderWidth: 1,
    borderColor: colors.grafite,
  },
  margin: {
    marginTop: 20,
    
    },
  legenda: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginTop: 12,

  },
  legendaTexto: {
    color: colors.textoSecundario,
  },
  itemLegenda: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,

    paddingVertical: 5,

  },
  corLegenda: {
    width: 12,
    height: 12,
    borderRadius: 2,


  },
  graficoBarras: {
    height: 205,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 30,
    paddingBottom: 8,
    paddingHorizontal: 4,
    //backgroundColor: '#a2cbe4',

  },
  grupoBarras: {
    //flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    //backgroundColor: '#eef3f8',

  },
  barras: {
    height: 150,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    //gap: 3,
    //backgroundColor: '#00ffb7',
    //width: 22,
  },
  barra: {
    width: 20,
    minHeight: 2,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: '#ffea00',

  },
  mesBarra: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textoSecundario,
    marginTop: 6,


  },
  colunaComValor: {
    alignItems: "center",
    justifyContent: "flex-end",
    //backgroundColor: '#ff001e',

  },
  valorBarra: {
    fontSize: 12,
    color: colors.texto,
    marginBottom: 10,

  },
});

