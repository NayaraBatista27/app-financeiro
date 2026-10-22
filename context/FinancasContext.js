import { createContext, useContext, useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../src/firebase";
import { useAuth } from "./AuthContext";

const FinancasContext = createContext(null)

const despesasIniciais = [
/*   {
    id: 1,
    nome: "Aluguel",
    valor: 1500,
    tipo: "recorrente",
    diaVencimento: 5,
    mesInicio: 9,
    anoInicio: 2026,
  },
  {
    id: 2,
    nome: "Mercado",
    valor: 250,
    tipo: "unica",
    diaVencimento: 12,
    mesInicio: 9,
    anoInicio: 2026,
  }, */
];

export function FinancasProvider( {children} ){
  const { usuario } = useAuth();
  const [despesas, setDespesas] = useState(despesasIniciais);
  const [despesasPagas, setDespesasPagas] = useState({});
  const [entradas, setEntradas] = useState([]);
  const [mes, setMes] = useState(9);
  const [ano, setAno] = useState(2026);

  useEffect(() => {
    async function carregarFinancas() {
      if (!usuario) return;

      try {
        const uid = usuario.uid;

        const despesasRef = collection(
          db, "usuarios", uid, "despesas"
        );

        const entradasRef = collection(
          db, "usuarios", uid, "entradas"
        );

        const [despesasSnapshot, entradasSnapshot] =
          await Promise.all([
            getDocs(despesasRef),
            getDocs(entradasRef),
          ]);

        const listaDespesas = despesasSnapshot.docs.map(
          (documento) => ({
            id: documento.id,
            ...documento.data(),
          })
        );

        const listaEntradas = entradasSnapshot.docs.map(
          (documento) => ({
            id: documento.id,
            ...documento.data(),
          })
        );

        const pagamentosRef = doc(
          db, "usuarios", uid, "pagamentos", "status"
        );

        const pagamentosSnapshot = await getDoc(pagamentosRef);

        setDespesas(listaDespesas);
        setEntradas(listaEntradas);
        setDespesasPagas(
          pagamentosSnapshot.exists()
            ? pagamentosSnapshot.data()
            : {}
        );
      } catch (erro) {
        console.error("Erro ao carregar finanças:", erro);
      }
    }

    carregarFinancas();
  }, [usuario]);

  // Salvar uma despesa nova ou atualizar uma existente
  async function salvarDespesaNoFirestore(despesa) {
    if (!usuario) {
      throw new Error("Usuário não autenticado.");
    }

    const { id, ...dadosDespesa } = despesa;

    if (id) {
      await setDoc(
        doc(db, "usuarios", usuario.uid, "despesas", String(id)),
        dadosDespesa
      );

      return String(id);
    }

    const referencia = await addDoc(
      collection(db, "usuarios", usuario.uid, "despesas"),
      dadosDespesa
    );

    return referencia.id;
  }
  
  async function salvarEntradaNoFirestore(entrada) {
    if (!usuario) {
      throw new Error("Usuário não autenticado.");
    }

    const { id, ...dadosEntrada } = entrada;

    if (id) {
      await setDoc(
        doc(db, "usuarios", usuario.uid, "entradas", String(id)),
        dadosEntrada
      );

      return String(id);
    }

    const referencia = await addDoc(
      collection(db, "usuarios", usuario.uid, "entradas"),
      dadosEntrada
    );

    return referencia.id;
  }

  // Excluir uma despesa do Firestore
  async function excluirDespesaNoFirestore(id) {
    if (!usuario) {
      throw new Error("Usuário não autenticado.");
    }

    await deleteDoc(
      doc(db, "usuarios", usuario.uid, "despesas", String(id))
    );
  }

  async function excluirEntradaNoFirestore(id) {
    if (!usuario) {
      throw new Error("Usuário não autenticado.");
    }

    await deleteDoc(
      doc(db, "usuarios", usuario.uid, "entradas", String(id))
    );
  }

  // Salvar os pagamentos no Firestore
  async function salvarPagamentosNoFirestore(pagamentos) {
    if (!usuario) {
      throw new Error("Usuário não autenticado.");
    }

    await setDoc(
      doc(db, "usuarios", usuario.uid, "pagamentos", "status"),
      pagamentos
    );
  }

  return(
    <FinancasContext.Provider value={{
      despesas, 
      setDespesas, 
      despesasPagas, 
      setDespesasPagas, 
      entradas, 
      setEntradas,

      salvarDespesaNoFirestore,
      excluirDespesaNoFirestore,
      salvarPagamentosNoFirestore,
      salvarEntradaNoFirestore,
      excluirEntradaNoFirestore,

      mes,
      setMes,
      ano, 
      setAno
    }}>
      {children}
    </FinancasContext.Provider>
  )
}

export function useFinancas() {
  const contexto = useContext(FinancasContext)

  if(!contexto) {
    throw new Error("useFinancas deve ser utilizado dentro de FinancasProvider.");
  }
  return contexto
}
