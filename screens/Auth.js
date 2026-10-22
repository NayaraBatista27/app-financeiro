
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";

import { auth } from "../src/firebase";
import colors from "../src/theme/colors";

export default function Auth() {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const corDestaque = modoCadastro ? colors.laranja : colors.verdeLimao;

  async function lidarComAcesso() {
    if (!email.trim() || !senha) {
      Alert.alert("Atenção", "Preencha o e-mail e a senha.");
      return;
    }

    if (modoCadastro && !nome.trim()) {
      Alert.alert("Atenção", "Informe seu nome.");
      return;
    }

    if (modoCadastro && senha.length < 6) {
      Alert.alert("Atenção", "A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setCarregando(true);

      if (modoCadastro) {
        const credencial = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          senha
        );

        await updateProfile(credencial.user, {
          displayName: nome.trim(),
        });

        Alert.alert("Conta criada com sucesso!");
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), senha);
      }
    } catch (erro) {
      let mensagem = "Não foi possível realizar o acesso.";

      if (erro.code === "auth/email-already-in-use") {
        mensagem = "Esse e-mail já está cadastrado.";
      } else if (erro.code === "auth/invalid-email") {
        mensagem = "Informe um e-mail válido.";
      } else if (
        erro.code === "auth/invalid-credential" ||
        erro.code === "auth/wrong-password" ||
        erro.code === "auth/user-not-found"
      ) {
        mensagem = "E-mail ou senha incorretos.";
      } else if (erro.code === "auth/weak-password") {
        mensagem = "Escolha uma senha com pelo menos 6 caracteres.";
      }

      Alert.alert("Erro", mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cartao}>
          <Text style={[styles.titulo, { color: corDestaque }]}>Minhas finanças</Text>

          <Text style={styles.subtitulo}>
            {modoCadastro
              ? "Crie sua conta para começar"
              : "Entre para acessar suas finanças"}
          </Text>

          {modoCadastro && (
            <TextInput
              style={styles.input}
              placeholder="Como gostaria de ser chamado?"
              placeholderTextColor={colors.textoSecundario}
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              maxLength={80}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="E-mail válido"
            placeholderTextColor={colors.textoSecundario}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            keyboardType="numeric"
            style={styles.input}
            placeholder="Senha com 6 caracteres"
            placeholderTextColor={colors.textoSecundario}
            value={senha}
            onChangeText={setSenha}
          />

          <Pressable
            style={[
  styles.botao,
  { backgroundColor: corDestaque },
  carregando && styles.botaoDesativado,
]}
            onPress={lidarComAcesso}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color={colors.fundo} />
            ) : (
              <Text style={styles.textoBotao}>
  {modoCadastro ? "Criar conta" : "Entrar"}
</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.botaoAlternativo}
            onPress={() => {
              setModoCadastro(!modoCadastro);
              setSenha("");
            }}
            disabled={carregando}
          >
            <Text style={styles.textoAlternativo}>
              {modoCadastro
                ? "Já tem uma conta? Entrar"
                : "Ainda não tem conta? Cadastre-se"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: colors.fundo,
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  cartao: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    gap: 16,
  },
  titulo: {
    color: colors.verdeLimao,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitulo: {
    color: colors.textoSecundario,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.grafite,
    color: colors.texto,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
  botao: {
    backgroundColor: colors.verdeLimao,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  botaoDesativado: {
    opacity: 0.7,
  },
  textoBotao: {
    fontSize: 16,
    fontWeight: "bold",
  },
  botaoAlternativo: {
    alignItems: "center",
    paddingVertical: 8,
  },
  textoAlternativo: {
    color: colors.texto,
    textAlign: "center",
  },
});
