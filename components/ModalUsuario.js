import { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { signOut } from "firebase/auth";

import { auth } from "../src/firebase";
import colors from "../src/theme/colors";
import { useAuth } from "../context/AuthContext";

export default function ModalUsuario({ visivel, fechar }) {
  const { usuario } = useAuth();
  const [saindo, setSaindo] = useState(false);

  async function sairDaConta() {
    try {
      setSaindo(true);
      await signOut(auth);
      fechar();
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível sair da conta.");
    } finally {
      setSaindo(false);
    }
  }

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="slide"
      onRequestClose={fechar}
    >
      <View style={styles.fundo}>
        <Pressable style={styles.areaExterna} onPress={fechar} />

        <View style={styles.painel}>
          <View style={styles.cabecalho}>

            <View style={styles.iconeUsuario}>
              <Feather name="user" size={28} color={colors.verdeLimao} />
            </View>

            <Text style={styles.nome}>
              {usuario?.displayName || "Usuário"}
            </Text>

            

            <Pressable onPress={fechar} hitSlop={12}>
              <Feather name="x" size={24} color={colors.textoSecundario} />
            </Pressable>
          </View>

          

          <Text style={styles.email}>
            {usuario?.email || ""}
          </Text>

          <View style={styles.divisor} />

          <Pressable
            style={styles.botaoSair}
            onPress={sairDaConta}
            disabled={saindo}
          >
            {saindo ? (
              <ActivityIndicator color={colors.laranja} />
            ) : (
              <>
                <Feather
                  name="log-out"
                  size={20}
                  color={colors.laranja}
                />
                <Text style={styles.textoSair}>
                  Sair da conta
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  areaExterna: {
    flex: 1,
  },
  painel: {
    width: "65%",
    maxWidth: 360,
    height: "100%",
    backgroundColor: colors.card,
    padding: 24,
    paddingTop: 55,
    elevation: 12,
    borderLeftWidth: 2,
    borderLeftColor: colors.grafite,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  iconeUsuario: {
    width: 50,
    height: 50,
    borderRadius: 28,
    backgroundColor: colors.grafite,
    alignItems: "center",
    justifyContent: "center",
  },
  nome: {
    color: colors.verdeLimao,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: -60,
  },
  email: {
    color: colors.textoSecundario,
    fontSize: 14,
    marginTop: 6,
  },
  divisor: {
    height: 1,
    backgroundColor: colors.grafite,
    marginVertical: 24,
  },
  botaoSair: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  textoSair: {
    color: colors.laranja,
    fontSize: 16,
    fontWeight: "600",
  },
});
