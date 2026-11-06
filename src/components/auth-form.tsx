import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/theme/colors';
import { useAuthStore } from '@/features/auth/auth-store';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);

  const [error, setError] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const isRegister = mode === 'register';

  const submit = async () => {
    setError('');
    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password);
      }
      router.replace('/');
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Não foi possível continuar.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <Text style={styles.logo}>Aa</Text>
        <Text style={styles.title}>{isRegister ? 'Crie sua conta' : 'Bem-vindo de volta'}</Text>
        <Text style={styles.subtitle}>
          {isRegister ? 'Salve suas palavras e acompanhe seu histórico.' : 'Entre para acessar sua coleção de palavras.'}
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Usuário</Text>
        <TextInput
          value={username}
          autoCorrect={false}
          style={styles.input}
          autoCapitalize="none"
          onChangeText={setUsername}
          placeholder="Digite seu usuário"
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          secureTextEntry
          value={password}
          style={styles.input}
          onChangeText={setPassword}
          placeholderTextColor={colors.muted}
          placeholder="Mínimo de 6 caracteres"
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <Pressable onPress={() => void submit()} style={styles.primaryButton}>
          <Text style={styles.primaryText}>{isRegister ? 'Criar conta' : 'Entrar'}</Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace(isRegister ? '/auth/login' : '/auth/register')}
          style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>
            {isRegister ? 'Já tenho uma conta' : 'Ainda não tenho uma conta'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  brand: {
    alignItems: 'center',
    marginBottom: 36
  },
  logo: {
    color: colors.accent,
    fontSize: 54,
    fontWeight: '800',
    marginBottom: 12
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center'
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 300
  },
  form: { gap: 10 },
  label: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6
  },
  input: {
    height: 52,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.ink,
    paddingHorizontal: 16,
    fontSize: 16
  },
  error: {
    color: colors.danger,
    lineHeight: 20,
    marginTop: 4
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 15,
    paddingVertical: 15,
    marginTop: 10
  },
  primaryText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '800'
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 14
  },
  secondaryText: {
    color: colors.accent,
    fontWeight: '700'
  },
});
